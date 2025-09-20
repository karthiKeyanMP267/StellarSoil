import axios from 'axios';

// Use VITE_API_URL if provided, otherwise default to relative '/api' to leverage Vite proxy in dev
const baseURL = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api`
  : '/api';

const API = axios.create({
  baseURL,
});

// Add auth token to requests if available
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle 401 Unauthorized responses
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const msg = error.response?.data?.msg || error.message || 'Unauthorized';
      alert('Authentication error: ' + msg);
      console.error('API 401 error:', error.response?.data || error.message); // Log backend error
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

// Auth endpoints
export const authApi = {
  login: (data) => API.post('/auth/login', data),
  register: (data) => {
    const formData = new FormData();
    for (const key in data) {
      if (key === 'kisanId' && data[key] instanceof File) {
        formData.append('kisanId', data[key]);
      } else {
        formData.append(key, data[key]);
      }
    }
    return API.post('/auth/register', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  }
};

// Admin endpoints
export const adminApi = {
  getPendingFarmers: () => API.get('/admin/pending-farmers'),
  approveFarmer: (farmerId) => API.put(`/admin/approve-farmer/${farmerId}`),
  rejectFarmer: (farmerId, reason) => API.put(`/admin/reject-farmer/${farmerId}`, { reason }),
  toggleUserStatus: (userId) => API.put(`/admin/toggle-user-status/${userId}`)
};

export default API;
