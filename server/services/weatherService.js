import axios from 'axios';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Set up proper environment loading
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.resolve(__dirname, '../.env');
dotenv.config({ path: envPath });

class WeatherService {
  constructor() {
    this.openWeatherApiKey = process.env.OPENWEATHER_API_KEY;
    this.weatherApiKey = process.env.WEATHER_API_KEY;
    this.baseUrls = {
      openWeather: 'https://api.openweathermap.org/data/2.5',
      weatherApi: 'http://api.weatherapi.com/v1'
    };
    
    // Log which API keys are available
    console.log('Weather API Key available:', !!this.weatherApiKey);
    console.log('OpenWeather API Key available:', !!this.openWeatherApiKey);
  }

  async getCurrentWeather(lat, lon) {
    try {
      // Try OpenWeatherMap first
      if (this.openWeatherApiKey) {
        try {
          const response = await axios.get(`${this.baseUrls.openWeather}/weather`, {
            params: {
              lat,
              lon,
              appid: this.openWeatherApiKey,
              units: 'metric'
            }
          });

          return this.formatOpenWeatherData(response.data);
        } catch (error) {
          console.warn('OpenWeatherMap API failed, trying fallback...', error.message);
        }
      }

      // Try WeatherAPI as fallback
      if (this.weatherApiKey) {
        try {
          const response = await axios.get(`${this.baseUrls.weatherApi}/current.json`, {
            params: {
              key: this.weatherApiKey,
              q: `${lat},${lon}`,
              aqi: 'no'
            }
          });

          return this.formatWeatherApiData(response.data);
        } catch (error) {
          console.warn('WeatherAPI failed, using mock data...', error.message);
        }
      }

      // Fallback to mock data if no API keys or all APIs fail
      return this.getMockWeatherData();
    } catch (error) {
      console.error('Weather service error:', error);
      return this.getMockWeatherData();
    }
  }

  async getWeatherForecast(lat, lon, days = 5) {
    try {
      // Try OpenWeatherMap first
      if (this.openWeatherApiKey) {
        try {
          const response = await axios.get(`${this.baseUrls.openWeather}/forecast`, {
            params: {
              lat,
              lon,
              appid: this.openWeatherApiKey,
              units: 'metric',
              cnt: days * 8 // 8 forecasts per day (3-hour intervals)
            }
          });

          return this.formatOpenWeatherForecast(response.data);
        } catch (error) {
          console.warn('OpenWeatherMap forecast API failed, trying fallback...', error.message);
        }
      }

      // Try WeatherAPI as fallback
      if (this.weatherApiKey) {
        try {
          const response = await axios.get(`${this.baseUrls.weatherApi}/forecast.json`, {
            params: {
              key: this.weatherApiKey,
              q: `${lat},${lon}`,
              days,
              aqi: 'no'
            }
          });

          return this.formatWeatherApiForecast(response.data);
        } catch (error) {
          console.warn('WeatherAPI forecast failed, using mock data...', error.message);
        }
      }

      // Fallback to mock data
      return this.getMockForecastData(days);
    } catch (error) {
      console.error('Weather forecast service error:', error);
      return this.getMockForecastData(days);
    }
  }

  async getAgriculturalAlerts(lat, lon) {
    try {
      const weather = await this.getCurrentWeather(lat, lon);
      const alerts = [];

      // Generate agriculture-specific alerts based on weather conditions
      if (weather.temperature > 35) {
        alerts.push({
          type: 'heat_warning',
          severity: 'high',
          message: 'High temperature detected. Increase irrigation frequency.',
          icon: '🌡️'
        });
      }

      if (weather.humidity > 80) {
        alerts.push({
          type: 'humidity_warning',
          severity: 'medium',
          message: 'High humidity may promote fungal diseases. Monitor crops closely.',
          icon: '💧'
        });
      }

      if (weather.windSpeed > 20) {
        alerts.push({
          type: 'wind_warning',
          severity: 'medium',
          message: 'Strong winds detected. Secure lightweight structures.',
          icon: '💨'
        });
      }

      if (weather.description.toLowerCase().includes('rain')) {
        alerts.push({
          type: 'rain_info',
          severity: 'low',
          message: 'Rain expected. Adjust irrigation schedule accordingly.',
          icon: '🌧️'
        });
      }

      return alerts;
    } catch (error) {
      console.error('Agricultural alerts service error:', error);
      return [];
    }
  }

  formatOpenWeatherData(data) {
    return {
      temperature: Math.round(data.main.temp),
      humidity: data.main.humidity,
      windSpeed: data.wind.speed,
      description: data.weather[0].description,
      icon: data.weather[0].icon,
      pressure: data.main.pressure,
      visibility: data.visibility / 1000, // Convert to km
      uvIndex: 0, // Not available in current weather endpoint
      location: data.name
    };
  }

  formatWeatherApiData(data) {
    return {
      temperature: Math.round(data.current.temp_c),
      humidity: data.current.humidity,
      windSpeed: data.current.wind_kph / 3.6, // Convert to m/s
      description: data.current.condition.text,
      icon: data.current.condition.icon,
      pressure: data.current.pressure_mb,
      visibility: data.current.vis_km,
      uvIndex: data.current.uv,
      location: data.location.name
    };
  }

  formatOpenWeatherForecast(data) {
    return data.list.map(item => ({
      date: new Date(item.dt * 1000).toISOString().split('T')[0],
      time: new Date(item.dt * 1000).toLocaleTimeString(),
      temperature: Math.round(item.main.temp),
      humidity: item.main.humidity,
      description: item.weather[0].description,
      icon: item.weather[0].icon,
      windSpeed: item.wind.speed,
      precipitation: item.rain ? item.rain['3h'] || 0 : 0
    }));
  }

  formatWeatherApiForecast(data) {
    const forecast = [];
    data.forecast.forecastday.forEach(day => {
      forecast.push({
        date: day.date,
        temperature: Math.round(day.day.avgtemp_c),
        humidity: day.day.avghumidity,
        description: day.day.condition.text,
        icon: day.day.condition.icon,
        windSpeed: day.day.maxwind_kph / 3.6, // Convert to m/s
        precipitation: day.day.totalprecip_mm
      });
    });
    return forecast;
  }

  getMockWeatherData() {
    return {
      temperature: 28,
      humidity: 65,
      windSpeed: 8,
      description: 'Partly cloudy',
      icon: '02d',
      pressure: 1013,
      visibility: 10,
      uvIndex: 6,
      location: 'Demo Location'
    };
  }

  getMockForecastData(days) {
    const forecast = [];
    const baseDate = new Date();
    
    for (let i = 0; i < days; i++) {
      const date = new Date(baseDate);
      date.setDate(baseDate.getDate() + i);
      
      forecast.push({
        date: date.toISOString().split('T')[0],
        temperature: Math.round(25 + Math.random() * 10),
        humidity: Math.round(50 + Math.random() * 30),
        description: ['Sunny', 'Partly cloudy', 'Cloudy', 'Light rain'][Math.floor(Math.random() * 4)],
        icon: ['01d', '02d', '03d', '10d'][Math.floor(Math.random() * 4)],
        windSpeed: Math.round(5 + Math.random() * 10),
        precipitation: Math.random() * 5
      });
    }
    
    return forecast;
  }
}

export default new WeatherService();
