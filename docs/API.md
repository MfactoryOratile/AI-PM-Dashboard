# API

Base URL: `http://localhost:8000`

## `GET /health`

Returns `{ "status": "ok" }` when the service is available.

## `GET /api/projects`

Returns the current projects as a JSON array. Each project includes its tasks
and milestones.

## `GET /api/projects/{project_id}`

Returns one project or `404` when the project does not exist.