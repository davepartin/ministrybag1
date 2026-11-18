# UI-FOCUS-MODALITY

November 18, 2026. Codex / codex/focus-input-modality. Dave finds the gold control outline distracting on the phone-first series and asked whether it can disappear or change color. The screenshot shows keyboard-focus styling, not a text-selection/highlighting feature.

## Behavior

A shared helper hides outlines after touch/mouse input, including native selects that browsers keep matching focus-visible after a click. Keyboard Tab/navigation keeps a restrained 2px blue outline (#2A6F9E) with system Highlight in forced-colors mode. No blur, preventDefault, tab-order changes, storage or data writes. Text entry, virtual-keyboard Enter, native dropdowns, radios/checkmarks, selected tabs and widget steps remain functional. No new learner setting or toggle.

Included on the lesson app, apps hub and all3 companions. The helper applies the policy to dynamically inserted same-origin lesson iframe documents and synchronizes input mode between them. Reload/removal cleans listeners/observers/styles; opaque/cross-origin frames are skipped safely. Every approved widget file remains byte-identical. Standalone widget documents retain their own fallback styling; the shared policy covers their embedded lesson presentation. If the helper fails, existing native focus styles remain rather than breaking controls.

Authoritative source: scripts/focus-modality.js. Existing companion builders distribute exact source copies into each app folder and generated root MinistryBag copies, with provenance headers and --check parity. No cross-site script dependency. HTML includes the helper; no app business logic, lesson JSON, images, widget bytes or saved-answer code changes.

## Verification

- All foundation suites passed; export186, answer storage64, assets145, images1557 (final integrated head) and iframe32 passed.
- focus_modality_browser_check.js:117 checks passed at390 mouse,390 touch and1280 mouse. Exercises Heart52 select/flip/category saving, Daily dropdown, Weekly textarea/autosave/virtual Enter, hub links, Tab/Shift-Tab, dynamic/reloaded/removed/opaque frames and4 real lesson widgets (101-04,201-10,202-08,202-09). Pointer outlines absent, native focus retained, keyboard outlines blue, selected check visible, no page errors/overflow and existing synthetic prayer/lesson data unchanged.
- Existing read101_a11y_browser_check.js:57 passed, preserving keyboard reading/header/notes behavior.
- Existing lesson_navigation_browser_check.js:964 passed across phone/desktop/reduced motion, completed/revisited lessons, course boundaries and saved answers.
- All3 builder --check commands, syntax, protected-file comparison and whitespace checks pass. No widgets contain an important focus-ring declaration that would beat the shared policy.
- Test fixes: the original collection's actual first two words were retained rather than assuming another translation's wording; the synthetic seed was limited to top-level HTTP(S) documents so the intentionally opaque frame did not throw a sessionStorage error. No production storage access was added.

Dave's request authorizes this behavior change; no new visual design or lesson wording is introduced. Merge/live evidence follows below. DONE after production verification.

Integration refresh: current main236d9bc added approved203-03/203-04 voice/TOC work during implementation. Merged it cleanly; the shared runtime and app changes are unchanged, and all current-main lesson/widget/image files remain exact. Final integrated-head foundation and117 focus checks passed before merge.

## Publication

PR #311 final head86159e3f510049b57db3bf019071fdf9e3da8e8b had all3 PR checks passing and mergeable_state clean. Preview117 checks passed; index, hub, helper and all3 companion HTML/helper files matched the exact reviewed bytes. Merged normally at07654c561e417d483e29127803ffe113128e788c.

Firebase production run44417943372 and Pages run44417942222 both completed successfully. FOCUS_BASE_URL=https://growingtogetherdiscipleship.com node scripts/focus_modality_browser_check.js passed117 live checks across390 mouse,390 touch and1280 mouse. Nine deployed main/hub/app HTML/helper files returned200 and matched source bytes; all3 MinistryBag helper copies also returned200 and matched the generated copies. No lesson JSON, widget source, image, app business logic or saved-answer code changed. No whole-lesson approval/status inferred.
