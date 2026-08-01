---
context: system_file
type: skill
slug: association-leader-setup
status: active
created: 2026-06-24
related:
  - people-setup
  - church-setup
  - Send KC Association Relationship Map
---

# /association-leader-setup

## Purpose

Create or update one canonical SendNetwork person note for an associational leader, DOM/AMS, seminary partner, denominational partner, or other ministry partner who affects SendKC church planting work.

Use this when the person is not primarily a planter, pastor, or SendKC staff member. If they are also a pastor or planter, keep one person note and use `roles:` to show the overlap.

## Inputs

Person name, association/organization, role/title, geography or lane, relationship to SendKC, churches or pastors they connect us to, current next step, and any real owned tasks.

Capture what is known. Do not invent titles, contact details, influence level, or relationship strength.

## Steps

1. Search `wiki/people/`, `wiki/churches/`, `wiki/organization/`, and generated indexes for the exact name and variants.
2. If the person exists, update the existing note. Do not create a second note for a different role.
3. If missing, create `wiki/people/[Person Name].md` from `wiki/templates/Person Template.md`.
4. Use frontmatter:
   - `context: send_network`
   - `type: person`
   - `person_type: association_leader` or `person_type: partner`
   - `roles:` with values such as `dom`, `ams`, `association_partner`, `seminary_partner`, `denominational_partner`
   - `association:` when tied to an association
   - `organization:` when tied to another organization
   - `status: active`
   - `privacy: sensitive`
5. In the body, fill:
   - `## At a Glance`: who they are, organization/association, relationship to SendKC, what matters now.
   - `## Story & Context`: short breadcrumbs about the relationship and relevant churches.
   - `## Log`: dated entries, not transcripts.
6. Link relevant churches, pastors, planters, associations, or events with `[[wikilinks]]`.
7. Add real owned tasks only with `- [ ] [[Owner]] about [[Subject]] :: description`. The owner must be a real SendNetwork person note.
8. Run `python3 scripts/sync_sendnetwork_dashboard.py` from the SendNetwork vault root.

## Output Format

```markdown
**Association / Partner Setup Complete: [date]**

Person: [[Name]]
Type: association_leader / partner
Association / Organization: [value or "-"]
Linked churches / people: [list or none]
Tasks added: [list or None]
Sync: [scripts run]
Needs follow-up: [missing fields worth asking about]
```
