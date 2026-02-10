import axios from 'axios';

const OPENAI_CHAT_URL = 'https://api.openai.com/v1/chat/completions';
const MODEL = 'gpt-3.5-turbo';
const DEFAULT_TIMEOUT = 15000;

/**
 * OpenAI service wrapper.
 * Centralizes API key usage and error handling so we can swap client or add retries later.
 */
export async function generateSuggestion(userPrompt, options = {}) {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('OpenAI API key is not configured');
  }

  const timeout = options.timeout ?? DEFAULT_TIMEOUT;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await axios.post(
      OPENAI_CHAT_URL,
      {
        model: MODEL,
        messages: [
          {
            role: 'system',
            content:
              'You help people write clear, professional descriptions of their financial and employment situation for a government social support application. Keep responses concise (2-4 sentences) and factual.',
          },
          { role: 'user', content: userPrompt },
        ],
        max_tokens: 200,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        signal: controller.signal,
        timeout,
      }
    );

    clearTimeout(timeoutId);
    const content = response.data?.choices?.[0]?.message?.content;
    return content?.trim() ?? '';
  } catch (err) {
    clearTimeout(timeoutId);
    if (err.code === 'ECONNABORTED' || err.name === 'AbortError') {
      const timeoutError = new Error('Request timed out');
      timeoutError.code = 'TIMEOUT';
      throw timeoutError;
    }
    if (err.response?.status === 401) {
      const authError = new Error('Invalid API key');
      authError.code = 'AUTH';
      throw authError;
    }
    throw err;
  }
}

export default generateSuggestion;
