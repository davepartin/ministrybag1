# DOC-ART-STYLE: Dave sketch style guide for story art

Date: 2026-11-12. Agent: Cursor. Branch: `cursor/doc-art-sketch-style`. Status: REVIEW.

Base: `628ba67` (origin/main). Shared main checkout untouched.

## Why

Dave asked that the house story-art style prompt sit where every bot will see it. This packet adds `SKETCH-STYLE.md` and two short pointers. Docs only. No lesson JSON, images, widgets, or runtime edits.

## What changed

1. **Claim:** DOC-ART-STYLE row on TASKS.md in the first commit, owner Cursor / `cursor/doc-art-sketch-style`.
2. **`SKETCH-STYLE.md`:** Dave's attached sketch-style notes, with light markdown only (title heading, file/command ticks, a link to story-image.md, prompt as a quote).
3. **`story-image.md`:** one line near the top: All new story art follows SKETCH-STYLE.md, Dave's loose marker sketch style.
4. **TEAM-BOARD.md:** the same line on standing Images rule 6, the art/images section every agent reads.
5. **TASKS.md:** status REVIEW after checks. Duplicate claim line from the first commit removed.

HANDOFF.md left alone so this stays off the coordinator file and away from open art PRs #181 and ART-203-03b. Inventory rows and lesson files were not touched.

## Verification

From `discipleship/`, with `set -o pipefail`:

```text
npm ci: exit 0
bash scripts/qa_foundation.sh: all foundation QA checks passed; QA_FOUNDATION_EXIT:0
  assets 110, iframe 32, export 167, bundled John 415, images 1173
```

Checks not run: browser/phone visual checks (no new art or UI). No deploy. No merge.

## Handoff

Changed files: `SKETCH-STYLE.md`, `story-image.md`, `project-management/TEAM-BOARD.md`, `project-management/TASKS.md`, this log.

Remaining work: review, then Dave's merge. Stop at REVIEW.
