"""
Test different preprocessing methods to find the correct one for the model
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
print(f"Model input shape: {model.input_shape}")

img_path = input("Enter image path: ").strip().strip('"')
if not os.path.exists(img_path):
    print(f"File not found: {img_path}")
    sys.exit(1)

img = Image.open(img_path).convert('RGB')
img_resized = img.resize((224, 224))
img_array = np.array(img_resized)

# =============================================
# Method 1: No normalization (raw 0-255)
# EfficientNet has built-in Rescaling layer
# =============================================
print("\n" + "=" * 50)
print("Method 1: Raw pixels (0-255) - No normalization")
print("=" * 50)
inp = np.expand_dims(img_array.astype(np.float32), axis=0)
pred = model.predict(inp, verbose=0)
for i, cls in enumerate(classes):
    pct = float(pred[0][i]) * 100
    bar = "#" * int(pct / 2)
    print(f"  {cls:25s} : {pct:6.2f}% {bar}")
print(f"  >> {classes[np.argmax(pred)]} ({float(np.max(pred))*100:.1f}%)")

# =============================================
# Method 2: Divide by 255 (current method)
# =============================================
print("\n" + "=" * 50)
print("Method 2: Divide by 255 (0.0 - 1.0)")
print("=" * 50)
inp = np.expand_dims(img_array / 255.0, axis=0).astype(np.float32)
pred = model.predict(inp, verbose=0)
for i, cls in enumerate(classes):
    pct = float(pred[0][i]) * 100
    bar = "#" * int(pct / 2)
    print(f"  {cls:25s} : {pct:6.2f}% {bar}")
print(f"  >> {classes[np.argmax(pred)]} ({float(np.max(pred))*100:.1f}%)")

# =============================================
# Method 3: EfficientNet preprocess_input
# Scales to [-1, 1]
# =============================================
print("\n" + "=" * 50)
print("Method 3: EfficientNet preprocess_input (-1 to 1)")
print("=" * 50)
inp = np.expand_dims(img_array.copy(), axis=0).astype(np.float32)
inp = tf.keras.applications.efficientnet.preprocess_input(inp)
pred = model.predict(inp, verbose=0)
for i, cls in enumerate(classes):
    pct = float(pred[0][i]) * 100
    bar = "#" * int(pct / 2)
    print(f"  {cls:25s} : {pct:6.2f}% {bar}")
print(f"  >> {classes[np.argmax(pred)]} ({float(np.max(pred))*100:.1f}%)")

# =============================================
# Method 4: ImageNet normalization
# =============================================
print("\n" + "=" * 50)
print("Method 4: ImageNet mean/std normalization")
print("=" * 50)
mean = np.array([0.485, 0.456, 0.406])
std = np.array([0.229, 0.224, 0.225])
inp = np.expand_dims((img_array / 255.0 - mean) / std, axis=0).astype(np.float32)
pred = model.predict(inp, verbose=0)
for i, cls in enumerate(classes):
    pct = float(pred[0][i]) * 100
    bar = "#" * int(pct / 2)
    print(f"  {cls:25s} : {pct:6.2f}% {bar}")
print(f"  >> {classes[np.argmax(pred)]} ({float(np.max(pred))*100:.1f}%)")

print("\n>> Pick the method that shows ONE class with HIGH confidence (70%+)")
