# Architecture and Decisions

## Overview

The app is a 3-step application wizard with Redux for global form state, React Hook Form per step for validation, and optional OpenAI assistance in Step 3. UI is built with Ant Design behind thin wrappers for scalability.

## Design Decisions

### 1. Component wrappers (Button, Input, Select, Toast, etc.)

All Ant Design usage goes through `src/components/ui/*`. This gives:

- **Single place to change**: Swapping to another UI library only touches the wrapper components.
- **Consistent API**: Consumers use the same props; internal implementation can change (e.g. Toast from `antd` message to react-hot-toast).
- **Easier testing**: Wrappers can be mocked or replaced in tests.

### 2. Redux + React Hook Form

- **Redux** holds the full application payload and current step so we can persist to LocalStorage and submit one object at the end.
- **React Hook Form** is used inside each step for validation and field control; on “Next” or “Submit”, validated values are dispatched to Redux (`updateForm`) and step is advanced (or form is submitted).
- This keeps validation logic in the form library while keeping a single source of truth in Redux for persistence and submit.

### 3. LocalStorage persistence

- `usePersistForm` subscribes to Redux `application` state and writes it to LocalStorage on every change.
- On load, `applicationSlice` initial state is read from LocalStorage so returning users see their last progress.
- Key: `social-support-application` (exported as `APPLICATION_STORAGE_KEY` from the slice).

### 4. Validation

- Centralized in `src/utils/validation.js`: rules (required, email, phone, min/max length) and error message getters using `t()` for i18n.
- Step 1: required fields, email and phone format.
- Step 2: required employment and housing; dependents and income validated as numbers.
- Step 3: all three text areas required before submit.

### 5. OpenAI integration

- **Service**: `src/services/openai/openaiService.js` calls `https://api.openai.com/v1/chat/completions` with model `gpt-3.5-turbo`.
- **Key**: From `import.meta.env.VITE_OPENAI_API_KEY` (set in `.env`).
- **Timeout**: 15s with `AbortController`; on timeout a dedicated error is thrown and the Toast shows a timeout message.
- **Errors**: API errors (e.g. 401) and network errors are caught; Toast shows a user-friendly message (see “Evaluation focus”).
- **Flow**: User clicks “Help Me Write” → modal opens with loading → request runs → suggestion is shown in a textarea; user can Accept (writes to field), Edit (then accept), or Discard.

### 6. Internationalization (i18n) and RTL

- **react-i18next** with JSON under `src/i18n/locales/` (en, ar).
- Language switcher in the header toggles `en` ↔ `ar`.
- When language is Arabic, `document.documentElement.dir` is set to `rtl` and `lang` to `ar`; layout and form actions use CSS so RTL works (e.g. `form-actions-between` with direction-aware flex).

### 7. Accessibility

- **ARIA**: Progress bar uses `role="progressbar"`, `aria-valuenow/min/max`; step regions use `role="region"` and `aria-labelledby` where appropriate; modal is labelled and described.
- **Keyboard**: Ant Design components provide focus and keyboard support; custom buttons and links are focusable; `:focus-visible` is styled in `App.css` for visible focus.
- **Forms**: Required fields use `aria-required`; errors use `aria-invalid` and, where needed, `aria-describedby` for error text.

### 8. Toast / notifications

- **Toast** in `src/components/ui/Toast` wraps Ant Design `message` and exposes `success`, `error`, `warning`, `info`.
- Used for: AI errors (timeout, API failure), submit success/failure, and any other user-facing feedback so all notifications go through one place.

## Possible improvements

- **Backend**: Replace mock submit with real API; move OpenAI calls to backend to keep API key server-side.
- **Tests**: Jest + React Testing Library for wizard flow, validation, and Toast/error paths.
- **Code splitting**: Lazy-load step components or OpenAI modal to reduce initial bundle size.
- **Offline**: Service worker and queue for submit when back online.
- **Stronger a11y**: Skip link, live region for step changes, and automated a11y tests (e.g. axe).
