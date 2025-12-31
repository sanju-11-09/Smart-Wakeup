# map_service.py

import requests

OSRM_BASE_URL = "https://router.project-osrm.org"

def get_route_from_osrm(
    curr_lat,
    curr_lng,
    dest_lat,
    dest_lng
):
    """
    Returns:
    - route_coords: list of (lat, lng)
    - duration_min
    - distance_km
    """

    url = (
        f"{OSRM_BASE_URL}/route/v1/driving/"
        f"{curr_lng},{curr_lat};{dest_lng},{dest_lat}"
    )

    params = {
        "overview": "full",
        "geometries": "geojson"
    }

    try:
        resp = requests.get(url, params=params, timeout=10)
        data = resp.json()

        if "routes" not in data or len(data["routes"]) == 0:
            print("⚠ OSRM returned no routes")
            return fallback_route()

        route = data["routes"][0]

        route_coords = [
            (lat, lng)
            for lng, lat in route["geometry"]["coordinates"]
        ]

        duration_min = route["duration"] / 60
        distance_km = route["distance"] / 1000

        return route_coords, duration_min, distance_km

    except Exception as e:
        print("⚠ OSRM error:", e)
        return fallback_route()


def fallback_route():
    return [], 300.0, 300.0
