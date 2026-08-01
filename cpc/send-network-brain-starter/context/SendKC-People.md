---
context: send_network
type: context_brief
status: template
---

# SendKC-People

People live in `wiki/people/`, one note per human.

## Person Types

Use `person_type:` in frontmatter:

- `planter` — potential, candidate, funded, or aged-out planter.
- `pastor` — pastor connected to a church we track.
- `staff` — team or support role.
- `association_leader` — DOM/AMS or associational leader.
- `partner` — seminary, ministry, denominational, or other strategic partner.

If someone fits more than one lane, keep one note and add `person_types:` and `roles:`. Example: a staff member who also pastors a church is `person_type: staff` with `person_types: [staff, pastor]`.

## Planter Pathway

For planters, set exactly one `planter_pathway:` value:

- `potential`
- `candidate`
- `funded`
- `aged-out`

The pathway lives on the person note, not only in a dashboard. Pathway group notes are generated views.

## Field Staff / CPC Ownership

Use `field_staff:` for the CPC/SCM primarily responsible for planter care or pathway follow-up. Use a wikilink to their person note when possible. Do not default unknown ownership to any one person. Leave it blank or ask.

## Sensitive Context

This vault is shared. Keep assessment, family, conflict, funding, immigration, counseling, HR, and crisis details brief. Use breadcrumbs that help the team care wisely; do not paste transcripts, private reports, or full personal identifiers, and never paste them into a public AI tool.
