# WIDGET-101-07-REMOVE-BOX: November 15, 2026

Branch: codex/10107-remove-interim-box, isolated worktree.
Base main: 81571c33f6a2cc03a85863c88d13d2debab923c0 (#251 already merged).

Dave explicitly requested replacing the interim The 180: Stop, Turn, Walk box with the already-approved widget, directly after the three-step setup. This follow-up removes only the one box object (nine JSON lines). It does not add a second widget or alter any remaining block. The widget already occupies the requested location and keeps its exact approved 53d2d60 bytes. The current lesson object equals main with only that one box removed. All active and retired questions/answers, Scripture, John 19-21, other prose, artwork, iframe helper, index and widgets are unchanged.

Task, board, handoff and 101 tracker/baseline supersede the earlier box-retention note. Current lesson/content fingerprints update for this explicit removal; widget/image hashes and text stage Silver remain unchanged. No whole-lesson Gold is inferred.

Pinned npm ci and repository checks exit 0: foundation, export 186, storage 64, assets 138, images 1465, iframe 32. Existing embedded browser script exercises the changed lesson at 375/390/1280 and reduced motion, sizing/stable card/no scroll jump, all active/retired responses and edits/reload/revisit/Email. Final browser exits, exact-head Firebase preview, merge SHA and live verification are recorded on the follow-up PR after the tracking commit. No new test duplicating the removal is added; a direct JSON comparison proves the exact one-object change and placement.
