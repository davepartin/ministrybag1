# WIDGET-101-04-RDR-POLISH: refreshed visual review

Date: November 17, 2026. PR #262, source gemini/widget-101-04-rdr-polish. Own isolated worktree /workspace/ministrybag1-codex-review262, local branch codex/review-262. Submitted widget: 69fff4eb3e59013db323bb74366f3efefc414917. Current main: 70c977d (#283 approved 201-01 voice). Status: REVIEW, not merged/published.

## Request and preservation

Dave requested a current preview of the conflicted PR so he can decide whether to approve it. Merged main normally. Only TASKS/TEAM-BOARD append conflicts required resolution; preserved both histories. The browser test merged the current approved placement-text expectation from main automatically. All new Bible-opening, dim passage/watermark and Ready-card checks remain.

read-discover-respond.html stays byte-identical to Gemini's submitted 69fff4e. data/101-04.json, index.html and scripts/widget-iframe.js stay byte-identical to main. No other lesson, widget or artwork file changes in the final PR diff. Protected current wording, questions/IDs and retired answers, John readings, approved Nicodemus lamp and iframe placement are preserved. Baseline/status approvals are not rewritten for an unapproved widget preview; text stays Silver and current approved component fingerprints remain historical until Dave reviews this revision.

## Verification

Pinned npm ci exit 0. Commands run from discipleship; actual exits verified:

- bash scripts/qa_foundation.sh: exit 0, all foundation suites.
- node scripts/test_lesson_export.js: exit 0, 186.
- node scripts/test_answer_storage.js: exit 0, 64.
- node scripts/check_lesson_assets.js: exit 0, 144.
- node scripts/test_lesson_images.js: exit 0, 1543.
- node scripts/test_widget_iframe.js: exit 0, 32.
- GT_CHROMIUM_PATH=/usr/bin/chromium RDR_BASE_URL=http://127.0.0.1:8850/index.html RDR_SCREENSHOT_DIR=/workspace/scratch/pr262-shots node scripts/widget_101_04_rdr_browser_check.js: exit 0, 230 checks using the current lesson and its question set, at 375/390/1280 and reduced motion. Navigation, focus, fixed card sizing, current/retired saved answers and new visual states are covered.
- Exact widget/main preservation comparisons and git diff --check pass.

Inspected Ready and Read Slowly mobile screenshots. Ready has the closed Bible and dimmed worked passage beneath John 1:11-12; Read Slowly opens the Bible and reveals readable passage text. No design/copy changes were made during this refresh.

## Preview and next action

Exact-head Firebase Action/status, hosted-byte comparison and browser rerun evidence will be posted on PR #262. Provide direct widget and embedded #101-4 links. Stop for Dave's visual decision; this request does not authorize merging the still-unapproved polish. No manual deploy, hosting change or real learner-data access.

## Dave visual follow-up

Dave requests a left-anchored Bible at half the previous width, a right-to-left opening wipe, and a top diagram about 30 percent shorter so the complete widget fits on a phone. Implementing on the same PR; lesson JSON, artwork, wording and historical approvals remain untouched.

Implemented half-scale Bible artwork (labels remain readable), left placement, fixed-right-edge reveal expanding left, and compact rows with undistorted text. Diagram height 166 to 116 (30.1 percent shorter). Card and Scripture styles and all wording are unchanged. Only the widget, its focused browser checks and coordination records change. Main still 70c977d; JSON/index/iframe helper compare byte-identical to main. No approval baseline changes.

Core rerun passes: foundation; export 186; storage 64; assets 144; images 1543; iframe 32. Updated browser coverage verifies compact geometry, half-scale left placement, actual animated wipe direction and complete-widget fit below the phone header at 375x667 and 390x844, alongside prior behavior and answer checks. Screenshots inspected at Ready/Read. Exact-head preview verification follows after push.

## Closed-book right alignment

Dave clarified that the closed book must sit against the right edge of its own white-space footprint, leaving room to open left. Previous compact version 2cee566 is verified on the hosted preview (Action 44186025815 attempt 2 succeeded after a stalled checkout was cancelled and retried). Claiming this small visual follow-up on the same PR. Preserve the compact diagram and half-scale art, all wording and protected files.

The closed cover is translated within the existing half-scale art group so its right edge matches the open book's edge. It occupies the right-hand half of the open footprint, making the existing right-to-left wipe reveal space to its left. Top labels, connector positions, diagram height and all teaching remain unchanged. A physical browser assertion checks right-edge alignment and leftward expansion room at all four viewport/motion configurations. Foundation QA passes; current lesson JSON/index/helper remain byte-identical to main. Screenshots inspected at Ready and Read. Final browser and exact-head hosted evidence is recorded on PR #262. Status REVIEW, no merge or approval inferred.

## Approved integration

Dave explicitly approved 6a4c1e7977719842941e72a3cee339c67899c2f6 and requested merge. Widget HTML remains byte-identical to that approved commit. Only coordination and component approval records are added for integration; the initial #229 approval is retained historically, and the current approved widget hash is refreshed. Whole lesson stays Silver. Protected 101-04 JSON/index/helper compare exact to main 70c977d. Core QA previously passed with export186/storage64/assets144/images1543/iframe32; latest focused browser coverage is 248, plus exact-head hosted three-width six-step smoke. Final checks, merge SHA and live deployment evidence are recorded on PR #262. No manual Firebase deployment/configuration changes or real learner-data access.
