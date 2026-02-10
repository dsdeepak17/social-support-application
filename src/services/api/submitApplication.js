import { apiClient } from '@/services/api/client.js';

const MOCK_SUBMIT = true;

/**
 * Submit application. Uses mock when no backend is configured.
 */
export async function submitApplication(payload) {
  if (MOCK_SUBMIT || !import.meta.env.VITE_API_BASE_URL) {
    await new Promise((r) => setTimeout(r, 800));
    return { success: true, id: 'mock-' + Date.now() };
  }
  const { data } = await apiClient.post('/application/submit', payload);
  return data;
}

export default submitApplication;
