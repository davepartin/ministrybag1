---
context: system_file
type: skill
slug: planter-people-setup
status: active
created: 2026-05-29
last_revised: 2026-06-01
related:
  - Skills Index
  - Send Network Dashboard
  - Send Network People Index
  - Send Network Pipeline Index
---

# /planter-people-setup

## Purpose

Create or update one canonical Send Network person/planter note inside `wiki/people/`. This protects the team's planter-care layer by keeping Send Network people separate from your local church people notes while still making them searchable, task-synced, and visible in pipeline indexes.

Use this skill when a team member mentions a potential planter, candidate planter, funded church planter, planter resident, assessed planter, or aged-out planter connected to Send Network.

Do **not** use this as the default for every SendNetwork person. Use `/pastor-setup` for pastors who are not planter-pathway people, `/people-setup` for SendKC staff, and `/association-leader-setup` for association or ministry partners.

## Inputs

Ask for or infer only what is needed.

1. Person name.
2. Relationship/context: potential planter, candidate, assessment, funded church planter, pastor, mobilized pastor, aged-out planter, staff, association partner, or other.
3. Planter pathway, if known.
4. Church/plant name and location, if known.
5. Sending church, field staff/CPC, spouse/family details, and contact info, if known.
6. Last contact and next follow-up date, if relevant.
7. What matters now: one sentence.
8. Any owned task: owner, subject, and exact action wording, if yes.
9. Source: team conversation, raw source, email, MAP, spreadsheet, staff meeting, text thread, or other.

## Planter Pathways

Use these exact values in frontmatter:

- `potential`
- `candidate`
- `funded`
- `aged-out`

The pathway belongs in the planter note as `planter_pathway:`. Groups and [[SendKC Church Planting]] are dashboard views; they should not be the only place the pathway lives.

## Steps

1. **Search before creating**
   - Search `wiki/people/`, `wiki/churches/`, `wiki/organization/`, and generated indexes for the exact name.
   - Search variants: nickname, spelling, accents, spouse name, church/plant name, and old process-note titles.
   - If one likely match exists, update it. Do not create a duplicate.
   - If multiple likely matches exist, stop and ask which note is canonical.

2. **Choose the right home**
   - Send Network people and planters live in `wiki/people/[Person Name].md`.
   - Send Network staff who are also your local church people may still need a SendNetwork staff note when they own SendKC tasks or appear in SendKC dashboards.
   - Pastors who are also planters stay one note; set the primary `person_type` to the current SendKC lane, list both lanes in `person_types:`, and preserve specific descriptors in `roles:`.
   - Sensitive process notes can use a descriptive filename when needed. Use `type: planter_process` and `related_planter: "[[Person Name]]"` so they do not become duplicate planter records.

3. **Create the file if missing**
   - Use `wiki/templates/Send Network Planter Template.md`.
   - Set `type: planter` for planter/candidate/pastor pipeline notes.
   - Use `status: active` unless a team member says inactive or aged out.
   - Add `planter_pathway:` with one of the exact pathway values above.
   - Set `person_type: planter` unless another SendKC staff lane is clearly primary, and include `planter` in `person_types:`.

4. **Update frontmatter carefully**
   - Preserve existing phone, email, spouse, church, funding, assessment, and sensitive fields.
   - Append groups; do not overwrite existing group links.
   - Suggested groups:
     - `[[Potential Planters]]`
     - `[[Candidate Planters]]`
     - `[[Funded Church Planters]]`
     - `[[Aged-Out Planters]]`
     - `[[Pastors]]`
     - `[[Mobilized Pastors]]`
     - `[[Send Network Staff]]`
   - Keep the frontmatter factual. If the pathway is unclear, leave it unset and surface the note for reconciliation instead of guessing.

5. **Update core sections**
   - `## At a Glance`: Who, family, church/plant, where they are in the process, what matters now.
   - `## Praying For`: only known prayer needs or broad care categories the team would actually pray.
   - `## Pipeline`: current stage, next step, blockers, owner/CPC, and important dates.
   - `## PACE Check-In`: Pray, Assess, Care, Equip.
   - `## Log`: short dated breadcrumbs, not transcripts.

6. **Privacy and sensitivity**
   - Assessment, marriage, funding, counseling, conflict, or HR details should be summarized as breadcrumbs.
   - Do not paste full private text threads, MAP records, assessment reports, or financial details unless a responsible team member explicitly asks and the note needs them.
   - Prefer "what the team needs to remember to care well" over "everything that happened."

7. **Checkbox contract**
   - Use `- [ ]` only for real owned actions, in the shape `- [ ] {priority?} [[Owner]] about [[Subject]] :: description`.
   - The owner must match an existing SendNetwork person note. Write each task once on the note it concerns.
   - Do not default ownership to the Lead CPC. Use the responsible CPC/SCM when known; ask if unclear.
   - Do not use checkboxes for pipeline status, Send staff assignments, planter responsibilities, or assessment milestones.
   - Status lives in `planter_pathway:`, tables, or plain bullets.

8. **Sync and verify**
   - Run `python3 scripts/sync_tasks.py`.
   - Verify the person appears in:
     - `wiki/indexes/Send Network People Index.md`
     - `wiki/organization/SendKC Church Planting.md`
     - `wiki/indexes/Send Network Pipeline Index.md`
     - `wiki/indexes/Send Network Groups Index.md` or related dashboard links when applicable

## Output Format

```markdown
**Planter People Setup Complete: [today's date]**

Person: [Person Name]
Canonical file: [path]
Action: Created / Updated / No change needed

Planter pathway:
- [stage]

Groups connected:
- [group links, or "None"]

What changed:
- [short bullet list]

Owned tasks added:
- [task text, or "None"]

Sync status:
- [scripts run and verification result]
```

## Boundaries

Do not delete or merge old notes without explicit approval from the City Lead or the Lead CPC. If a duplicate exists, report it and recommend which note should become canonical.

Do not move a your local church member's normal people note into Send Network just because they are also a pastor or friend. Use Send Network notes for Send Network pipeline, coaching, event, staff, or operational responsibilities.

## Revision Log

- **2026-06-01** - v3. Standardized the four-value `planter_pathway:` contract, added the SendKC planter dashboard, and separated process notes from canonical planter records.
- **2026-06-01** - v2. Replaced the Lead CPC-only task wording with the canonical explicit-owner task contract.
- **2026-05-29** - v1. Created to govern the Send Network people layer, pipeline stages, privacy boundaries, and index sync pattern.
