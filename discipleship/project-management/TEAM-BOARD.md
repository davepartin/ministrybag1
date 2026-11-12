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

## Lanes and queues (take the top item of your lane)

### ChatGPT (GPT 6.1)
1. TOOLING-001: add a `package.json` in `discipleship/` that pins `sharp` (and Playwright for the browser checks) as dev dependencies, with a short README line, so any agent can `npm install` in a fresh worktree and run `build_lesson_images.js` and the browser checks. Do not commit `node_modules`; add it to `.gitignore`.
1b. PERF-001b: done (#154).
2. 101 fix 2: include chapter notes in Email Lesson (per Dave's choice; Save PDF is the blank-course placeholder now).
3. 101 fix 3: retry when a chapter of John fails to download.
4. 101 fix 4: keyboard-accessible chapter headers and labeled notes fields in the reader.
5. TRIM-SERIES: the 13 light trims in plan section B, one lesson per PR, in this order: 101-01, 101-04, 101-05, 201-05, 201-06, 201-09, 202-01, 202-03, 202-05, 202-06, 203-02, 203-03, 203-05. Light touch only. Where a lesson needs a teach-it question (plan section C), propose it in the PR; Claude will word it with Dave.

### Gemini (Gemini 4)
1. Story art, 201 and 202, in this order: 201-09, 202-03, 202-05, 202-06, 202-07. Charcoal style, sequence or dissolve per `story-image.md`, optimizer run, one lesson per PR.
2. DOCS-STANDARD: update `LESSON-TEMPLATE.md` (101 closing is four questions), `AI-LESSON-CHECKLIST.md` (new exemplars 202-08, 202-09, 202-10, 203-06, 203-09, 203-08; teach-it question; never name a widget in prose), and `DISCIPLESHIP-COMPASS.md` (the seven-point standard). Source: plan section "Documents to update".
3. Keep the inventory in `story-image.md` current as art lands.

### Grok
1. Story art, 203, in this order: ART-004 203-06, 203-07, 203-03, 203-09, 203-10. Then ART-008 203-08 and any 101 lesson still without art.
2. Widget art and polish only when Claude posts a task here.

### Claude (Fable 5.1)
1. Review every PR within the day it opens: checks, preview on a phone-size screen, the plan checklist, Dave's editing patterns. Post a verdict for Dave: merge, or what to change.
2. Word every new or changed question with Dave.
3. Keep this board, TASKS, DAVE.md and HANDOFF current.
4. Take anything that touches Dave's voice, sign-in, Firebase or the workflows.

## Review order

Claude reviews in this priority: anything blocking a learner (broken page, lost answers) first, then content Dave asked for by name, then the lanes in the order above. Dave merges one PR at a time with "merge it", or several with "merge all".

## How to add to this board

Any agent may add a row under "Proposed" in TASKS.md. Only Claude moves work onto a lane here, after Dave agrees.
