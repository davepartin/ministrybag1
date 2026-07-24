# Send Network Second Brain — Starter Kit

A ready-to-use **Obsidian** framework for church planting catalysts and their teams. It gives you one shared "second brain" for the work: the planters you care for, the churches you are mobilizing, the events you run, and the tasks that keep people from falling through the cracks.

This kit was designed for **Send Network Kansas City** and is shared as a starting point. It contains the whole operating system — the folder structure, the rules, the setup skills, the templates, the dashboards, and the sync scripts — with **zero real people in it.** You bring your own planters, pastors, and churches.

> **Why this exists.** A church planting catalyst spends half the job on relationships and half on paperwork: emails, reports, tracking, remembering. This vault carries the paperwork so you have more of yourself left for the people. Same NAMB documents, same PACE pathway, same kind of workflow, city to city. Build it once and watch it grow.

---

## What you get

- A clean Obsidian vault laid out for Send Network work (people, churches, events, organization).
- `AGENTS.md` — the rulebook an AI assistant reads so it works inside your vault safely.
- `skills/` — step-by-step "recipes" so adding a planter, pastor, church, event, or task is the same every time.
- `wiki/templates/` — the note templates every record is built from.
- `wiki/organization/` — the framework docs: what a catalyst does (PACE), the 5-level church mobilization pathway, the endorsement pathway.
- `*.base` — Obsidian **Bases** dashboards (planters, churches, people, staff) that work on desktop and iPad.
- `scripts/` — Python sync scripts that build your indexes and roll tasks up onto the right person.
- A few clearly-fake **Example** notes so you can see the pattern, then delete them.

---

## Two ways to build it

### Path A — Download and open (easiest, no coding)

1. Download this folder (or clone the repo) to your computer.
2. Install **Obsidian** (free) from obsidian.md.
3. In Obsidian: *Open folder as vault* → choose this folder.
4. Enable the community plugins listed in **Requirements** below (Dataview, Tasks). Obsidian **Bases** is built in.
5. Open `Start Here.md` and follow it. Start adding your people with the skills.

That's it. The vault is ready. The example notes show you the pattern; replace them with your own.

### Path B — Let Claude build it with you (guided)

If you use **Claude** (the desktop app / Cowork), you can have it set this up and coach you through your first planter:

1. Put this folder somewhere on your computer, or have the link to it.
2. Open Claude and give it access to a folder to work in.
3. Say:

   > "Read `BUILD-GUIDE.md` and `README.md` in this Send Network starter kit. Set the vault up in my folder, then walk me through adding my first planter."

Claude will read the guide, create the structure, and take you step by step through your first real record. See `BUILD-GUIDE.md` for exactly what it does.

---

## Make it yours

This kit is modeled on Send Network **Kansas City**. To adapt it to your city:

1. **Rename the region.** Find-and-replace `KC` / `Kansas City` with your region, and update the associations named in `wiki/organization/` to your local ones.
2. **Replace the example notes.** Delete `Example Planter`, `Example Pastor`, and `Example Sending Church` once you have real ones.
3. **Set your team.** Edit `context/SendKC-Team.md` and add a profile per teammate in `context/staff-profiles/` (copy `Profile - Template.md`).
4. **Tell your story.** Update `context/SendKC-Business.md` with your region's mission and rhythms.

---

## A word on privacy (read this)

- **This kit ships with no real people.** Every name in it is a placeholder or an obvious example.
- **You track real people, and some details are sensitive** — assessments, marriages, funding, immigration, legal. Keep those as short breadcrumbs, not transcripts. Do not paste private reports or full personal identifiers into a public AI tool. See `AGENTS.md`.
- **This vault is shareable with your team, not the public.** Keep it in a private repo or a synced folder your team controls, not on a public site.

---

## Requirements

- **Obsidian** (free) — the app the vault runs in. Works on Mac, Windows, iPad, iPhone.
- **Community plugins:** *Dataview* and *Tasks*. (Obsidian *Bases* is built in and powers the `.base` dashboards.)
- **Python 3** — to run the sync scripts in `scripts/` (`python3 scripts/sync_sendnetwork_dashboard.py`). Optional but recommended; the vault still works without them, the generated indexes just will not refresh.
- **An AI assistant** (optional, but this is built for it): Claude, ChatGPT, or Gemini. Point it at `AGENTS.md`.

---

*Built by a Send Network church planting catalyst and shared freely so other catalysts can start healthy, organized, and people-first. Adapt it, improve it, pass it on.*
