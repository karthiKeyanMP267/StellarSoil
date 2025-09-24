# StellarSoil - Farm Management System

## Features

### Mandatory Farm Profile Registration
- Farmers are now required to complete their farm profile before accessing any farmer routes
- Profile information includes:
  - Farm name, type, and description
  - Location (address and GPS coordinates)
  - Contact information
  - Farm size and establishment year
  - Specialties and certifications
- The profile cannot be bypassed and blocks navigation until completed

### Live Market Price Prediction
- Market price predictions help farmers set appropriate prices for their products
- Features include:
  - Current market prices
  - 7-day price forecasts
  - Historical price trends
  - Regional price adjustments
  - Confidence intervals for predictions
  - Factors affecting price changes

## Implementation
- FarmerProfileGuard: Component that ensures farmers have completed their profiles
- MandatoryFarmProfile: Form that farmers must complete to proceed
- LiveMarketPriceWidget: Component displaying live market price predictions

## API Endpoints
- `/api/farms/profile/me`: GET/PUT farm profile information
- `/api/ml/price-prediction/:crop`: GET price predictions for a crop
- `/api/ml/crop-list`: GET list of available crops for prediction

## Technical Notes
- Farm profile validation happens on both client and server sides
- Price predictions use machine learning models based on historical data
- Mandatory profile check is implemented using React Router Guards
