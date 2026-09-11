# User Guide

## What is AI-PM-Dashboard

An AI-assisted project management dashboard for understanding delivery
health, team focus, and the next best action.

## Getting started

```sh
make install
make dev
```

The dashboard runs at `http://localhost:5173`; the API runs at
`http://localhost:8000` (interactive docs at `/docs`). See
[SETUP.md](SETUP.md) for prerequisites and manual commands.

## Walking through the dashboard

- **Sidebar**: Overview / Projects navigation, with a live project count.
- **Delivery pulse header and metrics grid**: "Active projects" and "Open
  tasks" are computed from live data returned by the API. **"Delivery
  confidence 84%" is a fixed number in the UI code today, not a computed
  metric** — treat it as a placeholder, not a real measurement.
- **Featured project panel**: name, description, and the progress bar are
  computed from real task data (completed tasks vs. total).
- **"AI signal" card**: this shows fixed placeholder copy ("Momentum is
  healthy, but the task queue is waiting on one clear owner...") hardcoded in
  `frontend/src/App.tsx`. It does not change based on your data and is not a
  live, model-generated recommendation. See
  [ARCHITECTURE.md](ARCHITECTURE.md) and
  [AI_AGENT_GOVERNANCE.md](AI_AGENT_GOVERNANCE.md) for what this is planned
  to become.
- **Latest tasks list**: real, from the API.

## What's real vs. placeholder today

| Element | Status |
|---|---|
| Active projects count | Real — from API |
| Open tasks count | Real — from API |
| Delivery confidence 84% | Placeholder — fixed literal |
| Featured project progress bar | Real — computed from task data |
| "AI signal" card | Placeholder — fixed copy, not model-generated |
| Latest tasks list | Real — from API |

## Planned AI features

Two AI-related capabilities are scoped but not yet built: an in-app
recommendation service that reads project/task data to suggest a "next best
action" (read-only, advisory-only — never auto-applies changes), and a
separate, external Copilot Studio/Teams bot for read-only GitHub status
queries and merge notifications. Both are bounded by
[AI_AGENT_GOVERNANCE.md](AI_AGENT_GOVERNANCE.md), and the transparency,
fairness, and accountability standards they must meet before shipping are in
[RESPONSIBLE_AI.md](RESPONSIBLE_AI.md).

## Data & privacy today

No data is persisted. The dashboard's project/task data is seeded in memory
and resets every time the backend restarts. Once real storage is added, see
[DATA_SOVEREIGNTY.md](DATA_SOVEREIGNTY.md) for how data location and
retention are decided.

## Feedback / contributing

See [CONTRIBUTING.md](../CONTRIBUTING.md) for how to report issues or
propose changes.
