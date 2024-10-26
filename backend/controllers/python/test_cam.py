import cv2

cap = cv2.VideoCapture(0)
if not cap.isOpened():
    print("Could not open video stream")
else:
    ret, frame = cap.read()
    if ret:
        cv2.imshow('Test Camera', frame)
        cv2.waitKey(0)
        cv2.destroyAllWindows()
    cap.release()
