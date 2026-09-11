# Governance Checklist

## Purpose & how to use

A single, actionable checklist a maintainer or reviewer runs through before
approving any AI agent feature or any feature that introduces real
persistent data storage. Every item links to the document that actually
defines it — this file is a rollup, not a restatement. Link the relevant
section from the PR description and check items off as they're verified.

## Section A — Any AI agent feature (new agent, new capability, or scope change)

- [ ] Scope documented/updated in [AI_AGENT_GOVERNANCE.md §1](AI_AGENT_GOVERNANCE.md#1-scope)
      before implementation.
- [ ] Scope-change process followed
      ([§3](AI_AGENT_GOVERNANCE.md#3-changing-an-agents-scope)).
- [ ] Least-privilege credentials confirmed
      ([§4](AI_AGENT_GOVERNANCE.md#4-credentials-and-least-privilege)).
- [ ] Sandbox/test-mode validated before production
      ([§1.3](AI_AGENT_GOVERNANCE.md#13-general-boundaries-all-agents)).
- [ ] Transparency requirement met — AI output labeled
      ([RESPONSIBLE_AI.md § Transparency](RESPONSIBLE_AI.md#transparency)).
- [ ] Fairness/bias check completed and recorded
      ([RESPONSIBLE_AI.md § Bias & Security Check Process](RESPONSIBLE_AI.md#bias--security-check-process)).
- [ ] Security checks completed and recorded (same section).
- [ ] Advisory-only / human-in-the-loop constraint preserved
      ([AI_AGENT_GOVERNANCE.md §1.1](AI_AGENT_GOVERNANCE.md#11-in-app-recommendation-service-backend)).
- [ ] Escalation paths reviewed if new failure modes are introduced
      ([§2](AI_AGENT_GOVERNANCE.md#2-escalation-paths)).
- [ ] Maintainer sign-off recorded.

## Section B — Any real persistent-storage feature (new DB, file/blob storage, cloud service)

- [ ] Data Storage Decision Record completed
      ([DATA_SOVEREIGNTY.md template](DATA_SOVEREIGNTY.md#pre-deployment-decision-record-template)).
- [ ] Data classified (personal vs. business vs. operational).
- [ ] GDPR applicability assessed.
- [ ] POPIA applicability assessed.
- [ ] Cross-border transfer mechanism identified, if applicable.
- [ ] Data subject rights plan exists.
- [ ] Breach notification plan documented.
- [ ] Encryption at rest & in transit confirmed.
- [ ] Retention/deletion policy defined.
- [ ] Maintainer sign-off recorded.

## Section C — General (any feature touching users or data)

- [ ] [CONTRIBUTING.md](../CONTRIBUTING.md#security) secret-scanning/Dependabot
      status still clean.
- [ ] Auth/access-control impact reviewed. (Known gap: backend routes
      currently have no auth at all — flag explicitly if a feature increases
      exposure.)

## Sign-off table

| Feature | Date | Owner | Sections completed | Approved by |
|---|---|---|---|---|
| | | | | |
