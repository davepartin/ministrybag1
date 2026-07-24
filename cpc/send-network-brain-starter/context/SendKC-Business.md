---
context: send_network
type: context_brief
status: template
---

# SendKC-Business

> Replace "Kansas City / SendKC" throughout with your own region as you make this vault yours.

Send Network [Your Region] helps churches discover, develop, send, and care for church planters across the metro.

This vault is the shared operating brain for that work. It tracks the people, churches, pathway stages, events, team responsibilities, and follow-up tasks that keep the movement visible between meetings.

## What We Track

- **Planters:** potential, candidate, funded, and aged-out planters.
- **Pastors:** pastors of churches we are mobilizing, coaching, or partnering with.
- **Churches:** sending, supporting, cooperating, multiplying, movement, dying, replant, and church-plant notes.
- **Staff:** SCM, CPCs, assessment, training, spouse care, and regional partners.
- **Associations / partners:** DOMs/AMS, associational leaders, seminary partners, and other ministry partners.
- **Events:** monthly lunches, assessment, Sending Lab, Residency Builder, Vision Summit, retreats, trainings, and staff meetings.

## Operating Rhythm

- Keep one canonical note per person, church, event, and operational group.
- Use frontmatter for structured facts that need to sync into indexes.
- Use short breadcrumbs in body sections for relational context and follow-up.
- Use tasks only for real owned actions.
- Run `python3 scripts/sync_sendnetwork_dashboard.py` after meaningful edits so indexes and task roll-ups stay current.

## Key Dashboards

- `SendKC Dashboard.md` — shared dashboard entry point.
- `wiki/organization/SendKC Church Planting.md` — generated planter pathway dashboard.
- `wiki/indexes/Send Network People Index.md` — all tracked people.
- `wiki/indexes/Send Network Churches Index.md` — churches by mobilization level.
- `wiki/indexes/Task Index.md` — active shared tasks.

## Boundary

This is a shared team vault. It may contain sensitive ministry operations, but it should not contain any one leader's private journaling, private family content, or another ministry's staff-only material.
