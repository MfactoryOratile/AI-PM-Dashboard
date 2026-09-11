# AI-PM-Dashboard

An AI-assisted project management dashboard for understanding delivery health,
team focus, and the next best action.

## Stack

- **Backend:** Python, FastAPI, Pydantic
- **Frontend:** React, TypeScript, Vite
- **Contracts:** Shared TypeScript domain types

## Quick start

```sh
make install
make dev
```

The dashboard runs at `http://localhost:5173`. The API runs at
`http://localhost:8000`, with interactive docs at `/docs`.

To run the backend tests:

```sh
make test
```

See [docs/SETUP.md](docs/SETUP.md) for prerequisites and manual commands.

## Documentation

- [docs/SETUP.md](docs/SETUP.md) — local setup and prerequisites
- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) — monorepo layout and diagram
- [docs/API.md](docs/API.md) — API reference
- [docs/USER_GUIDE.md](docs/USER_GUIDE.md) — using the dashboard
- [docs/AI_AGENT_GOVERNANCE.md](docs/AI_AGENT_GOVERNANCE.md) — AI agent scope and boundaries
- [docs/RESPONSIBLE_AI.md](docs/RESPONSIBLE_AI.md) — transparency, fairness, accountability
- [docs/DATA_SOVEREIGNTY.md](docs/DATA_SOVEREIGNTY.md) — data residency, GDPR/POPIA
- [docs/GOVERNANCE_CHECKLIST.md](docs/GOVERNANCE_CHECKLIST.md) — pre-ship checklist