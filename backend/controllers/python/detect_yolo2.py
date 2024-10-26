from ultralytics import YOLO
import cv2
import sys  # Import sys to handle system exit
import json
from class_names import classNames  # Import your class names from a separate file

# Load YOLO model
model = YOLO("Yolo-Weights/yolov8l.pt")

# Use video stream URL (replace with your desired video stream URL)
stream_url = "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"

# Open video stream
cap = cv2.VideoCapture(stream_url)

if not cap.isOpened():
    print(json.dumps({"error": "Could not open video stream"}))
    cap.release()
    sys.exit(1)

while True:
    # Capture frame-by-frame from the video stream
    ret, frame = cap.read()

    if not ret:
        print(json.dumps({"error": "Failed to grab frame from stream"}))
        break

    # Run YOLO model on the current frame
    results = model(frame, stream=True)

    # Process the results
    detected_objects = []
    for r in results:
        boxes = r.boxes
        for box in boxes:
            # Class name
            cls = int(box.cls[0])
            class_name = classNames[cls]
            detected_objects.append(class_name)

            # Get the bounding box coordinates
            x1, y1, x2, y2 = map(int, box.xyxy[0])

            # Draw the bounding box and class label on the frame
            cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 255, 0), 2)
            cv2.putText(frame, class_name, (x1, y1 - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 2)

    # Display the resulting frame with detections
    cv2.imshow('YOLO Real-Time Detection', frame)

    # Exit the loop when 'q' is pressed
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

# Release the video capture object and close all windows
cap.release()
cv2.destroyAllWindows()
