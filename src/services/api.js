import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://localhost:7252/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests automatically
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle common errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized - redirect to login
      localStorage.removeItem('authToken');
      sessionStorage.removeItem('authToken');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (credentials) => apiClient.post('/Auth/Login', credentials),
  forgotPassword: (email) => apiClient.post('/Auth/ForgotPassword', { email }),
};

export const attendanceAPI = {
  checkIn: (data) => apiClient.post('/Attendance/CheckIn', data),
  checkOut: (data) => apiClient.post('/Attendance/CheckOut', data),
  getFullAttendance: (userId) => apiClient.get(`/Attendance/FullAttendance?userId=${userId}`),
};

export default apiClient; 