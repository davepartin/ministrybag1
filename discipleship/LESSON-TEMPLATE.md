---
title: Growing Together Lesson Template
purpose: The structural law for every lesson in the Growing Together Discipleship Series
status: active
exemplars: data/201-08.json (parable plus diagram image), data/201-10.json (parable plus interactive widget)
last-updated: 2026-04-17
---

# Growing Together Lesson Template

Every lesson in this series is built from the same spine. The spine protects three things: the 30-minute lunch-conversation length, the reproducibility standard so a learner can pass the lesson on, and the warm pastoral rhythm that keeps grace in front of pressure.

Use this file as the starting skeleton for every new lesson, and as the review checklist for every existing one. Two lessons live in the repo as the reference exemplars. Read them first.

- `data/201-08.json` - parable block opening, diagram image as the main visual
- `data/201-10.json` - parable block opening, interactive widget as the main visual

This template is the structural law. `DISCIPLESHIP-COMPASS.md` governs philosophy, tone, and editorial direction and always wins when guidance overlaps. `PROJECT-BRIEF.md` governs JSON block types and technical details.

## The eight goals this template encodes

Every lesson should hit these eight goals. The slots below are designed to make that natural, not accidental.

1. Teaches one of the 30 core truths a Christian needs to know or be reminded of.
2. Fits a 30-minute lunch discussion. Reads in 15 to 20 minutes and leaves room for conversation.
3. Reproducible. After one pass, a learner could take a friend through it.
4. Reading level fits most English-speaking adults (a sixth-grade ceiling on sentence complexity), while keeping ESV for Scripture.
5. Clean intro and clean outro. Journey Recap at the top, Lesson Review at the bottom.
6. A key picture early in the lesson, tied to the story or parable. Black-and-white Grok sketch with the scroll-reveal color treatment.
7. A diagram or interactive widget that carries the main point visually, between teaching sections.
8. Three to five mid-lesson reflection questions, not counting the closing reflections.

## Lesson spine, in order

### 1. Journey recap - one short paragraph

- Block type: `text` as the first content block. Course openers (101.01, 201.01, 202.01, 203.01, 301.01) use a course welcome heading and two short paragraphs instead.
- Purpose: tell the learner where they are standing in the course arc and how this lesson connects to what came before. Two to three sentences. Warm, not bureaucratic.
- Arc callout: when the lesson sits inside a named arc, name the arc so the learner feels the shape of the journey. Examples of arcs currently in play:
  - 201 Trinity arc (201.01 Father, 201.02 Son, 201.03 Spirit)
  - 201 Bible arc (201.05 map, 201.06 road trip, 201.07 skill)
  - 202 Love Others arc (202.01 neighbors, 202.02 family, 202.03 church family)
  - 203 BLESS arc (203.02 Begin, 203.03 Listen and Eat, 203.04 Serve, 203.05 Share)

### 2. Parable block - the key picture and the story hook

- Block type: `parable`
- Purpose: anchor the lesson in a memorable story before any teaching begins. The image gives the learner something to see. The short narrative gives them something to hold onto for the rest of the lesson.
- Image style: black-and-white Grok sketch at the top of the parable card, paired with a second identical composition that carries a color splash or slight motion. The color variant reveals on scroll. Honor `prefers-reduced-motion` settings so users with motion sensitivity see the color version statically.
- Exemplar: `data/201-08.json` is the reference implementation for this block.
- Exception: a course opener can skip the parable block and open with the course welcome and logo image, since the whole course is the hook.

### 3. Opening paragraph - the bridge from story to truth

- Block type: `heading` followed by `text`, or `text` alone when the parable flows directly into the teaching.
- Purpose: turn the story into the question or invitation the lesson is answering. Warm and direct, not academic.
- Grace-first rule: if the lesson is about an obedience or a command, name the grace that precedes it before naming the call.

### 4. Teaching section A - Scripture and plain explanation

- Block types: `heading`, `text`, `verse`.
- Purpose: open Scripture on the main idea. Use ESV. Explain church words when they appear.
- Sentence rhythm rule: watch for staccato clusters. Three or more short sentences in a row should be blended into smoother prose. Short sentences are for emphasis, not for the default pace.

### 5. Mid-lesson question - reflection prompt 1

- Block type: `question`
- Purpose: let the learner process what they just read before the next idea stacks on top.
- Numbering: Series.Lesson.Question (e.g., 203.5.1 shown to the learner as "5.1 -").

### 6. Diagram or widget - the visual that carries the main point

- Block types: `image` for a diagram, `widget` for an interactive tool, or `stepper` for a step-by-step visual.
- Purpose: give the learner one picture or one tool that holds the whole lesson. This is the reproducibility anchor. A learner should be able to sketch this on a napkin for a friend.
- Exemplars: 201-08 uses a grace-and-mercy four-quadrant diagram image. 201-10 uses the Learning Circle widget.

### 7. Teaching section B - application and Scripture

- Block types: `heading`, `text`, `verse`.
- Purpose: bring the truth into the learner's daily life. Keep concrete. Keep grace in front.

### 8. Mid-lesson question - reflection prompt 2

- Block type: `question`

### 9. Teaching section C - one more layer if needed

- Block types: `heading`, `text`, `verse`, `box`.
- Purpose: add the last layer of teaching, or introduce a how-to exercise. The `box` block works well for a small exercise or activity here.

### 10. Mid-lesson question - reflection prompt 3, with optional 4 and 5

- Block type: `question`
- Target: three to five mid-lesson questions total across the lesson, not counting the three closing reflections. Five is the ceiling for a 30-minute lunch conversation.

### 11. Lesson Review - one short paragraph

- Block types: `heading` with text "Lesson X Review" followed by `text`.
- Purpose: tie the lesson closed before the closing reflections. Name the one big truth in a sentence a learner could repeat to a friend.
- Length: two to four sentences.

### 12. Bible reading (optional)

- Block type: `bible_reading`
- Purpose: where a course includes a parallel reading plan (like 101 walking through the Gospel of John), this block lives here.

### 13. Closing Reflections - the three standard questions

- Block types: `heading` with text "Closing Reflections" followed by three `question` blocks.
- 200-level standard (201, 202, 203): three distinct questions, always in this order.
  1. What is one key thing you learned from this lesson?
  2. What is one step you are going to take this week?
  3. What is a prayer request for this week?
- 100-level exception: the 101 course uses its own ending rhythm (a combined key-thing-plus-next-step question, then a devotions question, then a prayer request). That pattern is intentional for the on-ramp course and does not need to match the Growing-level standard.
- 300-level: to be finalized when 301 writing begins. Until then, assume the 200-level standard.

## Editorial non-negotiables inherited from the Compass

- No em dashes anywhere. Use commas, colons, periods, or " - " (space-hyphen-space).
- No bullet points in lesson prose. Write in paragraphs.
- Self-paced voice only. No "we," "together," or group-meeting framing.
- Grace before pressure in every section.
- ESV for Scripture.
- Warm, pastoral tone. Not academic.

## The eight-goal check

Run this check on every lesson before it ships.

| Goal | How to verify |
|------|---------------|
| 1. Teaches one of the 30 core truths | The one big truth is named in the Journey Recap or Lesson Review |
| 2. 30-minute lunch length | Reads in 15 to 20 minutes, leaves room to discuss |
| 3. Reproducible | The learner could sketch the tool or repeat the named phrase |
| 4. Sixth-grade reading with ESV | Short sentences, plain words, ESV verses, church terms explained |
| 5. Clean intro and outro | Journey Recap present at the top, Lesson Review present at the bottom |
| 6. Key picture early | `parable` block appears within the first three content blocks |
| 7. Diagram or widget | One visual or interactive tool sits between the question sets |
| 8. Three to five mid-lesson questions | Mid-lesson `question` count is three to five, not counting closing reflections |

## How to use this template

When drafting a new lesson, copy the spine above into a scratch file, fill each slot with the actual content, then run the eight-goal check before touching the JSON. When reviewing an existing lesson, open the JSON beside this file and walk the slots top to bottom. Missing slots become visible immediately.

Three files point back here:

- `AI-LESSON-CHECKLIST.md` uses this template as the spine of its slot-by-slot checks.
- `DISCIPLESHIP-COMPASS.md` names this template as the structural law for every lesson.
- `PROJECT-BRIEF.md` references this template from the Adding a New Lesson section.

When this template and any of those files disagree, this file and the Compass govern the lesson structure together. The Brief governs the technical layer underneath.
