---
context: system_file
type: skill
slug: groups-setup
status: active
created: 2026-06-24
related:
  - Send Network Groups Index
  - SendKC Church Planting
  - planter-people-setup
---

# /groups-setup

## Purpose

Create or update SendNetwork pathway/team group notes in `wiki/organization/`.

SendNetwork does not use NC-style `wiki/groups/` ministry groups. The group-like dashboards here are operational views such as [[Funded Church Planters]], [[Candidate Planters]], [[Potential Planters]], [[Aged-Out Planters]], [[Pastors]], [[Mobilized Pastors]], and [[Send Network Staff]].

## Rules

- Store SendNetwork group dashboards in `wiki/organization/`.
- Use `type: group`.
- For planter pathway groups, the source of truth is each planter note's `planter_pathway:` property.
- Do not hand-edit generated member tables between `<!-- START_SYNCED_PATHWAY_MEMBERS -->` and `<!-- END_SYNCED_PATHWAY_MEMBERS -->`.
- Rebuild with `python3 scripts/sync_send_network.py`.

## Steps

1. Search `wiki/organization/` and `wiki/indexes/` for the group name.
2. If it exists, update only non-generated context: purpose, rhythms, responsibilities, open questions, and breadcrumbs.
3. If missing, create `wiki/organization/[Group Name].md`.
4. Use frontmatter:
   - `context: send_network`
   - `type: group`
   - `status: active`
   - `leader: "[[Name]]"` or `"-"`
   - `member_count: "-"` unless generated
   - `planter_pathway:` only for pathway groups.
5. If the group is a pathway group, add the sync markers for the generated member table.
6. Run `python3 scripts/sync_send_network.py`.

## Output Format

```markdown
**SendNetwork Group Setup Complete: [date]**

Group: [[Name]]
File: wiki/organization/[Name].md
Action: Created / Updated
Sync: [scripts run]
```
