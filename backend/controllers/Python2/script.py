import cv2
import numpy as np
import matplotlib.pyplot as plt
from ultralytics import YOLO
import os
import argparse
import random
import json
import base64
from io import BytesIO
from matplotlib.backends.backend_agg import FigureCanvasAgg as FigureCanvas


# Function to parse command line arguments
def parse_arguments():
    parser = argparse.ArgumentParser(description="Rock Sample Analysis using YOLO")
    parser.add_argument('--image', type=str, required=True, help="Path to the input image")
    return parser.parse_args()


# Load the YOLO model
def load_model(model_path):
    model = YOLO(model_path)
    return model


# Helper function to convert matplotlib plot to base64 string
def plot_to_base64(fig):
    canvas = FigureCanvas(fig)
    buf = BytesIO()
    canvas.print_png(buf)
    buf.seek(0)
    img_base64 = base64.b64encode(buf.read()).decode('utf-8')
    buf.close()
    return img_base64


# Function to compress and encode an image to Base64
def compress_and_encode_image(image, scale_percent=50):  # Default scale to 50%
    # Resize the image
    width = int(image.shape[1] * scale_percent / 100)
    height = int(image.shape[0] * scale_percent / 100)
    resized_image = cv2.resize(image, (width, height))

    # Compress the image using JPEG encoding
    encode_param = [int(cv2.IMWRITE_JPEG_QUALITY), 75]  # Lower quality for more compression
    _, img_encoded = cv2.imencode('.jpg', resized_image, encode_param)  # Use JPEG format
    img_base64 = base64.b64encode(img_encoded).decode('utf-8')
    return img_base64


# Function to detect spots (circles) in the image
def detect_spots(image):
    gray_image = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    blurred_image = cv2.GaussianBlur(gray_image, (9, 9), 2)

    # Use HoughCircles to detect circles
    circles = cv2.HoughCircles(
        blurred_image,
        cv2.HOUGH_GRADIENT,  # Corrected constant name
        dp=1.1,  # Inverse ratio of accumulator resolution to image resolution
        minDist=20,  # Minimum distance between detected circles
        param1=82,  # Canny edge detection threshold
        param2=15,  # Accumulator threshold for circle detection
        minRadius=7,  # Minimum radius of circles
        maxRadius=18  # Maximum radius of circles
    )

    detected_circle_count = 0
    if circles is not None:
        circles = np.round(circles[0, :]).astype("int")
        detected_circle_count = len(circles)

    return detected_circle_count, circles


# Function to draw detected spots on the image
def draw_spots_on_image(image, circles):
    # Create a copy of the image to draw spots
    output_image = image.copy()

    if circles is not None:
        for (x, y, r) in circles:
            # Draw the circle in the output image
            cv2.circle(output_image, (x, y), r, (0, 255, 0), 2)  # Green circle
            # Draw a small circle at the center
            cv2.circle(output_image, (x, y), 2, (0, 0, 255), 3)  # Red center

    return output_image


def main():
    # Parse the command-line arguments
    args = parse_arguments()
    image_path = args.image

    # Model setup
    model_dir = 'rock_classification_yolo'
    model_path = os.path.join(model_dir, 'exp1', 'weights', 'best.pt')
    model = load_model(model_path)

    # Load the image
    original_image = cv2.imread(image_path)
    if original_image is None:
        raise ValueError(f"Error: Unable to load image from {image_path}. Check the path.")

    # YOLO prediction
    def predict_image(model, img):
        results = model.predict(source=img, conf=0.25)  # Adjust confidence as needed
        annotated_img = results[0].plot()
        return annotated_img

    annotated_img = predict_image(model, original_image)

    # Spot detection (circles)
    detected_circle_count, circles = detect_spots(original_image)

    # Draw detected spots (circles) on the original image
    output_image = draw_spots_on_image(original_image, circles)

    # Create JSON output dictionary
    json_output = {}

    # Save the annotated image as base64
    json_output['annotated_image'] = compress_and_encode_image(annotated_img)

    # Add the number of detected spots (circles) to the JSON output
    json_output['number_of_spots'] = detected_circle_count

    # Convert the segmented image with spots to base64
    json_output['segmented_image'] = compress_and_encode_image(output_image)

    # Plot and convert the spot detection image to base64
    plt.figure(figsize=(6, 6))
    plt.imshow(cv2.cvtColor(output_image, cv2.COLOR_BGR2RGB))
    plt.title(f"Detection of Spots - {detected_circle_count} circles found")
    plt.axis("off")

    # Convert the plot to base64 and add to JSON output
    fig = plt.gcf()  # Get the current figure
    json_output['spot_detection_plot'] = plot_to_base64(fig)

    # Close the plot to avoid memory leak
    plt.close(fig)

    # Output JSON with base64 images and spot data
    print(json.dumps(json_output, indent=4))


if __name__ == "__main__":
    main()
