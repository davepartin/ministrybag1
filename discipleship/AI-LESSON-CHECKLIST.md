---
title: AI Lesson Checklist
purpose: Practical drafting and review checklist for lesson work
status: active
---

# AI Lesson Checklist

Use this checklist when drafting, revising, reviewing, or evaluating lessons in this project.

- For the lesson spine, slot order, and eight-goal structural check, see **LESSON-TEMPLATE.md**. That file is the structural law; this checklist is the practical companion.
- For editorial direction, tone, audience, and non-negotiables, see **DISCIPLESHIP-COMPASS.md**.
- The two reference lessons to study alongside the template are `data/201-08.json` (parable plus diagram image) and `data/201-10.json` (parable plus interactive widget).

## Slot-by-slot template check

Walk every lesson through the spine laid out in LESSON-TEMPLATE.md. The same walk works for a new draft, a revision, and a review.

1. Journey recap paragraph present at the top (course openers get a course welcome instead).
2. Parable block within the first three content blocks, with a B&W Grok image plus the color-reveal variant.
3. Opening paragraph that bridges the story into the teaching.
4. Teaching section A with Scripture.
5. Mid-lesson question 1.
6. Diagram, widget, or stepper as the main visual.
7. Teaching section B with Scripture.
8. Mid-lesson question 2.
9. Teaching section C (and/or `box` exercise) when the lesson needs another layer.
10. Mid-lesson question 3, with optional 4 and 5. Total mid-lesson question count lands between three and five.
11. Lesson Review paragraph that names the one big truth.
12. Bible reading block when the course has a parallel reading plan.
13. Closing Reflections with the three standard 200-level questions (101 keeps its own ending rhythm; see LESSON-TEMPLATE.md for the exception).

If a slot is missing, decide whether the lesson truly does not need it, or whether the slot should be filled. Lessons drift toward thinner when slots are left empty without a reason.

## Before writing

Confirm:

- Who is the learner for this lesson?
- What is the one big truth?
- What should the learner know, feel, do, and eventually be able to explain?
- Is this lesson helping a new believer grow, or helping a maturing believer disciple someone else, or both?

If the lesson has multiple competing burdens, narrow it.

## While writing

Check for:

- warm and pastoral tone
- plain language
- short paragraphs
- one main idea at a time
- clear use of Scripture
- grace before command
- concrete application
- a memorable tool or framework when useful
- varied sentence rhythm: short sentences should create emphasis, not set the default pace. If three or more short sentences appear in a row, look for ways to blend them into smoother prose. To flag this in review, say "watch the rhythm" or "blend the clusters."

## Readability test

Ask:

- Would a newer believer understand these sentences?
- Are there church words that need explanation?
- Is the wording simpler than the theology?
- Could this be read on a phone without fatigue?

If the wording sounds like notes, lectures, or staff training, simplify it.

## Reproducibility test

Ask:

- Could this learner explain the main point to a friend?
- Is there a simple phrase, picture, diagram, or framework worth remembering?
- Does the lesson leave the learner better prepared to disciple someone else?

If the lesson informs but does not transfer, it is not done yet.

## New believer test

Ask:

- Would this create clarity or confusion for a spiritually young believer?
- Is assurance clear where needed?
- Is the gospel still the center?
- Does the lesson sound like invitation and formation, not pressure and performance?

## Length test

Ask:

- Is there one main burden, or too many?
- Would a reader lose the thread on a phone?
- Can any paragraph be shortened without losing warmth or truth?

It is better to be memorable than exhaustive.

## Tool test

Look for a chance to add:

- a memory device
- a short framework
- a reflection prompt
- a personal inventory
- a diagram
- a mini webapp
- a discipleship conversation aid
- an interactive widget (self-contained HTML in `widgets/` folder, embedded via `{"type": "widget", "src": "widgets/filename.html"}`)

Do not force a tool into every lesson, but default to transferability. When a concept benefits from exploration rather than linear reading, consider building an interactive widget. See PROJECT-BRIEF.md for widget design guidelines.

## Final lesson test

A strong lesson usually lets the learner say:

- I understand the main point.
- I know why it matters.
- I know what to do this week.
- I could share this with someone else.

## Editorial rules (non-negotiable)

- No em dashes anywhere. Use commas, colons, periods, or " - " instead.
- No bullet points in lesson prose. Write in paragraphs.
- No Augustine quotes in 201-01.
- Self-paced language only: no "we" language, "together" framing, or group-setting assumptions.
- Write for the phone screen first.

## Evaluation rule

When reviewing partial or placeholder lessons, do not over-focus on polish.

Prioritize:

- direction
- sequence
- learner fit
- theological center
- pastoral tone
- disciple-making usefulness
