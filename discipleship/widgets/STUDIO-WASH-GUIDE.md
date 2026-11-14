# Studio Wash Edition: Widget Design Guide

This guide captures the design lessons and locked visual standard from **Version 5 (Studio Wash Edition)** of the Greatest Commandment widget (`widgets/great-command-v5-201.html` and `widgets/great-command-v5.js`) so future widgets in the **Growing Together** series (`201`, `202`, `203`, and beyond) share the same clarity, restraint, and craftsmanship.

---

## 1. Core Design Principles

1. **Design the finished static picture first.** Before designing step-by-step motion, make the completed resting state look balanced, timeless, and worthy of print. Animation should reveal an already-coherent composition, not patch together disconnected blocks.
2. **Use luminous translucent washes instead of heavy solid fills.** Heavy full-opacity bars fighting shoulder-to-shoulder look like a bar chart. Soft tinted fills (`~18-22%` saturation wash) paired with `1.6px` colored inner hairlines and deep ink typography feel calm, reverent, and readable.
3. **Commit to true symmetry and directional label anchoring.**
   - Anchor text to the direction of movement: vertical stem labels align cleanly alongside the stem (`rotate(90)` reading downward on the left, `rotate(-90)` reading upward on the right, letter tops facing inward toward the cross), and horizontal arm labels sit at symmetric column offsets (`text-anchor="end"` on the left, `text-anchor="start"` on the right).
   - Never leave orphan labels stranded in distant corners where they create dead whitespace.
4. **Show subtle ongoing movement via nested watermarks.** Instead of large solid arrowheads or clipart, place clean double-chevron directional marks (`stroke-width: 3` at `0.55` opacity plus a trailing `2.4` chevron at `0.26` opacity in the beam's own hue) near the outer edge of each washed lane.
5. **Frame climaxes with crisp double hairlines, never fuzzy glow.** Step 5 unites the cross using a clean `3.5px` Deep Crimson outer path plus a `1.1px` (`0.45` opacity) inner hairline. Avoid blurry outer shadows or neon glows.
6. **Keep typography modern, crisp, and legible at phone width.** Bold humanist/system sans (`system-ui`, `14.5px`, weight `700`) for diagram callouts; Georgia serif for Scripture (`13.5px`) inside the bottom card; compact `17px` `#2C2416` header bar with widget title top-left and lesson tag top-right (`201-01`, `202-01`, `203-01`, dropping the word `COURSE`).

---

## 2. Locked Studio Wash Color Palette

| Role | Meaning / Direction | Primary Ink (`label` / `border`) | Soft Beam Wash | Sweep Ribbon |
| :--- | :--- | :--- | :--- | :--- |
| Base Ink & Paper | Charcoal / Chrome | `#2C2416` (muted `#6E6559`) | `#FFFFFF` stage (`#F6F4EE` tray) | `#EBE5D9` borders |
| Down (God first) | God loves us | `#A8760A` (`#7D5604` dark) | `#FCF2D6` | `#C48F10` |
| Up (Response) | We love God | `#1F684A` (`#164E37` dark) | `#E1F1E9` | `#2E7D5B` |
| Left Arm (Belong) | Love the Church | `#2A5B7C` (`#1E435C` dark) | `#E2EEF6` | `#3B6F91` |
| Right Arm (Go) | Love the Lost | `#5F4684` (`#473366` dark) | `#EDE7F6` | `#705598` |
| Finished Cross | Christ's Cross | `#8B1A2B` (`#6D1422` dark) | Transparent double hairline | Drawn stroke (`185 px/s`) |

When building **dissolve / spotlight steps** (such as focusing on the horizontal neighbor beam in `202` or the outward mission arm in `203`), fade inactive beams smoothly to a soft ghost wash (`~0.10-0.14` opacity) rather than deleting them, keeping the whole cross present in memory while giving complete clarity to the featured section.

---

## 3. Motion, Layout, and Accessibility Rules

- **Calm, consistent pacing:** Sweeping directional ribbons move at linear `95 px/s` (`viewBox="0 0 440 278"`), clipping open the soft beam wash behind them and exiting cleanly off the diagram edge. Accent contours trace smoothly via `stroke-dashoffset` at `185 px/s`.
- **Navigation chrome:** Wordless color circle buttons (`>= 28x28px` touch target, `16px` dot fill inside) paired with `>= 44px` tall `Back` / `Begin ->` / `Next ->` / `Start Over` buttons and a compact `Step N of M` counter.
- **Stable card & iframe safety (per `widgets/widget.md`):**
  - Pre-measure the tallest step card once via `fitCardHeight()` and lock `--card-h` so advancing steps never shifts height.
  - Re-measure **only** when `window.innerWidth` changes (ignoring iOS Safari address-bar height-only resize events).
  - Leave zero idle DOM timers or ongoing attribute mutations once an animation stops.
- **Accessibility & reduced motion:**
  - Native `<button>` elements with explicit `:focus-visible` outlines (`3px solid #E0A526`), `aria-pressed`, and descriptive `aria-label`s.
  - Inline `<svg role="img" width="100%">` with dynamically updated `<title>` and `<desc>`.
  - Wrap visual transitions inside `@media (prefers-reduced-motion: no-preference)` and short-circuit `requestAnimationFrame` sweeps to instant final state when `prefers-reduced-motion: reduce` matches.
- **Series text constraints:** Never use em dashes in code, comments, or copy; never rely on `localStorage`.
