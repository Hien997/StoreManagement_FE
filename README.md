# StorePro

A modern, single-page **store management dashboard** built with React 19, TypeScript, Vite, and Tailwind CSS. StorePro helps small and mid-sized retailers manage products, categories, brands, suppliers, customers, inventory, and orders from one clean interface, with bilingual (English / Vietnamese) support and light/dark themes.

> Frontend only. It talks to a REST API (configured via environment variables) and does not ship a backend.

## Features

- **Dashboard** — at-a-glance KPIs (Revenue, orders, low-stock, customers) and recent activity.
- **Products** — full CRUD with categories, brands, suppliers, pricing, stock, and expiration tracking.
- **Categories** — hierarchical (tree) organization of the catalog.
- **Brands** — brand management linked to products.
- **Inventory** — stock-movement history (in / out / adjustment) and inventory valuation.
- **Orders** — create customer orders, update status (pending / completed / cancelled), and view order details.
- **Customers** — customer directory with order history and lifetime spend.
- **Suppliers** — supplier directory with outstanding balances and supplied products.
- **Reports** — sales vs. purchase summaries with charts (Revenue trend, by category, top products).
- **Settings** — appearance (theme), profile, and notification preferences.
- **Authentication** — login, "forgot password" flow, JWT access/refresh handling, and route protection.
- **Internationalization** — English and Vietnamese, switchable at runtime.
- **Theming** — light, dark, and system modes.

## Tech Stack

| Area                    | Choice                                                                                                                |
| ----------------------- | --------------------------------------------------------------------------------------------------------------------- |
| Build tool              | [Vite](https://vitejs.dev/) 6                                                                                         |
| Framework               | [React](https://react.dev/) 19 + TypeScript 5                                                                         |
| Routing                 | [React Router](https://reactrouter.com/) 7                                                                            |
| Data fetching / caching | [TanStack Query](https://tanstack.com/query) 5                                                                        |
| Tables                  | [TanStack Table](https://tanstack.com/table) 8 + [TanStack Virtual](https://tanstack.com/virtual) 3                   |
| Forms                   | [React Hook Form](https://react-hook-form.com/) 7 + [Zod](https://zod.dev/) 3                                         |
| State                   | [Zustand](https://zustand-demo.pmnd.rs/) 5 (auth, theme, UI)                                                          |
| UI                      | [Radix UI](https://www.radix-ui.com/) primitives + [Tailwind CSS](https://tailwindcss.com/) 3 + `tailwindcss-animate` |
| Charts                  | [Recharts](https://recharts.org/) 2                                                                                   |
| i18n                    | [i18next](https://www.i18next.com/) + [react-i18next](https://react.i18next.com/)                                     |
| HTTP                    | [Axios](https://axios-http.com/)                                                                                      |

## Getting Started

### Prerequisites

- Node.js 18+ (Node 20+ recommended)
- A running instance of the StorePro API (or a compatible REST backend)

### Installation

```bash
# Install dependencies
npm install

# Start the development server
npm run dev
```

The app will be available at `http://localhost:5173` (Vite's default port).

### Environment Variables

Create a `.env` (or `.env.local`) file in the project root. The app reads the API base URL from Vite's environment variables:

```bash
# Base URL of the backend API
VITE_API_URL=http://localhost:8000/api
```

> All `VITE_`-prefixed variables are exposed to the client at build time. See `src/shared/api/client.ts` for how the base URL and auth token are applied to requests.

## Available Scripts

| Script            | Description                                                  |
| ----------------- | ------------------------------------------------------------ |
| `npm run dev`     | Start the Vite dev server with HMR.                          |
| `npm run build`   | Type-check (`tsc -b`) and build for production into `dist/`. |
| `npm run preview` | Preview the production build locally.                        |
| `npm run lint`    | Run the TypeScript compiler in no-emit mode to type-check.   |

## Project Structure

```
src/
├── features/            # Feature-first modules (auth, products, categories, brands,
│                       #   suppliers, customers, orders, inventory, reports, settings)
│   └── <feature>/
│       ├── pages/        # Route-level pages, dialogs, and forms
│       ├── hooks.ts      # TanStack Query hooks (list/detail + mutations)
│       ├── service.ts    # API calls for the feature
│       └── types.ts      # Feature-local types (auth only)
├── shared/
│   ├── api/            # Axios client + response types
│   ├── components/      # Shared UI (PageHeader, DataTable, dialogs) + form fields
│   ├── components/ui/   # Low-level Radix-based primitives (button, card, select, ...)
│   ├── i18n/          # i18next setup + en.json / vi.json translation resources
│   ├── layouts/        # App shell (sidebar + header)
│   ├── lib/            # Utilities (format, export, product schema, query client)
│   ├── store/          # Zustand stores (auth, theme, UI)
│   └── types/          # Shared domain types and API mappers
├── router.tsx          # Route definitions + protected routes
└── main.tsx           # Application entry point
```

## Internationalization

Translations live in `src/shared/i18n/` as JSON resources (`en.json`, `vi.json`). The active language is persisted and can be switched from the header language switcher. To add a new language:

1. Copy `src/shared/i18n/en.json` to `src/shared/i18n/<lang>.json` and translate the values.
2. Register the language in `src/shared/i18n/index.ts` (add it to `SUPPORTED_LANGUAGES` and the `resources` map).

UI text should always be rendered through the `t()` function (from `react-i18next`) rather than hardcoded strings. API field names, model identifiers, and SKUs are intentionally left untranslated.

## Theming

The app supports **light**, **dark**, and **system** themes via a Zustand theme store and Tailwind's `class` dark mode. The preference is toggled from the header and applied by adding/removing the `dark` class on the root element.

## Authentication

- The login page issues a JWT (access + refresh tokens) via the API and stores the session in the Zustand auth store.
- Authenticated routes are wrapped in `ProtectedRoute`, which redirects unauthenticated users to `/login` while preserving the intended destination.
- The Axios client automatically attaches the access token to outgoing requests and can use the refresh token to recover expired sessions.

## API Contract

The frontend expects a REST API exposing the following resource groups (paths are relative to `VITE_API_URL`):

| Resource      | Endpoints                                                |
| ------------- | -------------------------------------------------------- |
| Auth          | `POST /auth/login`, `GET /auth/me`, `POST /auth/refresh` |
| Products      | `/products`                                              |
| Categories    | `/categories`                                            |
| Brands        | `/brands`                                                |
| Suppliers     | `/suppliers`                                             |
| Customers     | `/customers`                                             |
| Orders        | `/orders`                                                |
| Inventory     | `/inventory`                                             |
| Reports       | `/reports/sales`, `/reports/purchases`                   |
| Settings      | `/settings`                                              |
| Users / Roles | `/users`, `/roles`                                       |

List endpoints are expected to return a paginated envelope (`{ items, pagination }`) and mutations return the affected resource. See `src/shared/types/api/response.ts` for the response shapes and `src/types/api/mappers.ts` for client-side mapping.

## Building for Production

```bash
npm run build
```

The optimized bundle is emitted to `dist/`. Deploy the contents of `dist/` to any static file host (Netlify, Vercel, GitHub Pages, Nginx, etc.). Make sure to:

- Set `VITE_API_URL` at build time to point at your backend.
- Configure your host to rewrite all unknown routes to `index.html` (SPA fallback) so client-side routing works.

## Notes

- This repository contains the **frontend only**; a compatible backend service is required for full functionality.
- The production bundle may exceed Vite's 500 kB chunk-size warning. This is expected for a feature-rich SPA and can be addressed later with route-level code splitting if desired.
