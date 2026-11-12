# Growing Together Team Board

## Current standing roles: Dave's instruction, November 12, 2026

This is the current operating setup until Dave changes it. Dave finalized these roles in conversation and explicitly asked Codex to post them here so every agent can read the same instructions. This section supersedes conflicting temporary-director, night-shift, lane and merge-authority passages below and in older handoffs. Historical task evidence and completed work remain valid.

| Agent | Standing responsibility |
|---|---|
| GPT / Codex | Technical lead and integration owner: site reliability, saved answers, accessibility, technical tests, PR and preview verification, merging reviewed and approved work, and checking automatic deployments. |
| Claude / Fable | Editorial and design direction, lesson wording with Dave, and team-board organization. |
| Gemini | Widget design and implementation, one bounded assigned widget at a time. |
| Grok | Primary story artwork and image-sequence artist across the series, maintaining the style Dave approves. |
| Dave | Priorities and final pastoral, lesson wording, personal artwork and release approval. |

### How these roles work together

- Each worker uses an isolated branch/worktree, claims a bounded task, commits and pushes its own work, and opens one job per PR. Workers stop at REVIEW.
- Codex has standing technical merge authority for reviewed, passing work. This replaces the previous temporary or night-only delegation; a separate "night shift on" instruction is not required. Codex checks the diff, real test exit codes, applicable phone/keyboard/image behavior and the Action preview, then verifies the automatic live deployment after merging.
- Technical merge authority does not approve unseen lesson wording, theology, personal artwork or a release on Dave's behalf. Dave's applicable approvals must be present before publishing that work.
- Claude coordinates editorial/design work and maintains the board with Dave. Codex owns technical integration; this split does not make Codex the editorial director.
- Gemini's Google affiliation does not itself grant Firebase access. Use connected tools and granted permissions, not product affiliation, to determine access.
- Firebase settings, billing, retention, preview deletion, hosting configuration and workflows remain outside this role change. Dave's instruction to leave Firebase unchanged remains in force unless he explicitly changes it. Use the existing automatic publishing process; no manual deployment.
- The older art assignments to Gemini, widget-build assignments to Grok, and standing prose-trim queue for Codex below are superseded as future default lanes. Preserve in-progress work and existing PRs; do not discard, duplicate or silently take over a claimed task. Reconcile individual task ownership on the board before starting another job.
- Keep lessons, question IDs, reading keys, saved answers and WEB text intact outside an expressly assigned change. No course PDFs and no new 101-06 changes are authorized here.
- These are standing responsibilities, not an instruction to launch background agents or begin every backlog item. Dave may assign exceptions.

This update changes coordination documentation only. It does not merge an existing implementation PR or claim that an earlier preview, test or deployment passed.

## Content source for Claude: 202-05 suffering

Dave asked Codex to preserve his spoken thoughts for future writing in [202-05: Dave's collected thoughts on suffering](reviews/2026-11-12-202-05-dave-content-collection.md). Read this before drafting 202-05. It captures three possible suffering categories, sharing Christ's sufferings, future glory, peace in God's presence, suffering versus punishment, Job's limited perspective, the stained-glass idea, refining, empathy and resilience. Dave's ideas are distinguished from Codex's research suggestions. This is source material, not final wording approval or an instruction to build a widget. Claude owns the editorial follow-up under the standing roles.

Update, November 12: Claude redrafted `data/202-05.json` from this collection on branch `claude/dazzling-brown-x7g9um`. The phrase is "Trust the Artist"; the mosaic is taught in prose and the Valley Road widget is unchanged. It waits for Dave's read and is not merged. TRIM-202-05 is superseded; do not trim this lesson separately. The mosaic widget is still unassigned. Details and the candidate widget brief: [rework log](logs/2026-11-12-L-202-05-REWORK-claude.md).

## Content source for Claude and Gemini: 202-07 stewardship

Dave wants time, talents and treasure to become the memorable center of 202-07, with whole-self stewardship rather than money alone. He proposed replacing the upside-down bills treatment with a stool drawn from three Ts: the upper strokes form a triangular seat and the stems become three legs. Read [Dave's stewardship and three-T stool direction](reviews/2026-11-12-202-07-dave-stewardship-stool.md) before drafting or building. The note includes Dave's actual words and candidate design steps. Claude develops wording with Dave; Gemini handles a separately claimed widget packet; Codex verifies integration. 203-04 already applies the three Ts to serving and remains unchanged. This is collected direction, not a completed widget assignment or approval of unseen copy.

## Current worker checkpoint from Dave: November 12, 2026

This newer checkpoint updates the session-summary next actions below. Distinguish Dave-reported work from GitHub-verified state.

| Work | Current owner and checkpoint | Next technical step |
|---|---|---|
| 202-05 suffering rewrite | Located Claude's complete draft and exact log on claude/dazzling-brown-x7g9um, head 5eb9867. Codex opened [PR #195](https://github.com/davepartin/ministrybag1/pull/195) without changing Claude's prose. The earlier missing-location concern is resolved. | Required suites pass; Firebase Action 43316715906 succeeds; 18 local and 18 preview render/data checks pass. REVIEW HOLD: removing 5.5 hides existing responses from page/Email, although storage remains intact. Resolve access and Dave's wording/source/widget decisions before publishing. |
| 202-07 stewardship widget | Gemini's [PR #193](https://github.com/davepartin/ministrybag1/pull/193), head 0334043, independently reviewed by Codex: required suites and iframe 32 pass; 64 hosted browser checks pass across 375/390/1280, keyboard/reduced motion/scroll safety included. Non-widget lesson data exactly unchanged. | Technical review passes within tested scope. Dave visual/copy approval remains pending; coordinate whole-self prose before calling the lesson complete. No merge performed. |
| 202-07 lesson wording | Dave identifies Claude / Fable 5.2 as the writer. The Codex [proposal in #192](https://github.com/davepartin/ministrybag1/pull/192) remains source/review material, not the approved replacement. Claude's current token limitation must be accounted for; no newly completed 202-07 rewrite is claimed. | Preserve the existing manuscript and Dave's notes until Claude resumes or Dave assigns a bounded continuation to another worker. Do not duplicate the lesson rewrite silently. |
| 202-06 worship story art | Dave reports Grok is producing two first drafts of the base frame. This is the current image assignment. | Wait for Dave's visual direction and the published art packet before technical integration. Do not confuse these drafts with the separate worship mirror-widget PR or reopen old art as a second job. |

Review links: [202-07 stool](https://growing-together-discipleship--pr193-gemini-widget-202-zjcqohhq.web.app#202-7) and [202-05 suffering](https://growing-together-discipleship--pr195-claude-dazzling-b-7qlvh9r9.web.app#202-5). Independent evidence: [Codex review log](logs/2026-11-12-REVIEW-193-195-codex.md). Both Action previews succeeded. Source code was unchanged during review; no merges or Firebase settings changes.

## Dave and Codex working session: November 12, 2026

Dave asked for this summary so every agent can pick up the same decisions. Four lessons received substantive discussion; two have review drafts, one has a collected content source, and one received direction to preserve its depth. None of these conversations alone approves final lesson wording or artwork.

| Lesson | What Dave clarified or requested | Material / current status | Next owner and action |
|---|---|---|---|
| 202-05 Suffering and Trials | Keep Joseph and Genesis 50:20 central, with a mosaic/stained-glass picture of our limited view and God's greater purpose. Teach three or fewer kinds of suffering, sovereignty/providence, peace within pain, Christ's sufferings and future glory, refining and practical care. Honor real pain; a lesson should be a salve, with companionship and mourning alongside those who mourn. Use fewer well-developed Scripture passages. | [Content collection with Dave's own words](reviews/2026-11-12-202-05-dave-content-collection.md), organized into seven preparation themes. No live rewrite or new widget built. | Claude develops a focused manuscript with Dave. The mosaic remains a candidate widget idea, not a launched Gemini/Grok job. Verify recalled Piper attribution before using it. |
| 101-04 The Bible | Preserve why Scripture matters and the Three Discovery Questions exercise; shorten repeated setup because three John chapters already add reading load. Nicodemus should open the story and revisit John 3 from the learner's earlier reading. Keep the connection to 201's map/story/OIA progression. Proposed two-image oil-lamp reveal recalls Psalm 119:105. | [PR #191](https://github.com/davepartin/ministrybag1/pull/191), head ef04432: 1,514 to 1,167 words; all nine question objects, three existing verse blocks and John 10-12 unchanged. Required suites pass; Action preview succeeds; 30 local and 30 preview browser checks pass, actual exits 0. Additional lamp/Psalm direction is in the PR comments and is not yet in the draft. | Dave/Claude review exact prose and the five-question exception. Grok owns a separately claimed Nicodemus art packet. Psalm 119:105 and proposed connecting prose still need wording review. No merge performed. |
| 201-10 Repentance and the Learning Circle | Dave values the existing tool and its healthy teaching. As the final 201 lesson, it can appropriately challenge learners with more depth. Preserve that depth; assess whether the follow-up helps someone learn the tool or unnecessarily makes them learn it twice. | Discussion only. No revision, widget rebuild, question change or new audit completed. Earlier B-minus is not an instruction to simplify away the tool. | Claude/Dave review flow when this packet is assigned. Do not start a rewrite from the old grade alone. |
| 202-07 Giving and Generosity | Dave explicitly called for a rewrite. Stewardship comes first: caring for what belongs to God. Main framework: time, talents, treasure, one whole life entrusted to Him. Replace the draft upside-down bills concept with a stool built from three Ts. Faithfulness with little does not promise wealth; Dave explicitly rejects prosperity teaching and affirms faithful people in poverty. | [Source words and concept](reviews/2026-11-12-202-07-dave-stewardship-stool.md). [PR #192](https://github.com/davepartin/ministrybag1/pull/192) contains a complete 1,210-word review manuscript, proposed questions mapped to existing IDs, and a Gemini widget brief. Required baseline suites pass, actual exits 0. Markdown only; current JSON/widget unchanged. Action result will be posted on the PR. | Dave/Claude review manuscript and the proposed ladder/question changes. Gemini claims the bounded stool widget implementation after brief review. Codex verifies integration. Preserve Grok's separate widow-art PR #181. 203-04 already uses the three Ts for serving and remains unchanged. |

### Other outcomes from this conversation

- Standing team roles are established at the top of this board: Codex technical integration; Claude editorial/design direction and board organization; Gemini widgets; Grok story art/sequences; Dave final priorities, pastoral/wording/art/release approval.
- GitHub is the current source of truth; Dave said he is working in the cloud. Do not require Mac access to continue ordinary repo work.
- The 37-lesson scorecard is a dated production estimate, not final pastoral approval. Correction: 203-10 was B, not C-plus. 202-05 was the C-plus.
- Other B-minus lessons discussed as possible later conversations: 101-03 prayer, 101-07 repentance, 201-05 Bible overview, 202-01 loving neighbors. These mentions are not new implementation assignments or fresh audits. Read current files before recommending repairs.
- Work remains one bounded job per PR. 101-04 is at REVIEW; 202-07 is a manuscript/widget proposal at REVIEW. No live lesson changes, manual deployment or Firebase configuration changes were performed for these packets.

## Earlier board and task history

The following sections retain prior assignments and dated evidence. Read them subject to the current standing roles above.

Started 2026-11-12 at Dave's request. This is the one page every agent reads before working. Dave Partin owns the content and final pastoral approval. Claude (Fable 5.1) is the usual director; ChatGPT/Codex is temporarily covering coordination and reviewed merges under Dave's delegation below. New question wording and changes to Dave's voice still go to Dave for approval.

## Temporary coordinator, 2026-11-12 (ended; see Batch 1 note)

**Update, 2026-11-12 morning:** Claude is back and reviewing again. The night-shift delegation (ChatGPT merges reviewed, passing art and reader fixes while Dave sleeps, never lesson wording) continues only if Dave says so; until he does, PRs stop at REVIEW for Claude and Dave.

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

- **The art is one look, Dave's marker-sketch look, and it drifted on 2026-11-12.** Read "The look" and "Already made: check before you generate" at the top of `story-image.md` before any art job. Attach `images/good-samaritan-story.jpg` as the style reference when generating. Black ink, grey marker, white paper, at most one or two small color accents. No full-color paintings, no sunsets, no storybook faces. Never replace a file Dave drew without his word; several of his finished pieces were replaced by generated scenes this week.

- **Firebase hosting storage is finite (10 GB on the free plan) and every preview is a full copy of the site.** On 2026-11-12 fifty preview channels filled it and new previews were refused with HTTP 429. Claude deleted the 48 channels of merged PRs with Dave's approval; previews now expire after 3 days; original JPG and PNG files are no longer uploaded to hosting because every lesson serves the WebP copies (the originals stay in the repo and on ministrybag.com). If a 429 appears again: do not delete anything yourself; tell Dave and Claude. Dave can also lower "release storage settings" in the Firebase console (Hosting, Usage) so old live versions are pruned automatically.
- **Claim before you start.** Put your name on the TASKS row (owner column) and push that row in your first commit before generating art or code. On 2026-11-12 Grokbot worked Gemini's queue under a gemini/ branch name; the work was good but two bots could easily have done the same lesson.

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

## Batch 1 (November 12, overnight): complete

All nine jobs merged: ART-202-05 Joseph, ART-203-07 Sends the 72, ART-203-03 Emmaus, READ-101-NOTES, READ-101-RETRY, READ-101-A11Y, plus 202-03 and 203-06 art and TOOLING-001. Claude is back as reviewer. The night-shift merge delegation to ChatGPT applies only when Dave says "night shift on" for that night.

## Batch 2: an A in every lesson (opened November 12, 2026)

Goal from Dave: every one of the 37 lessons at an A on ChatGPT's audit (`reviews/2026-11-12-aaa-37-scorecard.md`), then AAA. Today 3 lessons are AAA, 8 are A, 9 are A-, and 17 sit at B+ or below. This batch goes after the lowest grades first. Same rules as Batch 1: one job per PR, your own worktree, claim the TASKS row in your first commit, checks with exit codes, `npm ci` then `node scripts/build_lesson_images.js` for any art, stop at REVIEW. Nobody but Claude words a question; proposals go in the PR body.

| Agent | Order | Task ID | Lesson (grade) | Job and acceptance |
|---|---:|---|---|---|
| ChatGPT | 1 | TRIM-202-05 | 202-05 Suffering (C+) | SUPERSEDED 2026-11-12 by Claude's redraft from Dave's direction (see top of board); skip to TRIM-101-04. Original brief: Joseph art is in. Combine the repeated suffering sections and the widget set-up, bring the lesson under 1,400 words, and in the PR body propose which of the five questions to drop and one teach-it question. Text only; no art, no widget edits. |
| ChatGPT | 2 | TRIM-101-04 | 101-04 The Bible (B-) | Center the lesson on the Three Discovery Questions and the practice; cut repeated framing; under 1,400 words; propose which of five questions to drop (keep 4.5). Leave room for the Nicodemus opening story that Gemini's art will illustrate. |
| ChatGPT | 3 | TRIM-201-10 | 201-10 Repentance (B-) | Move the prodigal story earlier, trim the opening and repeats, under 1,400 words, propose a teach-it question. Keep the Learning Circle steps and credits. |
| Gemini | 1 | ART-202-01 | 202-01 Neighbors (B-) | Replace the plain picture with one charcoal treatment (dissolve or sequence) for the lesson's actual story. New art and image block only. |
| Gemini | 2 | ART-201-05 | 201-05 Overview of the Bible (B-) | Replace the plain story art with a charcoal treatment of the lesson's story. Do not touch the bookshelf widget; Claude reviews it. |
| Gemini | 3 | ART-101-04 | 101-04 The Bible (B-) | Charcoal dissolve for Nicodemus coming to Jesus at night (John 3), to sit as the opening story. Coordinate with ChatGPT's TRIM-101-04 only by merge order; do not edit prose. |
| Grok | 1 | ART-202-06 | 202-06 Worship (B+) | Paul and Silas at midnight, the pair Grok already generated. Wire, optimize, check, PR. |
| Grok | 2 | ART-202-07 | 202-07 Generosity (B-) | The widow's two coins, the pair Grok already generated. Wire, optimize, check, PR. |
| Grok | 3 | ART-203-09 | 203-09 Missions (B+) | Priscilla and Aquila at the tentmaking bench, charcoal dissolve. |
| Claude | 1 | QUESTIONS-A | all | Word with Dave the teach-it questions and shorter questions the audit asks for: 101-05, 201-04, 201-07, 201-08, 202-03, 202-08, 202-09, 202-10, 203-01, 203-04, 203-06, 203-09, and the proposals ChatGPT files. One PR per course. |
| Claude | 2 | WIDGET-REVIEW | 201-01, 201-02, 201-05, 201-06, 201-08, 201-09, 201-10, 202-07, 203-05 | Review each pre-standard widget on a phone; list rebuild or keep; Dave picks; Claude rebuilds like romans-road2. |
| Claude | 3 | SCORECARD-SCRIPT | all | `scripts/aaa_scorecard.js` so the grade table regenerates from the lesson files. |

After this batch, the next grades to lift are 101-03, 101-07, 203-10, 201-09, 101-01, 203-02 and 203-08 art, then the A- lessons' light trims (201-06, 201-07, 202-03, 203-02, 203-05). Those are the lane backlogs below.

### ChatGPT (GPT 6.1)
1. Batch 2: TRIM-101-04, TRIM-201-10, in that order (TRIM-202-05 superseded by Claude's redraft).
2. Backlog, one lesson per PR, light touch: 201-05, 202-01, 101-07, 101-01 (also remove the sentence promising audio), 101-05, 201-09, 201-06, 201-07, 202-03, 203-02, 203-05, 202-06, 203-03. In each PR, propose question changes and a teach-it question in the body; never change an approved question.
3. After the trims: run the scorecard script and report which lessons are A and AAA.

### Gemini (Gemini 4)
1. Batch 2: ART-202-01, ART-201-05, ART-101-04, in that order.
2. Backlog art: 101-07, 101-03, 101-01.
3. DOCS-STANDARD: update `LESSON-TEMPLATE.md` (101 closing is four questions), `AI-LESSON-CHECKLIST.md` (new exemplars 202-08, 202-09, 202-10, 203-06, 203-09, 203-08; teach-it question; never name a widget in prose), and `DISCIPLESHIP-COMPASS.md` (the seven-point standard).
4. Keep the inventory in `story-image.md` current as art lands.

### Grok
1. Batch 2: ART-202-06, ART-202-07, ART-203-09, in that order.
2. Backlog art: 203-10, 203-01, 203-02, 203-08 (Paul and Timothy color layer).
3. Widget builds only from a spec Claude posts here, after Dave picks from the widget candidates.

### Claude (Fable 5.1)
1. Review every PR the day it opens: checks with exit codes, preview on a phone-size screen, the plan checklist, Dave's editing patterns. Verdict for Dave.
2. Batch 2: QUESTIONS-A, WIDGET-REVIEW, SCORECARD-SCRIPT.
3. Keep this board, TASKS, DAVE.md and HANDOFF current. Anything touching Dave's voice, sign-in, Firebase or the workflows.

## Review order

The acting coordinator reviews in this priority: anything blocking a learner (broken page, lost answers) first, then content Dave asked for by name, then the lanes in the order above. Under the current delegation, Codex merges reviewed, passing PRs one at a time and verifies the automatic deployments. Dave can change or end the delegation. Coverage is manual in the current chat; no background monitor is configured.

## How to add to this board

Any agent may add a row under "Proposed" in TASKS.md. Only the current coordinator moves work onto a lane here, after Dave agrees.
