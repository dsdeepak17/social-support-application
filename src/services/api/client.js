import axios from 'axios';

/**
 * Axios instance for API calls.
 * Base URL and headers can be updated here when connecting to a real backend.
 */
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default apiClient;
