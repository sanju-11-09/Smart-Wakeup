# stop_classification.py

def classify_stop(stop_duration, location_type):
    if stop_duration < 60:
        return "traffic"
    elif stop_duration >= 180 and location_type == "city":
        return "break"
    else:
        return "unexpected"
