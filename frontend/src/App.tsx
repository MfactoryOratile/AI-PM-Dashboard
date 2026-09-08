import { useEffect, useState } from "react";
import { Activity, ArrowUpRight, CheckCircle2, CircleDashed, LayoutDashboard, Plus, Sparkles } from "lucide-react";
import type { Project, Task } from "../../shared/types";
import { getProjects } from "./services/projects";

function TaskRow({ task }: { task: Task }) {
  const icon = task.status === "done" ? <CheckCircle2 size={17} /> : <CircleDashed size={17} />;
  return (
    <li className="task-row">
      <span className={`task-icon ${task.status}`}>{icon}</span>
      <span>{task.title}</span>
      <span className={`task-status ${task.status}`}>{task.status.replace("_", " ")}</span>
    </li>
  );
}

export default function App() {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    getProjects().then(setProjects);
  }, []);

  const project = projects[0];
  const tasks = project?.tasks ?? [];
  const completed = tasks.filter((task) => task.status === "done").length;
  const progress = tasks.length ? Math.round((completed / tasks.length) * 100) : 0;

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <div className="brand"><span className="brand-mark"><Sparkles size={17} /></span><span>northstar</span></div>
        <nav aria-label="Main navigation">
          <a className="nav-item active" href="#overview"><LayoutDashboard size={18} /> Overview</a>
          <a className="nav-item" href="#projects"><Activity size={18} /> Projects <span className="nav-count">{projects.length}</span></a>
        </nav>
        <div className="sidebar-footer"><span className="avatar">MO</span><span><strong>Mfactory</strong><small>Workspace admin</small></span></div>
      </aside>
      <section className="content" id="overview">
        <header className="topbar"><div><p className="eyebrow">Tuesday, 08 September 2026</p><h1>Good morning, Oratile.</h1></div><button className="primary-button"><Plus size={17} /> New project</button></header>
        <section className="intro-row"><div><h2>Delivery pulse</h2><p>A focused view of what is moving, what needs attention, and what comes next.</p></div><span className="live-indicator"><i /> Live workspace</span></section>
        {project && <>
          <section className="metrics-grid" aria-label="Project metrics">
            <article className="metric"><span>Active projects</span><strong>{projects.length.toString().padStart(2, "0")}</strong><small className="positive">+1 this month</small></article>
            <article className="metric"><span>Open tasks</span><strong>{tasks.filter((task) => task.status !== "done").length.toString().padStart(2, "0")}</strong><small>Across your workspace</small></article>
            <article className="metric"><span>Delivery confidence</span><strong>84<em>%</em></strong><small className="positive">↑ 6% from last week</small></article>
          </section>
          <section className="dashboard-grid">
            <article className="project-panel"><div className="panel-heading"><div><span className="label">Featured project</span><h3>{project.name}</h3></div><span className="status-pill">Active</span></div><p>{project.description}</p><div className="progress-meta"><span>Overall progress</span><strong>{progress}%</strong></div><div className="progress-track"><span style={{ width: `${Math.max(progress, 12)}%` }} /></div><div className="project-footer"><span>{completed} of {tasks.length} tasks complete</span><a href="#tasks">View project <ArrowUpRight size={15} /></a></div></article>
            <article className="signal-panel"><div className="panel-heading"><div><span className="label">AI signal</span><h3>One thing to know</h3></div><Sparkles className="sparkle" size={20} /></div><p>Momentum is healthy, but the task queue is waiting on one clear owner for team activity data.</p><div className="signal-note">Suggested next step <strong>Assign an owner</strong></div></article>
          </section>
          <section className="tasks-panel" id="tasks"><div className="panel-heading"><div><span className="label">Project activity</span><h3>Latest tasks</h3></div><button className="quiet-button">See all <ArrowUpRight size={15} /></button></div><ul>{tasks.map((task) => <TaskRow key={task.id} task={task} />)}</ul></section>
        </>}
      </section>
    </main>
  );
}