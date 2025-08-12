import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
import joblib
import os
import sys
import json
from typing import Dict, List, Union, Optional

def validate_soil_data(data: Dict) -> bool:
    """Validate soil data input"""
    required_fields = ['N', 'P', 'K', 'temperature', 'humidity', 'ph', 'rainfall']
    ranges = {
        'N': (0, 200),
        'P': (0, 200),
        'K': (0, 200),
        'temperature': (0, 50),
        'humidity': (0, 100),
        'ph': (0, 14),
        'rainfall': (0, 300)
    }
    
    try:
        # Check all required fields exist and are within range
        for field in required_fields:
            value = float(data.get(field, None))
            if value is None:
                return False
            min_val, max_val = ranges[field]
            if value < min_val or value > max_val:
                return False
        return True
    except (TypeError, ValueError):
        return False

import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
import joblib
import os
import sys
import json

def validate_soil_data(data):
    """Validate soil data input"""
    required_fields = ['N', 'P', 'K', 'temperature', 'humidity', 'ph', 'rainfall']
    if not isinstance(data, dict):
        return False
    
    for field in required_fields:
        if field not in data:
            return False
        try:
            float(data[field])
        except (ValueError, TypeError):
            return False
    
    return True

class CropRecommendationSystem:
    def __init__(self):
        self.model = None
        self.scaler = StandardScaler()
        self.initialize_model()

    def initialize_model(self):
        # Sample data structure (you can expand this with real data)
        data = {
            'N': np.random.randint(0, 140, 1000),
            'P': np.random.randint(5, 145, 1000),
            'K': np.random.randint(5, 205, 1000),
            'temperature': np.random.uniform(8.83, 43.68, 1000),
            'humidity': np.random.uniform(14.26, 99.98, 1000),
            'ph': np.random.uniform(3.5, 9.94, 1000),
            'rainfall': np.random.uniform(20.21, 298.56, 1000),
        }

        # Crop labels (you can expand this list)
        crops = ['rice', 'wheat', 'mung bean', 'Tea', 'millet', 'maize', 'lentil', 'jute', 'coffee', 'cotton', 'ground nut', 'peas', 'rubber', 'sugarcane', 'tobacco', 'kidney beans', 'moth beans', 'coconut', 'black gram', 'adzuki beans', 'pigeon peas', 'chick peas', 'banana', 'grapes', 'apple', 'mango', 'muskmelon', 'orange', 'papaya', 'pomegranate', 'watermelon']
        
        # Create DataFrame
        df = pd.DataFrame(data)
        df['label'] = np.random.choice(crops, size=1000)

        # Split features and target
        X = df.drop('label', axis=1)
        y = df['label']

        # Split data
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

        # Scale features
        X_train_scaled = self.scaler.fit_transform(X_train)

        # Train model
        self.model = RandomForestClassifier(n_estimators=100, random_state=42)
        self.model.fit(X_train_scaled, y_train)

        # Save model
        if not os.path.exists('models'):
            os.makedirs('models')
        joblib.dump(self.model, 'models/crop_recommendation_model.joblib')

    def predict(self, soil_data):
        """
        Predict crop based on soil and weather data
        soil_data: dict with keys ['N', 'P', 'K', 'temperature', 'humidity', 'ph', 'rainfall']
        """
        try:
            # Convert input to correct format
            input_data = pd.DataFrame([soil_data])
            input_scaled = self.scaler.transform(input_data)
            
            # Get prediction and probabilities
            prediction = self.model.predict(input_scaled)[0]
            probabilities = self.model.predict_proba(input_scaled)[0]
            confidence = np.max(probabilities)
            
            # Get top 3 recommendations
            top_3_idx = np.argsort(probabilities)[-3:][::-1]
            recommendations = [
                {
                    'crop': self.model.classes_[idx],
                    'confidence': float(probabilities[idx])
                }
                for idx in top_3_idx
            ]
            
            return {
                'success': True,
                'recommendations': recommendations,
                'top_prediction': prediction,
                'confidence': float(confidence)
            }
        except Exception as e:
            return {
                'success': False,
                'error': str(e)
            }

    def get_crop_calendar(self, crop, location):
        """
        Get planting and harvesting calendar for a crop
        """
        # This is a simplified version. You can expand with real data
        calendars = {
            'rice': {
                'planting_season': ['June', 'July'],
                'harvesting_season': ['November', 'December'],
                'duration_months': 5
            },
            'wheat': {
                'planting_season': ['October', 'November'],
                'harvesting_season': ['March', 'April'],
                'duration_months': 6
            }
            # Add more crops
        }
        
        return calendars.get(crop.lower(), {
            'planting_season': ['Unknown'],
            'harvesting_season': ['Unknown'],
            'duration_months': 0
        })

def main():
    if len(sys.argv) < 2:
        print(json.dumps({
            'success': False,
            'error': 'No command provided'
        }))
        return

    command = sys.argv[1]
    
    try:
        recommender = CropRecommendationSystem()
        
        if command == 'health':
            # Health check - verify model is loaded
            if recommender.model is not None:
                print(json.dumps({
                    'success': True,
                    'status': 'healthy',
                    'message': 'Model is loaded and ready'
                }))
            else:
                print(json.dumps({
                    'success': False,
                    'status': 'unhealthy',
                    'error': 'Model failed to load'
                }))
                
        elif command == 'list-crops':
            # Return list of available crops
            crops = sorted(recommender.model.classes_)
            print(json.dumps({
                'success': True,
                'crops': crops
            }))
            
        elif command == 'predict':
            if len(sys.argv) < 3:
                print(json.dumps({
                    'success': False,
                    'error': 'No soil data provided'
                }))
                return
            
            try:
                soil_data = json.loads(sys.argv[2])
            except json.JSONDecodeError:
                print(json.dumps({
                    'success': False,
                    'error': 'Invalid JSON data'
                }))
                return
                
            if not validate_soil_data(soil_data):
                print(json.dumps({
                    'success': False,
                    'error': 'Invalid or missing soil data fields'
                }))
                return
            
            result = recommender.predict(soil_data)
            print(json.dumps(result))
            
        elif command == 'calendar':
            if len(sys.argv) < 4:
                print(json.dumps({
                    'success': False,
                    'error': 'Missing crop name or location'
                }))
                return
                
            crop = sys.argv[2]
            try:
                location = json.loads(sys.argv[3])
                result = recommender.get_crop_calendar(crop, location)
                print(json.dumps({
                    'success': True,
                    'calendar': result
                }))
            except (json.JSONDecodeError, KeyError):
                print(json.dumps({
                    'success': False,
                    'error': 'Invalid location data'
                }))
        else:
            print(json.dumps({
                'success': False,
                'error': f'Unknown command: {command}'
            }))
            
    except Exception as e:
        print(json.dumps({
            'success': False,
            'error': str(e)
        }))

if __name__ == '__main__':
    main()
