# TOOLING-001: pinned development dependencies

Date: 2026-11-11. Agent: Codex. Status: REVIEW, awaiting Claude's review and Dave's merge approval.
Branch: codex/tooling-001-pinned-dev-dependencies. Base: 7de1e55.
Worktree: /Users/dpartin/github/ministrybag1-codex-tooling.

## Assignment and scope

Read TEAM-BOARD.md including Lessons learned, plus Claude's pending AAA scorecard on PR #160. The top ChatGPT item is TOOLING-001, not the next reader fix. Follow the standing rules and stop at REVIEW for Claude before Dave merges.

Add package.json with exact sharp and Playwright development versions, a generated npm lockfile, node_modules ignore coverage and short README setup instructions. Match the versions already used successfully in this chat's image and browser checks: sharp 0.35.5 and Playwright 1.57.0. Use Node.js 20.9 or newer, matching sharp's engine requirement. Do not change lesson content, approved questions, images, widgets, app behavior, account code, Firebase configuration or deployment workflows.

The main checkout is read-only. Dependency setup and checks run in this separate worktree with NODE_PATH removed to prove the new setup works independently of the desktop bundle. Every required check's process exit status must be captured and failures must stop the checking command.

## Verification

All commands below ran from this worktree's discipleship/ with NODE_PATH removed, not pointed at the desktop bundle. Node.js v24.20.0 on macOS. Dependencies resolve under this worktree's node_modules/. Each process exit status was inspected; grouped checks use spawnSync and immediately propagate any nonzero status instead of piping through tail.

```text
$ env -u NODE_PATH npm install
added 8 packages, and audited 9 packages
found 0 vulnerabilities
EXIT 0
$ env -u NODE_PATH npm ci
added 9 packages, and audited 10 packages
found 0 vulnerabilities
EXIT 0
$ env -u NODE_PATH npm audit
found 0 vulnerabilities
EXIT 0
$ env -u NODE_PATH npm ls --depth=0
playwright@1.57.0
sharp@0.35.5
EXIT 0
$ env -u NODE_PATH npx --no-install playwright --version
Version 1.57.0
EXIT 0
$ env -u NODE_PATH node scripts/build_lesson_images.js
delivery copies unchanged
PASS: manifest and all 203 existing delivery files remain byte-for-byte unchanged
EXIT 0
$ env -u NODE_PATH bash scripts/qa_foundation.sh
1015 lesson image checks passed.
All foundation QA checks passed.
EXIT 0
$ env -u NODE_PATH node scripts/test_lesson_export.js
143 check(s) passed.
EXIT 0
$ env -u NODE_PATH node scripts/test_answer_storage.js
64 check(s) passed.
EXIT 0
$ env -u NODE_PATH node scripts/check_lesson_assets.js
PASS: 96 src/image/imageBw/imageColor/imageSequence references resolve to files.
EXIT 0
$ env -u NODE_PATH node scripts/test_lesson_images.js
1015 lesson image checks passed.
EXIT 0
$ env -u NODE_PATH node scripts/test_build_lesson_images.js
11 image build checks passed.
EXIT 0
$ env -u NODE_PATH PERF001B_BASE_URL=http://127.0.0.1:8880/index.html node scripts/perf001b_browser_check.js
387 all-course image delivery browser checks passed.
EXIT 0
$ git diff --check
EXIT 0
```

Fresh-install detail: npm install began with no node_modules in this new worktree. npm ci then did a clean reinstall from the generated lockfile. Its npm version emits an optional fsevents install-script notice; no script approval or security setting was changed. The module loads, build, audit and browser checks all pass despite that optional notice.

One focused test repair: the first NODE_PATH-free build-fixture test exited 1 because its copied builder ran under the OS temporary folder and could not find sharp. The fixture now links its node_modules to this worktree's installed dependencies; the full 11 checks then exit 0 without NODE_PATH. Only the temporary test setup changes; the image builder and production files are untouched.

Verified package.json is private, uses exact development pins with no version ranges, and agrees with package-lock.json. Git ignores node_modules and tracks no dependency files. Existing firebase.json already excludes **/node_modules/**, so no Firebase change is needed. README covers Node, install/ci, image building, browser setup and local-server prerequisites, with the official Playwright browser instructions linked.

Local browser suite uses installed Chrome with the pinned local Playwright library. All 37 active-course lessons at 375/390/1280 px pass, including image delivery and reduced motion. Account code is stubbed; no real accounts or learner data. Physical iPhone/Safari and other operating systems were not tested. No UI or lesson changes are claimed.

## Handoff

Files: package.json, package-lock.json, .gitignore, README.md, the isolated build test's dependency link, this log and the TOOLING-001 row. No node_modules files staged. The PR contains commands with exit codes and the Firebase Action preview link with a lesson hash; deployed-preview verification is added to the PR before reporting to Dave.

One job per PR. Stop at REVIEW. Claude reviews; Dave decides whether to merge. No manual deployment or merge. Do not begin chapter-note export or any lesson trims. TEAM-BOARD.md, DAVE.md, HANDOFF.md and the AAA scorecard stay with Claude.
