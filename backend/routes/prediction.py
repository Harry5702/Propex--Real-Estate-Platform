from flask import Blueprint, request, jsonify
import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import LabelEncoder
import joblib
import os

prediction_bp = Blueprint('prediction', __name__)

# Initialize the model (in a real scenario, you'd load a pre-trained model)
model = None
label_encoders = {}

def initialize_model():
    """Initialize a simple model for price prediction"""
    global model, label_encoders
    
    # Create sample data for training (in reality, this would be your actual dataset)
    sample_data = {
        'bedrooms': [2, 3, 4, 2, 3, 4, 5, 3, 2, 4],
        'bathrooms': [1, 2, 3, 1, 2, 2, 3, 2, 1, 3],
        'area': [1200, 1800, 2400, 1100, 1600, 2200, 3000, 1700, 1000, 2500],
        'property_type': ['Apartment', 'House', 'Villa', 'Apartment', 'House', 
                         'Villa', 'Villa', 'House', 'Apartment', 'Villa'],
        'location': ['Downtown', 'Suburb', 'Beach', 'Downtown', 'Suburb',
                    'Beach', 'Beach', 'Suburb', 'Downtown', 'Beach'],
        'price': [300000, 450000, 800000, 280000, 420000, 750000, 
                 1200000, 480000, 250000, 900000]
    }
    
    df = pd.DataFrame(sample_data)
    
    # Encode categorical variables
    label_encoders['property_type'] = LabelEncoder()
    label_encoders['location'] = LabelEncoder()
    
    df['property_type_encoded'] = label_encoders['property_type'].fit_transform(df['property_type'])
    df['location_encoded'] = label_encoders['location'].fit_transform(df['location'])
    
    # Prepare features
    features = ['bedrooms', 'bathrooms', 'area', 'property_type_encoded', 'location_encoded']
    X = df[features]
    y = df['price']
    
    # Train the model
    model = RandomForestRegressor(n_estimators=100, random_state=42)
    model.fit(X, y)
    
    return True

@prediction_bp.route('/predict', methods=['POST'])
def predict_price():
    try:
        global model, label_encoders
        
        # Initialize model if not already done
        if model is None:
            initialize_model()
        
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['bedrooms', 'bathrooms', 'area', 'property_type', 'location']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'{field} is required'}), 400
        
        # Prepare input data
        try:
            bedrooms = int(data['bedrooms'])
            bathrooms = int(data['bathrooms'])
            area = float(data['area'])
            property_type = data['property_type']
            location = data['location']
            
            # Encode categorical variables
            try:
                property_type_encoded = label_encoders['property_type'].transform([property_type])[0]
            except ValueError:
                # If property type not in training data, use a default value
                property_type_encoded = 0
                
            try:
                location_encoded = label_encoders['location'].transform([location])[0]
            except ValueError:
                # If location not in training data, use a default value
                location_encoded = 0
            
            # Create feature vector
            features = np.array([[bedrooms, bathrooms, area, property_type_encoded, location_encoded]])
            
            # Make prediction
            predicted_price = model.predict(features)[0]
            
            # Add some randomness to make it more realistic
            variance = predicted_price * 0.1  # 10% variance
            min_price = max(0, predicted_price - variance)
            max_price = predicted_price + variance
            
            return jsonify({
                'predicted_price': round(predicted_price, 2),
                'price_range': {
                    'min': round(min_price, 2),
                    'max': round(max_price, 2)
                },
                'confidence': round(np.random.uniform(0.75, 0.95), 2),  # Simulated confidence
                'factors': {
                    'bedrooms': bedrooms,
                    'bathrooms': bathrooms,
                    'area': area,
                    'property_type': property_type,
                    'location': location
                }
            }), 200
            
        except ValueError as ve:
            return jsonify({'error': f'Invalid input data: {str(ve)}'}), 400
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@prediction_bp.route('/market-trends', methods=['GET'])
def get_market_trends():
    """Get simulated market trends data"""
    try:
        # Simulate market trends data
        trends = {
            'overall_trend': 'up',
            'price_change_percent': 5.2,
            'average_price': 625000,
            'median_price': 580000,
            'properties_sold_last_month': 156,
            'average_days_on_market': 28,
            'location_trends': [
                {'location': 'Downtown', 'trend': 'up', 'change': 7.1},
                {'location': 'Suburb', 'trend': 'up', 'change': 3.8},
                {'location': 'Beach', 'trend': 'up', 'change': 8.5}
            ],
            'property_type_trends': [
                {'type': 'Villa', 'trend': 'up', 'change': 6.2},
                {'type': 'House', 'trend': 'up', 'change': 4.9},
                {'type': 'Apartment', 'trend': 'up', 'change': 3.1}
            ]
        }
        
        return jsonify(trends), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500