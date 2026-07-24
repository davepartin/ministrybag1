---
context: system_file
type: skill
slug: pastor-setup
status: active
created: 2026-06-11
related:
  - Skills Index
  - church-setup
  - planter-people-setup
---

# /pastor-setup

## Purpose

Create or update one canonical note for a Kansas City area pastor in `wiki/people/`, linked to their church and scored for Send Network involvement — the relational layer of SendKC church mobilization work.

## Inputs

Pastor name (required); whatever else is available: church, role, cell, email, association, involvement level, story. Capture what is given; never invent contact details or involvement reads.

## Steps

1. **Search before creating.** Check `wiki/people/` for the exact name and likely variants. Planters, Send staff, and pastors all live there now; a planter does not also get a separate pastor note. If the NC vault is visible, also check `../NC/wiki/people/` before creating a duplicate for someone who is actually an NC person.
2. **Create from the template:** `wiki/templates/Send Network Pastor Template.md` → `wiki/people/[Pastor Name].md`.
3. **Property rules:**
   - `type: pastor`, `person_type: pastor`, `person_types: [pastor]`, and `role:` (lead_pastor, associate, executive…).
   - If the pastor is also SendKC/NAMB staff or a planter, keep one note: choose the primary `person_type:` for the dashboard lane and list every category in `person_types:`.
   - `church:` is a wikilink to a note in `wiki/churches/` — run `/church-setup` if it doesn't exist yet (the pair usually gets created together).
   - `involvement_level:` is the SendKC team's read, one of `none`, `low`, `medium`, `high`, or `""` until the team makes the call. Evidence can suggest ("leads a Level 3 sending church → likely medium/high") but do not invent the property value — note the suggestion in the body and leave the property empty.
   - `cell:` vs church office phone: don't put an office line in `cell:`. If the only number available is the church's, it belongs on the church note, with a body line here saying his cell is still needed.
4. **Body:** At a Glance (who, relationship to SendKC, what matters now), Story & Context, and a dated Log entry naming the source. Keep sensitive details brief and staff-appropriate for this shared vault.
5. **Cross-link:** make sure the church note's `pastor:` field points back here. If the church has multiple tracked pastors, update `pastors:` as a list too. Connect to relevant planters or group notes (e.g. [[Pastors]], [[Mobilized Pastors]]).
6. **Append to `log.md`.**

## Index integration

The sync scans pastor/staff notes in `wiki/people/` and generates [[Send Network Pastors Index]].

## Output Format

```markdown
**Pastor note ready: [[Pastor Name]]**
- Church: [[Church Name]] (created/linked) · Role: <role> · Involvement: <level or "for team to set">
- Needs from team: <missing cell/email/involvement read>
```

## Revision Log

- **2026-06-11** — v1. Created alongside the pastors/ wing (first note: Pastor Name).
