# map_service.py

import requests

API_KEY = "PASTE_YOUR_GOOGLE_MAPS_API_KEY_HERE"

def get_eta_from_maps(current_lat, current_lng, destination):
    url = "https://maps.googleapis.com/maps/api/directions/json"

    params = {
        "origin": f"{current_lat},{current_lng}",
        "destination": destination,
        "key": API_KEY,
        "departure_time": "now"
    }

    try:
        response = requests.get(url, params=params, timeout=10)
        data = response.json()

        # 🔴 SAFETY CHECK
        if "routes" not in data or len(data["routes"]) == 0:
            print("⚠ Maps returned no routes. Using fallback ETA.")
            return fallback_eta()

        leg = data["routes"][0]["legs"][0]

        duration = leg.get("duration_in_traffic", leg["duration"])["value"]
        distance = leg["distance"]["value"]

        return duration / 60, distance / 1000

    except Exception as e:
        print("⚠ Map API error:", e)
        return fallback_eta()

def fallback_eta():
    """
    Safe fallback so backend NEVER crashes
    """
    return 300, 300.0
