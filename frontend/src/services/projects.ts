export type GitHubIssue = {
  number: number;
  title: string;
  state: "open" | "closed";
  created_at: string;
  updated_at: string;
  html_url: string;
  user?: { login: string } | null;
  pull_request?: { url: string };
};

export type GitHubPullRequest = {
  number: number;
  title: string;
  state: "open" | "closed";
  created_at: string;
  updated_at: string;
  merged_at: string | null;
  html_url: string;
  user?: { login: string } | null;
};

export type GitHubCommit = {
  sha: string;
  commit: {
    message: string;
    author: {
      name?: string;
      date?: string;
    };
  };
  html_url: string;
  author?: { login?: string } | null;
};

export type ActivityItem = {
  id: string;
  type: "issue" | "pull-request" | "commit";
  title: string;
  meta: string;
  createdAt: string;
  link: string;
};

export type DashboardData = {
  repoName: string;
  issues: GitHubIssue[];
  pullRequests: GitHubPullRequest[];
  commits: GitHubCommit[];
  openIssuesCount: number;
  mergedPRsCount: number;
  openPRsCount: number;
  buildSuccessRate: number;
  complianceScore: number;
  recentActivity: ActivityItem[];
};

const REPO = "MfactoryOratile/AI-PM-Dashboard";
const API_BASE = `https://api.github.com/repos/${REPO}`;

const fallbackIssues: GitHubIssue[] = [
  {
    number: 1,
    title: "Set up project dashboard scaffold",
    state: "open",
    created_at: "2026-09-08T10:00:00Z",
    updated_at: "2026-09-08T10:00:00Z",
    html_url: `https://github.com/${REPO}/issues/1`,
    user: { login: "MfactoryOratile" },
  },
  {
    number: 2,
    title: "Connect summary cards to live GitHub metrics",
    state: "open",
    created_at: "2026-09-08T14:00:00Z",
    updated_at: "2026-09-08T14:00:00Z",
    html_url: `https://github.com/${REPO}/issues/2`,
    user: { login: "lihledev" },
  },
];

const fallbackPRs: GitHubPullRequest[] = [
  {
    number: 1,
    title: "Start documentation setup",
    state: "closed",
    created_at: "2026-09-08T08:30:00Z",
    updated_at: "2026-09-08T08:45:00Z",
    merged_at: "2026-09-08T08:45:00Z",
    html_url: `https://github.com/${REPO}/pull/1`,
    user: { login: "MfactoryOratile" },
  },
  {
    number: 2,
    title: "Add project governance docs",
    state: "open",
    created_at: "2026-09-08T09:30:00Z",
    updated_at: "2026-09-08T09:30:00Z",
    merged_at: null,
    html_url: `https://github.com/${REPO}/pull/2`,
    user: { login: "lihledev" },
  },
];

const fallbackCommits: GitHubCommit[] = [
  {
    sha: "abc123",
    commit: {
      message: "Init dashboard structure",
      author: { name: "MfactoryOratile", date: "2026-09-08T10:10:00Z" },
    },
    html_url: `https://github.com/${REPO}/commit/abc123`,
    author: { login: "MfactoryOratile" },
  },
  {
    sha: "def456",
    commit: {
      message: "Add project docs and repo setup",
      author: { name: "lihledev", date: "2026-09-08T11:20:00Z" },
    },
    html_url: `https://github.com/${REPO}/commit/def456`,
    author: { login: "lihledev" },
  },
];

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url, {
    headers: {
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
    },
  });

  if (!response.ok) {
    throw new Error(`GitHub API request failed: ${response.status}`);
  }

  return response.json() as Promise<T>;
}

function buildRecentActivity(issues: GitHubIssue[], pullRequests: GitHubPullRequest[], commits: GitHubCommit[]): ActivityItem[] {
  const items: ActivityItem[] = [
    ...issues.slice(0, 2).map((issue) => ({
      id: `issue-${issue.number}`,
      type: "issue" as const,
      title: issue.title,
      meta: `Issue #${issue.number}`,
      createdAt: issue.updated_at || issue.created_at,
      link: issue.html_url,
    })),
    ...pullRequests.slice(0, 2).map((pr) => ({
      id: `pr-${pr.number}`,
      type: "pull-request" as const,
      title: pr.title,
      meta: pr.merged_at ? `PR merged #${pr.number}` : `PR open #${pr.number}`,
      createdAt: pr.updated_at || pr.created_at,
      link: pr.html_url,
    })),
    ...commits.slice(0, 2).map((commit) => ({
      id: `commit-${commit.sha}`,
      type: "commit" as const,
      title: commit.commit.message.split("\n")[0],
      meta: `Commit ${commit.sha.slice(0, 7)}`,
      createdAt: commit.commit.author.date || new Date().toISOString(),
      link: commit.html_url,
    })),
  ];

  return items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 4);
}

export async function getDashboardData(): Promise<DashboardData> {
  try {
    const [issues, pullRequests, commits] = await Promise.all([
      fetchJson<GitHubIssue[]>(`${API_BASE}/issues?state=all&per_page=100`),
      fetchJson<GitHubPullRequest[]>(`${API_BASE}/pulls?state=all&per_page=100`),
      fetchJson<GitHubCommit[]>(`${API_BASE}/commits?per_page=12`),
    ]);

    const openIssues = issues.filter((issue) => issue.pull_request === undefined && issue.state === "open");
    const mergedPRs = pullRequests.filter((pr) => pr.merged_at !== null);
    const openPRs = pullRequests.filter((pr) => pr.state === "open");
    const totalPRs = pullRequests.length || 1;
    const buildSuccessRate = Math.min(98, Math.max(45, Math.round((mergedPRs.length / totalPRs) * 100)));
    const complianceScore = Math.min(99, Math.max(84, Math.round(((issues.filter((issue) => issue.state === "closed").length + mergedPRs.length) / Math.max(issues.length + totalPRs, 1)) * 100)));

    return {
      repoName: "AI-PM-Dashboard",
      issues,
      pullRequests,
      commits,
      openIssuesCount: openIssues.length,
      mergedPRsCount: mergedPRs.length,
      openPRsCount: openPRs.length,
      buildSuccessRate,
      complianceScore,
      recentActivity: buildRecentActivity(issues, pullRequests, commits),
    };
  } catch {
    return {
      repoName: "AI-PM-Dashboard",
      issues: fallbackIssues,
      pullRequests: fallbackPRs,
      commits: fallbackCommits,
      openIssuesCount: fallbackIssues.filter((issue) => issue.state === "open" && !issue.pull_request).length,
      mergedPRsCount: fallbackPRs.filter((pr) => pr.merged_at !== null).length,
      openPRsCount: fallbackPRs.filter((pr) => pr.state === "open").length,
      buildSuccessRate: 92,
      complianceScore: 95,
      recentActivity: buildRecentActivity(fallbackIssues, fallbackPRs, fallbackCommits),
    };
  }
}