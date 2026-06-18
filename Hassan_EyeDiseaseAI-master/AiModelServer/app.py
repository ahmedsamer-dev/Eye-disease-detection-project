from flask import Flask, request, jsonify
from flask_cors import CORS
import io
import os
import random

try:
    import tensorflow as tf
except ImportError:
    tf = None

try:
    import numpy as np
except ImportError:
    np = None

try:
    from PIL import Image
except ImportError:
    Image = None

app = Flask(__name__)
CORS(app)


MODEL_PATH = os.path.join(os.path.dirname(__file__), "model.h5")
FALLBACK_PATH = os.path.join(os.path.dirname(__file__), "..", "..", "AI_Model", "model.h5")

model = None
MOCK_MODE = False

if tf is not None and os.path.exists(MODEL_PATH):
    try:
        model = tf.keras.models.load_model(MODEL_PATH)
        print(f"[OK] Model loaded successfully from: {MODEL_PATH}")
    except Exception as e:
        print(f"[ERROR] Error loading model: {e}")
elif tf is not None and os.path.exists(FALLBACK_PATH):
    try:
        model = tf.keras.models.load_model(FALLBACK_PATH)
        print(f"[OK] Model loaded successfully from: {FALLBACK_PATH}")
    except Exception as e:
        print(f"[ERROR] Error loading model: {e}")
else:
    if tf is None:
        print("[WARNING] TensorFlow not installed! Running in MOCK MODE.")
    else:
        print("[WARNING] Model not found! Running in MOCK MODE.")
    MOCK_MODE = True


classes = ['Cataract', 'Diabetic Retinopathy', 'Glaucoma', 'Normal']


condition_details = {
    'Cataract': {
        'severity': 'Moderate - Surgical evaluation recommended',
        'iop_estimate': '14 mmHg (normal)',
        'retinal_cup_disc_ratio': '0.3 (normal)',
        'summary': 'The AI analysis detected signs of cataract in the fundus image. Cataracts cause clouding of the eye lens, leading to decreased vision. Early detection allows for timely surgical intervention.',
        'recommendations': [
            'Schedule a comprehensive eye examination with an ophthalmologist',
            'Discuss surgical options (phacoemulsification) if vision is significantly affected',
            'Monitor for progression with regular follow-up visits every 3-6 months',
            'Use anti-glare sunglasses and adequate lighting to manage symptoms'
        ]
    },
    'Diabetic Retinopathy': {
        'severity': 'High - Immediate follow-up required',
        'iop_estimate': '16 mmHg (normal)',
        'retinal_cup_disc_ratio': '0.4 (normal)',
        'summary': 'The AI analysis detected signs of Diabetic Retinopathy. This condition results from damage to the blood vessels of the retina due to diabetes. Early treatment can prevent severe vision loss.',
        'recommendations': [
            'Refer to a retinal specialist for fluorescein angiography',
            'Ensure strict blood sugar control (HbA1c < 7%)',
            'Consider anti-VEGF injections or laser photocoagulation therapy',
            'Schedule follow-up examination within 2-4 weeks'
        ]
    },
    'Glaucoma': {
        'severity': 'High - Monitor and treat promptly',
        'iop_estimate': '22 mmHg (elevated)',
        'retinal_cup_disc_ratio': '0.65 (borderline)',
        'summary': 'The AI analysis detected signs of Glaucoma. This condition involves increased intraocular pressure that can damage the optic nerve, leading to irreversible vision loss if untreated.',
        'recommendations': [
            'Perform visual field testing and OCT of the optic nerve',
            'Initiate IOP-lowering therapy (prostaglandin analogs as first-line)',
            'Monitor intraocular pressure quarterly',
            'Educate patient on the importance of medication adherence'
        ]
    },
    'Normal': {
        'severity': 'Low - No abnormalities detected',
        'iop_estimate': '15 mmHg (normal)',
        'retinal_cup_disc_ratio': '0.3 (normal)',
        'summary': 'The AI analysis shows a healthy fundus with no signs of disease. The retinal structures appear normal. Continue routine eye examinations for preventive care.',
        'recommendations': [
            'Continue routine eye examinations annually',
            'Maintain a healthy lifestyle with proper nutrition for eye health',
            'Protect eyes from UV exposure with quality sunglasses',
            'Report any sudden changes in vision immediately'
        ]
    }
}


@app.route('/predict', methods=['POST'])
def predict():
    if model is None and not MOCK_MODE:
        return jsonify({"error": "Model not loaded"}), 500

    if 'file' not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files['file']

    try:
        if MOCK_MODE:
            if np:
                random_probs = np.random.dirichlet(np.ones(len(classes)), size=1)[0]
                prediction = [random_probs]
                result_index = int(np.argmax(random_probs))
                confidence = float(np.max(random_probs)) * 100
            else:
                probs = [random.uniform(0, 1) for _ in range(len(classes))]
                total = sum(probs)
                probs = [p/total for p in probs]
                prediction = [probs]
                confidence = max(probs) * 100
                result_index = probs.index(max(probs))
        else:
            if not model or not np or not Image:
                return jsonify({"error": "Dependencies or model missing for real prediction"}), 500

            img = Image.open(io.BytesIO(file.read())).convert('RGB')
            img = img.resize((224, 224))
            img_array = np.array(img, dtype=np.float32)
            img_array = np.expand_dims(img_array, axis=0)

            prediction = model.predict(img_array)
            result_index = int(np.argmax(prediction))
            confidence = float(np.max(prediction)) * 100

        detected_condition = classes[result_index]
        details = condition_details[detected_condition]

        return jsonify({
            "condition": detected_condition,
            "confidence": round(confidence, 1),
            "severity": details['severity'],
            "iopEstimate": details['iop_estimate'],
            "retinalCupDiscRatio": details['retinal_cup_disc_ratio'],
            "summary": details['summary'],
            "recommendations": details['recommendations'],
            "allPredictions": {
                classes[i]: round(float(prediction[0][i]) * 100, 1)
                for i in range(len(classes))
            }
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/health', methods=['GET'])
def health():
    return jsonify({
        "status": "running",
        "model_loaded": model is not None,
        "mock_mode": MOCK_MODE,
        "classes": classes
    })


if __name__ == '__main__':
    print("=" * 50)
    print("  AI Eye Disease Detection Model Server")
    print("=" * 50)
    print(f"  Running on: http://localhost:5001")
    print(f"  Endpoints:")
    print(f"   POST /predict  - Send image for analysis")
    print(f"   GET  /health   - Check server status")
    print("=" * 50)
    app.run(debug=False, host='localhost', port=8080)
