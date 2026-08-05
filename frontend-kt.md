# Frontend KT Script — Spend Mix Tool

---

## 1. Introduction & Purpose

The **Spend Mix Tool** is a React-based analytics dashboard for e-commerce performance monitoring and planning. It enables multiple user personas (Perf Marketing Leads, Key Account Managers, Executives) to analyze platform spend, availability, market share, SOV (Share of Voice), and CPM/ATC metrics — and to run budgeting models.

---

## 2. Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19 + TypeScript |
| Build Tool | Vite |
| Routing | React Router DOM v7 |
| Global State | Redux Toolkit |
| Server State / Caching | TanStack React Query v5 |
| UI Components | MUI (Material UI) v9 |
| Styling | Styled Components + MUI |
| HTTP Client | Axios |
| Charts | Chart.js |
| Icons | Lucide React |
| Testing | Vitest + Testing Library |
| Code Quality | ESLint, Prettier, Husky (pre-commit) |

---

## 3. Project Structure

```
src/
├── App.tsx              # Root component — wires providers
├── main.tsx             # Entry point
├── api/                 # API layer — raw HTTP calls per domain
├── components/          # Reusable UI components
├── constants/           # App-wide constants and config
├── hooks/               # Custom hooks (data fetching + business logic)
├── layouts/             # Page shell (sidebar + header + outlet)
├── pages/               # Feature pages (one folder per route)
├── routes/              # Route definitions
├── services/            # QueryClient config
├── store/               # Redux store + slices
├── styles/              # Global styles
├── types/               # TypeScript types per domain
└── utils/               # Helper utilities
```

---

## 4. Application Entry & Provider Setup

`src/App.tsx` wraps the app in four nested providers in order:

1. **`ReduxProvider`** — makes the Redux store available globally
2. **`QueryClientProvider`** — powers TanStack React Query
3. **`ThemeProvider`** (MUI) — applies Poppins font theme globally
4. **`AppRoutes`** — the router component

`src/services/queryClient.ts` configures the shared `QueryClient`:
- **Stale time**: 10 minutes (data is not re-fetched for 10 min)
- **Retry**: 1 retry on failure
- **`refetchOnWindowFocus`**: disabled

---

## 5. Routing

All routes are defined in `src/routes/index.tsx` using `createBrowserRouter`.

**All feature pages are lazy-loaded** via `React.lazy()` and wrapped in `<Suspense>` with a `<PageLoader />` fallback — keeping the initial bundle small.

| Path | Page | Section |
|---|---|---|
| `/login` | LoginPage | Public |
| `/` | DailyPulse (PMM view) | Daily Pulse |
| `/key-account-manager` | KeyAccountManager | Daily Pulse |
| `/executive` | Executive | Review |
| `/deep-dive` | DeepDive | Review |
| `/on-shelf-availability` | OnShelfAvailability | Review |
| `/budgeting` | Budgeting | Planning |
| `/spend-reallocation` | SpendReallocation | Planning |

Routes under `/` use **`MainLayout`** as a shared shell.

---

## 6. Layout & Navigation

`src/layouts/MainLayout.tsx` renders:
- **`<Sidebar>`** — collapsible, driven by `sidebarSlice`. Menu items are grouped: *Daily Pulse*, *Review*, *Planning*
- **`<Header>`** — top bar with filter bar context
- **`<Outlet>`** — the active page's content

If the user is not authenticated, `MainLayout` redirects to `/login`.

---

## 7. Global State (Redux)

The store (`src/store/store.ts`) has three slices:

### `authSlice` (`src/store/authSlice.ts`)
Manages `isAuthenticated`, `accessToken`, `refreshToken`, `user`. Tokens are **persisted to `localStorage`** and rehydrated on page load.

Actions: `setAuth`, `clearAuth`, `setAccessToken`

### `filterSlice` (`src/store/filterSlice.ts`)
Stores the shared filter state applied across all pages:
- `platform` (persisted to `localStorage`)
- `category[]`, `geography[]`
- `model_run`
- `asmtDateRange` / `compDateRange` (assessment vs. comparison periods)

Actions: `setPlatform`, `setCategory`, `setGeography`, `setModelRun`, `setAsmtDateRange`, `setCompDateRange`, `resetFilters`

### `sidebarSlice`
Tracks whether the sidebar is expanded or collapsed.

---

## 8. API Layer

### HTTP Client — `src/api/apiClient.ts`

A configured Axios instance with:
- `baseURL` from `window.__ENV__.API_BASE_URL` → `VITE_API_BASE_URL` → `http://localhost:8000` (runtime env injection for Docker)
- **Request interceptor**: attaches `Bearer` token from `localStorage`
- **Response interceptor**: on `401`, attempts a silent token refresh using `refreshToken`; if that fails, calls `logout()` and redirects

### API modules (`src/api/`)

Each file is responsible for one domain:

| File | Domain |
|---|---|
| `authApi.ts` | Login, logout, refresh, current user |
| `filterApi.ts` | Platforms, categories, geographies, model runs |
| `statCardsApi.ts` | KPI stat cards |
| `deepDiveApi.ts` | Deep dive drill-down data |
| `executiveApi.ts` | Executive performance & P&L |
| `budgetingApi.ts` | Budgeting model runs, spending plan |
| `kamDailyPulseApi.ts` | KAM daily pulse metrics |
| `pmmDailyPulseApi.ts` | PMM daily pulse metrics |
| `osaApi.ts` | On-shelf availability |
| `aiInsightApi.ts` | AI insights fetch + logging |
| `spendReallocationApi.ts` | Spend reallocation data |

---

## 9. Custom Hooks (Data Layer)

All data fetching is abstracted into hooks under `src/hooks/`. They use `useQuery` from TanStack React Query and take filter parameters as arguments.

### Filter hooks — `src/hooks/useFilters.ts`
- `usePlatforms()` — fetches available platforms
- `useCategories(category)` — fetches category list
- `useGeographies(geography)` — fetches city/geography list
- `useModelRuns()` — fetches available budgeting model runs

### Auth hook — `src/hooks/useAuth.ts`
Provides `login()`, `logout()`, `refreshAccessToken()` methods that dispatch to Redux and call the API.

### Page-specific hooks
Each page has dedicated hooks. Examples:
- `useDailyPulseSOV`, `useDailyPulseCPM`, `useDailyPulseATC` — SOV/CPM/ATC metrics
- `useExecutivePlatformPerformance`, `useExecutivePnL` — Executive view
- `useBudgetingSpendingPlan`, `useBudgetingPlatformCards` — Budgeting
- `useBudgetingModelRunPoll` — polls model run status every 2 min

---

## 10. Key Pages Walkthrough

### Daily Pulse (`/`)
The PMM (Performance Marketing Manager) view. Displays SOV, CPM, and ATC metrics with expandable drilldown tables. The `activeTab` syncs with the Redux `platform` filter. AI insights are rendered via `<AiInsightsWithTracking>`.

### Budgeting (`/budgeting`)
Most complex page. Features:
- **Platform KPI cards** — per-platform performance summary
- **Spending Plan table** — editable allocation plan
- **Update Targets popup** — modal for updating KPI targets
- **Model run polling** — `useModelRunDetail` polls for `running`/`completed`/`failed` status
- Model runs with `running` or `failed` status disable edit interactions

### Deep Dive (`/deep-dive`)
Hierarchical drill-down: brand → subcategory → SKU, city-level breakdowns. Uses transformer utilities (`expandableTableTransformer.ts`, `cityTableDynamicTransformer.ts`) to reshape API responses into table-compatible formats.

### Executive (`/executive`)
Ecommerce P&L view + platform performance comparison. Date ranges use month-based (YYYY-MM) format vs. day-based ranges on other pages.

---

## 11. Shared Components

| Component | Purpose |
|---|---|
| `<FiltersBar>` | Global filter bar — platform tabs, category, geography, date range pickers, Apply button |
| `<AiInsightsWithTracking>` | AI-generated insights panel with tabs (all/high/medium/low priority), logs user interactions |
| `<TrendDrilldownTable>` | Reusable expandable table for trend data (SOV, CPM, ATC) |
| `<StatCards>` | KPI metric cards |
| `<AreaChart>` | Reusable area chart wrapper (Chart.js) |
| `<Sidebar>` | Collapsible navigation sidebar |
| `<Header>` | App header |
| `<PageLoader>` | Full-page spinner used during lazy route loading |
| `<Popup>` | Generic modal wrapper |
| `<CustomPagination>` | Table pagination control |

---

## 12. Filter Bar Behavior

The `<FiltersBar>` component reads from and dispatches to `filterSlice`. Key behaviors:
- Platform selection is persisted in `localStorage` across sessions
- Geography defaults to `['all']` — the backend applies no city filter when it receives `'all'`
- Date pickers use `dayjs` with preset options (defined in `constants/dateRangePresets.ts`)
- Each page syncs its local `filters` state from Redux on mount, then calls its own Apply action

---

## 13. Environment & Configuration

| Config | Source |
|---|---|
| API Base URL | `window.__ENV__.API_BASE_URL` (runtime) → `VITE_API_BASE_URL` (build-time) → `localhost:8000` |
| Category type | `CATEGORY_TYPE = 'category_group'` in `constants.ts` |
| API timeout | 4 minutes (for long-running model calls) |
| Model run poll interval | 2 minutes |

The `window.__ENV__` pattern allows the Docker container to inject the API URL at runtime via the `docker-entrypoint.sh` script without rebuilding the image.

---

## 14. Local Development

```bash
# Install dependencies
npm install

# Start dev server (Vite, port 5173 by default)
npm run dev

# Run tests
npm run test

# Run tests with UI
npm run test:ui

# Lint
npm run lint

# Format
npm run format
```

The backend is expected at `http://localhost:8000` unless overridden via `.env` (`VITE_API_BASE_URL`).

---

## 15. Code Quality & Conventions

- **Pre-commit hooks** via Husky + lint-staged run Prettier and ESLint on every commit
- **Path aliases**: `@/` maps to `src/` (configured in `tsconfig.app.json` and `vite.config.ts`)
- **Styling pattern**: Each page has a co-located `.styles.ts` file using styled-components. Shared styles are in `components/ui.styles.ts` and `components/table.styles.ts`
- **Types**: Domain-specific type files in `src/types/` — e.g. `budgetingTypes.ts`, `deepdiveTypes.ts`
- **No direct API calls in components** — all fetching goes through hooks

---

## 16. Good Starting Points for New Developers

1. `src/App.tsx` — understand the provider hierarchy
2. `src/routes/index.tsx` — see all routes and pages
3. `src/store/` — understand global state (auth, filters, sidebar)
4. `src/api/apiClient.ts` — understand auth + token refresh flow
5. Pick any page folder under `src/pages/` and trace: page → hooks → api module
 