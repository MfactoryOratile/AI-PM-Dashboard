from datetime import date
from enum import Enum

from pydantic import BaseModel, Field


class ProjectStatus(str, Enum):
    planning = "planning"
    active = "active"
    on_hold = "on_hold"
    completed = "completed"


class TaskStatus(str, Enum):
    todo = "todo"
    in_progress = "in_progress"
    blocked = "blocked"
    done = "done"


class User(BaseModel):
    id: str
    name: str
    email: str


class Task(BaseModel):
    id: str
    title: str
    status: TaskStatus = TaskStatus.todo
    assignee_id: str | None = None
    due_date: date | None = None


class Milestone(BaseModel):
    id: str
    name: str
    due_date: date
    completed: bool = False


class Project(BaseModel):
    id: str
    name: str
    description: str = ""
    status: ProjectStatus = ProjectStatus.planning
    owner_id: str
    tasks: list[Task] = Field(default_factory=list)
    milestones: list[Milestone] = Field(default_factory=list)