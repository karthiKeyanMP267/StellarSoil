import pandas as pd
import numpy as np
from sklearn.ensemble import GradientBoostingRegressor
from sklearn.preprocessing import StandardScaler
import joblib
import os
from datetime import datetime, timedelta
import sys
import json
from typing import Dict, List, Union, Optional

def validate_input(crop: str, days: int) -> bool:
    """Validate input parameters"""
    if not isinstance(crop, str) or len(crop) == 0:
        return False
    try:
        days = int(days)
        if days < 1 or days > 365:
            return False
    except ValueError:
        return False
    return True

class PricePredictionSystem:
    def __init__(self):
        self.model = None
        self.scaler = StandardScaler()
        self.initialize_model()

    def initialize_model(self):
        # Generate sample historical price data
        dates = pd.date_range(start='2024-01-01', end='2025-08-05', freq='D')
        crops = ['rice', 'wheat', 'tomatoes', 'potatoes', 'onions']
        
        data = []
        for crop in crops:
            base_price = np.random.uniform(20, 100)
            for date in dates:
                # Add seasonal variations and trends
                month = date.month
                seasonal_factor = np.sin(2 * np.pi * month / 12) * 5
                trend = 0.01 * (date - dates[0]).days
                noise = np.random.normal(0, 2)
                
                price = base_price + seasonal_factor + trend + noise
                
                data.append({
                    'date': date,
                    'crop': crop,
                    'price': max(price, 10),  # Ensure price doesn't go too low
                    'month': month,
                    'day_of_week': date.dayofweek,
                    'season': (month % 12 + 3) // 3
                })

        df = pd.DataFrame(data)
        
        # Train separate model for each crop
        self.models = {}
        for crop in crops:
            crop_data = df[df['crop'] == crop].copy()
            
            # Create features
            X = crop_data[['month', 'day_of_week', 'season']]
            y = crop_data['price']
            
            # Scale features
            X_scaled = self.scaler.fit_transform(X)
            
            # Train model
            model = GradientBoostingRegressor(n_estimators=100, random_state=42)
            model.fit(X_scaled, y)
            
            self.models[crop] = {
                'model': model,
                'scaler': self.scaler
            }
        
        # Save models
        if not os.path.exists('models'):
            os.makedirs('models')
        joblib.dump(self.models, 'models/price_prediction_models.joblib')

    def predict_price(self, crop, days_ahead=30):
        """
        Predict prices for the next specified number of days
        """
        try:
            if crop.lower() not in self.models:
                return {
                    'success': False,
                    'error': f'No model available for crop: {crop}'
                }

            model_data = self.models[crop.lower()]
            model = model_data['model']
            scaler = model_data['scaler']

            # Generate dates for prediction
            dates = pd.date_range(start=datetime.now(), periods=days_ahead, freq='D')
            
            # Prepare features for prediction
            prediction_data = pd.DataFrame({
                'month': dates.month,
                'day_of_week': dates.dayofweek,
                'season': (dates.month % 12 + 3) // 3
            })
            
            # Scale features
            X_pred = scaler.transform(prediction_data)
            
            # Make predictions
            predictions = model.predict(X_pred)
            
            # Calculate confidence intervals (simplified)
            std_dev = np.std(predictions)
            confidence_interval = 1.96 * std_dev  # 95% confidence interval
            
            return {
                'success': True,
                'predictions': [
                    {
                        'date': date.strftime('%Y-%m-%d'),
                        'price': float(price),
                        'lower_bound': float(max(0, price - confidence_interval)),
                        'upper_bound': float(price + confidence_interval)
                    }
                    for date, price in zip(dates, predictions)
                ],
                'average_price': float(np.mean(predictions)),
                'confidence_interval': float(confidence_interval)
            }
        except Exception as e:
            return {
                'success': False,
                'error': str(e)
            }

    def get_price_factors(self, crop):
        """
        Get factors affecting price for a specific crop
        """
        # This could be expanded with real data and analysis
        factors = {
            'rice': [
                {'factor': 'Seasonal demand', 'impact': 'High'},
                {'factor': 'Monsoon conditions', 'impact': 'High'},
                {'factor': 'Global supply', 'impact': 'Medium'},
                {'factor': 'Government policies', 'impact': 'High'}
            ],
            'wheat': [
                {'factor': 'Winter crop yield', 'impact': 'High'},
                {'factor': 'International prices', 'impact': 'Medium'},
                {'factor': 'Storage conditions', 'impact': 'Medium'}
            ]
            # Add more crops
        }
        
        return factors.get(crop.lower(), [])

def main():
    if len(sys.argv) < 2:
        print(json.dumps({
            'success': False,
            'error': 'No command provided'
        }))
        return

    command = sys.argv[1]
    
    try:
        predictor = PricePredictionSystem()
        
        if command == 'health':
            # Health check - verify models are loaded
            if predictor.models:
                print(json.dumps({
                    'success': True,
                    'status': 'healthy',
                    'message': 'Models are loaded and ready'
                }))
            else:
                print(json.dumps({
                    'success': False,
                    'status': 'unhealthy',
                    'error': 'Models failed to load'
                }))
                
        elif command == 'predict':
            if len(sys.argv) < 4:
                print(json.dumps({
                    'success': False,
                    'error': 'Missing crop name or days'
                }))
                return
                
            crop = sys.argv[2]
            days = sys.argv[3]
            
            if not validate_input(crop, days):
                print(json.dumps({
                    'success': False,
                    'error': 'Invalid input parameters'
                }))
                return
            
            result = predictor.predict_price(crop, int(days))
            print(json.dumps(result))
            
        elif command == 'factors':
            if len(sys.argv) < 3:
                print(json.dumps({
                    'success': False,
                    'error': 'Missing crop name'
                }))
                return
                
            crop = sys.argv[2]
            factors = predictor.get_price_factors(crop)
            print(json.dumps({
                'success': True,
                'factors': factors
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
