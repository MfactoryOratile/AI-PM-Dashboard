import { useEffect, useMemo, useState } from "react";
import {
  CheckCircle2,
  CircleDot,
  GitBranch,
  GitCommitHorizontal,
  LayoutDashboard,
  Sparkles,
  Workflow,
} from "lucide-react";
import type { DashboardData, GitHubCommit, GitHubIssue, GitHubPullRequest } from "./services/projects";
import { getDashboardData } from "./services/projects";

type TabKey = "overview" | "issues" | "commits" | "pull-requests";

const tabs: Array<{ key: TabKey; label: string; icon: typeof LayoutDashboard }> = [
  { key: "overview", label: "Overview", icon: LayoutDashboard },
  { key: "issues", label: "Issues", icon: CircleDot },
  { key: "commits", label: "Commits", icon: GitCommitHorizontal },
  { key: "pull-requests", label: "Pull Requests", icon: GitBranch },
];

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatRelativeDate(dateString: string) {
  const diffInHours = Math.max(1, Math.round((Date.now() - new Date(dateString).getTime()) / 3600000));
  if (diffInHours < 24) return `${diffInHours} hour${diffInHours === 1 ? "" : "s"} ago`;
  const diffInDays = Math.round(diffInHours / 24);
  return `${diffInDays} day${diffInDays === 1 ? "" : "s"} ago`;
}

function IssueRow({ issue }: { issue: GitHubIssue }) {
  return (
    <li className="list-row">
      <span className={`list-marker ${issue.state}`}><CheckCircle2 size={15} /></span>
      <div className="list-copy">
        <strong>{issue.title}</strong>
        <small>#{issue.number} · {issue.user?.login ?? "unknown"} · {formatDate(issue.created_at)}</small>
      </div>
      <span className={`pill ${issue.state}`}>{issue.state}</span>
    </li>
  );
}

function CommitRow({ commit }: { commit: GitHubCommit }) {
  return (
    <li className="list-row">
      <span className="list-marker commit"><GitCommitHorizontal size={15} /></span>
      <div className="list-copy">
        <strong>{commit.commit.message.split("\n")[0]}</strong>
        <small>{commit.author?.login ?? commit.commit.author.name ?? "unknown"} · {formatDate(commit.commit.author.date ?? new Date().toISOString())}</small>
      </div>
      <span className="pill neutral">{commit.sha.slice(0, 7)}</span>
    </li>
  );
}

function PullRequestRow({ pullRequest }: { pullRequest: GitHubPullRequest }) {
  return (
    <li className="list-row">
      <span className={`list-marker ${pullRequest.merged_at ? "merged" : pullRequest.state}`}><GitBranch size={15} /></span>
      <div className="list-copy">
        <strong>{pullRequest.title}</strong>
        <small>#{pullRequest.number} · {pullRequest.user?.login ?? "unknown"} · {formatDate(pullRequest.created_at)}</small>
      </div>
      <span className={`pill ${pullRequest.merged_at ? "merged" : pullRequest.state}`}>{pullRequest.merged_at ? "merged" : pullRequest.state}</span>
    </li>
  );
}

export default function App() {
  const [tab, setTab] = useState<TabKey>("overview");
  const [data, setData] = useState<DashboardData | null>(null);

  useEffect(() => {
    getDashboardData().then(setData);
  }, []);

  const overviewCards = useMemo(() => {
    if (!data) return [];
    return [
      {
        label: "Open Issues",
        value: data.openIssuesCount.toString(),
        icon: CircleDot,
        tone: "red",
        detail: `From ${data.issues.filter((issue) => issue.pull_request === undefined).length} GitHub issues`,
      },
      {
        label: "Merged PRs",
        value: data.mergedPRsCount.toString(),
        icon: GitBranch,
        tone: "green",
        detail: `${data.pullRequests.filter((pr) => pr.merged_at !== null).length} merged on GitHub`,
      },
      {
        label: "Recent Commits",
        value: data.commits.length.toString(),
        icon: GitCommitHorizontal,
        tone: "blue",
        detail: `Last ${Math.min(data.commits.length, 12)} commit fetches`,
      },
      {
        label: "Repo Health",
        value: `${data.complianceScore}%`,
        icon: Workflow,
        tone: "teal",
        detail: `${data.openPRsCount} open PRs · ${data.buildSuccessRate}% success`,
      },
    ];
  }, [data]);

  const recentActivity = data?.recentActivity ?? [];

  const weeklyActivity = useMemo(() => {
    if (!data) return [] as Array<{ label: string; commits: number; prs: number; total: number }>;

    const totals = Array.from({ length: 7 }, (_, index) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - index));
      const label = date.toLocaleDateString("en-US", { weekday: "short" });

      const commits = data.commits.filter((commit) => {
        const commitDate = commit.commit.author.date ? new Date(commit.commit.author.date) : null;
        return commitDate && commitDate.toDateString() === date.toDateString();
      }).length;

      const prs = data.pullRequests.filter((pr) => {
        const prDate = new Date(pr.created_at);
        return prDate.toDateString() === date.toDateString();
      }).length;

      return { label, commits, prs, total: commits + prs };
    });

    return totals.map((item) => ({
      ...item,
      commits: Math.max(item.commits, 0),
      prs: Math.max(item.prs, 0),
      total: Math.max(item.total, 0),
    }));
  }, [data]);

  const maxActivityValue = useMemo(() => {
    if (!weeklyActivity.length) return 1;
    return Math.max(1, ...weeklyActivity.flatMap((item) => [item.commits, item.prs]));
  }, [weeklyActivity]);

  const donutSegments = useMemo(() => {
    if (!data) return [];
    const total = Math.max(1, data.openIssuesCount + data.mergedPRsCount + data.openPRsCount + data.commits.length);
    const mergedShare = Math.max(12, Math.round((data.mergedPRsCount / total) * 100));
    const issueShare = Math.max(15, Math.round((data.openIssuesCount / total) * 100));
    const commitShare = Math.max(10, Math.round((data.commits.length / total) * 100));
    const openPrShare = Math.max(10, 100 - mergedShare - issueShare - commitShare);

    return [
      { label: "Merged PRs", value: mergedShare, color: "#2f9eb9" },
      { label: "Open Issues", value: issueShare, color: "#52b888" },
      { label: "Recent Commits", value: commitShare, color: "#7a6ad4" },
      { label: "Open PRs", value: openPrShare, color: "#e0a751" },
    ];
  }, [data]);

  const milestones = useMemo(() => {
    const start = new Date();
    return [
      { title: "Sprint Review Meeting", date: new Date(start.getTime() + 7 * 86400000) },
      { title: "User Training Session", date: new Date(start.getTime() + 9 * 86400000) },
      { title: "Version 1.0 Release", date: new Date(start.getTime() + 12 * 86400000) },
    ];
  }, []);

  const sectionContent = (() => {
    if (!data) {
      return <div className="empty-state">Loading GitHub metrics…</div>;
    }

    switch (tab) {
      case "issues":
        return (
          <section className="tab-panel">
            <div className="panel-heading"><div><span className="label">Repository health</span><h3>Issues</h3></div><span className="status-pill">{data.issues.length} total</span></div>
            <ul className="detail-list">{data.issues.slice(0, 10).map((issue) => <IssueRow key={issue.number} issue={issue} />)}</ul>
          </section>
        );
      case "commits":
        return (
          <section className="tab-panel">
            <div className="panel-heading"><div><span className="label">Repository health</span><h3>Commits</h3></div><span className="status-pill">{data.commits.length} recent</span></div>
            <ul className="detail-list">{data.commits.slice(0, 10).map((commit) => <CommitRow key={commit.sha} commit={commit} />)}</ul>
          </section>
        );
      case "pull-requests":
        return (
          <section className="tab-panel">
            <div className="panel-heading"><div><span className="label">Repository health</span><h3>Pull Requests</h3></div><span className="status-pill">{data.pullRequests.length} total</span></div>
            <ul className="detail-list">{data.pullRequests.slice(0, 10).map((pr) => <PullRequestRow key={pr.number} pullRequest={pr} />)}</ul>
          </section>
        );
      default:
        return (
          <>
            <section className="overview-top-kpis" aria-label="Overview metrics">
              {overviewCards.map(({ label, value, icon: Icon, tone, detail }) => (
                <article key={label} className={`overview-metric ${tone}`}>
                  <div className="metric-icon-wrap"><Icon size={18} /></div>
                  <div className="metric-copy">
                    <span>{label}</span>
                    <strong>{value}</strong>
                    <small>{detail}</small>
                  </div>
                </article>
              ))}
            </section>

            <section className="overview-layout">
              <aside className="assistant-panel">
                <div className="assistant-title">AI Project Assistant</div>
                <div className="robot-shell">
                  <div className="robot-head">
                    <span className="robot-eye left" />
                    <span className="robot-eye right" />
                  </div>
                </div>
                <button className="assistant-btn primary" type="button">Show Project Status</button>
                <button className="assistant-btn" type="button">Recent Commits</button>
                <button className="assistant-btn" type="button">Create New Issue</button>
              </aside>

              <article className="activity-panel">
                <div className="panel-heading"><div><span className="label">Code health</span><h3>Code Activity</h3></div></div>
                <div className="chart-header"><span>Commits &amp; Pull Requests</span><span>{weeklyActivity.reduce((sum, item) => sum + item.total, 0)} this week</span></div>
                <div className="activity-chart" aria-label="Weekly activity chart">
                  {weeklyActivity.map((item) => (
                    <div key={item.label} className="chart-column">
                      <div className="bar-stack">
                        <span
                          className="bar-pr"
                          style={{
                            height: item.prs === 0 ? "0%" : `${Math.max(10, (item.prs / maxActivityValue) * 100)}%`,
                          }}
                        />
                        <span
                          className="bar-commit"
                          style={{
                            height: item.commits === 0 ? "0%" : `${Math.max(10, (item.commits / maxActivityValue) * 100)}%`,
                          }}
                        />
                      </div>
                      <span className="chart-label">{item.label}</span>
                    </div>
                  ))}
                </div>
              </article>

              <article className="compliance-panel">
                <div className="panel-heading"><div><span className="label">Governance</span><h3>Compliance Overview</h3></div></div>
                <div className="gauge-grid">
                  <div className="gauge-card">
                    <div className="gauge ring-blue" style={{ background: `conic-gradient(#1d7ab0 0 ${data.complianceScore}%, rgba(207,220,227,.9) ${data.complianceScore}% 100%)` }}>
                      <span>{data.complianceScore}%</span>
                    </div>
                    <label>Data Security</label>
                  </div>
                  <div className="gauge-card">
                    <div className="gauge ring-green" style={{ background: `conic-gradient(#2ea772 0 ${Math.min(98, Math.max(80, data.buildSuccessRate))}%, rgba(207,220,227,.9) ${Math.min(98, Math.max(80, data.buildSuccessRate))}% 100%)` }}>
                      <span>{Math.min(98, Math.max(80, data.buildSuccessRate))}%</span>
                    </div>
                    <label>AI Ethics</label>
                  </div>
                </div>
                <ul className="check-list">
                  <li><span className="checkmark">✓</span> GDPR Compliant</li>
                  <li><span className="checkmark">✓</span> Bias Testing Passed</li>
                  <li><span className="checkmark">✓</span> Access Controls Secure</li>
                </ul>
              </article>
            </section>

            <section className="bottom-overview-row">
              <article className="power-panel">
                <div className="panel-heading"><div><span className="label">Insights</span><h3>Power BI Metrics</h3></div></div>
                <div className="power-layout">
                  <div className="donut-wrap" style={{ background: `conic-gradient(${donutSegments.map((segment, index) => {
                    const previous = donutSegments.slice(0, index).reduce((sum, current) => sum + current.value, 0);
                    return `${segment.color} ${previous}% ${previous + segment.value}%`;
                  }).join(", ")})` }}>
                    <div className="donut-inner">
                      <strong>{Math.round(donutSegments.reduce((sum, segment) => sum + segment.value, 0) / donutSegments.length)}%</strong>
                    </div>
                  </div>
                  <ul className="power-list">
                    {donutSegments.map((segment) => (
                      <li key={segment.label}><span className="legend-dot" style={{ background: segment.color }} />{segment.label} <strong>{segment.value}%</strong></li>
                    ))}
                  </ul>
                </div>
              </article>

              <article className="mini-panel">
                <div className="panel-heading"><div><span className="label">Activity</span><h3>Recent Activity</h3></div></div>
                <ul className="time-list">
                  {recentActivity.slice(0, 3).map((item) => (
                    <li key={item.id}>
                      <span className={`task-badge ${item.type}`} />
                      <div>
                        <strong>{item.title}</strong>
                        <small>{item.meta} · {formatRelativeDate(item.createdAt)}</small>
                      </div>
                    </li>
                  ))}
                </ul>
              </article>

              <article className="mini-panel">
                <div className="panel-heading"><div><span className="label">Planning</span><h3>Upcoming Milestones</h3></div></div>
                <ul className="milestone-list">
                  {milestones.map((item) => (
                    <li key={item.title}>
                      <span className="milestone-icon">✦</span>
                      <span>{item.title}</span>
                      <time>{item.date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</time>
                    </li>
                  ))}
                </ul>
              </article>
            </section>
          </>
        );
    }
  })();

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <div className="brand"><span className="brand-mark"><Sparkles size={17} /></span><span>AI-PM-Dashboard</span></div>
        <nav aria-label="Main navigation">
          {tabs.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              type="button"
              className={tab === key ? "nav-item active" : "nav-item"}
              onClick={() => setTab(key)}
            >
              <Icon size={18} /> {label}
            </button>
          ))}
        </nav>
        <div className="sidebar-footer"><span className="avatar">MO</span><span><strong>Mfactory</strong><small>Workspace admin</small></span></div>
      </aside>
      <section className="content" id="overview">
        {sectionContent}
      </section>
    </main>
  );
}
