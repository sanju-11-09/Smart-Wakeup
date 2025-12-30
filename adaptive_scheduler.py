# adaptive_scheduler.py

import time
from map_service import get_eta_from_maps

TEST_MODE = True

def adaptive_eta_scheduler(get_location, destination, alert_buffer):
    while True:
        lat, lng = get_location()

        eta, distance = get_eta_from_maps(lat, lng, destination)
        print(f"ETA: {eta:.1f} min | Distance: {distance:.2f} km")

        if eta <= alert_buffer:
            print("🔔 WAKE-UP ALERT TRIGGERED")
            break

        if eta > 2 * alert_buffer:
            sleep_time = eta * 0.5
            print(f"😴 Sleeping for {sleep_time:.1f} minutes")
            time.sleep(1 if TEST_MODE else sleep_time * 60)
        else:
            print("⚠ Final tracking zone activated")
            time.sleep(1 if TEST_MODE else 60)
