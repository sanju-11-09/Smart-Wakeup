# eta_calculation.py

def calculate_eta(distance_remaining, avg_speed, delay=0):
    """
    distance_remaining in km
    avg_speed in km/h
    delay in minutes
    """
    return (distance_remaining / avg_speed) * 60 + delay
