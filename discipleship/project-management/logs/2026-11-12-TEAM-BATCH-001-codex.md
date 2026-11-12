# TEAM-BATCH-001: three queued projects per agent

Date: November 12, 2026. Agent/reviewer: Codex, acting coordinator.
Status: REVIEW at the documentation PR checkpoint; final integration evidence on the PR.
Branch: codex/team-batch-2026-11-12.
Base: 13567507c347b9a6941ed9cb9644659cf5f1bdcb.
Worktree: /Users/dpartin/github/ministrybag1-codex-team-batch. Shared main checkout untouched.

## Request and decisions

Dave asked: "give gemini a few projects and grok a few projects and yourself a few projects, add them to the team board".

Selected the next three existing priorities in each lane. No lesson rewrite or widget was invented, no agent was launched, and no message was sent to another chat. Publishing assignments is not implementation or an increase in the production-completeness scores.

Gemini: ART-202-05 Joseph, ART-202-06 Paul/Silas, ART-202-07 widow.
Grok: ART-203-07 Jesus sends the 72, ART-203-03 Emmaus, ART-203-09 tentmakers.
Codex: READ-101-NOTES, READ-101-RETRY, READ-101-A11Y.

All nine are TODO until claimed. One active implementation per agent; jobs 2 and 3 follow that owner's prior reviewed merge. All jobs get separate worktrees/branches, one task per PR, exact exit-code checks, log/task evidence and Action previews. Gemini and Grok stop at REVIEW; only the delegated coordinator merges reviewed, passing authorized work.

Read the current TEAM-BOARD including the scorecard and Lessons learned, HANDOFF, task rows and story-image guidance. Current lesson stories and reader/export surfaces were inspected to make the scopes real rather than relying on old TOC labels.

## Boundaries

Art owns six separate lessons' image blocks/assets, generated delivery map and per-task evidence only. No non-image lesson changes, questions, IDs, widgets, shared reader/runtime, sign-in, Firebase or workflows. Matching charcoal/color compositions and dimensions, optimized delivery, image/parable join and reduced-motion/responsive preview checks are required.

Codex alone owns the shared reader/export surfaces for this batch. Notes stay current-lesson scoped and include live unsaved values; no PDF generation. Retry covers temporary failure recovery without losing reading data. Accessibility covers native keyboard toggles and correct label/state associations without changing stable storage keys. Each is a separate sequential PR, not a broad refactor.

Generated image maps and inventory rows are shared; explicitly serialize integrations, update only isolated worktrees/branches and rerun the generator/checks instead of manually merging generated data or dropping earlier images. Keep Dave's personal art and new-wording approval separate from technical integration.

## Files and state

TEAM-BOARD contains the nine briefs and lane order. TASKS has stable IDs, owners, dependencies and acceptance criteria. HANDOFF points to the batch and says assigned does not mean launched. Marked AUDIT-37-AAA done using #166's already verified merge, automatic deployment and checks. Other scores/approval states unchanged. #165 is a duplicate Daniel wording PR, not another assignment; no unrelated PR closed or merged.

No lesson, image, widget, index/runtime, Bible text, export code, Firebase or workflow files are changed in this documentation packet.

## Verification

Fresh npm ci succeeded, exit 0. Required and related checks from discipleship/ with NODE_PATH removed, actual spawnSync process statuses verified and failures propagated:

```text
bash scripts/qa_foundation.sh: all foundation QA checks passed; exit 0
node scripts/test_lesson_export.js: 143 checks passed; exit 0
node scripts/test_answer_storage.js: 64 checks passed; exit 0
node scripts/check_lesson_assets.js: 102 references resolve; exit 0
node scripts/test_lesson_images.js: 1075 checks passed; exit 0
node scripts/test_widget_iframe.js: 32 checks passed; exit 0
git diff --check: exit 0
```

Assignment validation passed, exit 0: nine unique TODO task rows, exactly three ordered projects per owner; brief/task owners and actual lesson stories match; acceptance scopes, document links, generated-map/privacy/approval boundaries retained. Runtime/data/art/widgets/scripts/TOC/workflows unchanged against main.

Attach the generated Action preview and review evidence before delegated merge. Final merge/deployment evidence belongs on the PR. No independent Claude review claimed.
