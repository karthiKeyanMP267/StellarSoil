import API from './api';

// Use the configured API with interceptors

const farmManagementApi = {
  // Sensor Data
  getSensorData: async (farmId) => {
    const response = await API.get(`/farm-management/sensor-data/${farmId}`);
    return response.data;
  },

  addSensorData: async (data) => {
    const response = await API.post(`/farm-management/sensor-data`, data);
    return response.data;
  },

  // Pest Alerts
  reportPestAlert: async (alertData) => {
    const response = await API.post(`/farm-management/pest-alert`, alertData);
    return response.data;
  },

  getPestAlerts: async () => {
    const response = await API.get(`/farm-management/pest-alerts`);
    return response.data;
  },

  // Crop Health
  updateCropHealth: async (cropId, healthData) => {
    const response = await API.put(`/farm-management/crop-health/${cropId}`, healthData);
    return response.data;
  },

  analyzeCropImage: async (imageData) => {
    const formData = new FormData();
    formData.append('image', imageData);
    const response = await API.post(`/farm-management/analyze-crop`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Recommendations
  getRecommendations: async (latitude, longitude) => {
    const response = await API.get(`/farm-management/recommendations`, {
      params: { lat: latitude, lng: longitude }
    });
    return response.data;
  },

  getSeasonalGuide: async (latitude, longitude) => {
    const response = await API.get(`/farm-management/seasonal-guide`, {
      params: { lat: latitude, lng: longitude }
    });
    return response.data;
  }
};

export default farmManagementApi;
