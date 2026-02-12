/**
 * Application-wide constants organized by category.
 */

// ============================================================================
// ROUTES / PATHS
// ============================================================================

export const ROUTES = {
  // Root
  ROOT: '/',
  
  // Application routes
  APPLICATIONS: {
    APPLY: '/applications/apply',
    SUBMITTED: '/applications/submitted',
  },
  
  // Application detail (dynamic)
  APPLICATION_DETAIL: (applicationId) => `/application/${applicationId}`,
  
  // Pattern for matching application detail routes
  APPLICATION_DETAIL_PATTERN: '/application/:applicationId',
};

// ============================================================================
// STORAGE KEYS
// ============================================================================

export const STORAGE_KEYS = {
  // 
  APPLICATION_FORM: 'social-support-application',
  
  // Saved application responses prefix
  RESPONSE_PREFIX: 'response-',
};

// ============================================================================
// APPLICATION STEPS
// ============================================================================

export const STEPS = {
  // Step numbers
  MIN_STEP: 1,
  MAX_STEP: 3,
  
  // Step values
  STEP_1: 1,
  STEP_2: 2,
  STEP_3: 3,
  
  // Step keys (for i18n)
  STEP_KEYS: {
    STEP_1: 'personalInfo',
    STEP_2: 'familyFinancial',
    STEP_3: 'situationDescriptions',
  },
  
  // Step configuration for progress bar
  STEP_CONFIG: [
    { key: 'personalInfo', step: 1 },
    { key: 'familyFinancial', step: 2 },
    { key: 'situationDescriptions', step: 3 },
  ],
}

// ============================================================================
// API ENDPOINTS
// ============================================================================

export const API_ENDPOINTS = {
  APPLICATION: {
    SUBMIT: '/application/submit',
  },
};

// ============================================================================
// APPLICATION CONFIGURATION
// ============================================================================

export const APP_CONFIG = {
  // Mock submission flag
  MOCK_SUBMIT: true,
  
  // Mock submission delay (ms)
  MOCK_SUBMIT_DELAY: 800,
};
