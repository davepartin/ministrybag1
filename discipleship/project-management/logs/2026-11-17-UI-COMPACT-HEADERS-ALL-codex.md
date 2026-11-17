# UI-COMPACT-HEADERS-ALL

November 17, 2026. Codex, branch codex/compact-headers-all. Base main 81fa996ad4758d17c54d380f28de2bca8f6c5132. Dave approved the 202-01 pilot and said to make this style across the whole app.

## Implementation

Use the existing approved compact class on the shared lesson header from initial render, and remove the pilot-only conditional in updateNav. Remove the now-unused progress markup, styles and JavaScript updates. Preserve the approved 49px layout, 44px Back/Menu targets, course color, zero-padded lesson code, title/ellipsis/full-title attribute, sticky positioning and save-banner offset. Other app views retain their purpose-specific navigation. No lesson copy/JSON, questions/IDs/readings, widgets, artwork or saved-answer implementation changes.

Expand compact_lesson_header_browser_check.js so 202-02 also retains the compact header and its identity updates; add an enumeration of every lesson JSON, checking code, available title, height and horizontal overflow. Preserve the existing phone/desktop/reduced-motion, menu/keyboard Back, sticky geometry and synthetic saved-answer tests. Update the technical brief to replace the pilot exception with the shared standard.

## Actual verification and blocker

The execution environment disconnected before the implementation command could start: exec-server transport disconnected, followed by no usable execution environment. Provider status reports running/connected, but shell access remains unavailable. No changes have been merged or published. Continued via the GitHub connector, on an isolated branch, without editing main or unrelated branches.

Static parsing in the orchestration JavaScript runtime passes for the updated inline application script and browser-check script. No progress-track/progress-fill references remain. This is syntax/inspection evidence only, not a substitute for repository QA or browser execution.

BLOCKED: restore execution workspace, fetch this branch, preserve any local handoff state, and run foundation QA, lesson export, storage, assets/images, iframe checks, the expanded compact header browser test, full lesson navigation, and relevant scroll-image regressions (202-01 sequence, 101-04 lamp, 201-04 timing). Check exact-head preview and protected-file diff before merge. Existing tests that assumed a taller header may require physical visibility expectations to be reviewed, not blindly weakened. Then verify production on all four core courses and update task/board/handoff with actual results.

No QA or browser pass is claimed for this rollout. No Firebase settings/workflows/manual deployment changes. Whole-lesson approval stages remain unchanged.
