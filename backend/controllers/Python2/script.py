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


# Function to detect spots (circles) in the image
def detect_spots(image):
    gray_image = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    blurred_image = cv2.GaussianBlur(gray_image, (9, 9), 2)

    # Use HoughCircles to detect circles
    circles = cv2.HoughCircles(
        blurred_image,
        cv2.HOUGH_GRADIENT,
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


def main():
    # Parse the command-line arguments
    args = parse_arguments()
    image_path = args.image

    # Model setup
    model_dir = 'rock_classification_yolo'
    model_path = os.path.join(model_dir, 'exp1', 'weights', 'best.pt')
    model = load_model(model_path)

    # Load and display the image
    original_image = cv2.imread(image_path)

    if original_image is None:
        raise ValueError(f"Error: Unable to load image from {image_path}. Check the path.")

    # YOLO prediction
    def predict_image(model, img_path):
        img = cv2.imread(img_path)
        results = model.predict(source=img, conf=0.25)  # Adjust confidence as needed
        annotated_img = results[0].plot()
        return annotated_img

    annotated_img = predict_image(model, image_path)

    # Spot detection (circles)
    detected_circle_count, circles = detect_spots(original_image)

    # Convert to LAB color space for segmentation
    image_rgb = cv2.cvtColor(original_image, cv2.COLOR_BGR2RGB)
    lab_image = cv2.cvtColor(original_image, cv2.COLOR_BGR2LAB)

    min_area = 1500  # Minimum area threshold for filtering
    contours_list = []
    areas = []

    # Define refined color ranges
    color_ranges = [
        ((20, 120, 100), (240, 255, 255)),
        ((0, 0, 0), (25, 110, 110)),
        ((100, 80, 80), (140, 255, 255)),
    ]

    # Loop through color ranges to find and process each region
    for lower, upper in color_ranges:
        mask = cv2.inRange(lab_image, lower, upper)

        # Apply morphological operations to reduce noise
        kernel = np.ones((5, 5), np.uint8)
        mask = cv2.morphologyEx(mask, cv2.MORPH_CLOSE, kernel)

        # Find contours
        contours, _ = cv2.findContours(mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        filtered_contours = [cnt for cnt in contours if cv2.contourArea(cnt) >= min_area]
        contours_list.extend(filtered_contours)

        # Calculate area for each filtered contour
        for contour in filtered_contours:
            area = cv2.contourArea(contour)
            areas.append(area)

    total_segmented_area = sum(areas)
    area_percentages_segmented = [(area / total_segmented_area) * 100 for area in areas]

    filtered_contours_list = []
    filtered_areas = []
    filtered_area_percentages = []

    for contour, area, percentage in zip(contours_list, areas, area_percentages_segmented):
        if percentage > 1 and area < 1040397:
            filtered_contours_list.append(contour)
            filtered_areas.append(area)
            filtered_area_percentages.append(percentage)

    # Generate distinct colors
    def generate_random_color():
        return tuple(random.randint(0, 255) for _ in range(3))

    colors = [generate_random_color() for _ in range(len(filtered_contours_list))]

    # Create JSON output dictionary
    json_output = {}

    # Save the annotated image as base64
    _, img_encoded = cv2.imencode('.png', annotated_img)
    # json_output['annotated_image'] = base64.b64encode(img_encoded).decode('utf-8')

    # Draw contours on the image
    output_image = image_rgb.copy()
    for contour, color in zip(filtered_contours_list, colors):
        bgr_color = (color[2], color[1], color[0])
        cv2.drawContours(output_image, [contour], -1, bgr_color, 2)

    # Convert image to base64
    output_image_rgb = cv2.cvtColor(output_image, cv2.COLOR_BGR2RGB)
    _, img_encoded = cv2.imencode('.png', output_image_rgb)
    # json_output['segmented_image'] = base64.b64encode(img_encoded).decode('utf-8')

    # Create plot for area percentages (bar chart)
    fig, ax = plt.subplots(figsize=(10, 6))
    ax.bar([f"Region {i + 1}" for i in range(len(filtered_areas))],
           filtered_area_percentages, color=[(r / 255, g / 255, b / 255) for r, g, b in colors])
    ax.set_title("Percentage Area Occupied by Each Mineral Region")
    ax.set_xlabel("Mineral Regions")
    ax.set_ylabel("Percentage Area (%)")
    ax.set_xticks(range(len(filtered_areas)))
    ax.set_xticklabels([f"Region {i + 1}" for i in range(len(filtered_areas))], rotation=45)

    # Convert the plot to base64 and add to the JSON output
    json_output['bar_chart'] = plot_to_base64(fig)

    # Close the plot to avoid memory leak
    plt.close(fig)

    # Add the number of detected spots (circles) to the JSON output
    # json_output['number_of_spots'] = detected_circle_count

    # Output JSON with base64 images and spot data
    print(json.dumps(json_output, indent=4))


if __name__ == "__main__":
    main()
