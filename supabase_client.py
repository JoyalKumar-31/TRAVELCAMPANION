"""
Supabase Database Service for TravelMate AI (FastAPI Backend)
Connects to Supabase PostgreSQL database for persistent storage of:
- Traveler Profiles & Trips
- Multi-Day AI Generated Itineraries
- Hotel & Lodge Room Bookings
- Conversational Companion Logs & Actions
- Landmark Vision Scans
Includes an intelligent fallback store when offline or credentials are being configured.
"""
import os
import uuid
from datetime import datetime
from typing import Dict, Any, List, Optional
from dotenv import load_dotenv

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL", "").strip()
SUPABASE_KEY = os.getenv("SUPABASE_KEY", os.getenv("SUPABASE_ANON_KEY", "")).strip()

_supabase_client = None

def get_supabase_client():
    """Initializes and returns the Supabase client instance if credentials exist."""
    global _supabase_client
    if _supabase_client is not None:
        return _supabase_client

    if SUPABASE_URL and SUPABASE_KEY:
        try:
            from supabase import create_client, Client
            _supabase_client = create_client(SUPABASE_URL, SUPABASE_KEY)
            print(f"[Supabase] Connected successfully to {SUPABASE_URL}")
            return _supabase_client
        except Exception as e:
            print(f"[Supabase Warning] Failed to connect: {e}. Running with local fallback store.")
            return None
    return None

# In-Memory Cache / Fallback Store
_LOCAL_STORE = {
    "trips": [],
    "itineraries": [],
    "hotel_bookings": [],
    "chat_interactions": [],
    "landmark_scans": []
}

def get_connection_status() -> Dict[str, Any]:
    """Returns the current live status of the Supabase connection."""
    client = get_supabase_client()
    return {
        "connected": client is not None,
        "supabase_url": SUPABASE_URL if SUPABASE_URL else "Not Configured (Using Local Store)",
        "driver": "supabase-py 2.33.0" if client else "in-memory-fallback",
        "timestamp": datetime.utcnow().isoformat()
    }

def save_trip_and_itinerary(profile_dict: Dict[str, Any], itinerary_dict: Dict[str, Any]) -> Dict[str, Any]:
    """Persists a traveler profile and its synthesized multi-day itinerary to Supabase."""
    client = get_supabase_client()
    trip_id = str(uuid.uuid4())
    itinerary_id = str(uuid.uuid4())
    now_iso = datetime.utcnow().isoformat()

    trip_record = {
        "id": trip_id,
        "destination": profile_dict.get("destination", "General"),
        "duration_days": int(profile_dict.get("duration_days", 3)),
        "budget": float(profile_dict.get("budget", 50000)),
        "group_size": int(profile_dict.get("group_size", 1)),
        "traveler_type": str(profile_dict.get("traveler_type", "couple")),
        "interests": profile_dict.get("interests", ["culture", "sightseeing"]),
        "accessibility_requirements": profile_dict.get("accessibility_requirements", []),
        "pace_preference": profile_dict.get("pace_preference", "moderate"),
        "created_at": now_iso
    }

    itinerary_record = {
        "id": itinerary_id,
        "trip_id": trip_id,
        "trip_title": itinerary_dict.get("trip_title", "Custom Trip"),
        "destination": itinerary_dict.get("destination", trip_record["destination"]),
        "duration_days": int(itinerary_dict.get("duration_days", trip_record["duration_days"])),
        "total_estimated_cost": float(itinerary_dict.get("total_estimated_cost", 0)),
        "budget_limit": float(itinerary_dict.get("budget_limit", trip_record["budget"])),
        "traveler_type": itinerary_dict.get("traveler_type", trip_record["traveler_type"]),
        "days": itinerary_dict.get("days", []),
        "eco_score": itinerary_dict.get("eco_score", {}),
        "safety": itinerary_dict.get("safety", {}),
        "local_food_recommendations": itinerary_dict.get("local_food_recommendations", []),
        "created_at": now_iso,
        "updated_at": now_iso
    }

    if client:
        try:
            client.table("trips").insert(trip_record).execute()
            client.table("itineraries").insert(itinerary_record).execute()
            print(f"[Supabase] Saved trip {trip_id} and itinerary {itinerary_id}")
            return {"trip_id": trip_id, "itinerary_id": itinerary_id, "storage": "supabase"}
        except Exception as e:
            print(f"[Supabase Error] Insert failed: {e}. Storing locally.")

    _LOCAL_STORE["trips"].append(trip_record)
    _LOCAL_STORE["itineraries"].append(itinerary_record)
    return {"trip_id": trip_id, "itinerary_id": itinerary_id, "storage": "local"}

def list_saved_trips(limit: int = 10) -> List[Dict[str, Any]]:
    """Retrieves previously generated trips and itineraries from Supabase."""
    client = get_supabase_client()
    if client:
        try:
            res = client.table("itineraries").select("id, trip_id, trip_title, destination, duration_days, total_estimated_cost, traveler_type, created_at").order("created_at", desc=True).limit(limit).execute()
            return res.data
        except Exception as e:
            print(f"[Supabase Error] Query failed: {e}")

    # Fallback
    return sorted(_LOCAL_STORE["itineraries"], key=lambda x: x.get("created_at", ""), reverse=True)[:limit]

def get_itinerary_by_id(itinerary_id: str) -> Optional[Dict[str, Any]]:
    """Fetches a complete multi-day itinerary by its UUID."""
    client = get_supabase_client()
    if client:
        try:
            res = client.table("itineraries").select("*").eq("id", itinerary_id).limit(1).execute()
            if res.data:
                return res.data[0]
        except Exception as e:
            print(f"[Supabase Error] Get itinerary failed: {e}")

    for it in _LOCAL_STORE["itineraries"]:
        if it.get("id") == itinerary_id:
            return it
    return None

def save_hotel_booking(booking_data: Dict[str, Any]) -> Dict[str, Any]:
    """Records a room booking in Supabase."""
    client = get_supabase_client()
    booking_id = str(uuid.uuid4())
    now_iso = datetime.utcnow().isoformat()

    record = {
        "id": booking_id,
        "hotel_name": booking_data.get("hotel_name", "Unknown Hotel"),
        "destination": booking_data.get("destination", "General"),
        "room_type": booking_data.get("room_type", "Standard Room"),
        "guests_count": int(booking_data.get("guests_count", 1)),
        "price_per_person_inr": float(booking_data.get("price_per_person_inr", 0)),
        "total_price_inr": float(booking_data.get("total_price_inr", 0)),
        "check_in_date": booking_data.get("check_in_date", datetime.utcnow().strftime("%Y-%m-%d")),
        "guest_name": booking_data.get("guest_name", "Traveler"),
        "guest_email": booking_data.get("guest_email", "traveler@example.com"),
        "guest_phone": booking_data.get("guest_phone", ""),
        "booking_status": "confirmed",
        "created_at": now_iso
    }

    if client:
        try:
            client.table("hotel_bookings").insert(record).execute()
            print(f"[Supabase] Saved hotel booking {booking_id}")
            return {"booking_id": booking_id, "status": "confirmed", "storage": "supabase"}
        except Exception as e:
            print(f"[Supabase Error] Booking insert failed: {e}")

    _LOCAL_STORE["hotel_bookings"].append(record)
    return {"booking_id": booking_id, "status": "confirmed", "storage": "local"}

def list_hotel_bookings(limit: int = 20) -> List[Dict[str, Any]]:
    """Lists recent confirmed hotel bookings from Supabase."""
    client = get_supabase_client()
    if client:
        try:
            res = client.table("hotel_bookings").select("*").order("created_at", desc=True).limit(limit).execute()
            return res.data
        except Exception as e:
            print(f"[Supabase Error] List bookings failed: {e}")

    return sorted(_LOCAL_STORE["hotel_bookings"], key=lambda x: x.get("created_at", ""), reverse=True)[:limit]

def log_chat_interaction(destination: str, user_query: str, assistant_response: str, action: Optional[Dict[str, Any]] = None, language: str = "English") -> None:
    """Asynchronously logs AI Companion questions and executed actions in Supabase."""
    client = get_supabase_client()
    record = {
        "id": str(uuid.uuid4()),
        "destination": destination,
        "user_query": user_query,
        "assistant_response": assistant_response[:2000], # safe max length
        "action_type": action.get("action_type") if action else None,
        "action_payload": action.get("payload") if action else None,
        "language": language,
        "created_at": datetime.utcnow().isoformat()
    }

    if client:
        try:
            client.table("chat_interactions").insert(record).execute()
        except Exception as e:
            print(f"[Supabase Warning] Chat log failed: {e}")

    _LOCAL_STORE["chat_interactions"].append(record)

def log_landmark_scan(scan_result: Dict[str, Any]) -> None:
    """Logs Vision AI scanner recognitions in Supabase."""
    client = get_supabase_client()
    record = {
        "id": str(uuid.uuid4()),
        "landmark_name": scan_result.get("landmark_name", "Unknown"),
        "city": scan_result.get("city", ""),
        "country": scan_result.get("country", ""),
        "confidence_score": float(scan_result.get("confidence_score", 0.95)),
        "estimated_entry_fee": scan_result.get("estimated_entry_fee", ""),
        "wheelchair_accessible": bool(scan_result.get("wheelchair_accessible", False)),
        "created_at": datetime.utcnow().isoformat()
    }

    if client:
        try:
            client.table("landmark_scans").insert(record).execute()
        except Exception as e:
            print(f"[Supabase Warning] Landmark scan log failed: {e}")

    _LOCAL_STORE["landmark_scans"].append(record)
