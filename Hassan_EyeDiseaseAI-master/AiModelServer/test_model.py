"""
Test script to verify the AI model predictions directly
"""
import tensorflow as tf
import numpy as np
from PIL import Image
import sys
import os

MODEL_PATH = r"D:\Downloads\Model AI\model.h5"
classes = ['Cataract', 'Diabetic Retinopathy', 'Glaucoma', 'Normal']

print("Loading model...")
model = tf.keras.models.load_model(MODEL_PATH)

# Show model input shape
print(f"Model input shape: {model.input_shape}")
print(f"Model output shape: {model.output_shape}")
print("-" * 50)

# Test with an image
if len(sys.argv) > 1:
    img_path = sys.argv[1]
else:
    img_path = input("Enter image path: ").strip().strip('"')

if not os.path.exists(img_path):
    print(f"File not found: {img_path}")
    sys.exit(1)

print(f"Testing image: {img_path}")

img = Image.open(img_path).convert('RGB')
print(f"Original size: {img.size}")

img_resized = img.resize((224, 224))
img_array = np.array(img_resized) / 255.0
img_array = np.expand_dims(img_array, axis=0)

print(f"Input array shape: {img_array.shape}")
print(f"Input range: [{img_array.min():.3f}, {img_array.max():.3f}]")
print("-" * 50)

prediction = model.predict(img_array)
print(f"\nRaw prediction output: {prediction}")
print(f"\nResults:")
for i, cls in enumerate(classes):
    pct = float(prediction[0][i]) * 100
    bar = "#" * int(pct / 2)
    print(f"  {cls:25s} : {pct:6.2f}% {bar}")

result_index = int(np.argmax(prediction))
print(f"\n>> Predicted: {classes[result_index]} ({float(np.max(prediction))*100:.1f}%)")
