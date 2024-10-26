from ultralytics import YOLO
import cv2
import sys
import os
import json
from class_names import classNames
from util import get_limits
import numpy as np

model = YOLO("Yolo-Weights/yolov8l.pt")

image_path = sys.argv[1]

if not os.path.exists(image_path):
    print(json.dumps({"error": f"File {image_path} not found."}))
    sys.exit(1)

img = cv2.imread(image_path)
if img is None:
    print(json.dumps({"error": "Failed to load the image."}))
    sys.exit(1)

results = model(img, stream=True, verbose=False)

detected_objects = []

colors_bgr = {
    "yellow": [0, 255, 255],
    "red": [0, 0, 255],
    "green": [0, 255, 0],
    "blue": [255, 0, 0],
    "white": [255, 255, 255],
    "black": [0, 0, 0]
}

def detect_color(bbox, image):
    x1, y1, x2, y2 = bbox
    cropped_img = image[y1:y2, x1:x2] 
    hsv_img = cv2.cvtColor(cropped_img, cv2.COLOR_BGR2HSV) 

    avg_hue = np.mean(hsv_img[:, :, 0])
    avg_saturation = np.mean(hsv_img[:, :, 1])
    avg_value = np.mean(hsv_img[:, :, 2])

    color_detected = "unknown"
    
    if avg_saturation > 50:  
        if (avg_hue < 10 or avg_hue > 170):  # Red (hue wraps around)
            color_detected = "red"
        elif 10 <= avg_hue < 25:  # Orange
            color_detected = "orange"
        elif 25 <= avg_hue < 35:  # Yellow
            color_detected = "yellow"
        elif 35 <= avg_hue < 45:  # Light green
            color_detected = "light green"
        elif 45 <= avg_hue < 85:  # Green
            color_detected = "green"
        elif 85 <= avg_hue < 105:  # Cyan/Teal
            color_detected = "cyan"
        elif 105 <= avg_hue < 125:  # Blue
            color_detected = "blue"
        elif 125 <= avg_hue < 145:  # Purple
            color_detected = "purple"
        elif 145 <= avg_hue < 170:  # Pink/Magenta
            color_detected = "pink"
    else:
        if avg_value > 200:
            color_detected = "white"
        elif avg_value < 50:
            color_detected = "black"
        else:
            color_detected = "gray"

    return color_detected


for r in results:
    boxes = r.boxes
    if boxes:  
        for box in boxes:
            cls = int(box.cls[0]) 
            x1, y1, x2, y2 = map(int, box.xyxy[0]) 
            
            object_name = classNames[cls]
            
            detected_color = detect_color((x1, y1, x2, y2), img)
            
            detected_objects.append({
                "object": object_name,
                "color": detected_color,
                "bounding_box": [x1, y1, x2, y2]
            })

if detected_objects:
    print(json.dumps({"detected_objects": detected_objects}))
else:
    print(json.dumps({"message": "No objects detected."}))
