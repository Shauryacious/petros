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
    spots_image = draw_spots_on_image(original_image, circles)

    # Convert to LAB color space for segmentation
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

    # Generate distinct colors for each region
    def generate_random_color():
        return tuple(random.randint(0, 255) for _ in range(3))

    colors = [generate_random_color() for _ in range(len(filtered_contours_list))]

    # Create JSON output dictionary
    json_output = {}

    # Save the annotated image as base64
    json_output['annotated_image'] = compress_and_encode_image(annotated_img)

    # Save the spots detection image as base64
    json_output['spots_image'] = compress_and_encode_image(spots_image)

    # Draw contours on the image
    output_image = cv2.cvtColor(original_image, cv2.COLOR_BGR2RGB)
    for contour, color in zip(filtered_contours_list, colors):
        bgr_color = (color[2], color[1], color[0])
        cv2.drawContours(output_image, [contour], -1, bgr_color, 2)

    # Convert the segmented image to base64
    json_output['segmented_image'] = compress_and_encode_image(output_image)

    # Create plot for area percentages (bar chart)
    fig_bar, ax_bar = plt.subplots(figsize=(10, 6))
    ax_bar.bar([f"Region {i + 1}" for i in range(len(filtered_areas))],
               filtered_area_percentages, color=[(r / 255, g / 255, b / 255) for r, g, b in colors])
    ax_bar.set_title("Percentage Area Occupied by Each Mineral Region")
    ax_bar.set_xlabel("Mineral Regions")
    ax_bar.set_ylabel("Percentage Area (%)")
    ax_bar.set_xticks(range(len(filtered_areas)))
    ax_bar.set_xticklabels([f"Region {i + 1}" for i in range(len(filtered_areas))], rotation=45)

    # Convert the bar chart to base64 and add to the JSON output
    json_output['bar_chart'] = plot_to_base64(fig_bar)

    # Close the bar chart to avoid memory leak
    plt.close(fig_bar)

    # Pie chart for area percentages
    fig_pie, ax_pie = plt.subplots()
    ax_pie.pie(filtered_area_percentages, labels=[f"Region {i + 1}" for i in range(len(filtered_areas))],
               colors=[(r / 255, g / 255, b / 255) for r, g, b in colors], autopct='%1.1f%%', startangle=140)
    ax_pie.set_title("Pie Chart of Area Percentages")

    # Convert the pie chart to base64 and add to the JSON output
    json_output['pie_chart'] = plot_to_base64(fig_pie)

    # Close the pie chart to avoid memory leak
    plt.close(fig_pie)

    # Scatter plot for area sizes of each region
    fig_scatter, ax_scatter = plt.subplots()
    ax_scatter.scatter(range(len(filtered_areas)), filtered_areas, color='blue', alpha=0.5)
    ax_scatter.set_title("Scatter Plot of Contour Areas")
    ax_scatter.set_xlabel("Region Index")
    ax_scatter.set_ylabel("Contour Area")

    # Convert the scatter plot to base64 and add to the JSON output
    json_output['scatter_plot'] = plot_to_base64(fig_scatter)

    # Close the scatter plot to avoid memory leak
    plt.close(fig_scatter)

    # Add the number of detected spots (circles) to the JSON output
    json_output['number_of_spots'] = detected_circle_count

    # Output JSON with base64 images and spot data
    print(json.dumps(json_output, indent=4))


if __name__ == "__main__":
    main()
