# motion_detection.py

import numpy as np

def detect_motion(ax, ay, az, threshold=0.002):
    acc_magnitude = np.sqrt(ax**2 + ay**2 + az**2)
    
    if acc_magnitude > threshold:
        return "moving"
    else:
        return "stopped"
    
import math

def haversine(lat1, lon1, lat2, lon2):
    R = 6371000  # meters
    phi1 = math.radians(lat1)
    phi2 = math.radians(lat2)
    dphi = math.radians(lat2 - lat1)
    dlambda = math.radians(lon2 - lon1)

    a = (
        math.sin(dphi / 2) ** 2
        + math.cos(phi1)
        * math.cos(phi2)
        * math.sin(dlambda / 2) ** 2
    )

    return 2 * R * math.atan2(math.sqrt(a), math.sqrt(1 - a))


def bearing(lat1, lon1, lat2, lon2):
    phi1 = math.radians(lat1)
    phi2 = math.radians(lat2)
    dlambda = math.radians(lon2 - lon1)

    y = math.sin(dlambda) * math.cos(phi2)
    x = (
        math.cos(phi1) * math.sin(phi2)
        - math.sin(phi1) * math.cos(phi2) * math.cos(dlambda)
    )

    return (math.degrees(math.atan2(y, x)) + 360) % 360


def bearing_diff(b1, b2):
    diff = abs(b1 - b2)
    return min(diff, 360 - diff)


def check_route_deviation(
    curr_lat,
    curr_lng,
    prev_lat,
    prev_lng,
    route_coords,
    distance_threshold_m=300,
    bearing_threshold_deg=90,
):
    """
    Returns route deviation status
    """

    if not route_coords or len(route_coords) < 2:
        return {
            "on_route": True,
            "reason": None,
        }

    # 📏 Distance from route
    min_dist = float("inf")
    nearest_index = 0

    for i, (lat, lng) in enumerate(route_coords):
        d = haversine(curr_lat, curr_lng, lat, lng)
        if d < min_dist:
            min_dist = d
            nearest_index = i

    off_route = min_dist > distance_threshold_m

    # 🧭 Direction check
    move_bearing = bearing(prev_lat, prev_lng, curr_lat, curr_lng)

    if nearest_index < len(route_coords) - 1:
        route_bearing = bearing(
            route_coords[nearest_index][0],
            route_coords[nearest_index][1],
            route_coords[nearest_index + 1][0],
            route_coords[nearest_index + 1][1],
        )
    else:
        route_bearing = move_bearing

    bearing_delta = bearing_diff(move_bearing, route_bearing)
    wrong_direction = bearing_delta > bearing_threshold_deg

    return {
        "on_route": not (off_route or wrong_direction),
        "off_route": off_route,
        "wrong_direction": wrong_direction,
        "distance_from_route_m": round(min_dist, 1),
        "bearing_diff_deg": round(bearing_delta, 1),
    }

