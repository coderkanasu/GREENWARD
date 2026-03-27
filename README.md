# GREENWARD CLT Runtime

GREENWARD CLT is a lightweight TypeScript runtime and browser UI for Charlotte-area lawn planning across Tall Fescue and Bermuda turf.

## Stack
- TypeScript on Node 20
- No frontend framework; static UI served by the runtime server
- Tests via `tsx` and the Node test runner

## Install
```bash
npm install
```

## Run In Dev Mode
```bash
npm run dev
```

Open `http://127.0.0.1:8787`.

## Build And Run
```bash
npm run build
npm start
```

## Test
```bash
npm test
```

## API
### `GET /health`
Returns:
```json
{ "status": "ok" }
```

### `POST /plan`
Example payload:
```json
{
  "zip_code": "28277",
  "sq_ft": 4500,
  "turf_type": "Tall_Fescue",
  "plan_tier": "Basic_7",
  "rain_forecast": 0.8,
  "temp": 95,
  "forecast_window_hours": 24,
  "green_up": 50
}
```

## UI Flow
1. Enter ZIP code, yard size, turf, and plan tier.
2. Adjust rain, temperature, and green-up to simulate current conditions.
3. Submit the form to generate the annual plan.
4. Review visit count, annual cost, savings, guardrail directive, and visit-by-visit line items.

## Notes
- The browser UI persists onboarding fields in local storage using the key `greenward.v2.onboarding`.
- Guardrail precedence is enforced server-side.
- The same runtime powers API and UI responses.

## Free CI/CD + Deployment

You can run this with no-cost CI and automatic deployment using GitHub Actions + Render free web service.

### 1. CI (already configured)
- Workflow file: `.github/workflows/ci.yml`
- Runs on every push and pull request:
  - `npm ci`
  - `npm run build`
  - `npm test`

### 2. Create a free Render web service
1. Push this repo to GitHub.
2. In Render, create a new Web Service from the repo.
3. Render can use `render.yaml` automatically, or set manually:
   - Build command: `npm ci && npm run build`
   - Start command: `npm start`
   - Health check path: `/health`
   - Plan: Free

### 3. CD from GitHub Actions to Render (optional)
- Workflow file: `.github/workflows/cd-render.yml`
- Add a repo secret in GitHub:
  - Name: `RENDER_DEPLOY_HOOK_URL`
  - Value: your Render deploy hook URL
- On every push to `main`, GitHub Actions triggers Render deploy.

### 4. End-to-end flow
1. Open PR -> CI validates build/tests.
2. Merge to `main` -> CD workflow triggers Render deploy hook.
3. Render builds and publishes automatically.

## Other no-cost options
- Vercel hobby plan (requires adapting to serverless functions).
- Cloudflare Pages + Workers (requires adapting runtime architecture).
