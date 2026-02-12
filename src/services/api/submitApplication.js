import { apiClient } from '@/services/api/client.js';
import { API_ENDPOINTS, APP_CONFIG } from '@/constants';

/**
 * Submit application. Uses mock when no backend is configured.
 */
export async function submitApplication(payload) {
  if (APP_CONFIG.MOCK_SUBMIT || !import.meta.env.VITE_API_BASE_URL) {
    await new Promise((r) => setTimeout(r, APP_CONFIG.MOCK_SUBMIT_DELAY));
    return { success: true, id: 'mock-' + Date.now() };
  }
  const { data } = await apiClient.post(API_ENDPOINTS.APPLICATION.SUBMIT, payload);
  return data;
}

export default submitApplication;
