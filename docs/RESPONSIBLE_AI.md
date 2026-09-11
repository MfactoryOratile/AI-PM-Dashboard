# Responsible AI

## Purpose & relationship to AI_AGENT_GOVERNANCE.md

[AI_AGENT_GOVERNANCE.md](AI_AGENT_GOVERNANCE.md) sets the *boundaries* for
what the project's AI agents may read, call, or act on. This document sets
the *quality bar* those agents' outputs must clear before shipping, organized
around three principles: transparency, fairness, and accountability. It also
defines the bias-and-security check process that gates any AI feature going
live.

## Transparency

Any AI-generated content in the UI must be visibly distinguishable from
static content.

- **Today**: the "AI signal" card and the "Delivery confidence 84%" metric in
  `frontend/src/App.tsx` (lines 46 and 50) are hardcoded literals, not model
  output. They must not be presented as live AI output — see
  [USER_GUIDE.md](USER_GUIDE.md) for the user-facing disclosure — until they
  are backed by a real service.
- **Once the in-app recommendation service** ([AI_AGENT_GOVERNANCE.md
  §1.1](AI_AGENT_GOVERNANCE.md#11-in-app-recommendation-service-backend)) is
  real: every surfaced recommendation needs a persistent visual marker (e.g.,
  an "AI suggestion" label) and, ideally, a one-line rationale referencing
  which inputs drove it.
- **The Copilot Studio / GitHub bot** ([AI_AGENT_GOVERNANCE.md
  §1.2](AI_AGENT_GOVERNANCE.md#12-conversational--github-integrated-agent-eg-copilot-studio-bot)):
  messages posted to Teams must be identifiable as bot-generated (bot display
  name/icon), never presented as if from a person.

## Fairness

The recommendation service's job — surfacing a "next best action" — carries a
concrete bias risk: it could systematically flag or deprioritize tasks tied
to particular assignees, smaller projects, or less-visible owners in ways
correlated with identity rather than task facts.

- **Pre-ship requirement**: test recommendation output against synthetic
  projects that vary owner/assignee identity, project size, and task volume.
  Outputs must correlate only with task facts (status, due date, dependency
  count) — never with identity.
- No recommendation logic may take demographic or protected attributes as
  input; use internal reference IDs only.
- Since no model exists yet, this is a pre-ship gate for whoever builds the
  recommendation service — not a completed audit.

## Accountability

- **Named owner**: the project maintainer, same accountable party as
  [AI_AGENT_GOVERNANCE.md §5](AI_AGENT_GOVERNANCE.md#5-ownership).
- **Human-in-the-loop**: recommendations remain advisory-only with no
  auto-apply, per [§1.1](AI_AGENT_GOVERNANCE.md#11-in-app-recommendation-service-backend).
  This document doesn't restate that rule — it depends on it holding.
- **Audit logging** (once built): every generated recommendation should log
  its input snapshot, output text, and timestamp so a human can review why a
  suggestion was made.
- **Escalation**: failures and scope questions follow
  [AI_AGENT_GOVERNANCE.md §2](AI_AGENT_GOVERNANCE.md#2-escalation-paths).

## Bias & Security Check Process

This is the gate that must pass before the recommendation service or the
Copilot Studio bot ships, and it must be re-run on any material prompt/model
change.

**Bias checks**

- [ ] Tested against varied synthetic owner/assignee identities with no
      systematic disparity in recommendations.
- [ ] No demographic or protected attributes used as model input.
- [ ] Recommendation distribution reviewed for skew toward/away from
      specific projects or people.
- [ ] Results recorded below (dataset, date, reviewer).

**Security checks**

- [ ] Prompt-injection tested, if any user-authored text (task titles,
      descriptions) is interpolated into a prompt.
- [ ] Output sanitized/escaped before rendering in the UI (no raw HTML
      injection).
- [ ] Logs checked for PII leakage beyond what's necessary; retention
      limited.
- [ ] API keys/credentials confirmed least-privilege (ties to
      [AI_AGENT_GOVERNANCE.md §4](AI_AGENT_GOVERNANCE.md#4-credentials-and-least-privilege)).
- [ ] Rate limiting reviewed if the feature is externally callable.

**Results log**

| Date | Feature/PR | Reviewer | Result | Notes |
|---|---|---|---|---|
| _(none yet — no AI feature has shipped)_ | | | | |
