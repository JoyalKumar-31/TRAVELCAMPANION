import math
import urllib.parse
from typing import Dict, Tuple, Optional, List

# Worldwide and Indian Geographical Coordinates Database (lat, lon)
GEO_COORDINATES: Dict[str, Tuple[float, float, str]] = {
    # Indian Cities
    "hyderabad": (17.3850, 78.4867, "Hyderabad, Telangana, India"),
    "visakhapatnam": (17.6868, 83.2185, "Visakhapatnam, Andhra Pradesh, India"),
    "vizag": (17.6868, 83.2185, "Visakhapatnam, Andhra Pradesh, India"),
    "mumbai": (19.0760, 72.8777, "Mumbai, Maharashtra, India"),
    "delhi": (28.6139, 77.2090, "New Delhi, India"),
    "new delhi": (28.6139, 77.2090, "New Delhi, India"),
    "delhi_agra": (27.1767, 78.0081, "Agra & Delhi, India"),
    "agra": (27.1767, 78.0081, "Agra, Uttar Pradesh, India"),
    "bengaluru": (12.9716, 77.5946, "Bengaluru, Karnataka, India"),
    "bangalore": (12.9716, 77.5946, "Bengaluru, Karnataka, India"),
    "chennai": (13.0827, 80.2707, "Chennai, Tamil Nadu, India"),
    "kolkata": (22.5726, 88.3639, "Kolkata, West Bengal, India"),
    "pune": (18.5204, 73.8567, "Pune, Maharashtra, India"),
    "ahmedabad": (23.0225, 72.5714, "Ahmedabad, Gujarat, India"),
    "jaipur": (26.9124, 75.7873, "Jaipur, Rajasthan, India"),
    "udaipur": (24.5854, 73.7125, "Udaipur, Rajasthan, India"),
    "goa": (15.2993, 74.1240, "Goa, India"),
    "kerala": (9.9312, 76.2673, "Kerala (Kochi), India"),
    "kochi": (9.9312, 76.2673, "Kochi, Kerala, India"),
    "munnar": (10.0889, 77.0595, "Munnar, Kerala, India"),
    "alappuzha": (9.4981, 76.3388, "Alappuzha, Kerala, India"),
    "wayanad": (11.6854, 76.1320, "Wayanad, Kerala, India"),
    "manali": (32.2432, 77.1892, "Manali, Himachal Pradesh, India"),
    "shimla": (31.1048, 77.1734, "Shimla, Himachal Pradesh, India"),
    "kashmir": (34.0837, 74.7973, "Srinagar, Kashmir, India"),
    "srinagar": (34.0837, 74.7973, "Srinagar, Kashmir, India"),
    "ladakh": (34.1526, 77.5771, "Leh Ladakh, India"),
    "leh": (34.1526, 77.5771, "Leh Ladakh, India"),
    "varanasi": (25.3176, 82.9739, "Varanasi, Uttar Pradesh, India"),
    "amritsar": (31.6340, 74.8723, "Amritsar, Punjab, India"),
    "ooty": (11.4102, 76.6950, "Ooty, Tamil Nadu, India"),
    "mysore": (12.2958, 76.6394, "Mysore, Karnataka, India"),
    "tirupati": (13.6288, 79.4192, "Tirupati, Andhra Pradesh, India"),
    "pondicherry": (11.9416, 79.8083, "Pondicherry, India"),
    "rishikesh": (30.0869, 78.2676, "Rishikesh, Uttarakhand, India"),
    "darjeeling": (27.0410, 88.2663, "Darjeeling, West Bengal, India"),
    "andaman": (11.6234, 92.7265, "Port Blair, Andaman & Nicobar, India"),
    "coorg": (12.3375, 75.8069, "Coorg, Karnataka, India"),
    "chandigarh": (30.7333, 76.7794, "Chandigarh, India"),
    "lucknow": (26.8467, 80.9462, "Lucknow, Uttar Pradesh, India"),

    # International Destinations
    "switzerland": (46.8182, 8.2275, "Switzerland (Zurich - Interlaken)"),
    "zurich": (47.3769, 8.5417, "Zurich, Switzerland"),
    "lucerne": (47.0502, 8.3093, "Lucerne, Switzerland"),
    "interlaken": (46.6863, 7.8632, "Interlaken, Switzerland"),
    "grindelwald": (46.6242, 8.0414, "Grindelwald, Switzerland"),
    "paris": (48.8566, 2.3522, "Paris, France"),
    "london": (51.5074, -0.1278, "London, United Kingdom"),
    "rome": (41.9028, 12.4964, "Rome, Italy"),
    "dubai": (25.2048, 55.2708, "Dubai, United Arab Emirates"),
    "tokyo": (35.6762, 139.6503, "Tokyo, Japan"),
    "singapore": (1.3521, 103.8198, "Singapore"),
    "bali": (-8.4095, 115.1889, "Bali, Indonesia"),
    "bangkok": (13.7563, 100.5018, "Bangkok, Thailand"),
    "phuket": (7.8804, 98.3923, "Phuket, Thailand"),
    "new york": (40.7128, -74.0060, "New York City, USA"),
    "barcelona": (41.3879, 2.1699, "Barcelona, Spain"),
    "amsterdam": (52.3676, 4.9041, "Amsterdam, Netherlands"),
    "maldives": (4.1755, 73.5093, "Maldives (Male)"),
    "sydney": (-33.8688, 151.2093, "Sydney, Australia"),
}

def find_best_coord_match(place_name: str) -> Tuple[float, float, str]:
    cleaned = place_name.lower().strip()
    for key, data in GEO_COORDINATES.items():
        if key in cleaned:
            return data
    # Fallback to central India or default
    return (17.3850, 78.4867, place_name)

def haversine_distance_km(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Calculates geodesic distance between two latitude/longitude points in kilometers."""
    R = 6371.0 # Earth radius in km
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = (math.sin(dlat / 2) ** 2 +
         math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) *
         math.sin(dlon / 2) ** 2)
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return round(R * c, 1)

def format_duration(hours: float) -> str:
    h = int(hours)
    m = int(round((hours - h) * 60))
    if m == 60:
        h += 1
        m = 0
    if h == 0:
        return f"{m} mins"
    if m == 0:
        return f"{h}h"
    return f"{h}h {m}m"

def calculate_journey_logistics(origin_name: str, dest_name: str) -> Dict:
    lat1, lon1, label1 = find_best_coord_match(origin_name)
    lat2, lon2, label2 = find_best_coord_match(dest_name)
    
    dist_km = haversine_distance_km(lat1, lon1, lat2, lon2)

    # Road travel usually has ~1.25x tortuosity factor over straight geodesic line
    road_dist_km = round(dist_km * 1.22, 1)

    is_both_india = not any(w in (origin_name + dest_name).lower() for w in [
        "switzerland", "paris", "london", "rome", "dubai", "tokyo", "singapore", "bali", "new york", "barcelona", "amsterdam", "maldives"
    ])

    # Google Directions Links
    orig_q = urllib.parse.quote(origin_name.split('(')[0].strip())
    dest_q = urllib.parse.quote(dest_name.split('(')[0].strip())

    base_gmap = "https://www.google.com/maps/dir/?api=1"
    gmap_car = f"{base_gmap}&origin={orig_q}&destination={dest_q}&travelmode=driving"
    gmap_train = f"{base_gmap}&origin={orig_q}&destination={dest_q}&travelmode=transit"
    gmap_bike = f"{base_gmap}&origin={orig_q}&destination={dest_q}&travelmode=two_wheeler"
    gmap_flight = f"{base_gmap}&origin={orig_q}&destination={dest_q}&travelmode=flight"

    # 1. Car Logistics
    # Average highway cruising speed: ~62 km/h
    car_hrs = max(0.5, round(road_dist_km / 62.0, 2))
    car_fuel = int(road_dist_km * 7.2) # ~14 km/l at ₹100/L
    car_tolls = int(road_dist_km * 1.4)
    car_data = {
        "mode": "car",
        "label": "Car / Drive",
        "icon": "fa-car",
        "time_str": format_duration(car_hrs),
        "distance_km": road_dist_km,
        "speed_avg": "62 km/h (Expressway & NH)",
        "fuel_cost_inr": car_fuel,
        "toll_est_inr": car_tolls,
        "total_est_cost_inr": car_fuel + car_tolls,
        "route_corridor": "National Highway / Expressway Corridor",
        "google_directions_url": gmap_car
    }

    # 2. Train / Rail Logistics
    # Rail speed: ~72 km/h average with halts (Superfast / Vande Bharat)
    train_hrs = max(1.0, round(dist_km / 72.0, 2))
    train_3ac = int(max(380, dist_km * 1.4))
    train_sleeper = int(max(180, dist_km * 0.55))
    train_data = {
        "mode": "train",
        "label": "Train / Rail",
        "icon": "fa-train",
        "time_str": format_duration(train_hrs),
        "distance_km": round(dist_km * 1.15, 1),
        "speed_avg": "72-90 km/h (Vande Bharat / Express)",
        "fare_inr": f"3AC: ₹{train_3ac:,} | SL: ₹{train_sleeper:,}",
        "rail_lines": "IRCTC Superfast / Vande Bharat Express Lines",
        "google_directions_url": gmap_train
    }

    # 3. Bike / Motorcycle Logistics
    # Average biker cruising speed: ~48 km/h with scenic breaks
    bike_hrs = max(0.6, round(road_dist_km / 48.0, 2))
    bike_fuel = int(road_dist_km * 2.6) # ~38 km/l at ₹100/L
    pitstops_count = max(1, int(road_dist_km / 120))
    bike_data = {
        "mode": "bike",
        "label": "Bike / Motorcycle",
        "icon": "fa-motorcycle",
        "time_str": format_duration(bike_hrs),
        "distance_km": road_dist_km,
        "speed_avg": "48 km/h (Biker Cruising)",
        "fuel_cost_inr": bike_fuel,
        "pitstops": f"{pitstops_count} Rest Stops recommended (every 120 km)",
        "scenic_tip": "Wear full safety gear; scenic highway dhabas on route",
        "google_directions_url": gmap_bike
    }

    # 4. Flight Logistics
    flight_hrs = max(1.0, round((dist_km / 750.0) + 1.0, 2))
    flight_fare = int(max(2400, dist_km * 4.2)) if dist_km < 2000 else int(dist_km * 7.5)
    flight_data = {
        "mode": "flight",
        "label": "Flight / Air",
        "icon": "fa-plane-departure",
        "time_str": format_duration(flight_hrs),
        "distance_km": dist_km,
        "speed_avg": "750 km/h (Cruising altitude)",
        "fare_inr": f"₹{flight_fare:,} (Est. Economy)",
        "google_directions_url": gmap_flight
    }

    return {
        "origin": label1,
        "destination": label2,
        "origin_coords": [lat1, lon1],
        "dest_coords": [lat2, lon2],
        "distance_km": dist_km,
        "road_distance_km": road_dist_km,
        "is_international": not is_both_india,
        "modes": {
            "car": car_data,
            "train": train_data,
            "bike": bike_data,
            "flight": flight_data
        },
        "flight_time": flight_data["time_str"],
        "drive_time": car_data["time_str"],
        "train_time": train_data["time_str"],
        "bike_time": bike_data["time_str"],
        "google_maps_directions_url": gmap_car
    }
