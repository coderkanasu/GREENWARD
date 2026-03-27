# GREENWARD CLT

GREENWARD CLT is a TypeScript runtime + browser UI for lawn planning in the Charlotte Piedmont region.

It supports both Tall Fescue and Bermuda programs, applies agronomic guardrails, and estimates homeowner cost vs local service baseline.

## What You Get
- Browser UI at `/` with guided inputs.
- Runtime API at `/plan`.
- Month-aware results view:
  - Default: show current-month actions first.
  - Optional: toggle to full annual plan.
- Turf-aware UI behavior:
  - Bermuda-only green-up control appears only when turf is Bermuda.
- Region-aware presentation:
  - ZIP updates region display/disclaimer text.
  - Core agronomic logic remains Charlotte-tuned in v2.1.

## Tech Stack
- Node 20 + TypeScript
- No frontend framework (static UI served by Node runtime)
- Test runner: `tsx` + Node test API

## Quick Start

### 1. Install
```bash
npm install
```

### 2. Run in dev mode
```bash
npm run dev
```

Open: `http://127.0.0.1:8787`

### 3. Build + run
```bash
npm run build
npm start
```

### 4. Run tests
```bash
npm test
```

## UI Behavior Notes
- Plan auto-refreshes when turf type or plan tier changes.
- `Basic 7` and `Plus 9` render different visit counts (for Tall Fescue: 7 vs 9).
- When no action exists for the current month, the UI shows the next upcoming action.
- Form values are persisted in local storage under key `greenward.v2.onboarding`.

## API

### `GET /health`
```json
{ "status": "ok" }
```

### `POST /plan`

Tall Fescue example:
```json
{
  "zip_code": "28277",
  "sq_ft": 4500,
  "turf_type": "Tall_Fescue",
  "plan_tier": "Basic_7",
  "rain_forecast": 0.2,
  "temp": 82,
  "forecast_window_hours": 24
}
```

Bermuda example (with green-up):
```json
{
  "zip_code": "28277",
  "sq_ft": 6000,
  "turf_type": "Bermuda",
  "plan_tier": "Plus_9",
  "rain_forecast": 0.0,
  "temp": 86,
  "forecast_window_hours": 24,
  "green_up": 35
}
```

## Free CI/CD + Deployment

This repo is set up for no-cost CI/CD with GitHub Actions + Render free tier.

### CI workflow (already configured)
- File: `.github/workflows/ci.yml`
- Runs on push and pull request:
  - `npm ci`
  - `npm run build`
  - `npm test`

### Free Render deploy
1. Push repo to GitHub.
2. In Render, create a Web Service from this repo.
3. Use `render.yaml` or configure manually:
   - Build command: `npm ci && npm run build`
   - Start command: `npm start`
   - Health check path: `/health`
   - Plan: Free

### CD on `main` (optional)
- File: `.github/workflows/cd-render.yml`
- Add GitHub Actions secret:
  - `RENDER_DEPLOY_HOOK_URL` = Render deploy hook URL
- Merge to `main` triggers deploy hook automatically.

## Project Layout
- `src/` runtime modules and HTTP server
- `public/` browser UI assets
- `tests/` runtime tests
- `docs/` requirements, decisions, tasks, and audit logs

## Known Scope Boundary
Current region handling is display-aware by ZIP, but agronomic calculations are still based on Charlotte Piedmont assumptions in v2.1.
