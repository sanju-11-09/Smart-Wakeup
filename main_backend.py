# main_backend.py

from adaptive_scheduler import adaptive_eta_scheduler
from location_service import get_current_location

def start_journey():
    destination = "Chrompet, Chennai"
    alert_buffer = 20

    print("🚍 Journey Started")
    adaptive_eta_scheduler(
        get_location=get_current_location,
        destination=destination,
        alert_buffer=alert_buffer
    )

if __name__ == "__main__":
    start_journey()
