from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import requests

from motion_detection import detect_motion
from stop_classification import classify_stop

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# -------------------------------
# OpenStreetMap: Geocoding
# -------------------------------
def geocode_place(place):
    url = "https://nominatim.openstreetmap.org/search"
    params = {
        "q": place,
        "format": "json",
        "limit": 1
    }
    headers = {
        "User-Agent": "smart-wakeup-app"
    }

    r = requests.get(url, params=params, headers=headers, timeout=10)
    data = r.json()

    if not data:
        raise Exception("Location not found")

    return {
        "lat": float(data[0]["lat"]),
        "lng": float(data[0]["lon"])
    }


# -------------------------------
# OpenStreetMap: Distance + ETA
# -------------------------------
def get_distance_and_eta(origin, dest):
    url = (
        f"http://router.project-osrm.org/route/v1/driving/"
        f"{origin['lng']},{origin['lat']};"
        f"{dest['lng']},{dest['lat']}"
        "?overview=false"
    )

    r = requests.get(url, timeout=10)
    data = r.json()

    route = data["routes"][0]

    distance_km = route["distance"] / 1000
    eta_min = route["duration"] / 60

    return round(distance_km, 1), round(eta_min)


# -------------------------------
# API ENDPOINT
# -------------------------------
@app.post("/journey/start")
def start_journey(payload: dict):
    destination = payload["destination"]
    alert_before = payload["alert_before"]

    origin = {
        "lat": payload["origin_lat"],
        "lng": payload["origin_lng"]
    }

    destination_coords = geocode_place(destination)
    distance, eta = get_distance_and_eta(origin, destination_coords)

    # Mock motion & halt (fine for demo)
    ax, ay, az = 0.001, 0.001, 0.003
    movement_status = detect_motion(ax, ay, az)
    speed = 60 if movement_status == "moving" else 0

    halt_info = {
        "type": classify_stop(80, "city"),
        "duration": "1 min 20 sec",
        "location": "Main Road"
    }

    return {
        "trip": {
            "destination": destination,
            "alert_before": alert_before
        },
        "origin": origin,
        "destination_coords": destination_coords,
        "live_eta": {
            "eta_min": eta,
            "distance_km": distance
        },
        "movement": {
            "status": movement_status,
            "speed": speed
        },
        "halt": halt_info,
        "system": {
            "tracking_mode": "Hybrid",
            "battery_mode": "Optimized"
        },
        "alert_triggered": False
    }


@app.get("/")
def root():
    return {"status": "Smart Wake-Up Backend Running"}
