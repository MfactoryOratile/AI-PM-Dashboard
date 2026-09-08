export type ProjectStatus = "planning" | "active" | "on_hold" | "completed";
export type TaskStatus = "todo" | "in_progress" | "blocked" | "done";

export interface Task {
  id: string;
  title: string;
  status: TaskStatus;
  assignee_id?: string | null;
  due_date?: string | null;
}

export interface Milestone {
  id: string;
  name: string;
  due_date: string;
  completed: boolean;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  status: ProjectStatus;
  owner_id: string;
  tasks: Task[];
  milestones: Milestone[];
}