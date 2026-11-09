"""
Flask microservice for ML-based anomaly detection
Endpoints:
  POST /detect-anomalies - Run anomaly detection
  POST /detect-behaviors - Run behavioral analysis
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
from anomaly_detector import MLAnomalyDetector
import json

app = Flask(__name__)
CORS(app)

detector = MLAnomalyDetector()

@app.route('/detect-anomalies', methods=['POST'])
def detect_anomalies():
    """Detect statistical anomalies in transactions"""
    try:
        data = request.json
        transactions = data.get('transactions', [])
        
        anomalies = detector.detect_anomalies(transactions)
        
        return jsonify({
            'success': True,
            'count': len(anomalies),
            'data': anomalies
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 400

@app.route('/detect-behaviors', methods=['POST'])
def detect_behaviors():
    """Detect behavioral patterns in transactions"""
    try:
        data = request.json
        transactions = data.get('transactions', [])
        
        behaviors = detector.detect_behavioral_patterns(transactions)
        
        return jsonify({
            'success': True,
            'count': len(behaviors),
            'data': behaviors
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 400

@app.route('/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({
        'status': 'ML service is running',
        'version': '1.0.0'
    })

if __name__ == '__main__':
    print("🤖 ML Anomaly Detection Service")
    print("🚀 Running on http://localhost:5001")
    print("\nEndpoints:")
    print("  POST /detect-anomalies  - Statistical anomaly detection")
    print("  POST /detect-behaviors  - Behavioral pattern detection")
    print("  GET  /health            - Health check\n")
    
    app.run(host='localhost', port=5001, debug=True)
