# Architecture

The project is organized as a small monorepo:

- `backend/src/models` owns domain schemas and enums.
- `backend/src/services` owns business operations and data access boundaries.
- `backend/src/routes` exposes HTTP contracts through FastAPI.
- `frontend/src` owns the dashboard experience and API client.
- `shared/types` contains frontend-facing DTO contracts that mirror the API.

The current service uses in-memory seed data to keep the first slice easy to
run. A database repository can replace `ProjectService` without changing the
route contract. AI recommendations should be added as a separate service once
the project and task data contract is stable.