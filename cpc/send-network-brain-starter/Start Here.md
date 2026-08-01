---
context: send_network
type: onboarding
status: active
pinned: true
---

# Start Here — Welcome to the Send Network Vault

Hey team,

This is our shared digital home for the church-planting work. Think of it as one brain we all share: the planters we care for, the churches we're mobilizing, the events we run, and the systems that keep us aligned. The more we put in, the more it carries for us so we can spend our attention on people, not paperwork.

Take ten minutes to read this before you dive in.

---

## What this vault is

A shared Obsidian notebook for the team. It holds:

- **People** — our planters, the pastors we partner with, and our own team.
- **Churches** — every church we're walking with, and where each sits on the mobilization pathway.
- **Events** — planter lunches, retreats, sending labs, residency builders, staff meetings, the vision summit.
- **Organization** — the team, our roles, the mobilization pathway, and our processes.

It is a shared team vault. Anything private to one leader belongs in that leader's own separate vault, not here.

## How it's organized

```
Send Network vault
├── Start Here.md          ← you are here
├── AGENTS.md              ← the AI rulebook (read this if you use AI)
├── SendKC Dashboard.md    ← the main team dashboard
├── Send Network KC.md     ← the home overview
├── context/               ← the essential background for AI and orientation
└── wiki/
    ├── people/            ← planters, pastors, and staff
    ├── churches/          ← churches and their mobilization level
    ├── events/            ← event playbooks and dated instances
    ├── organization/      ← team, structure, pathway, processes
    ├── indexes/           ← generated master lists
    └── templates/         ← templates for new notes
```

## Using an AI with this vault

Each of us can connect an AI assistant (Claude, Gemini, or ChatGPT) to this vault. **To start any session, say who you are and ask it to load context:**

> "I'm [your name]. Read Start Here and load our context."

Telling the AI who you are matters: it reads your profile in `context/staff-profiles/` and then works at your pace. A few norms:

1. **Trust but verify.** AI drafts are starting points. Read pastoral and sensitive content carefully and make it yours.
2. **Add, don't tear down.** This is shared. Extend notes; don't rewrite someone else's work.
3. **Sensitive stuff stays discreet.** Some notes hold candidate, legal, or funding details. Don't widen who sees them, and don't paste them into a public AI tool.
4. **When unsure, ask.** Ask the AI to explain, or ask a teammate.

## What to ask the AI to do

Use plain language, but name the kind of record when you can:

- "Use the planter setup skill to add a potential planter named..."
- "Use the church setup skill to add this sending church..."
- "Use the pastor setup skill to add this pastor and link him to his church..."
- "Use the association leader setup skill to add this DOM/AMS..."
- "Use the task setup skill to add a follow-up for [teammate] about..."

The AI should use the setup skills in `skills/`, create one note per person/church/event, use wikilinks, and run `python3 scripts/sync_sendnetwork_dashboard.py` after meaningful changes.

## For AI agents — context loading instructions

> *This section is for AI assistants. Staff can ignore it and just use the phrase above.*

If asked to "load context" or "read Start Here," do this before any other work:

**Step 0 — Identify who you're working with.** Ask their name if not given, read their profile in `context/staff-profiles/`, and calibrate. Some teammates are new to working this way, so go step by step and confirm before bigger changes.

**Step 1 — Read the context files:** `context/SendKC-Business.md`, `context/SendKC-People.md`, `context/SendKC-Team.md`, `context/Brand.md`.

**Step 2 — Read the rules:** `AGENTS.md`.

**Step 3 — Read the relevant skill** before creating or editing:

- People / staff / partners: `skills/people-setup.md`
- Planters: `skills/planter-people-setup.md`
- Pastors: `skills/pastor-setup.md`
- Association leaders / DOMs / partners: `skills/association-leader-setup.md`
- Churches: `skills/church-setup.md`
- Events: `skills/events-setup.md`
- Tasks: `skills/task-setup.md`

Useful bases for people classification: `SendKC People.base`, `SendKC Staff.base`, and `NAMB Staff.base`.

**Step 4 — Summarize briefly** (what this region's Send work is, the team, the key boundary), then do the work.
