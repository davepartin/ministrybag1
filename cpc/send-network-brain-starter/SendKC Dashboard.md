---
context: send_network
type: dashboard
status: active
---

# SendKC Dashboard

> The team's main view. Open the `.base` dashboards for live, sortable tables that also work on iPad.

## Live dashboards (Obsidian Bases)

- **SendKC Planters.base** — every planter by pathway and field staff.
- **SendKC Churches.base** — churches by mobilization level.
- **SendKC People.base** — everyone in the vault.
- **SendKC Staff.base** — the team.
- **NAMB Staff.base** — NAMB / network staff contacts.

## Pipeline at a glance

- [[Potential Planters]]
- [[Candidate Planters]]
- [[Funded Church Planters]]
- [[Aged-Out Planters]]

## Generated indexes

*Built by the sync scripts in `wiki/indexes/`. Do not hand-edit.*

- [[Send Network People Index]]
- [[Send Network Pipeline Index]]
- [[Send Network Churches Index]]
- [[Send Network Pastors Index]]
- [[Send Network Events Index]]
- [[Send Network Groups Index]]
- [[Task Index]]

## Refresh

```
python3 scripts/sync_sendnetwork_dashboard.py
```
