# RETIRE-LEGACY-PRS

Date: November 20, 2026
Owner: Codex
Branch: codex/retire-legacy-prs
Status: DONE

Dave explicitly requested retiring seven proposals and keeping the current live appearance. Read all seven PR states/descriptions before acting: all were open and unmerged. Closed them sequentially, preserving their original descriptions and appending Dave's retirement reason.

| PR | Disposition |
|---|---|
| #325 | Current203-01 Great Commission widget is correct; retire the alternative. |
| #346 | Current202-06 Moses artwork is finished; redundant tracking PR closed. |
| #222 | Retire older202-01 logo/widget placement proposal. |
| #68 | Retire old course-planning tracker proposal. |
| #28 | Retire old restore-label proposal; current backup/restore behavior retained. |
| #2 | Retire old denomination comparison guide draft. |
| #305 | Keep current branding; reject replacement logo/icons/link-preview proposal. |

Every close returned state closed, merged false. GitHub's open-PR list is now empty. Record current decisions in HANDOFF/TEAM-BOARD, retire UX-004's pending merge instruction, and mark ART-202-06c DONE with its current20/30 timing. Historical logs and PR descriptions retained; no branches deleted, no proposals merged.

Only coordination documentation changes on main. No lesson JSON, artwork, widgets, logo/icon files, runtime code, storage behavior or product design changes. Verification: gh pr list --repo davepartin/ministrybag1 --state open --limit100 returned an empty list; git diff --check passes. Runtime tests are unnecessary for documentation-only changes.
