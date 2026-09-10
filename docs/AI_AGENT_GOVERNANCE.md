# AI Agent Governance

This document defines the operating boundaries for AI agents used in or
alongside the AI-PM-Dashboard project — both the in-app recommendation
service described in [ARCHITECTURE.md](ARCHITECTURE.md) and any external
conversational agent (e.g., a Copilot Studio bot) that queries GitHub or
posts notifications on the project's behalf. It exists so that agent
capabilities expand deliberately, not by accident, and so that anyone
extending an agent's permissions knows what approval is required first.

## 1. Scope

### 1.1 In-app recommendation service (backend)

- **May**: read `ProjectService` domain data (projects, tasks, status) to
  generate the "next best action" surfaced in the dashboard.
- **May not**: write to the database, call external APIs, or take action on
  a user's behalf. Output is advisory text/data only, rendered by the
  frontend for a human to act on.
- Any future capability to auto-apply a recommendation (e.g., auto-assign a
  task) is out of scope until explicitly approved and documented as an
  addendum here.

### 1.2 Conversational / GitHub-integrated agent (e.g., Copilot Studio bot)

- **May**: answer read-only queries about project status, issues, PRs, and
  commits by calling the GitHub REST API (issues, pulls, commits endpoints).
- **May**: post notifications to Teams for defined trigger events (e.g., PR
  merged).
- **May not**: merge, close, or edit GitHub issues/PRs; push commits; modify
  branch protections; change repo settings; or take any write action against
  GitHub. The agent is read + notify only unless a specific write action is
  added to this document with an owner and approval date.
- **May not** access repositories outside an explicit allow-list configured
  for the agent's GitHub PAT/App installation. Scope creep (new repos, new
  orgs) requires updating that allow-list deliberately, not implicitly via
  broader token permissions.
- **May not** message channels or users outside the Teams channels it is
  explicitly configured to post into.

### 1.3 General boundaries (all agents)

- No agent may exfiltrate data to a destination not listed in its
  configuration (no ad-hoc webhooks, no third-party endpoints).
- No agent may act on secrets/credentials beyond what it needs for its
  documented actions (least privilege — see §4).
- Agents operate on production data only after passing sandbox testing (see
  the Copilot Studio test-chat / Power Automate test-run workflow used
  during development).

## 2. Escalation paths

| Situation | Action |
|---|---|
| Agent produces a response it's not confident in, or a query falls outside a known topic/action | Agent tells the user it can't help with that and stops — no guessing, no silent fallback action. |
| Agent's GitHub call fails (auth, rate limit, 4xx/5xx) | Fail visibly to the user/channel; do not retry against a broader scope or fall back to unscoped access. Log the failure for the owning engineer. |
| A user asks the agent to perform a write action (merge a PR, close an issue, edit repo settings) | Agent declines and directs the user to do it themselves in GitHub. Write actions are never added silently — see §3. |
| Notification workflow (e.g., Teams alert on PR merge) misfires or spams | Owning engineer disables the Power Automate flow immediately, then investigates before re-enabling. |
| Suspected credential leak or scope violation (agent accessed a repo/channel not on its allow-list) | Treat as a security incident: rotate the credential (PAT/App key) immediately, notify the project maintainer, and record what happened before restoring the integration. |
| A new capability is requested (e.g., agent should auto-comment on stale PRs) | Requires a documented scope change (see §3) before implementation — not built ad hoc inside a topic/flow. |

## 3. Changing an agent's scope

Any change that expands what an agent can read, call, or act on must:

1. Be described here (this file) before or alongside the implementation —
   what's being added, why, and what it's *not* allowed to do.
2. Use the narrowest credential scope that satisfies the new capability
   (e.g., a fine-grained GitHub PAT scoped to specific repos, not an
   org-wide token).
3. Be reviewed by the project maintainer, same as any other change to
   shared infrastructure (see [CONTRIBUTING.md](../CONTRIBUTING.md)).
4. Be validated in sandbox/test mode (Copilot Studio test chat, Power
   Automate test run, or equivalent) before being pointed at production
   repos or channels.

## 4. Credentials and least privilege

- GitHub access uses a PAT or GitHub App scoped only to the repos the agent
  needs, stored as a Power Platform environment variable / secret — never
  hardcoded in a flow or topic.
- Teams posting uses a connection scoped to the specific team/channel
  configured for notifications, not a tenant-wide app permission.
- Credentials are environment-specific (sandbox vs. production) so a
  compromised or misbehaving sandbox agent cannot touch production data or
  channels.

## 5. Ownership

- The project maintainer is accountable for what agents are allowed to do
  and reviews scope changes per §3.
- Whoever builds or edits an agent's flow/topic is responsible for keeping
  this document in sync with what's actually deployed — an undocumented
  capability is treated as a governance gap, not a feature.
