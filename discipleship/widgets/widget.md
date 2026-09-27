# Widget Design Guide

This guide defines the rules for building interactive widgets in the discipleship app. Every widget is embedded as a full-width iframe in the lesson page. Follow these rules consistently so widgets always look right on both phone and desktop.

---

## How Widgets Are Rendered

The lesson renderer (index.html) embeds each widget in an `<iframe>` that is:

- `width: 100%` of the lesson content area
- No border, no border-radius
- Margin of `24px -20px` (negative horizontal margin so the iframe bleeds edge-to-edge past the lesson's 20px side padding)
- Height starts at the `height` field in the lesson JSON (e.g. `"height": "640px"`). After the widget loads, `scripts/widget-iframe.js` measures the content and resizes the iframe to fit. It re-measures whenever anything inside the widget changes. Read **Measuring, Resizing and Scroll Safety** below before writing any resize code.

This means the widget's HTML is responsible for all its own internal layout. There is no surrounding card or frame from the parent page.

---

## Required Body and Outer Container CSS

Every widget uses a responsive two-mode layout: full-bleed on mobile, card look on desktop. Copy this pattern exactly into every new widget:

```css
body {
    padding: 0;
    margin: 0;
    font-family: 'Georgia', 'Cambria', serif;
    background: #F8F6F1;
    color: #2C2416;
    -webkit-font-smoothing: antialiased;
}

.widget-outer {
    background: #FFFFFF;
    border-radius: 0;
    overflow: hidden;
    box-shadow: none;
    border: none;
    max-width: 100%;
    width: 100%;
    margin: 0;
    position: relative;
}

/* Desktop: restore card look with rounded corners and shadow */
@media (min-width: 560px) {
    body {
        padding: 16px;
        background: #F8F6F1;
    }
    .widget-outer {
        border-radius: 12px;
        box-shadow: 0 6px 20px rgba(44, 36, 22, 0.08);
        border: 1px solid #EBE5D9;
        max-width: 460px;
        margin: 0 auto;
    }
}
```

On mobile (< 560px): the widget fills the full phone width edge-to-edge with no padding and no rounded corners.
On desktop (>= 560px): the widget appears as a centered rounded card with shadow, max 460px wide, with 16px breathing room around it.

Do NOT add:
- Any `padding` to `body` outside of the media query
- A fixed pixel `max-width` on `.widget-outer` outside of the media query
- `border-radius` or `box-shadow` on `.widget-outer` outside of the media query

The lesson page handles the full-bleed margin on mobile. The widget handles its own card appearance on desktop.

---

## Viewport and Meta Tag

Always include this exact meta tag:

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```

---

## Design Dimensions

Design for a minimum usable width of **350px**. This is the effective width on a small iPhone (390px screen minus the app's 40px total side padding from the lesson content area, before the negative margin fix bleeds it edge-to-edge).

With the negative margin fix in place, the widget renders edge-to-edge on mobile, so design comfortably to **390px** as your phone target. On tablet and desktop the widget will stretch wider, so use responsive layout (percentages, flexbox, max-widths on internal elements where needed).

For SVG-based diagrams:
- Set `viewBox` but also set explicit `width="100%"` so the SVG scales to fill the container
- Do not use a fixed pixel `width` attribute on the SVG element unless the diagram has a specific fixed-width layout
- If you use fixed layout constants (like `var W = 350`), be aware the SVG may not stretch and labels may clip on wider screens

---

## Title Bar

Keep the title bar compact. On phone, the goal is to show the whole widget without wasting height. Use a title only by default. Do not add a tagline unless the widget absolutely needs it for comprehension.

```css
.title-bar {
    background: #2C2416;
    padding: 6px 14px;
    text-align: center;
}

.title-bar h1 {
    font-size: 18px;
    font-weight: 600;
    color: #FAF8F3;
    font-family: 'Playfair Display', Georgia, serif;
    letter-spacing: 0.3px;
    margin: 0;
    line-height: 1.15;
}
```

If a subtitle is ever used, it must be optional and hidden on mobile by default. For most widgets, remove it.

---

## Card Area

The bottom card/verse area uses:

```css
#card-area {
    background-color: #F6F4EE;
    border-top: 1px solid #EBE5D9;
    padding-top: 8px;
}

.verse-card-wrapper {
    margin: 0 auto;
    padding: 0 12px 8px;
}

.verse-card {
    background: #FFFFFF;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 2px 14px rgba(44,36,22,0.06);
}

.verse-card-content {
    padding: 10px 16px;
    height: 112px;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
}
```

---

## Navigation Bar

```css
.nav-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 10px;
    padding: 0 2px;
}

.nav-btn {
    background: transparent;
    border: 1.5px solid #D4CFC4;
    border-radius: 10px;
    padding: 8px 14px;
    font-size: 12px;
    font-family: 'Trebuchet MS', sans-serif;
    cursor: pointer;
    font-weight: 600;
}

.nav-btn.primary {
    color: #fff;
    border: none;
}
```

---

## Course Colors

Use these accent colors consistently by course:

| Course | Color | Hex |
|--------|-------|-----|
| 201 Growing Deep | Forest Green | `#1A6B55` |
| 202 Growing Up | (TBD) | |
| 203 Growing Out | (TBD) | |
| 301 | (TBD) | |

---

## Height in Lesson JSON — The Most Important Rule

Widget height is the single most common source of bugs. If the iframe height in the lesson JSON is too short, the Next/Begin buttons get clipped off the bottom and the user cannot navigate the widget. This has happened before and must not happen again.

### iPhone viewport reference

| Device | Viewport height | Visible for widget (after Safari bars + lesson header) |
|--------|----------------|-------------------------------------------------------|
| iPhone SE | 667px | ~480–520px |
| iPhone 15/16 (standard) | 844px | ~620–660px |
| iPhone Pro Max | 932px | ~720–760px |

The standard iPhone (844px) is the design target. A widget must fit comfortably in ~620px of visible space so the user can see at least the title bar and the Next button without scrolling within the widget.

### Height budget for the standard widget layout

The standard widget layout (title bar + diagram + card + nav) stacks like this:

| Element | Height | Notes |
|---------|--------|-------|
| Title bar | ~34px | compact title-only bar |
| Diagram wrapper | 300px max | Default target is 280–300px. Only exceed 300px if the diagram truly needs it. |
| Card area chrome | ~12px | border-top 1px + padding-top 8px + wrapper padding-bottom 8px |
| Verse card bar | 4px | Accent color strip |
| Verse card content | 112px | Slightly taller so 4 lines fit without clipping |
| Nav bar | ~46px | margin-top 10px + button height ~36px |
| **Total** | **~508px** | Leaves healthier room on standard iPhone screens |

### Standard iframe heights

Use these values in the lesson JSON `"height"` field:

| Widget type | Diagram area | iframe height |
|-------------|-------------|---------------|
| Small diagram (≤ 240px) + card + nav | ≤ 240px | `"500px"` |
| Medium diagram (~280px) + card + nav | ~280px | `"530px"` |
| Large diagram (300px) + card + nav | 300px | `"560px"` |
| No card/nav (e.g. bookshelf, standalone) | varies | Set to content height + 20px buffer |

**For new widgets with the standard card/nav layout, target a 280–300px diagram area and a 530–560px iframe height.** If the content does not fit, redesign the internal layout. Do not solve the problem by making the widget taller.

### Card area CSS values (must use these exact values)

```css
#card-area {
    padding-top: 8px;
}

.verse-card-wrapper {
    padding: 0 12px 8px;
}

.verse-card-content {
    padding: 10px 16px;
    height: 112px;
}
```

Do not increase these values. The card text must be written concisely enough to fit in 100px of content height. If text is too long, shorten the text — do not grow the card.

---

## Measuring, Resizing and Scroll Safety

This section exists because of a real bug in 202-08 and 202-09 (September 2026). On phones, scrolling up past the widget kept snapping the page back down by about the height of the widget, which made the lesson feel like it was "resetting." Read this before writing any code that reacts to `resize`.

### How the page measures a widget

To measure a widget, `scripts/widget-iframe.js` briefly sets the iframe to `0px` high, reads the content height, and sets the new height. It does this when the widget first loads, whenever anything in the widget's DOM changes (a MutationObserver watches the body, including attributes), and whenever the widget's size changes (a ResizeObserver). Each 0px collapse is itself a **resize of the widget's window**. It can also make the browser nudge the page's scroll position.

### What went wrong

Two things fed each other in a loop that never stopped.

1. **The widget refit on every resize.** `covenant-triangle.html` and `starting-gun.html` ran `fitCards()` on every `window` resize. `fitCards()` measures the cards by adding a hidden `#measure` element to the body and removing it again.
2. **The page re-measured on every DOM change.** Adding and removing `#measure` is a DOM change, so the page collapsed the iframe to 0px to measure again. That collapse was a resize, so `fitCards()` ran again, and so on, 5 to 10 times a second, even while nobody touched anything.

A second trigger showed up only on real phones. When you scroll up, Safari (and other phone browsers) slide the address bar back in, which fires `resize` on the page with only the **height** changed. The page re-measured every widget on every one of those, so the frame collapsed mid-scroll. Desktop test browsers have no sliding address bar, so the first round of testing missed it.

### Rules for widget code

1. **Refit only when the width changes.** A height-only resize cannot change how your cards wrap, and the page causes height-only resizes every time it measures you. Use this pattern:

```js
var rt = null, lastWidth = window.innerWidth;
// Refit only when the width changes. The page briefly resizes this frame's height to measure it,
// and refitting on that would start a measure-resize loop that jolts the page while scrolling.
window.addEventListener('resize', function () {
    if (window.innerWidth === lastWidth) return;
    lastWidth = window.innerWidth;
    clearTimeout(rt); rt = setTimeout(fitCards, 150);
});
```

2. **Nothing should change in the DOM while the widget is idle.** No timers that rewrite attributes, no measuring loops, no animations that keep writing `transform` after they finish. Every DOM change makes the page re-measure. Animate with `requestAnimationFrame` only while something is moving, then stop.
3. **Never change the parent page's scroll.** Do not call `scrollIntoView`, `scrollTo` or anything else that moves the lesson page. Calling `.focus()` on a button inside the widget is fine only right after the reader clicked inside the widget.
4. **Do not size anything from `window.innerHeight` or `vh` units inside a widget.** Inside the iframe, the viewport height is whatever the page last set, including that 0px moment.

### Rules for the page's widget loader (`scripts/widget-iframe.js`)

1. **Re-measure on window resize only when the width changes.** This ignores the phone address bar. It is already implemented as `onWindowResize`; keep it.
2. **Do not try to "fix" scroll position by calling `scrollTo` after measuring.** That was tried in PR #35. On a phone it snaps the page back while the reader is still scrolling, and the page's `scroll-behavior: smooth` makes it glide. It also made the ENG-003 check flaky (3 of 8 runs failed). If the page moves, fix whatever is causing extra measurements instead.

### How to test a widget for this

The 202-08/09 browser check (`scripts/review_202_08_09_browser_check.js`) contains three checks worth copying for any new widget lesson:

- **Stays still while idle:** after load, count changes to the iframe's `style` attribute for 1.5 seconds. It must be 0.
- **Scrolls up without snapping back:** start below the widget, scroll up in steps, and check that every scroll position is lower than the one before.
- **Ignores phone toolbar resizes:** do the same scroll-up while alternating the viewport height (for example 844 and 764 at the same 390 width). Frame writes must be 0 and scrolling must keep moving up.

If you suspect this problem, the quickest diagnosis is to count mutations inside the widget while idle (`new MutationObserver(...).observe(iframe.contentDocument.body, { childList: true, subtree: true, attributes: true })`). Any steady stream of changes when nobody is touching the widget is the bug.

---

## Common Mistakes to Avoid

1. **Body padding** — any `padding` on `body` eats into the available width and causes clipping on phones. Always `padding: 0`.
2. **Fixed max-width on widget-outer** — `max-width: 370px` on the outer container means the widget stops at 370px even when more space is available, and clips on smaller screens. Always `max-width: 100%`.
3. **Border-radius on widget-outer** — since the widget bleeds edge-to-edge, rounded corners on the outer shell look wrong. Save border-radius for inner cards only.
4. **Fixed SVG width** — a fixed `width="350"` on an SVG means labels on the right side clip when the iframe is narrower than 350px. Use `width="100%"` and a `viewBox` instead, or design the internal layout to fit 350px minimum.
5. **Wrong height in JSON** — if the height is too small, the card area and navigation buttons get clipped off the bottom and the user cannot interact with the widget. Always calculate the total height using the budget table above, and test on a 390px-wide phone screen.
6. **Card content too tall** — the verse-card-content height is locked at 112px. If card text overflows, shorten the text before making the widget taller.
7. **Growing the iframe instead of redesigning** — if a widget does not fit in 600px, the answer is never to make the iframe taller. Reduce the diagram area, tighten padding, or simplify the layout. Tall iframes break the reading experience on standard iPhones.
8. **Refitting on every resize:** running `fitCards()` or any other measuring code on every `window` resize starts a loop with the page's own measuring and makes the lesson jump while scrolling on phones. Refit only when `window.innerWidth` changes. See **Measuring, Resizing and Scroll Safety**.
