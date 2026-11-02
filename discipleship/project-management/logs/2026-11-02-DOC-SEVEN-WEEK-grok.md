# DOC-SEVEN-WEEK: add the November 2 to December 19 finish tracker

Date: 2026-11-02
Agent / reviewer: Grok (Cursor Cloud Agent), coordinator packet
Status: REVIEW
Branch: cursor/seven-week-plan-tracker-94c4
Base commit: origin/main `83074ca0a1eef40b51168b0c3ab221d9c393348e`
Scope / files reserved: project-management/SEVEN-WEEK-PLAN.md, project-management/TASKS.md (L-203-08 and L-203-10 rows only), project-management/HANDOFF.md (short pointer only), this log.

## Changes and decisions

Copied Dave's approved seven-week finish plan verbatim into project-management/SEVEN-WEEK-PLAN.md. Did not rewrite theology or lesson prose. Added a short HANDOFF pointer so later bots find the tracker without treating HANDOFF as the board. TASKS.md remains the status board. DAVE.md remains the approval record.

Verified live origin/main before editing TASKS/HANDOFF. Local HEAD matched origin/main at `83074ca`. PRs #66 and #67 are merged, Dave-authored (`davepartin`), and they supersede the PR #58 board notes for 203-08 and 203-10:

- PR #66 merged 2026-10-30 as `845ba30`: Update Growing Out lessons 203-08 and 203-10.
- PR #67 merged 2026-10-30 as `24f1026`: 203-08 Make SPACE to disciple someone.

Updated only the L-203-08 and L-203-10 rows: owner is Dave on main via those PRs, status stays REVIEW, Dave gate stays unrecorded, and next work now points at PRs #66 and #67 rather than PR #58. No DAVE.md approval row exists for either lesson, so approval recording is still needed. Did not invent a new approval.

No lesson JSON, index.html, widgets, scripts, or login/provider code was touched.

## Verification

Exact command or browser action, result, and evidence path.

- `git fetch origin main`; local HEAD equals origin/main `83074ca`.
- `gh pr view 66` and `gh pr view 67`: both MERGED, author davepartin, files include discipleship/data/203-08.json; PR #66 also includes discipleship/data/203-10.json.
- `git log origin/main -- discipleship/data/203-08.json discipleship/data/203-10.json`: latest lesson-body rewrites are PR #67 (203-08) and PR #66 (203-10). PR #58 is stale for both board rows.
- Compared attached draft to SEVEN-WEEK-PLAN.md with `cmp`: identical.
- Grep of changed files for em dashes: none.
- No credentials or real learner answers in this packet. Synthetic data only; none required.

Checks not run and why:
Full foundation QA and browser suites were not run because this packet is documentation only. Visual and technical cells on L-203-08/10 were left as previously recorded; they were not re-verified after PRs #66/#67.

Known baseline failures distinguished from new regressions:
None introduced. No app code changed.

## Handoff

Changed files:
- discipleship/project-management/SEVEN-WEEK-PLAN.md (new)
- discipleship/project-management/TASKS.md
- discipleship/project-management/HANDOFF.md
- discipleship/project-management/logs/2026-11-02-DOC-SEVEN-WEEK-grok.md

Remaining work / next command:
Dave reviews this PR. Record 203-08 and 203-10 approvals in DAVE.md if he confirms those versions. Week 1 of the tracker still needs DAVE-004 (301 scope) and DAVE-003 (pilot pairs).

Blocker and unblock action, if any:
None for this documentation packet. Stops at REVIEW. Do not merge without Dave.

Commit / PR / GitHub sync state:
Recorded after push.

Pastoral approval evidence, if applicable:
None claimed. Dave authored the Oct 29-30 203-08/10 rewrites; this packet only corrects the board pointers.
