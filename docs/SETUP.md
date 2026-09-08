# Local setup

## Prerequisites

- Python 3.11+
- Node.js 20+
- npm 10+

## Install

From the repository root:

```sh
python3 -m venv .venv
. .venv/bin/activate
python -m pip install -r backend/requirements.txt
cd frontend && npm install && cd ..
```

## Run services

In separate terminals:

```sh
. .venv/bin/activate
uvicorn backend.src.main:app --reload --port 8000
```

```sh
cd frontend
npm run dev
```

The frontend falls back to its seed project when the API is unavailable, so UI
work can continue independently.