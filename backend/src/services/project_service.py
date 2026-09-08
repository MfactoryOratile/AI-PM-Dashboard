from ..models import Project, ProjectStatus, TaskStatus


class ProjectService:
    def __init__(self) -> None:
        self._projects = [
            Project(
                id="proj-1",
                name="AI-PM-Dashboard",
                description="A clear view of delivery health and team focus.",
                status=ProjectStatus.active,
                owner_id="user-1",
                tasks=[
                    {"id": "task-1", "title": "Define initial dashboard modules", "status": TaskStatus.done},
                    {"id": "task-2", "title": "Build project overview", "status": TaskStatus.in_progress},
                    {"id": "task-3", "title": "Connect team activity data", "status": TaskStatus.todo},
                ],
            )
        ]

    def list_projects(self) -> list[Project]:
        return self._projects

    def get_project(self, project_id: str) -> Project | None:
        return next((project for project in self._projects if project.id == project_id), None)