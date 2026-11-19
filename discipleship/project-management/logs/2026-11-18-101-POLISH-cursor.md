# 101-POLISH: Dave-approved 101 wording and metadata fixes
Date: 2026-11-18
Agent / reviewer: Cursor Grok 4.6
Status: REVIEW
Branch: cursor/101-polish-880d
Base commit: 236d9bc, then merged origin/main 6299e71 with a regular merge commit. Conflicts were only TASKS.md and HANDOFF.md; both histories kept. 101-06 lost its in-lesson BLESS credit line from main's CREDITS-ALL; polish wording and the 6-4 stub remain. 101-06 baseline hashes refreshed after that merge.
Scope / files reserved: discipleship/ only. Lesson JSON for 101-02 through 101-07, curriculum-toc.csv, export and storage tests, 101 editorial baseline/status, TASKS, HANDOFF, this log.

## Changes and decisions

Dave approved these edits in chat on November 18, 2026. That authorizes exactly this packet and does not reopen other 101 wording.

1. 101-07: "continue walking" became "continuing to walk in". "someone that never falls... one that gets back up" became "someone who... one who".
2. 101-06: "Jesus did not send her out trained. He sent her out known by God." became "she did not go out trained. She went out known by God." The lead-in "Remember that" stays.
3. 101-06: the BLESS lead-in is now two sentences: live out your faith every day; look at the well again.
4. 101-03 question 3.3: added "that" before "you can pray for". Active ID stays 3-4.
5. Lord's Prayer wording is unchanged. 101-03 diff has no quoted prayer-line edits.
6. curriculum-toc.csv title for 101.07 is now "When You Drift", matching the lesson JSON title. Compact top bar reads that Title field. Headless Chrome dump of index.html#101-7 showed class compact-lesson-topic as "When You Drift". The old title "A Life of Repentance" was absent.
7. TOC key verse for 101.07 is now Ephesians 2:8-10. The old 1 John 1:9 is never quoted in the lesson. Ephesians 2:8-10 is the only dedicated verse block and carries the lesson's center: saved by grace, not by works, created for good works.
8. Retired stubs added from git history at 4c3671b (2026-02-27), after confirming each ID is absent from current active blocks and current retiredQuestions: 2-4, 3-3, 4-2, 5-2, 6-4, 7-2, 7-4, 7-5. Original prompt text is preserved so earlier saved answers export again.
9. TOC subtitles: 101.04 now names Read, Discover, Respond with Heart52; 101.02 now names the A-B-C-D widget; 101.06 story is Woman at the Well.
10. 101-05 question 5.3 is now "What is your church family like right now?" Active ID stays 5-4.

No images were touched, so build_lesson_images.js was not run. 101-editorial-baseline.json hashes were refreshed for 101-02 through 101-07. That file is a reference snapshot, not a CI lock.

Synthetic data only. No credentials or real learner answers.

## Verification
Exact command or browser action, result, and evidence path.

From discipleship/:

- node scripts/test_answer_storage.js: exit 0, 73 passed (includes 8 orphaned-ID reservations and one synthetic reload check).
- node scripts/test_lesson_export.js: exit 0, 212 passed (includes original-prompt export and blank-placeholder checks for 2-4, 3-3, 4-2, 5-2, 6-4, 7-2, 7-4, 7-5, plus kept IDs 3-4 and 5-4).
- node scripts/test_lesson_assets.js: exit 0, 8 passed.
- node scripts/test_widget_iframe.js: exit 0, 32 passed.
- node scripts/test_lesson_images.js: exit 0, 1557 passed.
- bash scripts/qa_foundation.sh: exit 0, all foundation suites, including export 212, images 1557, assets 145 references.

Headless Chrome dump of local index.html#101-7: compact-lesson-topic is "When You Drift".

Checks not run and why:
- build_lesson_images.js: no image files changed.
- Full Playwright lesson navigation suite: not required for this wording packet. Compact title confirmed from TOC mapping plus a local DOM dump.

Known baseline failures distinguished from new regressions: none. All listed suites exited 0.

Post-merge re-run from discipleship/ after merging origin/main 6299e71:
- node scripts/test_answer_storage.js: exit 0, 73 passed.
- node scripts/test_lesson_export.js: exit 0, 212 passed.
- node scripts/test_lesson_assets.js: exit 0, 8 passed.
- node scripts/test_widget_iframe.js: exit 0, 32 passed.
- node scripts/test_lesson_images.js: exit 0, 1557 passed.
- bash scripts/qa_foundation.sh: exit 0, all foundation suites passed.

## Handoff
Changed files: data/101-02.json through data/101-07.json, curriculum-toc.csv, scripts/test_answer_storage.js, scripts/test_lesson_export.js, reviews/101-editorial-baseline.json, reviews/101-editorial-status.md, TASKS.md, HANDOFF.md, this log.
Remaining work / next command: Dave reviews the preview and decides whether to merge.
Blocker and unblock action, if any: none
Commit / PR / GitHub sync state: regular merge of origin/main into cursor/101-polish-880d; PR #314 left at REVIEW, not merged.
Pastoral approval evidence, if applicable: Dave approved these exact edits in chat on 2026-11-18. Whole-lesson Gold is not claimed.
