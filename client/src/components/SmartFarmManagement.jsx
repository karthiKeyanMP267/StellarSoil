import React, { useState, useEffect } from 'react';
import { 
  CloudIcon, 
  ChartBarIcon, 
  BellIcon,
  CameraIcon,
  BugAntIcon,
  LeafIcon
} from '@heroicons/react/24/outline';

const SmartFarmManagement = () => {
  const [farmData, setFarmData] = useState({
    weather: null,
    soilHealth: null,
    pestAlerts: [],
    cropHealth: null
  });

  useEffect(() => {
    const fetchFarmData = async () => {
      try {
        const [sensorData, pestAlerts, seasonalGuide] = await Promise.all([
          farmManagementApi.getSensorData(user.farmId),
          farmManagementApi.getPestAlerts(),
          farmManagementApi.getSeasonalGuide(farm.latitude, farm.longitude)
        ]);

        const formattedData = {
      weather: {
        temperature: 28,
        humidity: 65,
        rainfall: 2.5,
        forecast: [
          { day: 'Today', temp: 28, rain: 20 },
          { day: 'Tomorrow', temp: 27, rain: 60 },
          { day: 'Day 3', temp: 29, rain: 10 }
        ]
      },
      soilHealth: {
        moisture: 75,
        ph: 6.8,
        nutrients: {
          nitrogen: 'High',
          phosphorus: 'Medium',
          potassium: 'Medium'
        },
        recommendations: [
          'Reduce watering frequency',
          'Add organic matter for better structure'
        ]
      },
      pestAlerts: [
        {
          severity: 'medium',
          pest: 'Aphids',
          location: 'Section A',
          timestamp: new Date().toISOString()
        }
      ],
      cropHealth: {
        status: 'good',
        issues: [],
        growthStage: '60%',
        estimatedHarvest: '15 days'
      }
    };

    setFarmData(mockSensorData);
  }, []);

  // Simulated AI image analysis for disease detection
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Simulate AI analysis
      setTimeout(() => {
        alert('Analysis Complete: No disease detected. Plant health is optimal.');
      }, 2000);
    }
  };

  return (
    <div className="space-y-8">
      {/* Weather and Environment */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Weather</h3>
            <CloudIcon className="h-6 w-6 text-blue-500" />
          </div>
          {farmData.weather && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Temperature</span>
                <span className="text-2xl font-semibold">{farmData.weather.temperature}°C</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Humidity</span>
                <span className="text-2xl font-semibold">{farmData.weather.humidity}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Rainfall</span>
                <span className="text-2xl font-semibold">{farmData.weather.rainfall}mm</span>
              </div>
            </div>
          )}
        </div>

        {/* Soil Health Monitor */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Soil Health</h3>
            <LeafIcon className="h-6 w-6 text-green-500" />
          </div>
          {farmData.soilHealth && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Moisture</span>
                <span className="text-2xl font-semibold">{farmData.soilHealth.moisture}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">pH Level</span>
                <span className="text-2xl font-semibold">{farmData.soilHealth.ph}</span>
              </div>
              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Nutrients</h4>
                <div className="grid grid-cols-3 gap-2">
                  {Object.entries(farmData.soilHealth.nutrients).map(([nutrient, level]) => (
                    <div key={nutrient} className="text-center p-2 bg-gray-50 rounded">
                      <span className="text-xs text-gray-600 block">{nutrient}</span>
                      <span className="font-medium text-sm">{level}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Pest Detection */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Pest Alerts</h3>
            <BugAntIcon className="h-6 w-6 text-red-500" />
          </div>
          {farmData.pestAlerts.length > 0 ? (
            <div className="space-y-4">
              {farmData.pestAlerts.map((alert, index) => (
                <div key={index} className="border-l-4 border-yellow-500 pl-4">
                  <p className="font-medium text-gray-900">{alert.pest}</p>
                  <p className="text-sm text-gray-600">Location: {alert.location}</p>
                  <p className="text-sm text-gray-600">
                    Detected: {new Date(alert.timestamp).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-green-600">No pest issues detected</p>
          )}
        </div>

        {/* AI Disease Detection */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Disease Scanner</h3>
            <CameraIcon className="h-6 w-6 text-purple-500" />
          </div>
          <div className="space-y-4">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              id="cropImage"
            />
            <label
              htmlFor="cropImage"
              className="block w-full py-3 px-4 text-center border-2 border-dashed rounded-lg hover:border-green-500 cursor-pointer transition-colors"
            >
              Upload crop image for analysis
            </label>
            <p className="text-sm text-gray-600 text-center">
              AI-powered disease detection
            </p>
          </div>
        </div>
      </div>

      {/* Growth Monitoring */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-medium text-gray-900">Crop Growth Tracker</h3>
          <ChartBarIcon className="h-6 w-6 text-green-500" />
        </div>
        {farmData.cropHealth && (
          <div className="space-y-6">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">Growth Progress</span>
                <span className="text-sm font-medium text-gray-900">{farmData.cropHealth.growthStage}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-green-600 h-2.5 rounded-full" 
                  style={{ width: farmData.cropHealth.growthStage }}
                ></div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-green-50 rounded-lg p-4">
                <p className="text-sm text-green-600">Estimated Harvest</p>
                <p className="text-lg font-semibold text-green-900">
                  {farmData.cropHealth.estimatedHarvest}
                </p>
              </div>
              <div className="bg-blue-50 rounded-lg p-4">
                <p className="text-sm text-blue-600">Health Status</p>
                <p className="text-lg font-semibold text-blue-900 capitalize">
                  {farmData.cropHealth.status}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Smart Recommendations */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-medium text-gray-900">Smart Recommendations</h3>
          <BellIcon className="h-6 w-6 text-amber-500" />
        </div>
        {farmData.soilHealth?.recommendations && (
          <div className="space-y-4">
            {farmData.soilHealth.recommendations.map((rec, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center">
                    <span className="text-amber-600 font-medium">{index + 1}</span>
                  </div>
                </div>
                <div className="flex-grow">
                  <p className="text-gray-800">{rec}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SmartFarmManagement;
