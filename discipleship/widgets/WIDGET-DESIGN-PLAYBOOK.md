# Growing Together: Widget Design & Upgrade Playbook

Read `discipleship/widgets/widget.md` for iframe sizing and scroll-safety rules, then apply this playbook when building or upgrading interactive lesson widgets in the **Growing Together** series. This captures the locked **Studio Wash Edition** visual language (`great-command-v5.js`) and the creative workflow used to craft `201`, `202`, and `203`.

---

## 1. Visual Philosophy: Studio Wash Edition

1. **Design the finished static image first.** Before adding animations, make sure the completed resting diagram looks like a balanced, print-worthy emblem. Steps should thoughtfully reveal an already-coherent artwork, not stack disconnected boxes.
2. **Use luminous translucent washes instead of heavy opaque fills.**
   - Avoid putting four saturated solid blocks side by side (which reads like a bar chart).
   - Pair soft tinted fills (`~18-22%` saturation) with `1.6px` colored hairlines and crisp dark/accent typography.
3. **Commit to symmetry and geometry-locked labels.**
   - Anchor every label tightly to the shape and direction it names (vertical stem labels parallel to vertical flow; symmetric left/right column alignment across horizontal arms).
   - Eliminate dead whitespace and floating corner labels.
4. **Convey ongoing motion gently.** Use clean nested double-chevron watermarks (`opacity: 0.55` leading, `0.26` trailing in the beam's hue) or light Studio Wash line art rather than heavy clipart arrows.
5. **No fuzzy glow.** Highlight climaxes with crisp double-hairline contours (`3.5px` outer stroke + `1.1px` inner stroke at `0.45` opacity).
6. **Use dissolve spotlights to transition between courses or ideas.** When shifting focus to one part of a larger diagram, fade context elements down to a `~0.13` ghost watermark (`transition: opacity 0.48s ease`) so the foundation stays visible in memory while the focal idea shines.

---

## 2. Locked Studio Wash Color Palette & Typography

| Role | Meaning / Tone | Primary Ink (`label` / `border`) | Soft Beam Wash | Sweep / Accent |
| :--- | :--- | :--- | :--- | :--- |
| Chrome & Ink | Charcoal / Cream | `#2C2416` (muted `#6E6559`) | `#FFFFFF` stage / `#F6F4EE` tray | `#EBE5D9` borders |
| Gold | God's initiative / promise / glory | `#A8760A` (`#7D5604` dark) | `#FCF2D6` | `#C48F10` |
| Sage Green | Life / response / growth (`201`) | `#1F684A` (`#164E37` dark) | `#E1F1E9` | `#2E7D5B` |
| Harbour Blue | Home / church / belong (`202`) | `#2A5B7C` (`#1E435C` dark) | `#E2EEF6` | `#3B6F91` |
| Royal Plum | Sent outward / neighbors / mission (`203`) | `#5F4684` (`#473366` dark) | `#EDE7F6` | `#705598` |
| Deep Crimson | Christ's cross / sacrifice / climax | `#8B1A2B` (`#6D1422` dark) | Double hairline contour | `185 px/s` stroke draw |

- **Diagram labels:** Bold system sans (`system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`, `13.5px-15px`, weight `700`) for maximum phone crispness.
- **Scripture card:** `Georgia, Cambria, serif` (`13.5px`) for Scripture quotes, `system-ui` (`15px` bold heading, `12.5px` plain reflection note).
- **Title bar:** Compact `#2C2416` header with left-aligned title (`17px`) and right-aligned uppercase course tag (`COURSE 201`, `11px`).

---

## 3. UI Chrome & Animation Standards

- **SVG Canvas:** `viewBox="0 0 440 278"` (keeps total mobile widget height near `505-525px` well inside the `widget.md` `560px` target), `width="100%"`, `role="img"`, with dynamic `<title>` and `<desc>` updated on every step.
- **Wordless Step Dots:** A centered horizontal tray of color-coded circle buttons (`>= 28x28px` touch area, `16px` dot fill inside) matching each step's accent color (`aria-pressed`, `aria-label`), avoiding cluttered text pills underneath the diagram.
- **Teaching Card:** White card with a `4px` top color bar matching `--step-color`, pre-measured on load across all steps via `fitCardHeight()` (`min-height: var(--card-h)`), re-measured **only** when `window.innerWidth` changes.
- **Navigation Bar:** Native `<button>` controls at `>= 44px` height: `<- Back`, `Ready` / `Step N of M`, and `Begin ->` / `Next ->` / `Start Over`.
- **Pacing:** Sweep ribbons glide at linear `95 px/s` (revealing `clipPath` washes smoothly and exiting cleanly off edge); contours draw at `185 px/s`; cascading arcs stagger gently (`~240ms`). Never run idle DOM mutations or timers after a step finishes.
- **Accessibility & Copy Constraints:**
  - Always gate CSS transitions inside `@media (prefers-reduced-motion: no-preference)` and short-circuit `requestAnimationFrame` animations to instant final state when `prefers-reduced-motion: reduce` matches.
  - Style custom focus rings explicitly with `:focus-visible` (`3px solid #E0A526`).
  - Zero em dashes in code, comments, or text; zero `localStorage`.

---

## 4. Workflow for Designing & Upgrading Any Lesson Widget

1. **Read lesson context first:** Read `data/<lesson>.json`, `widgets/widget.md`, `widgets/STUDIO-WASH-GUIDE.md`, and inspect the existing widget (if upgrading) alongside `widgets/great-command-v5.js` and `widgets/romans-road3.html`.
2. **Craft the visual metaphor & final resting state:** Ask what theological movement the learner should *feel* (not just read): descending/ascending, crossing a gap, widening ripples, unfolding layers, or spotlighting via ghost dissolve. Map every step's geometry cleanly inside `440x278`.
3. **Iterate locally before publishing:** Serve `discipleship/` over a local HTTP server and inspect live on `390x844` mobile. When exploring major visual directions, build side-by-side variants (`v1` vs `v2`) so Dave can compare and direct tweaks rapidly without waiting on PR/Firebase deploys.
4. **Self-verify with Playwright and image inspection before showing Dave:**
   - Capture `390x844` screenshots across start, mid-animation, resting steps, and final state, and **open the PNGs with `read_file`** to catch any label overlap, tight edge margins, or contrast issues.
   - Verify: constant `--card-h` across all steps, zero horizontal overflow, zero console/page errors, `Back` navigation, `prefers-reduced-motion: reduce` instant state, and zero em dashes (`U+2014`).
5. **Follow repo handoff rules when ready to ship:** Only when Dave says to publish, check `AGENTS.md` / `project-management/TASKS.md`, isolate on a branch from `origin/main`, keep saved question IDs and lesson prose intact, and stop at `REVIEW`.
