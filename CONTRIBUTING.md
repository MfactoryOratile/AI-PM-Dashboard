# Contributing to AI-PM-Dashboard

Thanks for contributing. This document covers roles, branching, the pull requests (PR)
process, and the security expectations for this repository.

## Roles

| Role        | GitHub permission | Who                | Can do                                                              |
|-------------|--------|---------------------|----------------------------------------------------------------------|
| Admin       | Admin  | @MfactoryOratile     | Manage settings, branch protection, collaborators, merge without restriction |
| Contributor | Write  | @lihledev            | Create branches, open PRs, push to non-protected branches           |
| Reviewer    | Write  | @gugudev-learner (and @MfactoryOratile) | Requested automatically on PRs, approval required to merge to `main` |

Note: this repository is under a personal GitHub account rather than an
organization, so roles are implemented as GitHub collaborator permission
levels (`admin` / `write`) plus `.github/CODEOWNERS` for reviewer routing,
rather than GitHub Team-based RBAC. If this project moves to an
organization, recreate these as Teams (`admins`, `contributors`,
`reviewers`) with the same permission levels.

To add someone: **Settings → Collaborators and teams → Add people**, and
grant `Write` for contributors or `Admin` only for maintainers who need
full repo control.

## Branching model

- `main` is protected: no direct pushes, no force-pushes, no deletions.
- Create a feature branch off `main`: `feat/<short-description>`,
  `fix/<short-description>`, `chore/<short-description>`.
- Open a pull request into `main` when ready for review.

## Pull request process

1. Fill out the PR template (`.github/PULL_REQUEST_TEMPLATE.md`) completely.
2. Title must follow the conventional prefix format enforced by
   `.github/workflows/pr-checks.yml` (`feat:`, `fix:`, `chore:`, `docs:`,
   `refactor:`, `test:`, `ci:`, `build:`, `perf:`).
3. At least one approving review from a code owner is required
   (enforced by branch protection).
4. All required status checks must pass.
5. Prefer small, focused PRs — one concern per PR.
6. Squash-merge once approved, unless a merge commit is explicitly needed.

## Code review guidelines

- Reviewers: focus on correctness, security, and readability — not
  personal style preference.
- Authors: respond to every comment (either by addressing it or
  explaining why not); don't dismiss feedback silently.
- Re-request review after pushing changes that address feedback.
- Stale approvals are dismissed automatically when new commits are
  pushed, so a final re-approval is required before merge.

## Security

- Secret scanning and push protection are enabled on this repository —
  a push containing a detected secret will be blocked. Never commit
  API keys, tokens, or credentials; use environment variables or a
  secrets manager instead.
- Dependabot security updates and vulnerability alerts are enabled;
  dependency-update PRs should be reviewed and merged promptly.
- Report a suspected vulnerability privately to the repository admin
  rather than opening a public issue.
