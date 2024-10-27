import cv2
from ultralytics import YOLO
import os
import argparse
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


    # Create JSON output dictionary
    json_output = {}

    # Save the annotated image as base64
    json_output['annotated_image'] = compress_and_encode_image(annotated_img)


    # Output JSON with base64 images and spot data
    print(json.dumps(json_output, indent=4))


if __name__ == "__main__":
    main()
