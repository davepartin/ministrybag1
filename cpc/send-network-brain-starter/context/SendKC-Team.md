---
context: send_network
type: context_brief
status: template
---

# SendKC-Team

> This is a template. Replace the example roles below with your actual teammates, and add a profile per person in `context/staff-profiles/` (copy `Profile - Template.md`).

The team uses this vault to share regional clarity and keep follow-up from falling through the cracks.

## Core Team Roles

| Role | Primary Lane |
|---|---|
| City Lead (SCM) | Regional leadership, funding decisions, CPC alignment, team direction |
| CPC | Planter care, pathway clarity, church mobilization, shared-system building |
| CPC (by sub-region) | Planter care and relationships for a geographic lane of the metro |
| Support roles | Assessment, training, spouse care, associational and seminary partners |

Add one row per real teammate, and name the sub-region or lane each CPC carries.

## What A CPC Does

A Church Planting Catalyst helps identify, develop, assess, coach, care for, and connect planters and churches. In the vault, CPC work usually appears as:

- planter notes with pathway stage and next step,
- church notes with mobilization level and pastor relationships,
- event notes for labs, lunches, assessments, retreats, and summits,
- tasks assigned to the right CPC or team member,
- breadcrumbs from meetings, calls, and funding/process decisions.

See `wiki/organization/Church Planting Catalyst Role Reference.md` for the full role.

## How Staff Should Use AI Here

1. Say who you are at the start of a session.
2. The AI reads your staff profile in `context/staff-profiles/`.
3. The AI uses the setup skills in `skills/` before creating people, churches, events, or tasks.
4. The AI runs `python3 scripts/sync_sendnetwork_dashboard.py` after meaningful changes.
5. The AI summarizes what changed and names any unresolved fields.

## Ownership Posture

The vault should help the team see responsibility clearly. Do not assign every task to one person. If the city lead owns a funding decision, they are the task owner. If a CPC owns planter follow-up, that CPC is the owner. If ownership is unknown, capture the context as a plain bullet and ask.
