# Data Sovereignty

## Purpose & when this applies

This document must be **completed** (not just read) before any pull request
introduces a persistent data store, file/blob storage, or a third-party
data-processing service. Until then, it is a statement of the current state
and a template that becomes mandatory the moment real data storage is added.

## Current state (as of this writing)

`ProjectService` (`backend/src/services/project_service.py`) holds an
in-memory Python list, seeded fresh on every process start. No data is
written to disk, a database, or any cloud service, and nothing survives a
restart.

The only externally-hosted system this project touches today is GitHub.com,
used for source control. It stores code and commit metadata (contributor
names/emails), not application/project data. This is a known, low-risk item —
revisit if it ever becomes contractually relevant.

No cloud provider, infrastructure-as-code, or storage configuration exists
anywhere in the repository.

## Why this matters going forward

`docs/ARCHITECTURE.md` already states that a database repository will replace
`ProjectService`. Once that happens, project/task records may contain
personal data — owner IDs, assignee names, task titles authored by people —
which can trigger GDPR and/or POPIA obligations depending on where the
responsible party and data subjects are located.

## Data classification (apply once a real store exists)

- **Personal data**: user/owner identifiers, assignee names, any future
  auth/email fields.
- **Business data**: project descriptions, task titles, statuses.
- **Operational metadata**: timestamps, logs.

## Regulatory triggers (plain language)

- **POPIA** (Protection of Personal Information Act, South Africa): applies
  if the "responsible party" is domiciled in South Africa (near-certain once
  real user data exists) or processing occurs using South-Africa-based
  means.
- **GDPR** (General Data Protection Regulation, EU): applies if any data
  subject is located in the EU/EEA, regardless of where the company is
  based — conditional on who ends up using the product.

## Pre-deployment decision-record template

Copy this block into the PR description (or a linked doc) and complete it
before merging any feature that introduces persistent storage.

```
## Data Storage Decision Record — <feature/PR link>
Date:
Decision owner:
Data store type (e.g., PostgreSQL, managed cloud DB):
Hosting provider & region (e.g., AWS af-south-1 Cape Town / eu-west-1 Ireland / Azure South Africa North):
Data residency requirement: [ ] Must stay in ZA  [ ] Must stay in EU  [ ] No constraint — reason:
Lawful basis for processing:
  - GDPR Art. 6 basis (consent / contract / legitimate interest / other):
  - POPIA s11 condition for lawful processing:
Data subject rights implementation plan (access, correction, deletion, objection, portability — GDPR Arts 15-21 / POPIA ss23-25):
Cross-border transfer mechanism (if data leaves ZA or EU):
  - GDPR: adequacy decision / Standard Contractual Clauses / other:
  - POPIA s72: adequate protection in recipient country / consent / binding corporate rules:
Breach notification plan & timeline:
  - GDPR: notify supervisory authority within 72 hours (Art. 33)
  - POPIA: notify the Information Regulator and data subjects "as soon as reasonably possible" (s22)
Retention & deletion policy reference:
Sub-processors / vendors (cloud provider, analytics, etc.):
Encryption at rest confirmed: [ ]   Encryption in transit confirmed: [ ]
Sign-off: maintainer ____  reviewer ____
```

## References

- GDPR — Regulation (EU) 2016/679
- POPIA — Protection of Personal Information Act 4 of 2013 (South Africa)
- South Africa Information Regulator: https://inforegulator.org.za
- See [AI_AGENT_GOVERNANCE.md §4](AI_AGENT_GOVERNANCE.md#4-credentials-and-least-privilege)
  for credential-handling rules that apply once real storage exists.
