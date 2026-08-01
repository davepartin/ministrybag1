# BUILD-GUIDE — For an AI assistant setting up this vault

> **You are an AI assistant (Claude, ChatGPT, or Gemini) helping a Send Network church planting catalyst stand up their second brain from this starter kit.** Read this whole file first, then `README.md` and `AGENTS.md`, then do the steps below. Work in the folder the person has given you access to.

## What this kit is

A ready Obsidian vault framework for Send Network work, with no real people in it. The person will fill it with their own planters, pastors, and churches. Your job is to (1) make sure the structure is in place, (2) orient the person, and (3) coach them through their first real record.

## Step 1 — Confirm the structure

The vault should contain these, already present in this kit. Confirm they exist in the person's folder; if the person only has this README, offer to recreate the tree for them:

```
(vault root)
├── Start Here.md
├── AGENTS.md
├── README.md
├── SendKC Dashboard.md
├── Send Network KC.md
├── *.base                      (Obsidian Bases dashboards)
├── context/                    (background briefs + staff profiles)
├── skills/                     (setup recipes)
└── wiki/
    ├── people/                 (planters, pastors, staff — one note each)
    ├── churches/               (churches + mobilization level)
    ├── events/                 (playbooks + dated instances)
    ├── organization/           (team, roles, pathway, processes)
    ├── indexes/                (generated — do not hand-edit)
    └── templates/              (note templates)
```

## Step 2 — Orient the person

Ask their name and role (CPC, SCM/city lead, AMS/DOM, or partner). Read `AGENTS.md` and the four `context/` briefs so you understand the conventions. Then tell them, plainly and briefly: what the vault is, the one boundary that matters (this is shared with the team, keep truly sensitive details as short breadcrumbs), and that you will help them add their first person.

## Step 3 — Make it theirs

Offer to help with the light adaptation in `README.md` → *Make it yours*: rename the region, update local associations, set the team in `context/SendKC-Team.md`, and delete the `Example` notes once real ones exist. Do this only if they want to now; it can wait.

## Step 4 — Add their first planter (the important part)

Open `skills/planter-people-setup.md` and follow it. Ask only for what you need: the planter's name, where they are in the pathway (`potential`, `candidate`, `funded`, `aged-out`), church/plant and location if known, sending church, the responsible CPC, and one sentence on what matters now. Create one note in `wiki/people/` from `wiki/templates/Send Network Planter Template.md`. Keep sensitive details brief.

## Step 5 — Sync and show them the payoff

If Python is available, run `python3 scripts/sync_sendnetwork_dashboard.py` from the vault root. Show them the planter now appears in the generated indexes and on the Bases dashboards. Explain the loop they will use from here: add or update a note with a skill, run the sync, everything else updates itself.

## Boundaries (do not skip)

- **Add, do not overwrite.** Extend notes; never wipe someone else's content.
- **Never hand-edit generated sections** between `<!-- START ... -->` and `<!-- END ... -->`, or the files in `wiki/indexes/`. Edit the source note and re-run the sync.
- **Keep sensitive details discreet.** Breadcrumbs, not transcripts. No private reports or full personal identifiers.
- **One note per person, church, and event.** Use wikilinks instead of duplicating.
- **Never send a message or delete files** without asking the person first.

When you finish the first planter, tell them the next thing they can try (a church with `skills/church-setup.md`, or a follow-up task with `skills/task-setup.md`), and point them to `Start Here.md`.
