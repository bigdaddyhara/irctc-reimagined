# Indian Railways — IRCTC Reimagined

This is a frontend-only IRCTC redesign prototype for the Varun Mayya hackathon. It turns the railway booking experience into a guided journey: discover a route, compare trains, understand availability, book a mock ticket, monitor the trip, and recover from disruptions.

## Live demo

[Open IRCTC Reimagined on Vercel](https://irctc-rework.vercel.app)

## Planning documents

- [Frontend Master Plan](./docs/IRCTC_REIMAGINED_MASTER_PLAN.md) — product definition, phased development plan, feature priorities, architecture boundary, QA, and production roadmap.
- [Development Tracker](./docs/IRCTC_REIMAGINED_DEVELOPMENT_TRACKER.md) — checkboxes, owners, work queue, decision log, risk log, and release gates.

The project intentionally uses synthetic data and simulated actions. It does not connect to IRCTC, process real payments, or make live availability claims.

## Included prototype flows

- Task-focused train search with plain-language guidance
- Explainable “Best match” recommendation and comparison filters
- Human-readable availability, waitlist, and seat-watch states
- Mock passenger/payment flow that generates a prototype ticket and PNR
- My Trips with a simulated seat-watch update
- Journey Mode with location, platform, coach, and delay recovery simulation
- Alerts, profile preferences, Easy Mode, and twelve-language interface support
- Responsive desktop and mobile layouts with keyboard focus states and reduced-motion support

## Run locally

```bash
npm install
npm run dev
```

Open the local Vite URL shown in the terminal. The default demo route is Chennai Central → Bengaluru for 28 August 2026.

## Verify

```bash
npm test
npm run lint
npm run build
```

## Tech

React, TypeScript, Vite, Lucide icons, Vitest, and Testing Library. There is no backend in this repository; prototype state lives in the React app.
