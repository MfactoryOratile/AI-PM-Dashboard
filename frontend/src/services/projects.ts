import type { Project } from "../../../shared/types";

const fallbackProjects: Project[] = [
  {
    id: "proj-1",
    name: "AI-PM-Dashboard",
    description: "A clear view of delivery health and team focus.",
    status: "active",
    owner_id: "user-1",
    tasks: [
      { id: "task-1", title: "Define initial dashboard modules", status: "done" },
      { id: "task-2", title: "Build project overview", status: "in_progress" },
      { id: "task-3", title: "Connect team activity data", status: "todo" },
    ],
    milestones: [],
  },
];

export async function getProjects(): Promise<Project[]> {
  try {
    const response = await fetch("http://localhost:8000/api/projects");
    if (!response.ok) throw new Error("Unable to load projects");
    return response.json() as Promise<Project[]>;
  } catch {
    return fallbackProjects;
  }
}