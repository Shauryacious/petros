import cv2

# URL of the ESP32 video stream (replace with your stream URL)
stream_url = 'http://192.168.1.10/'  # Ensure this URL points to the actual streaming endpoint (e.g., 'http://192.168.1.10:81/stream')

# Initialize video capture with the stream URL
cap = cv2.VideoCapture(stream_url)

# Check if the video stream is opened successfully
if not cap.isOpened():
    print("Error: Unable to open the video stream.")
    exit()

while True:
    # Capture frame-by-frame
    ret, frame = cap.read()

    if not ret:
        print("Error: Unable to fetch the frame.")
        break

    # Display the resulting frame
    cv2.imshow('ESP32 Video Stream', frame)

    # Press 'q' on the keyboard to exit the loop
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

# Release the video capture object and close windows
cap.release()
cv2.destroyAllWindows()
