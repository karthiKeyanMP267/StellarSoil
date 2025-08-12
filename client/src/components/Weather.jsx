import React, { useState, useEffect } from 'react';
import { 
  SunIcon, 
  CloudIcon, 
  EyeIcon, 
  WindIcon,
  BeakerIcon,
  ExclamationTriangleIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import API from '../api/api';
import { toast } from 'react-toastify';

const Weather = ({ location }) => {
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [coords, setCoords] = useState(null);

  // Get user location
  useEffect(() => {
    if (location?.lat && location?.lon) {
      setCoords({ lat: location.lat, lon: location.lon });
    } else if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCoords({
            lat: position.coords.latitude,
            lon: position.coords.longitude
          });
        },
        (error) => {
          console.warn('Geolocation error:', error);
          // Default to Delhi coordinates if location access denied
          setCoords({ lat: 28.6139, lon: 77.2090 });
        }
      );
    } else {
      // Default to Delhi coordinates
      setCoords({ lat: 28.6139, lon: 77.2090 });
    }
  }, [location]);

  // Fetch weather data
  const fetchWeatherData = async () => {
    if (!coords) return;

    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      const [currentRes, forecastRes, alertsRes] = await Promise.all([
        API.get(`/api/weather/current?lat=${coords.lat}&lon=${coords.lon}`, { headers }),
        API.get(`/api/weather/forecast?lat=${coords.lat}&lon=${coords.lon}&days=5`, { headers }),
        API.get(`/api/weather/alerts?lat=${coords.lat}&lon=${coords.lon}`, { headers })
      ]);

      setWeather(currentRes.data);
      setForecast(forecastRes.data);
      setAlerts(alertsRes.data);
    } catch (error) {
      console.error('Weather fetch error:', error);
      const message = error.response?.data?.message || 'Failed to fetch weather data';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (coords) {
      fetchWeatherData();
    }
  }, [coords]);

  // Loading state
  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="animate-pulse">
          <div className="flex items-center justify-between mb-4">
            <div className="h-6 bg-gray-200 rounded w-32"></div>
            <div className="h-6 bg-gray-200 rounded w-6"></div>
          </div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="h-20 bg-gray-200 rounded"></div>
              <div className="h-20 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="text-center">
          <ExclamationTriangleIcon className="mx-auto h-12 w-12 text-red-500 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Weather Unavailable</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchWeatherData}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <ArrowPathIcon className="h-4 w-4 mr-2" />
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!weather) {
    return null;
  }

  const getWeatherIcon = (description) => {
    if (description.toLowerCase().includes('sun') || description.toLowerCase().includes('clear')) {
      return <SunIcon className="h-8 w-8 text-yellow-500" />;
    }
    return <CloudIcon className="h-8 w-8 text-gray-500" />;
  };

  const getAlertColor = (severity) => {
    switch (severity) {
      case 'high':
      case 'critical':
        return 'bg-red-100 border-red-300 text-red-800';
      case 'medium':
        return 'bg-yellow-100 border-yellow-300 text-yellow-800';
      default:
        return 'bg-blue-100 border-blue-300 text-blue-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Agricultural Alerts */}
      {alerts?.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <ExclamationTriangleIcon className="h-6 w-6 text-orange-500 mr-2" />
            Agricultural Alerts
          </h2>
          <div className="space-y-3">
            {alerts.map((alert, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border-l-4 ${getAlertColor(alert.severity)}`}
              >
                <div className="flex items-start">
                  <span className="text-2xl mr-3">{alert.icon}</span>
                  <div>
                    <h3 className="font-semibold">{alert.type}</h3>
                    <p className="text-sm mt-1">{alert.message}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Current Weather */}
      <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg text-white p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Current Weather</h2>
          <button
            onClick={fetchWeatherData}
            className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
          >
            <ArrowPathIcon className="h-5 w-5" />
          </button>
        </div>
        
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center mb-2">
              {getWeatherIcon(weather.description)}
              <span className="text-3xl font-bold ml-3">{weather.temperature}°C</span>
            </div>
            <p className="text-blue-100 capitalize">{weather.description}</p>
            <p className="text-blue-100 text-sm">{weather.location}</p>
          </div>
        </div>

        {/* Weather Details Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white bg-opacity-20 rounded-lg p-3">
            <div className="flex items-center text-blue-100 mb-1">
              <span className="text-lg">💧</span>
              <span className="ml-2 text-sm">Humidity</span>
            </div>
            <p className="text-lg font-semibold">{weather.humidity}%</p>
          </div>

          <div className="bg-white bg-opacity-20 rounded-lg p-3">
            <div className="flex items-center text-blue-100 mb-1">
              <WindIcon className="h-4 w-4" />
              <span className="ml-2 text-sm">Wind</span>
            </div>
            <p className="text-lg font-semibold">{weather.windSpeed} m/s</p>
          </div>

          <div className="bg-white bg-opacity-20 rounded-lg p-3">
            <div className="flex items-center text-blue-100 mb-1">
              <BeakerIcon className="h-4 w-4" />
              <span className="ml-2 text-sm">Pressure</span>
            </div>
            <p className="text-lg font-semibold">{weather.pressure} mb</p>
          </div>

          <div className="bg-white bg-opacity-20 rounded-lg p-3">
            <div className="flex items-center text-blue-100 mb-1">
              <EyeIcon className="h-4 w-4" />
              <span className="ml-2 text-sm">Visibility</span>
            </div>
            <p className="text-lg font-semibold">{weather.visibility} km</p>
          </div>
        </div>
      </div>

      {/* 5-Day Forecast */}
      {forecast?.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">5-Day Forecast</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {forecast.slice(0, 5).map((day, index) => (
              <div key={index} className="text-center p-4 rounded-lg border hover:bg-gray-50 transition-colors">
                <p className="text-sm font-medium text-gray-600 mb-2">
                  {new Date(day.date).toLocaleDateString('en-US', { 
                    weekday: 'short', 
                    month: 'short', 
                    day: 'numeric' 
                  })}
                </p>
                <div className="flex justify-center mb-2">
                  {getWeatherIcon(day.description)}
                </div>
                <p className="font-bold text-lg text-gray-900">{day.temperature}°C</p>
                <p className="text-xs text-gray-500 capitalize mt-1">{day.description}</p>
                {day.precipitation > 0 && (
                  <p className="text-xs text-blue-600 mt-1">
                    🌧️ {day.precipitation}mm
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Agricultural Recommendations */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Agricultural Recommendations</h2>
        <div className="space-y-3">
          {weather.temperature > 30 && (
            <div className="flex items-start p-3 bg-orange-50 rounded-lg">
              <span className="text-xl mr-3">🌡️</span>
              <div>
                <p className="text-orange-800 font-medium">High Temperature Alert</p>
                <p className="text-orange-700 text-sm">Increase irrigation frequency and provide shade for sensitive crops.</p>
              </div>
            </div>
          )}
          
          {weather.humidity > 80 && (
            <div className="flex items-start p-3 bg-blue-50 rounded-lg">
              <span className="text-xl mr-3">💧</span>
              <div>
                <p className="text-blue-800 font-medium">High Humidity</p>
                <p className="text-blue-700 text-sm">Monitor crops for fungal diseases and ensure proper ventilation.</p>
              </div>
            </div>
          )}
          
          {weather.windSpeed > 15 && (
            <div className="flex items-start p-3 bg-gray-50 rounded-lg">
              <span className="text-xl mr-3">💨</span>
              <div>
                <p className="text-gray-800 font-medium">Strong Winds</p>
                <p className="text-gray-700 text-sm">Secure lightweight structures and check for crop damage.</p>
              </div>
            </div>
          )}

          {weather.humidity < 40 && weather.temperature > 25 && (
            <div className="flex items-start p-3 bg-green-50 rounded-lg">
              <span className="text-xl mr-3">☀️</span>
              <div>
                <p className="text-green-800 font-medium">Ideal Growing Conditions</p>
                <p className="text-green-700 text-sm">Perfect weather for most crops. Maintain regular irrigation schedule.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Weather;
