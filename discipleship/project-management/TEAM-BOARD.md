# Growing Together Team Board

Started 2026-11-12 at Dave's request. This is the one page every agent reads before working. Dave Partin owns the content and final pastoral approval. Claude (Fable 5.1) is the usual director; ChatGPT/Codex is temporarily covering coordination and reviewed merges under Dave's delegation below. New question wording and changes to Dave's voice still go to Dave for approval.

## Temporary coordinator, 2026-11-12

Claude is unavailable. Dave asked ChatGPT/Codex to lead and confirmed: "Merge reviewed, passing PRs." Only the acting coordinator has this merge delegation. Other agents still push one job per PR and stop for review. Use separate worktrees, verify process exit codes and previews, and let the automatic Actions deploy. No manual deployment or force push. This temporary arrangement ends when Dave restores Claude or changes the instruction; it does not confer lesson, theology, or personal art approval.

Integrated after coordinator review: #161 tooling, #155 Daniel story art for 203-06, and #162 early-church art for 202-03. Checks and automatic deployments pass. Evidence: logs/2026-11-12-COORD-003-codex.md. Older #28 and #68 need a fresh current-state review; #2 is outside this discipleship assignment.

Companion documents: `HANDOFF.md` (how the system works), `TASKS.md` (the task rows), `reviews/2026-11-11-series-review.md` (the lesson standard and Dave's editing patterns), `DAVE.md` (approvals), `logs/` (evidence).

## The team

| Agent | Model | Lane | Branch prefix |
|---|---|---|---|
| Dave | | Reads previews on his phone, sends revisions, says "merge it" | |
| Claude | Fable 5.1 | Usual director, currently unavailable. New voice/question wording remains subject to Dave's approval. | `claude/` |
| ChatGPT | GPT 6.1 | Acting coordinator and reviewer under the temporary delegation; code and mechanics remain its implementation lane. | `codex/` |
| Gemini | Gemini 4 | Story art for 201 and 202, and the documentation set (templates, checklist, compass) | `gemini/` |
| Grok | Grok | Story art for 203 and 101, widget art and polish | `cursor/` or `grok/` |

## Standing rules for every agent

1. Work in your own git worktree or branch, never in the main checkout at `~/github/ministrybag1`. Push, open a PR, wait. Merge publishes both sites. Only the acting coordinator may merge reviewed, passing PRs under Dave's temporary delegation; other workers must stop. No agent deploys by hand.
2. One job per PR. Run from `discipleship/`: `bash scripts/qa_foundation.sh`, `node scripts/test_lesson_export.js`, `node scripts/test_answer_storage.js`, `node scripts/check_lesson_assets.js`, plus `node scripts/test_lesson_images.js` for images and `node scripts/test_widget_iframe.js` for widgets. Paste the results in the PR.
3. Write a log in `logs/YYYY-MM-DD-<ID>-<agent>.md` and add or update your TASKS row. The acting coordinator maintains the boards and DAVE.md; delegated integration is not a new pastoral or personal art approval.
4. The Firebase Action posts the preview link on the PR within a few minutes. Put the lesson hash on it when you report to Dave, for example `#201-3`.
5. Lesson text: read the standard and "How Dave edits" in the review plan first. Do not change a question Dave has approved; propose the new wording in the PR and let the current coordinator take it to Dave. No em dashes, never the words "record", "arc" or "gives way". One bold line per section at most.
6. Images: run `node scripts/build_lesson_images.js` so new art ships as small WebP copies, keep originals, and follow `story-image.md` for sequences and stops.
7. Never store Dave's email, keys or passwords in the repo. Never touch Firebase configuration, workflows or the sign-in code without a task from Claude.
8. If you are blocked or the task changes shape, stop and write it in the PR instead of guessing.

## Lessons learned (read these, they cost us time)

- **Install the pinned tools in each worktree.** TOOLING-001 merged as #161. From `discipleship/`, run `npm ci` for sharp and Playwright; no desktop-specific NODE_PATH is needed. See README.md for Node and browser prerequisites. If a build prints only a Node version line, it crashed and wrote nothing. Check the process exit code and generated outputs before committing.
- **Check exit codes, not the last line.** `bash scripts/qa_foundation.sh | tail -1` always exits 0. Run the script, then `echo $?`, or use `set -o pipefail`. Claude merged a red asset map on 2026-11-12 because of this.
- **Do not edit the image list by hand.** Since #154 the build script finds every file in `images/` on its own. Art PRs add the image files, run the build, and commit the regenerated `scripts/lesson-image-assets.js`. Two art PRs editing the list at once caused a conflict on 2026-11-12.
- **Parse-check widget scripts.** An apostrophe inside a single-quoted string took a widget down for one preview build. Run `node --check` on each inline script, or write text with double quotes.

## AAA scorecard (37-lesson production audit)

Refreshed November 12, 2026 against main `d9065c7`, including #155, #162 and #164. Full [scorecard, rubric and measured inventory](reviews/2026-11-12-aaa-37-scorecard.md). All 37 lessons are substantive drafts. **Overall: 86.8%, about 87%, toward the scored production standard; three AAA (A+) lessons and seven at 95%.**

Ten production checkpoints score 0/5/10 each. **100 = AAA (A+), 95 = A, 90 = A-, 85 = B+, 80 = B, 75 = B-, 70 = C+.** These are current production-completeness estimates, not hours-left, new pastoral/art approval, or release/pilot readiness. The previous "7 AAA" summary was inconsistent with its own six marked rows; the current count below uses one explicit rubric. No approved lesson wording is changed by a grade.

| Lesson | Toward AAA | Grade | Remaining Work / Next Action |
|---|---:|---|---|
| 101-01 | 85% | B+ | Trim repeated introduction and mentor material; remove promised audio; add a pass-it-on question; settle opener art. |
| 101-02 | 95% | A | Reduce five questions to three or four. The explain-to-a-friend question already exists (2.3). |
| 101-03 | 75% | B- | Add story art and a teach-it question; reduce five questions. Daily Prayers already supplies the reusable tool. |
| 101-04 | 75% | B- | Move Nicodemus into an opening story; add art; trim repeated framing; reduce five questions. Keep Discovery Questions and 4.5. |
| 101-05 | 85% | B+ | Let the potluck carry the lesson; add a teach-it question. The service checklist counts as its tool. |
| 101-06 | 95% | A | Propose shorter versions of 6.2/6.4; preserve Dave's wording until he approves. No new widget is required. |
| 101-07 | 75% | B- | Add story art and a teach-it question; light trim. Stop, Turn, Tell, Receive is already a usable exercise. |
| 201-01 | 95% | A | Finish the queued great-command widget review; keep the existing explain-it question. |
| 201-02 | 95% | A | Finish the queued great-exchange3 widget review; existing 2.2 already teaches the idea back. |
| 201-03 | 100% | AAA (A+) | No known production gap in this rubric; retain GUIDE and the existing explain-it question. |
| 201-04 | 85% | B+ | Light trim and add a teach-it question; keep Gospel Heart and the completed root sequence. |
| 201-05 | 75% | B- | Replace plain story art; trim reliability/translations material; add teach-it; review bookshelf widget. |
| 201-06 | 90% | A- | Trim the extra resource and repeat framing; review storyline widget. Existing 6.4 is already teach-it. |
| 201-07 | 90% | A- | Reduce five questions; turn the strong practice/sharing section into an explicit teach-it question. |
| 201-08 | 85% | B+ | Add teach-it and complete grace-diagram review; keep any remaining theology/wording decisions with Dave. |
| 201-09 | 80% | B | Trim the pruning detour; simplify the long question by proposal; add teach-it; review fruit widget. |
| 201-10 | 75% | B- | Move the story earlier; trim the opening/repeats; add teach-it; review circle widget/setup and translation labels. |
| 202-01 | 75% | B- | Use one story-art treatment; trim stacked teaching and widget setup; propose simpler questions plus teach-it. |
| 202-02 | 100% | AAA (A+) | No known production gap in this rubric; preserve the three R's, family roles and teach-it question. |
| 202-03 | 90% | A- | Retell the formal church-definition paragraph plainly; add teach-it. New early-church art is integrated. |
| 202-04 | 100% | AAA (A+) | No required production gap in this rubric; optional shorter lead-in/4.4 can be proposed without replacing Dave's wording. |
| 202-05 | 70% | C+ | Add Joseph art; combine repeated suffering sections and widget setup; reduce five questions and add teach-it. |
| 202-06 | 85% | B+ | Add midnight-prison story art; reduce five questions. 6.2 already asks for worship in the learner's own words. |
| 202-07 | 75% | B- | Add widow story art and teach-it; review stewardship widget. The Generosity Ladder is already present. |
| 202-08 | 90% | A- | Propose one teach-it question for Dave; keep his approved covenant/chisel wording. |
| 202-09 | 85% | B+ | Propose shorter 9.1/9.2 and a teach-it question; do not replace approved questions without Dave. |
| 202-10 | 95% | A | 10.4 names an observer but not what the learner would explain; propose an explicit teach-it version for Dave. |
| 203-01 | 85% | B+ | Upgrade plain mountain art; add a teach-it question tied to the ministry map. |
| 203-02 | 90% | A- | Upgrade plain Nehemiah art and trim the performance section; make the prayer-card step stand alone without an earlier map. |
| 203-03 | 90% | A- | Add Emmaus/table story art; keep the two practical tools; make the prayer-card reference self-contained. |
| 203-04 | 95% | A | Propose shorter 4.2/4.3 without losing Dave's wording. The time/talents/treasure exercise is sufficient; no widget is required. |
| 203-05 | 90% | A- | Trim bridge/faithfulness repetition and the lengthy walkthrough; review three-circles setup/widget. Existing draw-it step is strong. |
| 203-06 | 95% | A | Make the prayer-name application an explicit pass-it-on step by proposal. Daniel art and age clarification are live; art approval remains separate. |
| 203-07 | 90% | A- | Add story art for Jesus sending the 72. Verse-sharing in 7.4 already passes the transfer test. |
| 203-08 | 90% | A- | Finish Paul/Timothy color art; propose shorter questions for Dave. Keep his accepted longer lesson and SPACES. |
| 203-09 | 85% | B+ | Add Priscilla/Aquila art; strengthen the mission-choice question into an explicit teach-it step by proposal. |
| 203-10 | 80% | B | Add art for the current body-of-Christ story and teach-it; reconcile older Bezalel metadata without changing lesson scope. |

Current inventory: 21 lessons have sequence/dissolve art, six have plain pictures needing an upgrade, ten have no story art. The 16 art assignments remain nine Gemini and seven Grok. Six lessons have five mid-lesson questions: 101-02, 101-03, 101-04, 201-07, 202-05, 202-06. Transfer is strong/present in 16, implicit/weak in four, missing in 17; use the linked report instead of the older teach-it list. In particular, 101-02 2.3 and 202-06 6.2 already provide transfer; 202-10, 203-06 and 203-09 need clearer transfer proposals.

Shared checks currently pass: foundation QA, export 143, storage 64, assets 102, lesson images 1075, widget iframe 32, public-site browser 387; each process exited 0. This does not finish the older-widget review or physical-device/pilot gates. The older-widget review remains queued; no new widget is mandatory where an exercise works. Optional candidates remain 101-04 Three Discovery Questions, 101-07 Stop Turn Tell Receive, 203-02 prayer card and 203-03 listening; Dave decides.

## Lanes and queues (take the top item of your lane)

### ChatGPT (GPT 6.1)
1. 101 fix 2: include chapter notes in Email Lesson. TOOLING-001 is done in #161.
2. 101 fix 3: retry when a chapter of John fails to download.
3. 101 fix 4: keyboard-accessible chapter headers and labeled notes fields in the reader.
4. TRIM-SERIES, one lesson per PR, light touch, in this order (longest and most-read first): 101-04, 202-05, 201-10, 203-05, 101-07, 101-01, 101-05, 201-05, 201-06, 201-09, 202-01, 202-03, 202-06, 203-02, 203-03, 201-04 (light), 201-07 (light). In each PR: bring the lesson under about 1,400 words, apply "How Dave edits," and **propose** in the PR body (do not change) a one-line version of any question over about 20 words and one teach-it question. Dave approves any new wording.
5. After the trims: rerun the scorecard script once available and report which lessons are AAA.

### Gemini (Gemini 4)
1. Story art, one lesson per PR, in this order: 202-05, 202-06, 202-07, 202-01, 201-05, 101-04, 101-07, 101-03, 101-01. 202-03 art is integrated in #162. Charcoal style, sequence or dissolve per `story-image.md`, optimizer run, lesson text untouched. For 101-01 and 201-05 the existing plain picture may be replaced.
2. DOCS-STANDARD: update `LESSON-TEMPLATE.md` (101 closing is four questions), `AI-LESSON-CHECKLIST.md` (new exemplars 202-08, 202-09, 202-10, 203-06, 203-09, 203-08; teach-it question; never name a widget in prose), and `DISCIPLESHIP-COMPASS.md` (the seven-point standard). Source: plan section "Documents to update".
3. Keep the inventory in `story-image.md` current as art lands.

### Grok
1. Story art for 203, one lesson per PR: 203-07, 203-03, 203-09, 203-10, 203-01, 203-02, 203-08. 203-06 art is integrated in #155. Same rules as Gemini's lane: charcoal style, sequence or dissolve, optimizer run, lesson text untouched.
2. Widget builds only from a spec Claude posts here, after Dave picks from the widget candidates in the scorecard.

### Coordinator (Codex temporarily)
1. Review every PR within the day it opens: checks, preview on a phone-size screen, the plan checklist, Dave's editing patterns. Post a verdict for Dave: merge, or what to change.
2. Word every new or changed question with Dave, including the teach-it questions ChatGPT proposes, and the proposals for 202-08 and 202-09.
3. Old widget review pass: great-command, great-exchange3, grace-diagram, bible-bookshelf, biblical-storyline, learning-circle2, fruit-of-spirit, three-circles, five-gardeners, cornerstone, stewardship-flip. List which need a rebuild like romans-road2; Dave picks; Claude builds, or writes a spec for Grok.
4. Add `scripts/aaa_scorecard.js` so any agent can regenerate the table above.
5. Keep this board, TASKS, DAVE.md and HANDOFF current. Take anything that touches Dave's voice, sign-in, Firebase or the workflows.

## Review order

The acting coordinator reviews in this priority: anything blocking a learner (broken page, lost answers) first, then content Dave asked for by name, then the lanes in the order above. Under the current delegation, Codex merges reviewed, passing PRs one at a time and verifies the automatic deployments. Dave can change or end the delegation. Coverage is manual in the current chat; no background monitor is configured.

## How to add to this board

Any agent may add a row under "Proposed" in TASKS.md. Only the current coordinator moves work onto a lane here, after Dave agrees.
