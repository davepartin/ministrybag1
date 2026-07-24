---
context: system_file
type: skill
slug: church-setup
status: active
created: 2026-06-11
related:
  - Skills Index
  - pastor-setup
  - planter-people-setup
  - Send KC Church Mobilization Pathway
---

# /church-setup

## Purpose

Create or update one canonical note for a Kansas City area church in `wiki/churches/`, connected to its pastor, its association, and any planters it sends — so the SendKC team can coach churches along the [[Send KC Church Mobilization Pathway]] with real data instead of memory.

## Inputs

Church name (required); whatever else is available: address, phone, SBC ID, pastor(s), other staff, association, mobilization level, church type, planters sent, CPC relationship, and current next step. Source material is often an email or a conversation — capture what is given, never invent the rest.

## Steps

1. **Search before creating.** Check `wiki/churches/` for the exact name and obvious variants (e.g. "Example Church" vs "First Baptist Church Shawnee"). Also grep `wiki/` broadly — the church may already appear as a string in a planter's `sending_church:` or `church:` field. One note per church; if found, update it instead.
2. **Create from the template:** `wiki/templates/Send Network Church Template.md` → `wiki/churches/[Church Name].md`.
3. **Property rules:**
   - `type: church` (note type) — the plant/replant question goes in `church_type:` instead: one of `church_plant`, `replant`, `established`, `dying`.
   - `mobilization_level:` uses pathway language only: `1 - Cooperating`, `2 - Supporting`, `3 - Sending`, `4 - Multiplying`, `5 - Movement`, or `""` if unassessed. **Assign from evidence, not optimism** — a church actively sending a planter is demonstrably Level 3; a church the team hopes will engage is `""` with a note.
   - `pastor:` is the primary pastor wikilink to a note in `wiki/people/` — run `/pastor-setup` for them if the note doesn't exist (the pair usually gets created together).
   - `pastors:` is an optional list for multiple tracked pastors. Keep each value as a wikilink.
   - `planters_sent:` lists wikilinks to planter notes; keep it in sync with each planter's `sending_church:` field (one relationship, recorded on both ends).
   - `other_staff:` optional list of names or wikilinks.
   - `association:` should name or link the association when known (KCKBA, Clay-Platte, Blue River, etc.).
4. **Body:** fill At a Glance and Story & Context from the source; in Mobilization Pathway, note the current level and one concrete next step toward the next level. Log entry with date and source ("from NAMB modification email," "from lunch with...").
5. **Cross-link housekeeping:** if this church replaces another in a planter's paperwork (sending-church changes, check reissues), update the planter's note and leave a dated Log breadcrumb on **both** church notes — money trails deserve a paper trail.
6. **Append to `log.md`.**

## Index integration

The sync now scans `churches/` and generates [[Send Network Churches Index]] (extended 2026-06-12). Never hand-edit the generated indexes; re-run scripts/sync_send_network.py after changes.

## Output Format

```markdown
**Church note ready: [[Church Name]]**
- Pastor: [[Name]] (created/linked) · Mobilization: <level> · Type: <church_type>
- Linked planters: <list or none>
- Needs from team: <missing fields worth chasing>
```

## Revision Log

- **2026-06-11** — v1. Created alongside the churches/ wing (first notes: Example Church, Blue Valley Baptist).
