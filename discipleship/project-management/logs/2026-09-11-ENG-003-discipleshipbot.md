# ENG-003: widget iframe readiness, resize, and cleanup
Date: 2026-09-11
Agent / reviewer: DiscipleshipBot / Cursor cloud agent
Status: REVIEW
Branch: cursor/eng-003-iframe-init-ea64
Base commit: 9b07d90
Scope / files reserved: index.html widget render/bind path, scripts/widget-iframe.js, scripts/test_widget_iframe.js, scripts/eng003_browser_check.js, scripts/qa_foundation.sh, this log, TASKS.md, HANDOFF.md. Widget HTML and lesson JSON were not rewritten.

## Changes and decisions

The baseline bug was in the inline iframe `onload` handler: it called `MutationObserver.observe(f.contentDocument.body)` without checking that `body` was a Node. That threw `Failed to execute 'observe' on 'MutationObserver': parameter 1 is not of type 'Node'` while a course's iframes were still starting. Window resize listeners were also added per iframe and never removed when a course was rebuilt.

`scripts/widget-iframe.js` now owns iframe hosting:
- Titles come from an optional JSON `title`, then the known widget name, then a humanized filename, then `Lesson widget`. After load, a non-empty widget document title replaces the assigned title.
- Height uses the largest of documentElement/body scroll, offset, and client heights. Measurements above 50px update the iframe, so content can expand and collapse. Tiny or missing documents leave the current height.
- Observers start only after `body` is an element Node. Ready checks retry instead of throwing. MutationObserver and ResizeObserver, plus load and window resize listeners, disconnect on teardown.
- `loadSeries` tears the host down before removing sessions. `buildUI` binds every `.gt-widget-frame`. `showSession` refreshes heights after a hidden lesson becomes active.

Existing widget designs and lesson theology were left unchanged. Login, export, and ENG-004+ were not opened. SEC-001 was not reproduced.

## Verification
Exact command or browser action, result, and evidence path.

1. `node scripts/test_widget_iframe.js` from `discipleship/`
   Result: 30 checks passed. Covered title fallbacks, missing-document measure, expand/collapse, no observe on a missing body, delayed body on load, listener cleanup, double cleanup, and a torn-down host.

2. `bash scripts/qa_foundation.sh` from `discipleship/`
   Result: previous foundation checks passed, plus the unguarded `contentDocument.body` observe pattern is gone and the widget-iframe unit checks run as step 9.

3. `NODE_PATH=/tmp/node_modules node scripts/eng003_browser_check.js` against `http://127.0.0.1:8765/index.html`
   Result: 36 browser checks passed. 201-01 and 201-08 walked Begin/Next through Restart and Back at 390 px. Controls stayed inside the iframe at 375 px and 1280 px. 201 loaded 10 titled iframes. 101-02, 202-10, and 203-07 had titles and reachable controls. Returning to 201-08 after those course switches still worked. Browser logs had no MutationObserver exceptions.

4. Interactive browser walk of 201-08 at about 390 x 844 and a wider tablet width, plus 201-01 Begin on the wider width. Widget chrome matched the existing cream-card design. Begin/Next/Restart/Back stayed visible. No iframe initialization errors. Favicon 404 is an existing unrelated miss.

Checks not run and why:
- Real iPhone Safari, print, offline, reduced-motion, and keyboard-only widget operation were not tested.
- 201-01 was not walked through every step in the interactive session; Playwright covered that path.
- Hidden-lesson iframe heights were refreshed on show, but every 201 widget was not stepped individually.

Known baseline failures distinguished from new regressions: export scope, save-failure UI, 203-06 title/topic mismatch, 203-08 wrong content, SEC-001, and the ENG-002 Dave artwork lock remain out of scope.

## Handoff
Changed files: iframe host helper, unit and browser checks, foundation QA hook, index.html bind/teardown/title wiring, this log, TASKS.md, HANDOFF.md.
Remaining work / next command: reviewer verifies the diff and reruns `node scripts/test_widget_iframe.js` and `bash scripts/qa_foundation.sh` from `discipleship/`, then integrates. Next implementation packet is ENG-004.
Blocker and unblock action, if any: none for ENG-003.
Commit / PR / GitHub sync state: worker branch `cursor/eng-003-iframe-init-ea64`; PR https://github.com/davepartin/ministrybag1/pull/12 awaiting review. Find this packet with `git log -- discipleship/project-management/logs/2026-09-11-ENG-003-discipleshipbot.md` from repository root.
Pastoral approval evidence, if applicable: not required for this software repair.
