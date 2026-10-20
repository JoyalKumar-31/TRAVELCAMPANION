import urllib.request
import json

payload = {"origin": "Hyderabad, Telangana, India", "destination": "Goa, India"}
req = urllib.request.Request(
    "http://127.0.0.1:8000/api/distance/calculate",
    data=json.dumps(payload).encode("utf-8"),
    headers={"Content-Type": "application/json"}
)

try:
    with urllib.request.urlopen(req) as resp:
        data = json.loads(resp.read().decode("utf-8"))
        print("API Status: 200 OK")
        print("Origin:", data["origin"])
        print("Destination:", data["destination"])
        print("Straight Line Dist:", data["distance_km"], "km")
        print("Road Distance:", data["road_distance_km"], "km")
        print("Transit Modes Available:")
        for mode, details in data["modes"].items():
            print(f"  - {details['label']}: Time={details['time_str']}, Cost/Fare={details.get('total_est_cost_inr') or details.get('fare_inr') or details.get('fuel_cost_inr')}")
except Exception as e:
    print("Error:", e)
