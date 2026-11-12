# Growing Together Team Board

Started 2026-11-12 at Dave's request. This is the one page every agent reads before working. Dave Partin owns the content and gives the only approval that merges ("merge it"). Claude (Fable 5.1) is director: it assigns work here, reviews every pull request against the plan, and is the only agent that rewrites Dave's questions or voice. The other agents do the volume work so Claude's review is cheap.

Companion documents: `HANDOFF.md` (how the system works), `TASKS.md` (the task rows), `reviews/2026-11-11-series-review.md` (the lesson standard and Dave's editing patterns), `DAVE.md` (approvals), `logs/` (evidence).

## The team

| Agent | Model | Lane | Branch prefix |
|---|---|---|---|
| Dave | | Reads previews on his phone, sends revisions, says "merge it" | |
| Claude | Fable 5.1 | Director. Reviews every PR, keeps this board, writes anything in Dave's voice (questions, bio, lesson prose that changes meaning) | `claude/` |
| ChatGPT | GPT 6.1 | Code and mechanics: reader fixes, export, performance, then the light lesson trims in plan section B | `codex/` |
| Gemini | Gemini 4 | Story art for 201 and 202, and the documentation set (templates, checklist, compass) | `gemini/` |
| Grok | Grok | Story art for 203 and 101, widget art and polish | `cursor/` or `grok/` |

## Standing rules for every agent

1. Work in your own git worktree or branch, never in the main checkout at `~/github/ministrybag1`. Push, open a PR, wait. Merge to main publishes both sites, so no one runs a deploy and no one merges.
2. One job per PR. Run from `discipleship/`: `bash scripts/qa_foundation.sh`, `node scripts/test_lesson_export.js`, `node scripts/test_answer_storage.js`, `node scripts/check_lesson_assets.js`, plus `node scripts/test_lesson_images.js` for images and `node scripts/test_widget_iframe.js` for widgets. Paste the results in the PR.
3. Write a log in `logs/YYYY-MM-DD-<ID>-<agent>.md` and add or update your TASKS row. Claude records approvals in DAVE.md after merge.
4. The Firebase Action posts the preview link on the PR within a few minutes. Put the lesson hash on it when you report to Dave, for example `#201-3`.
5. Lesson text: read the standard and "How Dave edits" in the review plan first. Do not change a question Dave has approved; propose the new wording in the PR and let Claude take it to Dave. No em dashes, never the words "record", "arc" or "gives way". One bold line per section at most.
6. Images: run `node scripts/build_lesson_images.js` so new art ships as small WebP copies, keep originals, and follow `story-image.md` for sequences and stops.
7. Never store Dave's email, keys or passwords in the repo. Never touch Firebase configuration, workflows or the sign-in code without a task from Claude.
8. If you are blocked or the task changes shape, stop and write it in the PR instead of guessing.

## Lessons learned (read these, they cost us time)

- **Run the image build where `sharp` works.** `node scripts/build_lesson_images.js` needs the sharp library. ChatGPT runs it with `NODE_PATH=/Applications/ChatGPT.app/Contents/Resources/cua_node/lib/node_modules`; Claude used `NODE_PATH=/Users/dpartin/github/fleetdice/node_modules/.pnpm/sharp@0.34.5/node_modules`. If the build prints only a Node version line, it crashed and wrote nothing. Until a `package.json` pins sharp (ChatGPT, top of lane), check the output before you commit.
- **Check exit codes, not the last line.** `bash scripts/qa_foundation.sh | tail -1` always exits 0. Run the script, then `echo $?`, or use `set -o pipefail`. Claude merged a red asset map on 2026-11-12 because of this.
- **Do not edit the image list by hand.** Since #154 the build script finds every file in `images/` on its own. Art PRs add the image files, run the build, and commit the regenerated `scripts/lesson-image-assets.js`. Two art PRs editing the list at once caused a conflict on 2026-11-12.
- **Parse-check widget scripts.** An apostrophe inside a single-quoted string took a widget down for one preview build. Run `node --check` on each inline script, or write text with double quotes.

## AAA scorecard (goal: all 37 lessons AAA)

A lesson is **AAA** when it meets the seven-point standard in the review plan (one story, one phrase, one widget never named in prose, three or four one-line questions, one teach-it question, review hands the phrase back, about 1,400 words or less, authors credited) **and** has story art in the charcoal style (a scroll sequence or a charcoal-to-color dissolve) **and** passes every check. Scored 2026-11-12 by script and by hand. "Art" means sequence or dissolve; a plain picture does not count. Owners follow the lanes below.

| Lesson | Words | Art | Widget | Gaps to AAA | Owner |
|---|---|---|---|---|---|
| 101-01 | 1,102 | plain | none | trim (plan B), art, teach-it | ChatGPT trim, Gemini art |
| 101-02 | 1,196 | seq | romans-road2 | teach-it | Claude |
| 101-03 | 973 | none | Daily Prayers tool | art, teach-it | Gemini art |
| 101-04 | 1,551 | none | none | trim (plan B, main priority), art, widget candidate | ChatGPT trim, Gemini art |
| 101-05 | 1,218 | dissolve | checklist | trim (plan B), teach-it | ChatGPT |
| 101-06 | 1,065 | dissolve | none | done 2026-11-11 | AAA |
| 101-07 | 1,470 | none | none | trim, art, widget candidate, teach-it | ChatGPT trim, Gemini art |
| 201-01 | 1,223 | seq | great-command | old widget review | Claude |
| 201-02 | 1,261 | seq | great-exchange3 | old widget review | Claude |
| 201-03 | 1,188 | dissolve | guide-spirit2 | done 2026-11-11 | AAA |
| 201-04 | 1,490 | seq | deep-roots | light trim, teach-it | ChatGPT |
| 201-05 | 1,521 | plain | bible-bookshelf | trim (plan B), art, teach-it, old widget | ChatGPT trim, Gemini art |
| 201-06 | 1,489 | seq | biblical-storyline | trim (plan B), old widget review | ChatGPT |
| 201-07 | 1,410 | dissolve | oia-method | five questions, light trim | ChatGPT |
| 201-08 | 1,168 | dissolve | grace-diagram | teach-it, old widget review | Claude |
| 201-09 | 1,397 | seq | fruit-of-spirit | trim (plan B), one long question, teach-it | ChatGPT |
| 201-10 | 1,578 | dissolve | learning-circle2 | trim, teach-it, old widget review | ChatGPT |
| 202-01 | 1,463 | plain | cross-the-road | trim (plan B), art, long question, teach-it | ChatGPT trim, Gemini art |
| 202-02 | 1,402 | seq | cornerstone | done 2026-11-11 | AAA |
| 202-03 | 1,238 | none | one-another | trim (plan B), art, teach-it | ChatGPT trim, Gemini art |
| 202-04 | 1,005 | dissolve | five-gardeners | done 2026-11-11 | AAA |
| 202-05 | 1,633 | none | valley-road | trim (plan B), art, five questions, teach-it | ChatGPT trim, Gemini art |
| 202-06 | 1,427 | none | worship-is | trim (plan B), art, five questions, teach-it | ChatGPT trim, Gemini art |
| 202-07 | 1,364 | none | stewardship-flip | art, teach-it, old widget review | Gemini art |
| 202-08 | 1,267 | dissolve | covenant-triangle | teach-it (propose to Dave) | Claude |
| 202-09 | 1,218 | dissolve | starting-gun | one long question, teach-it (propose to Dave) | Claude |
| 202-10 | 1,184 | dissolve | two-ordinances | none | AAA |
| 203-01 | 1,319 | plain | personal-ministry-map | art, teach-it | Grok art |
| 203-02 | 1,443 | plain | none | trim (plan B), art, widget candidate | ChatGPT trim, Grok art |
| 203-03 | 1,383 | none | none | trim (plan B), art, widget candidate | ChatGPT trim, Grok art |
| 203-04 | 1,287 | dissolve | none | done 2026-11-11 | AAA |
| 203-05 | 1,668 | seq | three-circles | trim (plan B), old widget review | ChatGPT |
| 203-06 | 1,243 | none | three-spaces | art (#155 in review) | Grok |
| 203-07 | 1,314 | plain | armor-of-god | art | Grok art |
| 203-08 | 1,828 | plain | spaces-tables | art; Dave accepts the length | Grok art |
| 203-09 | 1,193 | none | mission-map | art | Grok art |
| 203-10 | 968 | none | shape | art, teach-it | Grok art |

Counts: 7 lessons are AAA today. 18 need story art (10 Gemini, 8 Grok). 16 need a trim or question pass (ChatGPT, proposals only on questions). 21 need a teach-it question (ChatGPT proposes inside its trim PR; Claude words it with Dave; Claude handles the rest). 11 widgets predate the A-standard layout and get a review pass (Claude lists which need a rebuild). Widget candidates for lessons with none: 101-04 Three Discovery Questions, 101-07 Stop Turn Tell Receive, 203-02 prayer card, 203-03 listening; Dave decides, Claude or Grok builds.

## Lanes and queues (take the top item of your lane)

### ChatGPT (GPT 6.1)
1. TOOLING-001: add a `package.json` in `discipleship/` that pins `sharp` (and Playwright for the browser checks) as dev dependencies, with a short README line, so any agent can `npm install` in a fresh worktree and run `build_lesson_images.js` and the browser checks. Do not commit `node_modules`; add it to `.gitignore`.
2. 101 fix 2: include chapter notes in Email Lesson.
3. 101 fix 3: retry when a chapter of John fails to download.
4. 101 fix 4: keyboard-accessible chapter headers and labeled notes fields in the reader.
5. TRIM-SERIES, one lesson per PR, light touch, in this order (longest and most-read first): 101-04, 202-05, 201-10, 203-05, 101-07, 101-01, 101-05, 201-05, 201-06, 201-09, 202-01, 202-03, 202-06, 203-02, 203-03, 201-04 (light), 201-07 (light). In each PR: bring the lesson under about 1,400 words, apply "How Dave edits," and **propose** in the PR body (do not change) a one-line version of any question over about 20 words and one teach-it question. Claude words those with Dave and adds them.
6. After the trims: rerun the scorecard script (Claude will add it to scripts/) and report which lessons are AAA.

### Gemini (Gemini 4)
1. Story art, one lesson per PR, in this order: 202-03, 202-05, 202-06, 202-07, 202-01, 201-05, 101-04, 101-07, 101-03, 101-01. Charcoal style, sequence or dissolve per `story-image.md`, optimizer run, lesson text untouched. For 101-01 and 201-05 the existing plain picture may be replaced.
2. DOCS-STANDARD: update `LESSON-TEMPLATE.md` (101 closing is four questions), `AI-LESSON-CHECKLIST.md` (new exemplars 202-08, 202-09, 202-10, 203-06, 203-09, 203-08; teach-it question; never name a widget in prose), and `DISCIPLESHIP-COMPASS.md` (the seven-point standard). Source: plan section "Documents to update".
3. Keep the inventory in `story-image.md` current as art lands.

### Grok
1. Story art for 203, one lesson per PR: 203-06 (#155 in review), then 203-07, 203-03, 203-09, 203-10, 203-01, 203-02, 203-08. Same rules as Gemini's lane: charcoal style, sequence or dissolve, optimizer run, lesson text untouched.
2. Widget builds only from a spec Claude posts here, after Dave picks from the widget candidates in the scorecard.

### Claude (Fable 5.1)
1. Review every PR within the day it opens: checks, preview on a phone-size screen, the plan checklist, Dave's editing patterns. Post a verdict for Dave: merge, or what to change.
2. Word every new or changed question with Dave, including the teach-it questions ChatGPT proposes, and the proposals for 202-08 and 202-09.
3. Old widget review pass: great-command, great-exchange3, grace-diagram, bible-bookshelf, biblical-storyline, learning-circle2, fruit-of-spirit, three-circles, five-gardeners, cornerstone, stewardship-flip. List which need a rebuild like romans-road2; Dave picks; Claude builds, or writes a spec for Grok.
4. Add `scripts/aaa_scorecard.js` so any agent can regenerate the table above.
5. Keep this board, TASKS, DAVE.md and HANDOFF current. Take anything that touches Dave's voice, sign-in, Firebase or the workflows.

## Review order

Claude reviews in this priority: anything blocking a learner (broken page, lost answers) first, then content Dave asked for by name, then the lanes in the order above. Dave merges one PR at a time with "merge it", or several with "merge all".

## How to add to this board

Any agent may add a row under "Proposed" in TASKS.md. Only Claude moves work onto a lane here, after Dave agrees.
