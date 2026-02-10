/**
 * Validation helpers for form fields.
 * Centralized so rules can be reused and updated in one place.
 */

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[\d\s\-+()]{7,20}$/;

export const validationRules = {
  required: (value) => (value == null || String(value).trim() === '' ? false : true),
  email: (value) => !value || EMAIL_REGEX.test(String(value).trim()),
  phone: (value) => !value || PHONE_REGEX.test(String(value).trim()),
  minLength: (min) => (value) => !value || String(value).length >= min,
  maxLength: (max) => (value) => !value || String(value).length <= max,
  min: (min) => (value) => value == null || Number(value) >= min,
  max: (max) => (value) => value == null || Number(value) <= max,
};

export function getRequiredError(t) {
  return t('validation.required');
}

export function getEmailError(t) {
  return t('validation.invalidEmail');
}

export function getPhoneError(t) {
  return t('validation.invalidPhone');
}

export function getMinLengthError(t, min) {
  return t('validation.minLength', { min });
}

export function getMaxLengthError(t, max) {
  return t('validation.maxLength', { max });
}
