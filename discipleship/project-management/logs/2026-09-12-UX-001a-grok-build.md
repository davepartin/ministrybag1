# UX-001a: 201-01/08 learner-journey review

Date: 2026-09-12
Agent / reviewer: Grok Build
Status: REVIEW
Branch: `codex/grok-build-ux001a`
Base commit: `ea93b131b1abc6d72a0948e151e8c4e467312899`
Scope / files reserved: `project-management/reviews/2026-09-12-UX-001a-grok-build.md` and this log only. No application, lesson, widget, image, test, board, or handoff edits.

## Changes and decisions

Read AGENTS.md, PLAN.md, HANDOFF UX-001a packet, and the UX-001a row. Walked 201-01 and 201-08 at 375x812, 390x844, and 1280x800 in a fresh Chrome profile with synthetic answers. Recorded five ranked findings and a 201-08 Discuss proposal. Did not implement Read/Discuss, edit shared code, or claim a human pilot.

Coordinator still owns TASKS.md and HANDOFF.md. This log records start, branch, and evidence. UX-001 remains TODO.

## Verification

Local app: `python3 -m http.server 8765 --bind 127.0.0.1` from `discipleship/`.

Browser: Chrome channel via Playwright, headless, one isolated context per viewport. Command (review script kept outside Git):

```
NODE_PATH=/Users/dpartin/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules node /tmp/ux001a-review.js
```

Supporting widget-fit measurements used `/tmp/ux001a-widget-fit.js` against the same server.

Results:

- Synthetic 201-01 and 201-08 answers survived home return and 201-08 to 201-09 to 201-08 in the same profile.
- No outer-page horizontal overflow at the three viewports.
- 201-08 closing fields sit 11.07 to 11.57 screens from the top at 375x812. TOC has no section jump.
- Completed Grace widget iframe height 649px at 375/390 and 683px at 1280. Sticky topbar clips Grace/Mercy labels when Back/Restart are in view.
- 201-01 completed Great Command iframe 480px at 375px; title, diagram, card, and controls fit.
- 201-08 Restart lands on Mercy/Next. 201-01 Restart returns to Begin.
- Running-Father alt does not match the visible road-and-distant-son composition.
- Direct hash `#201-8` opens lesson 8 after the course is loaded.

Checks not run and why:

- Actual iPhone, Safari, and a live one-on-one. This packet is an agent browser review.
- Cross-device sync. Viewports were separate profiles; transfer remains DATA-001.
- Screen reader, text zoom, reduced motion, and print. Out of scope for UX-001a.
- Foundation QA and unit tests. No application code changed.
- Production deployment.

Known baseline failures distinguished from new regressions:

- Editorial notes in the 201-08 benchmark proposal (justification wording, ESV labels, story-first order) were not re-opened as UX defects.
- ENG-002 artwork review and SEC-001 remain Dave-locked / release-blocked and were not part of this walk.
- One 404 console error appeared in the first 375px session and did not reproduce on later hash loads. URL was not captured. Not listed as a finding.

## Handoff

Changed files:

- `project-management/reviews/2026-09-12-UX-001a-grok-build.md`
- `project-management/logs/2026-09-12-UX-001a-grok-build.md`

Remaining work / next command: Coordinator records UX-001a as REVIEW on the board. After shared-code ownership is free, UX-001 prototypes Discuss on 201-08 using this proposal. Do not merge this PR as a substitute for that implementation.

Blocker and unblock action, if any: None for this documentation packet. UX-001 implementation waits on shared `index.html` / widget ownership (currently reserved for engineering) and a later phone conversation test.

Commit / PR / GitHub sync state: documentation-only PR from `codex/grok-build-ux001a`. Do not merge in this packet. Find the commit with `git log -- discipleship/project-management/logs/2026-09-12-UX-001a-grok-build.md`.

Pastoral approval evidence, if applicable: none. Lesson gates and Discuss copy remain Dave's.
