---
title: Series review and rework plan
date: 2026-11-11
status: active, approved direction
owner: Claude (Fable 5.1) as producer/director; Dave approves every lesson change
---

# Growing Together series review and rework plan

Dave asked for a review of all 40 written lessons (101, 201, 202, 203) on 2026-11-11 and approved the proposals below. This file is the standing plan for that rework. Any agent (Claude, Codex, Grok, or another) doing lesson review or revision on this project reads this file first, works inside it, and does not reopen the decisions in it. Claude holds the producer/director role: it assigns the next lesson, reviews every PR against the standard below, and keeps this file current. Dave's "merge it" in chat is the only approval that moves a lesson to main.

Read with: `DISCIPLESHIP-COMPASS.md` (tone and editorial direction), `LESSON-TEMPLATE.md` (slot order), `AI-LESSON-CHECKLIST.md`, `widgets/widget.md`. Where an older document and this file disagree about what a finished lesson looks like, this file wins until those documents are updated (see "Documents to update" at the end).

## What the series is for

People learn to help other people learn to love and follow the teachings of Jesus. Each lesson covers one essential of the Christian walk, can be talked through over a lunch, and can then be turned around so the learner becomes the teacher. 203-08 (Make SPACES) is the model for that turn.

## The standard every lesson is held to

A finished lesson does these seven things. Measure every draft and every review against this list, in this order.

1. **One story up top.** A parable block or Bible narrative in the first three content blocks, told in Dave's voice, no personal stories.
2. **One big idea in a phrase a person can repeat over lunch.** Examples already in the series: "nothing to find but faith" (203-06), "I will, even when" (202-08), "the cross bought you the power to run" (202-09), "make SPACES" (203-08), "their life, their heart, my part" (203-02). If a reviewer cannot name the lesson's phrase in five words, the lesson is not done.
3. **One widget that builds that phrase.** Prose never names the widget and never says tap, click, "the tool below" or "the diagram below". The paragraph before the widget states the idea in one line and stops.
4. **Three or four mid-lesson questions, one line each, aimed at the heart of the idea.** About 20 words or fewer. One question asks one thing. Lists of options stay out of the question unless the options are the point (pray, give, serve, or go).
5. **One teach-it question.** Somewhere after the widget, one question asks the learner to say the idea in their own words as if telling a friend, or to name who they will take it to. This is the multiplication step and it is the thing most lessons still lack.
6. **A review paragraph that hands the phrase back,** then the closing trio: key thing, one step, prayer request (101 also keeps its Daily Devotions question because of the John reading).
7. **About 1,400 words or fewer,** story to review. Outside authors are retold in the lesson's voice and named only in a plain credit line at the bottom.

Dave's standing rules, from his revision files: second person, no personal stories, no absolutes, no em dashes, never the words "record", "arc" or "gives way", retell outside authors and credit them at the bottom, never name a widget or say tap or click, one question one line.

## Exemplar lessons

Study these before touching anything: **202-08, 202-09, 202-10, 203-06, 203-09** (Dave's rewrites, fall 2026) and **203-08** (the model for learner-becomes-teacher). Also strong as written: 201-02, 201-04, 201-07, 101-07, 202-07, 203-01, 203-10. The older exemplars named in AI-LESSON-CHECKLIST.md (201-08, 201-10) are still sound structurally but are not the tone benchmark anymore.

## Work already done (the three sweeps)

| Sweep | PR | Scope | Status |
|---|---|---|---|
| SWEEP-001 | #118 | Removed tap/click/"tool below"/"diagram below" language from 22 lessons (24 lines). | Open, awaiting Dave's merge |
| SWEEP-002 | #119 | Niles (101-06), Luther (201-10), Piper (202-06, 202-07, 203-04) retold in body and credited at bottom. 101-01 to 101-07 closing question split into key and step (new `N-step` IDs). | Open, awaiting Dave's merge |
| SWEEP-003 | #120 | 32 long or two-part questions in 17 lessons rewritten as one line each. 202-09 and 203-08 left as Dave wrote them. | Open, awaiting Dave's merge |

Logs with before/after tables: `logs/2026-11-11-SWEEP-00{1,2,3}-claude.md`. All three add a TASKS.md row beside ART-008; merge in order and rebase if GitHub flags it. Lesson files do not overlap on any line.

## Work remaining

### A. Seven rewrites, one lesson at a time, in this order

Each rewrite is its own branch and PR. The loop that worked for 203-06 and 203-09: the agent drafts to the standard, Dave reads it on his phone, Dave sends a revision `.md` file, the agent applies it exactly, Dave says "merge it". Do not batch two rewrites in one PR.

| Order | Lesson | Words now | Direction |
|---|---|---|---|
| 1 | **203-07 Armor of God** | 1,683 | Let the widget carry the six pieces; keep one line each in prose. "A Sword for the Lie" is the best thing in it; make it the handle. Two questions are buried inside the armor list; pull them out or drop them. Target three questions plus a teach-it question ("Which piece would you explain first to a friend who is under attack, and how?"). |
| 2 | **203-04 Serve** | 1,643 | Keep the towel and basin, the mountain spring (now credited), and time, talents, treasure. Cut "The Joy of the Towel" or fold it into the review. Add a teach-it question. |
| 3 | **202-02 Family** | 1,570 | Two lessons in one. Keep the Forgiveness Loop as the handle; give the family roles (parent, child, single) one paragraph total. Add a teach-it question around the loop. |
| 4 | **202-04 Gifts** | 1,364 | Cut the paragraph defending the word "apostle" and most APEST explanation; the five farmers widget carries it. Questions already shortened in SWEEP-003; keep 4.2 ("Which of the five farmers are you most like, and what do you notice first in the field?") as the handle question. |
| 5 | **201-03 Holy Spirit** | 1,523 | GUIDE is the handle. Cut the long Jordan and wilderness section to one paragraph, drop the discernment paragraph and the "blind man in an art gallery" paragraph. Add a teach-it question ("How would you explain GUIDE to a friend in one minute?"). |
| 6 | **101-06 Sharing Jesus** | 1,168 | Too many tools: BLESS taste, ABCs, "Offer" steps with a salvation prayer, a prayer box, and a stray line linking to a gospel app ("Here is a simple app that walks you through the gospel: The Gospel Diagram"). Keep the woman at the well and the BLESS taste; point to 203-05 for the full gospel picture; remove the app line. Keep 6.2 (list three people) as the teach-it step. |
| 7 | **203-08 Disciple Others (trim)** | 1,935 | The model for the pattern but the longest lesson. "Addition or Multiplication" and "Life on Life" can each lose a paragraph. 8.2 and 8.3 are two-part; propose one-line versions to Dave but do not change them without his revision file, since these are his questions. |

### B. Trims (one pass each, light touch, can be two or three per PR if Dave prefers)

| Lesson | The one change |
|---|---|
| 101-01 | Fold "What to Expect" and "Spiritual Mentors" into three sentences; cut 1.2 and 1.3, keep 1.1 and 1.4. |
| 101-04 | The Three Discovery Questions are the lesson (1,561 words). Cut the "Read It" friendship paragraph and the "Three Ways" framing. 4.5 is already the teach-it question. |
| 101-05 | Grove and potluck are both good pictures; make the potluck the handle. |
| 201-05 | Cut the manuscript-reliability paragraph; "A Word on Translations" to one line. |
| 201-06 | The "Resource to Go Deeper" tool can go. 6.4 is already the teach-it question. |
| 201-09 | Cut "The Vinedresser's Pruning" section and 9.4 (or keep 9.4 and cut 9.3); four mid questions is one too many here. |
| 202-01 | Two art blocks stacked at the top; keep one. Three verses in one section ("as yourself", Golden Rule, Philippians 2); keep one. |
| 202-03 | The Baptist Faith and Message paragraph reads like a definition, not a conversation; retell it in one plain sentence. |
| 202-05 | Five mid questions (1,623 words). Fold "The Question Nobody Wants to Ask" and "Bitter or Better" into the sections around them; drop to four questions. |
| 202-06 | Five sections and five questions; "See, Bow, Receive, Go" is the handle. Drop to four questions. |
| 203-02 | "Prayer Is Not a Performance" to two sentences (1,478 words). |
| 203-03 | Two handles (Ask, Ask Again, Remember; The Open Table) are fine for a two-rhythm lesson; no structural change, just the length. |
| 203-05 | Fold "From Bridge to Crossing" and "Faithful, Not Successful" into their neighbors (1,660 words). The 3 Circles practice is already the teach-it step. |

### C. One teach-it question per lesson

After A and B, walk every lesson and confirm one question asks the learner to say the idea to someone else or name who they will take it to. Already present: 101-04 4.5, 101-06 6.2, 201-01 1.3, 201-02 2.2, 201-06 6.4, 201-07 (the Ethiopian makes the point itself), 202-10 10.4, 203-02 2.4, 203-03 3.4, 203-05 5.4, 203-06 6.4, 203-08, 203-09 9.3. Missing or weak: 101-01, 101-02 (2.2 could become it), 101-03, 101-05, 101-07, 201-03, 201-04, 201-05, 201-08, 201-09, 201-10, 202-01, 202-02, 202-03, 202-04, 202-05, 202-06, 202-07, 202-08, 202-09, 203-01, 203-04, 203-07, 203-10. Add it in whichever pass touches the lesson last so each lesson's questions get set once. For 202-08 and 202-09, propose to Dave; do not change his approved questions without a revision file.

### D. Missing pieces (track, do not block)

- No widget: 101-03 to 101-07 (101-03 has the Daily Prayers tool, 101-05 a checklist), 203-02, 203-03, 203-04. A widget is not required where the lesson has a tool or a clear exercise; note it, do not invent one without Dave.
- No story art: 201-09, 202-03, 202-05, 202-06, 202-07, 203-03, 203-06, 203-07, 203-09, 203-10. Existing ART tasks cover 203-06 (ART-004) and 203-08 (ART-008). Needs an image tool; out of scope for lesson text work.
- Question IDs that do not match their lesson: 202-05 uses `201-09-*`, 202-06 uses `201-05-*`, 202-09 9.3 is `201-9-1`. The app is in slow beta with no saved answers that matter, so these are cosmetic. Fix them only when that lesson is rewritten anyway, and do not raise them with Dave as a risk.
- The "Tap each question to compare" line inside `widgets/two-ordinances.html` is widget UI, not prose; leave it unless Dave asks.

## How to work a lesson under this plan

1. Claim the row in `TASKS.md` (owner, branch, date). One lesson per branch: `claude/l-203-07-rework` or `codex/l-203-07-rework`.
2. Read this file, the exemplars, the lesson JSON, and any `Lesson_research/` notes for it.
3. Draft to the standard. Keep the lesson's story, widget, verses and key phrase unless the direction above says otherwise. Keep question IDs where the question survives.
4. Run from `discipleship/`: `bash scripts/qa_foundation.sh`, `node scripts/test_lesson_export.js`, `node scripts/test_answer_storage.js`, `node scripts/check_lesson_assets.js`. If a widget changed, also `node scripts/test_widget_iframe.js` and a phone-width browser check per `widgets/widget.md`.
5. Write `logs/YYYY-MM-DD-L-<lesson>-<agent>.md`: what changed and why, word count before and after, question list before and after, checks run.
6. Open the PR with the same summary. Never merge. Never force-push. Do not touch lesson prose outside the assigned lesson.
7. Dave reads on his phone and sends a revision file; apply it exactly, including wording you would not have chosen. When he says "merge it", merge, record the approval in `DAVE.md` with the PR, merge sha and file sha256, and keep Dave's main folder pulled.

## Review checklist for any agent reviewing a lesson

Score each line yes or no and quote the evidence. A lesson passes when every line is yes.

- The big idea is a phrase of five words or fewer, and the review paragraph repeats it.
- The paragraph before the widget states the idea and does not name the widget or say tap, click, below, tool or diagram.
- Every mid-lesson question is one line, asks one thing, and is about 20 words or fewer.
- One question is a teach-it question.
- Word count, story to review, is about 1,400 or fewer.
- No outside author is named in the body; every borrowed picture has a credit line at the bottom.
- No personal stories, no absolutes, no em dashes, none of the banned words.
- Closing trio present (101: trio plus Daily Devotions).
- Checks in step 4 above pass.

## How Dave edits (learned from his revisions)

Dave reviewed 203-07 and 203-04 on his phone and sent line-by-line changes. The pattern in those changes is the editing standard for every later draft. Apply it before he sees a lesson, so his rounds get shorter.

- **Name the positive action, not the cost.** He replaced "be inconvenienced for someone else's good" with "care with action for someone else's good" and "start being inconvenienced" with "start to sacrifice". Serving is love in motion, not a burden.
- **No guilt in the setup.** "one more thing to do to keep God happy" became "one more thing they have to do." Describe the misunderstanding without caricaturing God.
- **"Acceptance with God," not "standing with God."** Warmer and relational, not legal.
- **God as the subject of every short line.** "Peace is not just comfort. It moves you on mission" became "Peace is the presence of God that moves you on mission." "Jesus has already triumphed" became "Jesus stands with you, before you, and has won." Keep Christ present tense, not only past.
- **One sentence where fragments pile up.** "Not power, not status. A towel and a basin." became one sentence with a colon. Join a contrast with "but" ("He had every right to be served, but He chose to serve") instead of two clipped sentences.
- **Bold the one line to remember in a section.** The world/Jesus greatness contrast was set in bold. At most one bold line per section, the line a reader would quote.
- **Homely, exact images.** "Watering bucket," not "watering trough." Pick the object people actually own.
- **Credit a quoted author inline.** When a sentence is really Piper's, write "John Piper says," and quote it, and keep the credit line at the bottom.
- **Questions must stand on their own.** He called 4.2 "too obscure" because it leaned on the lesson's metaphor (spring and trough). A question should make sense to someone who did not read the paragraph above it. Ask about feeling, growth, or a concrete next step; avoid clever callbacks.
- **Growth questions over confession questions.** "Which is hardest for you to give" became "which is your biggest growth area, and what is one way you could develop it?" Pair the diagnosis with a forward step.
- **Do not assume a prior artifact.** "Pick one name from your prayer card" was cut. A practice should work even if the learner skipped an earlier tool.
- **Short, concrete, warm.** Every change shortened or clarified; none added length.

## Documents to update once the sweeps merge

- `LESSON-TEMPLATE.md`: the 101 closing is now key, step, devotions, prayer (four questions), not the older combined key-and-step question.
- `AI-LESSON-CHECKLIST.md`: name 202-08, 202-09, 203-06, 203-09 and 203-08 as the tone and pattern exemplars alongside 201-08 and 201-10; add the teach-it question and the no-widget-naming rule to the slot check.
- `DISCIPLESHIP-COMPASS.md`: add the seven-point standard above under lesson standards if it is not already there in substance.
- `curriculum-toc.csv`: confirm the browse subtitle and tool column still match any lesson whose handle changes in a rewrite.
