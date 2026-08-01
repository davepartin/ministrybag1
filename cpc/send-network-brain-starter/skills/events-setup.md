---
context: system_file
type: skill
slug: events-setup
status: active
created: 2026-06-24
related:
  - Send Network Events Index
  - task-setup
---

# /events-setup

## Purpose

Create or update SendNetwork event notes in `wiki/events/` using the Playbook vs. Instance pattern.

- A **playbook** (`type: playbook`) is the evergreen event operating note.
- An **event instance** (`type: event_instance`) is a dated or year-specific occurrence.

Examples: [[Send Network Monthly Lunch]], [[Vision Summit]], [[Sending Lab]], [[Residency Builder]], [[Send Network Assessment]].

## Rules

- SendNetwork events live in `wiki/events/`, not NC.
- Generated event indexes live in `wiki/indexes/`.
- `owned_by_groups:` should point to the SendNetwork team/group responsible for the event, usually a note in `wiki/organization/`.
- Do not hand-edit generated indexes.
- Real owned event tasks use the canonical task grammar and sync with `scripts/sync_tasks.py`.

## Playbook Frontmatter

```yaml
---
context: send_network
type: playbook
status: active
owned_by_groups:
  - "[[Send Network Staff]]"
rhythm: Monthly
cadence: ongoing
purpose: One-sentence purpose for the index.
current_instance: "-"
leader: "-"
---
```

## Steps

1. Search `wiki/events/` for an existing playbook or instance.
2. Create/update the playbook for stable operating details: mission, roles, rhythm, and owner group.
3. Create/update an instance only when there is a specific date, year, agenda, budget, RSVP, or follow-up.
4. Add real owned tasks on the note they concern.
5. Run `python3 scripts/sync_sendnetwork_dashboard.py` from the SendNetwork vault root.

## Output Format

```markdown
**SendNetwork Event Setup Complete: [date]**

Event: [[Name]]
Playbook: Created / Updated / Existing
Instance: Created / Updated / None
Tasks added: [list or None]
Sync: [scripts run]
```
