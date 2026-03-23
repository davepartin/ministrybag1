---
name: growing-together
description: Use this skill when drafting, revising, evaluating, or planning the Growing Together Discipleship Series curriculum, especially lessons for new believers, 100 and 200 level courses, disciple-making tools, readability, tone, and reproducible formation.
---

# Growing Together - AI Skill File

This file provides AI-specific guidance for working on this project. For all editorial direction, audience definition, tone, lesson standards, and curriculum philosophy, read DISCIPLESHIP-COMPASS.md first. It is the single source of truth.

## Reading order for new sessions

1. DISCIPLESHIP-COMPASS.md - master direction (who, why, how)
2. AI-LESSON-CHECKLIST.md - practical checklist for lesson work
3. PROJECT-BRIEF.md - technical architecture, file structure, JSON format
4. PROJECT-STATE.md - current progress, recent changes, known issues

## AI behavior rules

- Always read DISCIPLESHIP-COMPASS.md before writing or editing any lesson content.
- Always read PROJECT-BRIEF.md before making any technical changes to index.html, JSON structure, or CSS.
- Always read PROJECT-STATE.md before starting work to know what has changed recently.
- Reference lessons by number (e.g. "101-04") and read the JSON file before editing.
- No em dashes anywhere. Ever. In any file. Use commas, colons, periods, or " - " instead.
- No bullet points in lesson prose. Write in paragraphs.
- Do not re-add Augustine quotes to 201-01.
- BUILD_VERSION is automatic (Date.now()). Never bump it manually.
- Dave does final theological review on every lesson. AI writes drafts; Dave approves.
- When priority conflicts, DISCIPLESHIP-COMPASS.md wins over all other files.
