---
context: system_file
type: skill
slug: people-setup
status: active
created: 2026-06-24
related:
  - planter-people-setup
  - pastor-setup
  - Task Index
---

# /people-setup

## Purpose

Create or update one canonical SendNetwork person note in `wiki/people/`.

Use this general skill only when the person is SendKC staff, a partner, or another SendNetwork contact who is not clearly a planter or pastor. For planters/candidates/funded planters, use `/planter-people-setup`. For area pastors tied to a church, use `/pastor-setup`. For DOMs, AMSs, associational leaders, seminary partners, or ministry partners, use `/association-leader-setup`.

## Core Rules

- One person note per SendNetwork person, flat in `wiki/people/`.
- Do not create your local church congregation notes here; those belong in `../NC/wiki/people/`.
- Do not put the Lead CPC-private reflection here; that belongs in your private vault.
- Use `context: send_network`.
- Use `person_type:` with one primary lane: `planter`, `pastor`, `staff`, `association_leader`, or `partner`.
- Use `person_types:` as the multi-select truth when one person fits multiple categories. Controlled values: `staff`, `pastor`, `planter`, `association_leader`, `partner`.
- Use `affiliations:` for organizations/networks, not job roles. Starter values: `namb`, `send_network`, `send_network_kc`, `kansas_city`, `kncsb`, `association`, `church`, `seminary`, `partner_org`.
- For staff, also use `staff_role:`, `job_title:`, `staff_region:`, and `staff_team:`. Example: `staff_role: CPC`, `job_title: "Church Planting Catalyst"`, `staff_region: "Kansas City"`, `staff_team: "[[Send Network KC]]"`.
- If one person has multiple roles, keep one note: set the primary `person_type:` for the dashboard lane, add all categories to `person_types:`, and use `roles:` for more specific descriptors like `lead_pastor`, `city_missionary`, `assessment_director`, or `pastor_friend`.
- Real owned tasks use `- [ ] [[Owner]] about [[Subject]] :: description`; operational notes use plain bullets.

## Steps

1. Search `wiki/people/`, `wiki/churches/`, `wiki/organization/`, and `wiki/indexes/` for the exact name and likely variants.
2. If the person already exists, update the existing note instead of creating a duplicate.
3. If missing, create `wiki/people/[Person Name].md` from `wiki/templates/Person Template.md` or the closest SendNetwork template.
4. Fill only known facts: role, staff lane, church relationship, association/organization, contact info, what matters now, and a short dated log breadcrumb.
   - NAMB staff example:
     ```yaml
     person_type: staff
     person_types:
       - staff
       - pastor
     affiliations:
       - namb
       - send_network
       - send_network_kc
       - kansas_city
     staff_role: CPC
     job_title: "Church Planting Catalyst"
     staff_region: "Kansas City"
     staff_team: "[[Send Network KC]]"
     church: "[[Church Name]]"
     role: lead_pastor
     ```
5. Add any real owned task on the note it concerns.
6. Run `python3 scripts/sync_sendnetwork_dashboard.py` from the SendNetwork vault root.

## Output Format

```markdown
**SendNetwork Person Setup Complete: [date]**

Person: [[Name]]
File: wiki/people/[Name].md
Action: Created / Updated
Tasks added: [list or None]
Sync: [scripts run]
```
