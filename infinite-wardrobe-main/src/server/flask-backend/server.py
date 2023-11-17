from flask import Flask, request, jsonify
import pickle
import shutil
import os
import numpy as np
import torch
from train_classifier import ColorClassifier
from PIL import Image
from collections import defaultdict
from transparent_background import Remover
import csv

model_path = "color_classifier.pth"
label_encoder_path = "label_encoder.pkl"
image_path = "uploads/dress.jpg"
csv_file = "colors.csv"

UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'jpg'}

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

remover = Remover() # default setting
# remover = Remover(mode='fast', jit=True, device='cuda:0', ckpt='~/latest.pth') # custom setting
# remover = Remover(mode='base-nightly') # nightly release checkpoint

# Background removal
def remove_background(image_path):
    img = Image.open(image_path).convert('RGB') # read image
    img = adjust_contrast(img, 1.3)
    out = remover.process(img, type="[255,255,255]") # change background with color code [255, 0, 0]


    out.save('uploads/output.jpg') # save result

if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def adjust_contrast(img, factor):
    def contrast(px):
        return 128 + factor * (px - 128)
    return img.point(contrast)

def get_image_colors(image_path, model, label_encoder):

    image = Image.open(image_path)
    pixels = np.array(image.getdata()) / 255.0
    pixels = torch.tensor(pixels, dtype=torch.float32)

    with torch.no_grad():
        model.eval()
        outputs = model(pixels)
        _, predicted_indices = torch.max(outputs, 1)
        color_names = label_encoder.inverse_transform(predicted_indices.numpy())

    color_counter = defaultdict(int)
    for color_name in color_names:
        color_counter[color_name] += 1

    return color_counter

def get_rgb_from_csv(colors_list, csv_file_path):
    with open(csv_file_path, newline='') as csvfile:
        reader = csv.DictReader(csvfile)
        colors_dict = {row["Name"].lower(): (int(row["Red (8 bit)"]), int(row["Green (8 bit)"]), int(row["Blue (8 bit)"])) for row in reader}
    result = []
    for color_name in colors_list:
        if color_name.lower() in colors_dict:
            rgb = colors_dict[color_name.lower()]
            result.append((color_name, rgb))
        else:
            result.append((color_name, None))
    return result

def get_simple_color_name(rgb_value):

    named_colors = {'maroon': (128, 0, 0), 'dark red': (139, 0, 0), 'brown': (165, 42, 42), 'firebrick': (178, 34, 34), 'crimson': (220, 20, 60), 'red': (255, 0, 0), 'tomato': (255, 99, 71), 'coral': (255, 127, 80), 'indian red': (205, 92, 92), 'light coral': (240, 128, 128), 'dark salmon': (233, 150, 122), 'salmon': (250, 128, 114), 'light salmon': (255, 160, 122), 'orange red': (255, 69, 0), 'dark orange': (255, 140, 0), 'orange': (255, 165, 0), 'gold': (255, 215, 0), 'dark golden rod': (184, 134, 11), 'golden rod': (218, 165, 32), 'pale golden rod': (238, 232, 170), 'dark khaki': (189, 183, 107), 'khaki': (240, 230, 140), 'olive': (128, 128, 0), 'yellow': (255, 255, 0), 'yellow green': (154, 205, 50), 'dark olive green': (85, 107, 47), 'olive drab': (107, 142, 35), 'lawn green': (124, 252, 0), 'chartreuse': (127, 255, 0), 'green yellow': (173, 255, 47), 'dark green': (0, 100, 0), 'green': (0, 128, 0), 'forest green': (34, 139, 34), 'lime': (0, 255, 0), 'lime green': (50, 205, 50), 'light green': (144, 238, 144), 'pale green': (152, 251, 152), 'dark sea green': (143, 188, 143), 'medium spring green': (0, 250, 154), 'spring green': (0, 255, 127), 'sea green': (46, 139, 87), 'medium aqua marine': (102, 205, 170), 'medium sea green': (60, 179, 113), 'light sea green': (32, 178, 170), 'dark slate gray': (47, 79, 79), 'teal': (0, 128, 128), 'dark cyan': (0, 139, 139), 'aqua': (0, 255, 255), 'cyan': (0, 255, 255), 'light cyan': (224, 255, 255), 'dark turquoise': (0, 206, 209), 'turquoise': (64, 224, 208), 'medium turquoise': (72, 209, 204), 'pale turquoise': (175, 238, 238), 'aqua marine': (127, 255, 212), 'powder blue': (176, 224, 230), 'cadet blue': (95, 158, 160), 'steel blue': (70, 130, 180), 'corn flower blue': (100, 149, 237), 'deep sky blue': (0, 191, 255), 'dodger blue': (30, 144, 255), 'light blue': (173, 216, 230), 'sky blue': (135, 206, 235), 'light sky blue': (135, 206, 250), 'midnight blue': (25, 25, 112), 'navy': (0, 0, 128), 'dark blue': (0, 0, 139), 'medium blue': (0, 0, 205), 'blue': (0, 0, 255), 'royal blue': (65, 105, 225), 'blue violet': (138, 43, 226), 'indigo': (75, 0, 130), 'dark slate blue': (72, 61, 139), 'slate blue': (106, 90, 205), 'medium slate blue': (123, 104, 238), 'medium purple': (147, 112, 219), 'dark magenta': (139, 0, 139), 'dark violet': (148, 0, 211), 'dark orchid': (153, 50, 204), 'medium orchid': (186, 85, 211), 'purple': (128, 0, 128), 'thistle': (216, 191, 216), 'plum': (221, 160, 221), 'violet': (238, 130, 238), 'magenta / fuchsia': (255, 0, 255), 'orchid': (218, 112, 214), 'medium violet red': (199, 21, 133), 'pale violet red': (219, 112, 147), 'deep pink': (255, 20, 147), 'hot pink': (255, 105, 180), 'light pink': (255, 182, 193), 'pink': (255, 192, 203), 'antique white': (250, 235, 215), 'beige': (245, 245, 220), 'bisque': (255, 228, 196), 'blanched almond': (255, 235, 205), 'wheat': (245, 222, 179), 'corn silk': (255, 248, 220), 'lemon chiffon': (255, 250, 205), 'light golden rod yellow': (250, 250, 210), 'light yellow': (255, 255, 224), 'saddle brown': (139, 69, 19), 'sienna': (160, 82, 45), 'chocolate': (210, 105, 30), 'peru': (205, 133, 63), 'sandy brown': (244, 164, 96), 'burly wood': (222, 184, 135), 'tan': (210, 180, 140), 'rosy brown': (188, 143, 143), 'moccasin': (255, 228, 181), 'navajo white': (255, 222, 173), 'peach puff': (255, 218, 185), 'misty rose': (255, 228, 225), 'lavender blush': (255, 240, 245), 'linen': (250, 240, 230), 'old lace': (253, 245, 230), 'papaya whip': (255, 239, 213), 'sea shell': (255, 245, 238), 'mint cream': (245, 255, 250), 'slate gray': (112, 128, 144), 'light slate gray': (119, 136, 153), 'light steel blue': (176, 196, 222), 'lavender': (230, 230, 250), 'floral white': (255, 250, 240), 'alice blue': (240, 248, 255), 'ghost white': (248, 248, 255), 'honeydew': (240, 255, 240), 'ivory': (255, 255, 240), 'azure': (240, 255, 255), 'snow': (255, 250, 250), 'black': (0, 0, 0), 'dim gray / dim grey': (105, 105, 105), 'gray / grey': (128, 128, 128), 'dark gray / dark grey': (169, 169, 169), 'silver': (192, 192, 192), 'light gray / light grey': (211, 211, 211), 'gainsboro': (220, 220, 220), 'white smoke': (245, 245, 245), 'white': (255, 255, 255)}
    # simple_colors = {
    #      "black": (0, 0, 0),
    # "silver": (192, 192, 192),
    # "gray": (128, 128, 128),
    # "white": (255, 255, 255),
    # "maroon": (128, 0, 0),
    # "red": (255, 0, 0),
    # "purple": (128, 0, 128),
    # 'medium purple': (147, 112, 219),
    # "fuchsia": (255, 0, 255),
    # "green": (0, 128, 0),
    # "lime": (0, 255, 0),
    # "olive": (128, 128, 0),
    # "yellow": (255, 255, 0),
    # "navy": (0, 0, 128),
    # "blue": (0, 0, 255),
    # "teal": (0, 128, 128),
    # "aqua": (0, 255, 255),
    # "dark purple":(48,
    #   25,
    #   52),
    #   "green yellow": (172,
    # 191,
    # 96),
    # "cambrdige blue":(163,
    # 193,
    # 173)
    # }
    def compute_distance(rgb1, rgb2):
        return sum((c1 - c2) ** 2 for c1, c2 in zip(rgb1, rgb2))

    closest_color = min(named_colors.keys(), key=lambda color: compute_distance(rgb_value, named_colors[color]))
    # closest_color = min(simple_colors.keys(), key=lambda color: compute_distance(named_colors[closest_color], simple_colors[color]))
    
    return closest_color

def get_top_colors(color_pixels, color_codes):
    data = []
    pixels = 0
    for (color_name, rgb_val), (_, pixels) in zip(color_codes, color_pixels):
        data.append({"color": color_name, "rgb": rgb_val, "Pixels": pixels})
    top_colors = sorted(data, key=lambda x: x['Pixels'], reverse=True)
    for i in top_colors:
        pixels += i["Pixels"]
    response_data = [{"color": color["color"], "simple_color": get_simple_color_name(color["rgb"]) , "rgb": color["rgb"], "pixels":color["Pixels"]} for color in top_colors[:3]]
    color = response_data[0]["simple_color"]
    print(color)
    for i in response_data[1:]:
        # print(i["simple_color"] == color)
        if color == i["simple_color"]:
            response_data[0], i = i, response_data[0]
            # print(i["simple_color"] == color)
            return response_data[0]
    if len(response_data) > 1:
        if color == "white":
            response_data[0], response_data[1] = response_data[1], response_data[0]
        else:
            # response_data[1], response_data[0] = response_data[0], response_data[1]
            pass
    if (response_data[0]["pixels"] / pixels) > 0.35:
        response_data = response_data[0]
    return response_data

with open(label_encoder_path, "rb") as f:
    label_encoder = pickle.load(f)
    num_classes = len(label_encoder.classes_)

model = ColorClassifier(3, num_classes)
model.load_state_dict(torch.load(model_path))

@app.route('/upload', methods=['POST'])
def upload_file():
    """
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400
    if file and allowed_file(file.filename):
    """
    if request.json and request.json["image_path"] and os.path.exists(request.json["image_path"]):
        filename = os.path.join(app.config['UPLOAD_FOLDER'], 'input.jpg')
        shutil.copy(request.json["image_path"], filename)
        remove_background(filename)
        filename = os.path.join(app.config['UPLOAD_FOLDER'], 'output.jpg')
        image_colors = get_image_colors(filename, model, label_encoder)
        color_pixels = sorted(image_colors.items(), key=lambda x: x[1], reverse=True)
        color_codes = get_rgb_from_csv([color[0] for color in color_pixels], csv_file)
        return jsonify(get_top_colors(color_pixels, color_codes)), 200
    else:
        return jsonify({"error": "Invalid file type"}), 400

@app.route('/test', methods=['POST'])
def receive_data():

    data = request.json
    
    return jsonify(data), 200

if __name__ == '__main__':
    app.run(debug=True, port=5000)



