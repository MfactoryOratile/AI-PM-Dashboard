from fastapi.testclient import TestClient

from backend.src.main import app

client = TestClient(app)


def test_health() -> None:
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_list_projects() -> None:
    response = client.get("/api/projects")
    assert response.status_code == 200
    assert response.json()[0]["name"] == "AI-PM-Dashboard"


def test_missing_project_returns_not_found() -> None:
    response = client.get("/api/projects/missing")
    assert response.status_code == 404