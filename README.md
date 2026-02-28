# Live Matches — Real-Time Sports Dashboard

A web application that displays simulated live sports matches with dynamic, real-time data updates.

---

## Tech Stack & Decisions

| Tool | Why |
|---|---|
| **React + TypeScript** | Type-safe component development |
| **AG Grid** | Enterprise-grade table with virtual scrolling out of the box, built-in sorting, and row-level animations — no need to reinvent the wheel |
| **TanStack Query** | Handles polling interval, background refetching, loading/error states, and automatic retries with zero boilerplate |
| **Vite** | Fast dev server and optimized production builds |
| **Plain CSS files** | No overhead of CSS-in-JS or a utility framework; scoped styles per component are enough for this scope |
| **Docker** | Reproducible, environment-agnostic builds and deployments |
| `useRef` | Holds previous match data between re-renders without triggering unnecessary re-renders itself |
| Row IDs | Match `id` fields are used as AG Grid row IDs, enabling precise diffing for new/removed row detection |

---

## Features

### Core
- **Live polling** — data refreshes every 5–10 seconds via TanStack Query
- **New match highlight** — newly appeared matches flash with a green background for 1 second, then return to normal
- **Removed match highlight** — matches that disappear from the API are marked red for 1 second before being removed from the DOM
- **Full match info** — teams, score, match time, league/competition displayed per row

### Optional (implemented)
- **Sorting** — click any column header to sort by time, team name, score, league, etc.
- **Virtual scrolling** — AG Grid renders only visible rows, keeping performance smooth with hundreds of matches
- **Component optimisation** — `useRef` for inter-render state, AG Grid's internal change detection prevents unnecessary DOM updates
- **Error & loading states** — inline error banner with last-known data preserved on refresh failure
- **Retry on failure** — TanStack Query automatically retries failed requests (3 attempts with exponential backoff)

---

## Getting Started

### Prerequisites
- Node.js ≥ 18
- npm ≥ 9

### Environment variables

Create a `.env` file in the project root (or pass variables directly):

```env
VITE_API_URL=http://172.235.235.11/api/matches
VITE_API_USERNAME=your@email.com
```

### Available scripts

```bash
# Start development server
npm run dev

# Type-check and build for production
npm run build

# Preview the production build locally
npm run preview

# Lint the codebase
npm run lint
```

---

## Docker

### Build

```bash
docker build \
  --build-arg VITE_API_URL=http://172.235.235.11/api/matches \
  --build-arg VITE_API_USERNAME=<YOUR_USERNAME> \
  -t live-matches-app .
```

Replace `<YOUR_USERNAME>` with your email address — it is sent as the `username` HTTP header on every API request.

### Run

```bash
docker run -p 3000:3000 live-matches-app
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Part I — Website Analysis

See [`proposed_fixes.md`](./proposed_fixes.md) for a detailed analysis of the selected page.
