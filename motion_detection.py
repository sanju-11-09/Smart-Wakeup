# motion_detection.py

import numpy as np

def detect_motion(ax, ay, az, threshold=0.002):
    acc_magnitude = np.sqrt(ax**2 + ay**2 + az**2)
    
    if acc_magnitude > threshold:
        return "moving"
    else:
        return "stopped"
