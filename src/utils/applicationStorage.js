const RESPONSE_PREFIX = 'response-';

/**
 * Generate a unique application ID (numeric).
 */
export function generateApplicationId() {
  return Date.now() * 1000 + Math.floor(Math.random() * 1000);
}

/**
 * Save application data to localStorage as response-{applicationId}.
 * @param {number} applicationId
 * @param {object} data - Full application payload
 */
export function saveApplicationResponse(applicationId, data) {
  const key = `${RESPONSE_PREFIX}${applicationId}`;
  const payload = {
    applicationId,
    submittedAt: new Date().toISOString(),
    ...data,
  };
  localStorage.setItem(key, JSON.stringify(payload));
}

/**
 * Get a single saved application by ID.
 * @param {string|number} applicationId
 * @returns {object|null}
 */
export function getApplicationResponse(applicationId) {
  const key = `${RESPONSE_PREFIX}${applicationId}`;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

/**
 * List all saved application IDs and minimal info (for list view).
 * @returns {Array<{ applicationId: string, submittedAt: string }>}
 */
export function listSavedApplications() {
  const items = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith(RESPONSE_PREFIX)) {
      const id = key.slice(RESPONSE_PREFIX.length);
      try {
        const raw = localStorage.getItem(key);
        if (raw) {
          const parsed = JSON.parse(raw);
          items.push({
            applicationId: id,
            submittedAt: parsed.submittedAt || '',
          });
        } else {
          items.push({ applicationId: id, submittedAt: '' });
        }
      } catch {
        items.push({ applicationId: id, submittedAt: '' });
      }
    }
  }
  items.sort((a, b) => (b.submittedAt || '').localeCompare(a.submittedAt || ''));
  return items;
}
