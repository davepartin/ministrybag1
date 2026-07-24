---
context: system_file
type: skill
slug: task-setup
status: active
created: 2026-05-31
last_revised: 2026-06-01
related:
  - Skills Index
  - Task Index
  - task-sync
  - people-setup
  - groups-setup
  - events-setup
  - AGENTS
---

# /task-setup

## Purpose

Author and maintain **Tasks** in the shared SendNetwork vault. A task is written once, on the note it concerns, and the sync script weaves it onto the note of the person responsible for it. This skill defines the task line grammar, how a task propagates, and the rules that keep it accurate.

A task always answers three questions: **who** does it (the owner), **what it's about** (a person, group, or event), and **what to do** (the description).

---

## The task line grammar

Write a task as a Markdown checkbox in this shape:

```
- [ ] 1 [[Lead Planter Catalyst]] about [[Send Network Monthly Lunch]] :: Confirm the July lunch venue ^t-lunch-venue
```

Read left to right:

| Part | Example | Meaning |
|---|---|---|
| Checkbox | `- [ ]` / `- [x]` | Open or done. |
| Priority | `1`, `2`, `3`, or blank | 1 = highest. Blank = unprioritized. Optional, comes right after the checkbox. |
| Owner | `[[Lead Planter Catalyst]]` | The person who does the task, as a **wikilink**. Must match an existing SendNetwork person note. |
| Keyword | `about` | Literal word `about` — the parser uses it to split owner from subject. |
| Subject | `[[Send Network Monthly Lunch]]` | A wikilink to the person, church, event, or process the task concerns. |
| Separator | `::` | Divides the subject from the description. |
| Description | `Confirm the July lunch venue` | What actually needs doing. |
| Block ID | `^t-yag-venue` | Stable hidden ID. The script adds one if missing; never add a second. |

Minimum viable line (no priority): `- [ ] [[City Lead]] about [[Vision Summit 2026]] :: Confirm presenter schedule`

**What makes a line a task:** a checkbox with the `[[Owner]] about [[Subject]] ::` pattern. A plain bullet without that pattern — e.g. `* Send reminder email to planters on Saturday.` — is an ordinary operational note and is ignored by the task sync.

---

## Where to write a task

Write the task **on the note it's about** — inside the planter, pastor, church, event, or process note. That's its natural home and its single source of truth. The `about [[Subject]]` link is what authoritatively names the subject, so even if you jot a task somewhere else, the link keeps it attached to the right thing.

SendKC tasks live in the **SendNetwork vault** because this work is shared with the SendKC team. the Lead CPC-private reflection belongs in your private vault; your local church work belongs in NC. Operational step-by-step instructions, setup checklists, and reminder notes are **not** owned tasks; write them as plain bullets `* ` (no checkbox, no `[[Owner]] about … ::` pattern), so they never enter the task system.

---

## One format everywhere (verbatim)

A task is written **identically in every place it appears**. When the sync copies a task into an owner's roll-up (or a private mirror), it copies the **exact source line verbatim** — same checkbox, same numeric priority, same `[[Owner]] about [[Subject]] ::` grammar, same description, same `^t-id`. **Do not reformat** on roll-up: no emoji priority, no `P1`/pipe styling, never drop the `[[Owner]] about` portion even on the owner's own note. The standard line is:

```
- [ ] 1 [[Lead Planter Catalyst]] about [[Send Network Monthly Lunch]] :: Confirm the July lunch venue ^t-lunch-venue
```

## How a task propagates (what the sync script does)

1. **Owner roll-up for SendNetwork-authored tasks.** Every SendNetwork task syncs to an auto-generated **Tasks** section on the owner's SendNetwork person note. The `## Tasks` section sits at the top of the note's body, directly under the name heading (`# Name`), before all other sections.
   - **Source-vault rule:** a SendNetwork task roll-up contains SendNetwork-authored tasks only. your private vault-private tasks stay in your private vault; NC tasks stay in NC.
2. **Subject note.** The task remains on the subject note it was written on. If a task is authored on a person/owner note but is *about* a group, it still appears on that group via the `about` link.
3. **Task Index.** All open tasks also compile into `wiki/indexes/Task Index.md`.

Auto-generated sections are wrapped in `<!-- START TASKS -->` / `<!-- END TASKS -->` markers. **Never hand-edit between the markers** (AGENTS.md rule) — edit the source task line and re-run the script.

---

## Ownership rules

- The owner is **whoever is linked on the line** (`[[Name]]`), for any staff member — not automatically the Lead CPC.
- An owner name **must match an existing SendNetwork person note**. If it doesn't, the script **flags it** rather than dropping it, so a typo never makes a task vanish.
- A task bullet with no owner link is flagged as **unassigned** — add an owner or it won't attach to anyone.

## Checkboxes vs. bullets (important)

- **Owned tasks use checkboxes** `- [ ]` with the `[[Owner]] about [[Subject]] ::` grammar (owner wikilinked). This is how a task enters the system and gets a roll-up.
- **Operational notes and SOPs use plain bullets** `* ` — cleaning rotations, greeter steps, setup lists, reminder notes. No checkbox, no owner pattern, so the sync ignores them and they don't clutter roll-ups or the Task Index.

---

## Steps — add a task

1. Open the SendNetwork note the task is about (person, church, event, organization/process note).
2. Add a checkbox line using the grammar above. Pick a priority (1/2/3) or leave it blank.
3. Make sure the owner link `[[Name]]` matches their SendNetwork person note, and the `[[Subject]]` link resolves.
4. Leave the block ID off — the script will assign one. (If you reuse an existing task, keep its existing `^t-` id.)
5. Run the sync from the SendNetwork vault root: `python3 scripts/sync_tasks.py`.
6. Confirm the task now appears in the owner's **Tasks** section and in the [[Task Index]].

## Steps — complete a task

1. Check the box `- [x]` on the source note or in the Task Index.
2. Run `python3 scripts/sync_tasks.py` from the SendNetwork vault root. The check propagates and the task drops off active roll-ups.

---

## Output Format

After a task sync, summarize for the user:

```markdown
**Task Setup / Sync Complete: [today's date]**

- **Tasks scanned:** [N] canonical owned tasks.
- **Owners resolved:** [N] matched to SendNetwork person notes.
- **Unassigned / unmatched (flagged):** [list, or "none"]
- **Owner roll-ups updated:** [list of person notes touched]
- **Task Index:** [N] active tasks written to [[Task Index]].
```

---

## Due dates (optional, decided 2026-06-11)

A task that has a **real external deadline** carries it at the end of the description, before the `^t-id`, in the Tasks-plugin date format:

```
- [ ] [[Lead Planter Catalyst]] about [[Sports Camp 2026]] :: Confirm volunteer background checks 📅 2026-06-15 ^t-ab12
```

Rules:

1. **Only date real deadlines** (registrations, paperwork due, promises made to people). Aspirational tasks stay undated on purpose - undated means "whenever there's margin," and it keeps the Overdue list honest.
2. The date rides inside the description, so the sync, indexes, and check-off all work unchanged.
3. The sync sorts dated tasks first (soonest due on top); the dashboards group tasks into **Overdue / Due this week / Upcoming / Whenever**.
4. When the Lead CPC says "due June 30" while creating a task, format it as `📅 2026-06-30`. When he says nothing about timing, add no date.

## Revision Log

- **2026-06-24** — v4 (SendNetwork). Updated routing for the separate shared SendNetwork vault: tasks sync inside SendNetwork, indexes live in `wiki/indexes/`, and your private vault/NC tasks stay in their own vaults.
- **2026-06-01** — v3. Earlier shared-task privacy clarification before SendNetwork became its own vault.
- **2026-05-31** — v2. Owner became a **wikilink** `[[Name]]`; roll-ups copy source task lines verbatim.
- **2026-05-31** — v1. Created the Tasks pillar skill and canonical `- [ ] {priority} [[Owner]] about [[Subject]] :: description ^t-id` grammar.
