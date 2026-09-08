from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .routes.projects import router as projects_router

app = FastAPI(title="AI-PM-Dashboard API", version="0.1.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(projects_router, prefix="/api")


@app.get("/health", tags=["system"])
def health() -> dict[str, str]:
    return {"status": "ok"}