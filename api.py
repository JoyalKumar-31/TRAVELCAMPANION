from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List, Dict, Any

from schemas import (
    DayReplanningRequest,
    DayReplanningResponse,
    TravelerProfile, 
    Itinerary, 
    DisruptionEvent, 
    AdaptationResult, 
    GroupConsensusRequest, 
    GroupConsensusResult,
    SmartPackingRequest,
    SmartPackingChecklist,
    LandmarkRecognitionRequest,
    LandmarkRecognitionResult,
    WhatIfRequest,
    WhatIfSimulationResult,
    CompanionChatRequest,
    CompanionChatResponse,
    EmergencyRequest,
    EmergencyResponse
)
from graph.tourism_graph import tourism_agent_graph
from agents import (
    GroupConsensusAgent,
    AdaptiveReplannerAgent,
    SmartPackingAgent,
    LandmarkVisionAgent,
    WhatIfTravelSimulator,
    MultilingualCompanionAgent,
    SafetyEcoAgent
)

app = FastAPI(
    title="AI Adaptive Tourism Companion API",
    description="Intelligent Multi-Agent Tourism Microservice powered by LangGraph, Groq LLaMA 3.3, and Vision AI.",
    version="2.0.0"
)

# Enable CORS for React frontend and Spring Boot backend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.middleware("http")
async def add_no_cache_headers(request, call_next):
    response = await call_next(request)
    response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
    response.headers["Pragma"] = "no-cache"
    response.headers["Expires"] = "0"
    return response

# Initialize Agent Services
group_agent = GroupConsensusAgent()
replanner_agent = AdaptiveReplannerAgent()
packing_agent = SmartPackingAgent()
vision_agent = LandmarkVisionAgent()
whatif_simulator = WhatIfTravelSimulator()
companion_agent = MultilingualCompanionAgent()
safety_agent = SafetyEcoAgent()

class GenerateResponse(BaseModel):
    success: bool
    itinerary: Itinerary
    logs: List[str]

class AdaptRequest(BaseModel):
    itinerary: Itinerary
    disruption: DisruptionEvent

class AdaptResponse(BaseModel):
    success: bool
    updated_itinerary: Itinerary
    adaptation_result: AdaptationResult
    logs: List[str]

class SimpleWhatIfRequest(BaseModel):
    itinerary: Itinerary
    scenario: str
    day_number: int = 1
    time_slot: str = "Morning"

class DistanceRequest(BaseModel):
    origin: str
    destination: str

class HotelRequest(BaseModel):
    destination: str
    day_number: int = 1

class HotelBookingRequest(BaseModel):
    hotel_name: str
    destination: str
    room_type: str
    guests_count: int = 1
    price_per_person_inr: float = 0.0
    total_price_inr: float
    check_in_date: Optional[str] = None
    guest_name: Optional[str] = "Traveler"
    guest_email: Optional[str] = "traveler@example.com"
    guest_phone: Optional[str] = ""

# Static Files Setup for TravelMate Web Client (React.js Frontend & Assets)
import os
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
STATIC_DIR = os.path.join(BASE_DIR, "static")
REACT_DIST_DIR = os.path.join(BASE_DIR, "frontend", "dist")

os.makedirs(STATIC_DIR, exist_ok=True)
app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")

if os.path.exists(REACT_DIST_DIR) and os.path.exists(os.path.join(REACT_DIST_DIR, "assets")):
    app.mount("/assets", StaticFiles(directory=os.path.join(REACT_DIST_DIR, "assets")), name="assets")

@app.get("/")
def root():
    # 1. Prefer Modern React.js Production Build
    if os.path.exists(REACT_DIST_DIR):
        react_index = os.path.join(REACT_DIST_DIR, "index.html")
        if os.path.exists(react_index):
            return FileResponse(react_index)

    # 2. Fallback to static client
    index_file = os.path.join(STATIC_DIR, "index.html")
    if os.path.exists(index_file):
        return FileResponse(index_file)

    return {
        "service": "AI Adaptive Tourism Companion",
        "role": "AI / AI Agents Lead Microservice",
        "framework": "LangGraph + Groq LLM + Computer Vision",
        "status": "Online",
        "endpoints": [
            "/api/health (GET)",
            "/api/hotels/near (POST)",
            "/api/hotels/day1 (GET)",
            "/api/itinerary/generate (POST)",
            "/api/itinerary/adapt (POST)",
            "/api/distance/calculate (POST)",
            "/api/group/consensus (POST)",
            "/api/packing/generate (POST)",
            "/api/vision/recognize-landmark (POST)",
            "/api/whatif/simulate (POST)",
            "/api/chat/companion (POST)",
            "/api/safety/emergency (POST)",
            "/docs (Swagger UI)"
        ]
    }

@app.get("/api/info")
def api_info():
    return {
        "service": "AI Adaptive Tourism Companion",
        "role": "AI / AI Agents Lead Microservice",
        "framework": "LangGraph + Groq LLM + Computer Vision",
        "status": "Online"
    }

@app.post("/api/distance/calculate")
def calculate_distance(payload: DistanceRequest):
    """
    Calculates geodesic distance, coordinates, and flight/drive travel times between origin and destination.
    """
    from geo_service import calculate_journey_logistics
    return calculate_journey_logistics(payload.origin, payload.destination)

@app.post("/api/hotels/near")
def get_nearby_hotels(payload: HotelRequest):
    """
    Recommends lodges & hotels near Day 1 staying hub with room sharing breakdown and partner booking links.
    """
    from hotel_service import get_day1_hotels_for_destination
    hotels = get_day1_hotels_for_destination(payload.destination, payload.day_number)
    return {
        "success": True,
        "destination": payload.destination,
        "day_number": payload.day_number,
        "hotels": hotels
    }

@app.get("/api/hotels/day1")
def get_day1_hotels(destination: str = "Goa, India"):
    """
    Quick GET endpoint for Day 1 staying lodges and room sharing rates.
    """
    from hotel_service import get_day1_hotels_for_destination
    hotels = get_day1_hotels_for_destination(destination, 1)
    return {
        "success": True,
        "destination": destination,
        "day_number": 1,
        "hotels": hotels
    }


@app.get("/api/health")
def health_check():
    from supabase_client import get_connection_status
    return {
        "status": "healthy",
        "service": "ai-tourism-companion-agents",
        "version": "2.0.0",
        "database": get_connection_status()
    }

@app.get("/api/supabase/status")
def supabase_status():
    """Returns the live connection status to Supabase PostgreSQL Database."""
    from supabase_client import get_connection_status
    return get_connection_status()

@app.get("/api/trips")
def get_saved_trips(limit: int = 10):
    """Retrieves saved trips and itineraries from Supabase."""
    from supabase_client import list_saved_trips
    return {"success": True, "trips": list_saved_trips(limit)}

@app.get("/api/trips/{trip_id}")
def get_trip(trip_id: str):
    """Fetches a specific saved itinerary from Supabase."""
    from supabase_client import get_itinerary_by_id
    data = get_itinerary_by_id(trip_id)
    if not data:
        raise HTTPException(status_code=404, detail="Itinerary not found in Supabase")
    return {"success": True, "itinerary": data}

@app.post("/api/bookings/hotel")
def book_hotel(booking: HotelBookingRequest):
    """Persists a room booking with sharing pricing directly to Supabase."""
    from supabase_client import save_hotel_booking
    res = save_hotel_booking(booking.model_dump())
    return {"success": True, "booking": res}

@app.get("/api/bookings/hotel")
def get_hotel_bookings(limit: int = 20):
    """Lists confirmed hotel and lodge bookings from Supabase."""
    from supabase_client import list_hotel_bookings
    return {"success": True, "bookings": list_hotel_bookings(limit)}

@app.post("/api/itinerary/generate", response_model=GenerateResponse)
def generate_itinerary(profile: TravelerProfile):
    """
    Generates a personalized, constraint-aware travel itinerary using the LangGraph StateGraph pipeline,
    and automatically persists the trip and itinerary into Supabase PostgreSQL.
    """
    try:
        initial_state = {
            "profile": profile,
            "disruption": None,
            "logs": []
        }
        final_state = tourism_agent_graph.invoke(initial_state)
        itinerary = final_state.get("itinerary")
        if not itinerary:
            raise HTTPException(status_code=500, detail="Failed to synthesize itinerary.")

        # Persist to Supabase Database
        try:
            from supabase_client import save_trip_and_itinerary
            save_trip_and_itinerary(profile.model_dump(), itinerary.model_dump())
        except Exception as se:
            print(f"[Supabase Warning] Failed to persist trip: {se}")

        return GenerateResponse(
            success=True,
            itinerary=itinerary,
            logs=final_state.get("logs", [])
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/weather/forecast")
def get_weather_forecast(destination: str = "Goa, India", start_date: Optional[str] = None, duration_days: int = 3):
    """
    Fetches reliable live meteorological weather forecast from Open-Meteo.
    Detects rain probability, humidity, and flags rain alerts for outdoor activities.
    """
    from weather_service import fetch_live_weather_forecast
    return fetch_live_weather_forecast(destination, start_date or "", duration_days)

@app.post("/api/weather/simulate-rain")
def simulate_weather_rain(payload: Dict[str, Any]):
    """
    Manually simulates a rain alert on Day 2 for demonstration purposes, explicitly tagged as simulated.
    """
    from weather_service import generate_simulated_rain_alert
    dest = payload.get("destination", "Goa, India")
    day_num = payload.get("day_number", 2)
    return generate_simulated_rain_alert(dest, day_num)

@app.post("/api/itinerary/replan-day", response_model=DayReplanningResponse)
def replan_itinerary_day(payload: DayReplanningRequest):
    """
    AI-Powered Day Replanning Workflow:
    When rain affects Day 2, keeps Day 1 and Day 3 unchanged while substituting
    all unsuitable outdoor activities with verified indoor alternatives.
    Presents side-by-side original vs revised comparison with AI rationale.
    """
    try:
        updated_itinerary, orig_day, rev_day, summary, rationale = replanner_agent.replan_entire_day(
            itinerary=payload.itinerary,
            affected_day=payload.affected_day,
            disruption_description=payload.disruption_description or "Severe rain downpour",
            is_simulated=payload.is_simulated
        )
        alert_source = "manual_simulation" if payload.is_simulated else "live"
        alert_badge = "Demonstration Alert (Manual Rain Simulation)" if payload.is_simulated else "Live Weather API Alert (Open-Meteo)"

        return DayReplanningResponse(
            success=True,
            updated_itinerary=updated_itinerary,
            affected_day=payload.affected_day,
            alert_source=alert_source,
            alert_badge=alert_badge,
            original_day_plan=orig_day,
            revised_day_plan=rev_day,
            replacements_summary=summary,
            ai_replan_rationale=rationale
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/api/itinerary/adapt", response_model=AdaptResponse)
def adapt_itinerary(payload: AdaptRequest):
    """
    Dynamically recalculates and adapts an existing itinerary in response to real-time disruptions
    (weather alerts, crowd surges, transit delays, attraction closures).
    """
    try:
        logs = [
            f"[API] Received real-time disruption signal: {payload.disruption.description} on Day {payload.disruption.day_number}"
        ]
        updated_itinerary, adaptation_res = replanner_agent.adapt(
            itinerary=payload.itinerary,
            disruption=payload.disruption
        )
        logs.append(f"[API] Adaptation successfully executed: {adaptation_res.reason_for_change}")

        return AdaptResponse(
            success=True,
            updated_itinerary=updated_itinerary,
            adaptation_result=adaptation_res,
            logs=logs
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/api/itinerary/simulate", response_model=AdaptResponse)
def simulate_simple_what_if(payload: SimpleWhatIfRequest):
    """
    Legacy simple What-If endpoint: maps text scenario to disruption replanner.
    """
    disruption = DisruptionEvent(
        day_number=payload.day_number,
        time_slot=payload.time_slot,
        disruption_type="weather" if any(w in payload.scenario.lower() for w in ["rain", "storm", "flood"]) else "crowd_surge",
        description=payload.scenario,
        severity="medium"
    )
    return adapt_itinerary(AdaptRequest(itinerary=payload.itinerary, disruption=disruption))

@app.post("/api/group/consensus", response_model=GroupConsensusResult)
def compute_group_consensus(request: GroupConsensusRequest):
    """
    Analyzes multi-user group preferences, balances voting compromises, computes fair expense splitting,
    and recommends group accommodations and transportation optimization.
    """
    try:
        return group_agent.harmonize_group(request)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/api/packing/generate", response_model=SmartPackingChecklist)
def generate_smart_packing(request: SmartPackingRequest):
    """
    Smart Packing Checklist Generator: Analyzes destination climate, duration, traveler demographics,
    and planned activities to generate a structured checklist.
    """
    try:
        return packing_agent.generate_checklist(request)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/api/vision/recognize-landmark", response_model=LandmarkRecognitionResult)
def recognize_landmark(request: LandmarkRecognitionRequest):
    """
    Computer Vision & Multimodal Landmark Recognition: Identifies monuments, extracts historical
    architecture, visiting hours, accessibility, eco-tips, and audio guide narrative.
    Logs successful scans to Supabase.
    """
    try:
        res = vision_agent.recognize_landmark(request)
        try:
            from supabase_client import log_landmark_scan
            log_landmark_scan(res.model_dump())
        except Exception:
            pass
        return res
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/api/whatif/simulate", response_model=WhatIfSimulationResult)
def simulate_what_if_scenario(request: WhatIfRequest):
    """
    Interactive What-If Travel Simulator: Evaluates hypothetical shocks (budget cuts, weather storms,
    attraction closures, transit strikes) and outputs an adjusted itinerary with feasibility score.
    """
    try:
        return whatif_simulator.simulate_scenario(request)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/api/chat/companion", response_model=CompanionChatResponse)
def chat_with_companion(request: CompanionChatRequest):
    """
    Conversational Multilingual Travel Companion: Answers queries in English, Hindi, Telugu, French, etc.,
    supplying local colloquial phrasebooks, audio narrative text, and executing user-requested actions.
    Logs conversations and executed actions to Supabase.
    """
    try:
        res = companion_agent.respond(request)
        try:
            from supabase_client import log_chat_interaction
            action_dict = res.action.model_dump() if res.action else None
            log_chat_interaction(request.destination, request.query, res.response_text, action_dict, request.language)
        except Exception:
            pass
        return res
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/api/safety/emergency", response_model=EmergencyResponse)
def get_emergency_support(request: EmergencyRequest):
    """
    Emergency & Tourist Safety Hub: Delivers 24/7 helplines, nearby hospital/police facilities,
    consular advice, and immediate crisis protocols.
    """
    try:
        return safety_agent.generate_emergency_support(request.destination, request.emergency_type)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("api:app", host="0.0.0.0", port=8000, reload=True)
