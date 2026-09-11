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
Test update for workflow notification.
