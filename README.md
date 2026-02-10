# Social Support Application

A 3-step application wizard for a government social support portal. Citizens can apply for financial assistance with optional AI-assisted writing for situation descriptions.

## Features

- **3-step form wizard** with progress bar (Personal Info → Family & Financial → Situation Descriptions)
- **Responsive** layout (mobile, tablet, desktop)
- **English + Arabic** with RTL support
- **Accessibility**: ARIA roles, keyboard navigation, focus management
- **Progress saved** to LocalStorage automatically
- **Mock submit** (configurable to real API)
- **AI “Help Me Write”** in Step 3 using OpenAI GPT (with timeout and error handling)

## How to Run

### Prerequisites

- Node.js 18+ (20.19+ or 22.12+ recommended for Vite 7)
- npm or yarn

### Install and run

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

### Build for production

```bash
npm run build
npm run preview   # optional: preview production build
```

## OpenAI API Key Setup

The “Help Me Write” feature in Step 3 calls the OpenAI Chat Completions API. You must provide an API key.

1. Create a `.env` file in the project root (same folder as `package.json`).
2. Add:

   ```env
   VITE_OPENAI_API_KEY=sk-your-openai-api-key-here
   ```

3. Restart the dev server (`npm run dev`).

- **Security**: The key is only used in the browser for this demo. In production, call OpenAI from your own backend and never expose the key to the client.
- **Without key**: Step 3 still works; “Help Me Write” will show an error toast if the key is missing or invalid.

## Optional: Backend API

Submit is mocked by default. To use a real backend:

1. Create `.env` and set:

   ```env
   VITE_API_BASE_URL=https://your-api.example.com
   ```

2. In `src/services/api/submitApplication.js`, set `MOCK_SUBMIT` to `false` (or remove the mock branch) so requests go to `VITE_API_BASE_URL/application/submit`.

## Project Structure

```
src/
  components/       # Reusable UI and feature components
    ui/             # Library wrappers (Button, Input, Select, Toast, etc.)
    layout/         # ProgressBar, StepContainer, LanguageSwitcher
    features/       # AISuggestionModal
  features/
    application/    # ApplicationWizard and step components
  store/            # Redux store and application slice
  services/         # API client, submit, OpenAI service
  hooks/            # useLocalStorage, usePersistForm
  i18n/             # react-i18next (en, ar)
  utils/            # validation helpers
```

## Tech Stack

- **React** (JavaScript)
- **Vite**
- **React Router**
- **Redux Toolkit**
- **React Hook Form**
- **Ant Design** (via wrappers for easier library swap)
- **Axios**
- **react-i18next** (EN/AR, RTL)
- **OpenAI API** (gpt-3.5-turbo) for “Help Me Write”

## Architecture and Decisions

See [ARCHITECTURE.md](./ARCHITECTURE.md) for design choices, validation, accessibility, and possible improvements.
