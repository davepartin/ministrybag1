# UX-001b: Grace widget Restart and whole-diagram view

Date: 2026-09-12
Agent / reviewer: Grok Build
Status: REVIEW
Branch: `codex/ux-001b-grace-diagram`
Base commit: `31240d9f529ef6cf3801905636442d88fdfe73fc` (origin/main after REV-006)
Scope / files reserved: `widgets/grace-diagram.html`, `scripts/ux001b_browser_check.js`, this log. Coordinator owns board/handoff. No lesson JSON, `index.html`, iframe helper, backup code, foundation QA, other widgets, artwork or shared styles.

## Changes and decisions

Restart now returns to the true intro/Begin state, matching 201-01. It is no longer a jump to Mercy and is not used as the overview action.

Added a separate **Show whole diagram** control on the intro and on every guided step. The overview uses the existing in-file boxes, definitions, arrows and cycle caption (`stops[4].cardTitle`). It does not repeat the step verse cards. **Return to steps** restores the step that was open when overview started. Restart from overview still goes to Begin.

Overview iframe height measured 444px at 375/390 and 478px at 1280, inside the 530-560px compact target. Guided-step card height is unchanged. Teaching labels were not shrunk.

Host positioning is unchanged: the lesson still requires ordinary outer scroll to bring the widget on screen. After the iframe is in view, the compact overview's four names, definitions, Return and Restart fit the 375 viewport, including a synthetic save-error banner. That banner was injected only in the test page, not in product code.

## Verification

Local app: `python3 -m http.server 8765 --bind 127.0.0.1` from `discipleship/`.

```
GT_BROWSER_CHANNEL=chrome NODE_PATH=/Users/dpartin/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules node scripts/ux001b_browser_check.js
```

Passed at 375x812, 390x844 and 1280x800: Begin/Next/Back/Restart, overview from intro and mid-tour, return with Justified preserved, repeated switches, keyboard Tab/Enter, iframe shrink/grow, four names and definitions inside the iframe, no outer overflow.

```
NODE_PATH=/Users/dpartin/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules node scripts/test_widget_iframe.js
```

30 widget iframe unit checks passed.

Committed `scripts/eng003_browser_check.js` could not launch Playwright Chromium in this environment (missing `chromium_headless_shell-1234`). A chrome-channel walk of the same 201-08 Begin/Next/Restart path passed: Restart returns Begin and the iframe keeps a usable height.

Checks not run and why:

- Actual iPhone, Safari, and a live conversation. Headless Chrome only.
- Foundation QA. No lesson JSON or host files changed; the packet forbids editing that script.
- Cross-device transfer.

Known baseline failures distinguished from new regressions:

- Sticky lesson header can cover the top of an unaligned iframe. That is a host positioning issue, not solved in this widget packet.
- 201-08 editorial wording and ESV labels remain EDIT-001 / L-201-08.

## Handoff

Changed files:

- `widgets/grace-diagram.html`
- `scripts/ux001b_browser_check.js`
- `project-management/logs/2026-09-12-UX-001b-grok-build.md`

Remaining work / next command: Coordinator records UX-001b as REVIEW. Parent UX-001 (Read/Discuss) still waits on shared-code ownership. Do not merge this PR as Discuss.

Blocker and unblock action, if any: none for this widget packet.

Commit / PR / GitHub sync state: documentation and widget PR from `codex/ux-001b-grace-diagram`. Find the commit with `git log -- discipleship/project-management/logs/2026-09-12-UX-001b-grok-build.md`.

Pastoral approval evidence, if applicable: none. Teaching text in the widget was preserved, not rewritten.
