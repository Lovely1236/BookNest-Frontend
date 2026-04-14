import axios from 'axios';
import axiosRetry from 'axios-retry';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

console.log('🔧 API Client initialized with baseURL:', import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api');

// Request Interceptor - Add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    console.log(`📤 REQUEST: ${config.method?.toUpperCase()} ${config.url}`, { 
      hasToken: !!token,
      baseURL: config.baseURL,
      fullUrl: `${config.baseURL}${config.url}`,
      data: config.data 
    });
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('❌ Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response Interceptor - Handle errors
apiClient.interceptors.response.use(
  (response) => {
    console.log(`📥 RESPONSE: ${response.status} ${response.config.url}`, {
      data: response.data,
      headers: response.headers
    });
    return response;
  },
  (error) => {
    console.error(`❌ RESPONSE ERROR: ${error.response?.status || 'NO_RESPONSE'} ${error.config?.url}`, {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message,
      code: error.code,
      headers: error.response?.headers
    });
    if (error.response?.status === 401) {
      console.log('🔐 Unauthorized - clearing auth and redirecting to login');
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Retry configuration
axiosRetry(apiClient, {
  retries: 3,
  retryDelay: axiosRetry.exponentialDelay,
  retryCondition: (error) =>
    axiosRetry.isNetworkOrIdempotentRequestError(error),
});

export default apiClient;
