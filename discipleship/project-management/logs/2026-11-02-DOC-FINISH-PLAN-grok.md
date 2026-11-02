# DOC-FINISH-PLAN: undated finish tracker (no 301)

Date: 2026-11-02
Agent / reviewer: Grok (Cursor Cloud Agent), coordinator packet
Status: REVIEW
Branch: cursor/seven-week-plan-tracker-94c4
Base commit: origin/main `83074ca0a1eef40b51168b0c3ab221d9c393348e`
PR: #68
Scope / files reserved: project-management/FINISH-PLAN.md, project-management/LESSON-GRADES-SUMMARY.md, project-management/SEVEN-WEEK-PLAN.md (deleted), project-management/TASKS.md (L-203-08, L-203-10, L-301-01 to L-301-10, RELEASE-001 DAVE-004 mention only), project-management/HANDOFF.md (pointer only), project-management/DAVE.md (DAVE-004 close only), this log. Earlier packet log 2026-11-02-DOC-SEVEN-WEEK-grok.md is superseded.

## Changes and decisions

### First pass (same PR)

Copied Dave's then-current seven-week plan and pointed L-203-08 and L-203-10 at PRs #66 and #67. Verified live origin/main at `83074ca` first. PRs #66 and #67 are merged and Dave-authored. Status stayed REVIEW; DAVE.md approval rows for 203-08 and 203-10 were not invented.

### Revision, later November 2 (Dave)

Dave revised the plan. No 301 series. No week dates. Template lessons and low grades matter.

- Deleted SEVEN-WEEK-PLAN.md.
- Copied FINISH-PLAN.md and LESSON-GRADES-SUMMARY.md verbatim from Dave's drafts. Did not rewrite theology or lesson prose.
- HANDOFF pointer now names FINISH-PLAN.md as the undated finish backlog. TASKS.md stays the status board. DAVE.md stays the approval record. LESSON-GRADES-SUMMARY.md is the grades view. 301 is out of scope.
- Closed DAVE-004 as decided: later / out of this release. Recorded the decision in DAVE.md. Marked L-301-01 through L-301-10 out of scope without rewriting unrelated lesson rows. RELEASE-001 now states release scope is the 37 lessons in 101, 201, 202 and 203.
- Unrelated 101/201/202/203 lesson rows were not rewritten in this revision. L-203-08 and L-203-10 still point at PRs #66 and #67 from the first pass.

No lesson JSON, index.html, widgets, scripts, or login/provider code was touched.

## Verification

Exact command or browser action, result, and evidence path.

- `git fetch origin main`; branch still based on origin/main `83074ca`.
- `cmp` of attached drafts to FINISH-PLAN.md and LESSON-GRADES-SUMMARY.md: identical.
- `gh pr view 66` and `gh pr view 67` from the first pass: both MERGED, author davepartin.
- Grep of changed files for em dashes: none.
- No credentials or real learner answers. Synthetic data only; none required.

Checks not run and why:
Full foundation QA and browser suites were not run because this packet is documentation only.

Known baseline failures distinguished from new regressions:
None introduced. No app code changed.

## Handoff

Changed files:
- discipleship/project-management/FINISH-PLAN.md (new)
- discipleship/project-management/LESSON-GRADES-SUMMARY.md (new)
- discipleship/project-management/SEVEN-WEEK-PLAN.md (deleted)
- discipleship/project-management/TASKS.md
- discipleship/project-management/HANDOFF.md
- discipleship/project-management/DAVE.md
- discipleship/project-management/logs/2026-11-02-DOC-FINISH-PLAN-grok.md (this log)
- discipleship/project-management/logs/2026-11-02-DOC-SEVEN-WEEK-grok.md (superseded first-pass log)

Remaining work / next command:
Dave reviews PR #68. Record 203-08 and 203-10 approvals in DAVE.md if he confirms those versions. Next finish-plan items: template checklist from 203-08 and 201-08, re-grade current main, DAVE-002, DAVE-003.

Blocker and unblock action, if any:
None for this documentation packet. Stops at REVIEW. Do not merge without Dave.

Commit / PR / GitHub sync state:
PR #68 on cursor/seven-week-plan-tracker-94c4. Recorded after push.

Pastoral approval evidence, if applicable:
None claimed for lesson text. Dave decided 301 is out of this release and authored the Oct 29-30 203-08/10 rewrites. This packet records those board facts only.
