from fastapi import APIRouter, HTTPException

from ..models import Project
from ..services import ProjectService

router = APIRouter(prefix="/projects", tags=["projects"])
project_service = ProjectService()


@router.get("", response_model=list[Project])
def list_projects() -> list[Project]:
    return project_service.list_projects()


@router.get("/{project_id}", response_model=Project)
def get_project(project_id: str) -> Project:
    project = project_service.get_project(project_id)
    if project is None:
        raise HTTPException(status_code=404, detail="Project not found")
    return project