# Widget Design Guide

This guide defines the rules for building interactive widgets in the discipleship app. Every widget is embedded as a full-width iframe in the lesson page. Follow these rules consistently so widgets always look right on both phone and desktop.

---

## How Widgets Are Rendered

The lesson renderer (index.html) embeds each widget in an `<iframe>` that is:

- `width: 100%` of the lesson content area
- No border, no border-radius
- Margin of `24px -20px` (negative horizontal margin so the iframe bleeds edge-to-edge past the lesson's 20px side padding)
- Height is set by the `height` field in the lesson JSON (e.g. `"height": "640px"`)

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

All widgets use this dark title bar pattern at the top:

```css
.title-bar {
    background: #2C2416;
    padding: 10px 20px 8px;
    text-align: center;
}

.title-bar h1 {
    font-size: 22px;
    font-weight: 600;
    color: #FAF8F3;
    font-family: 'Playfair Display', Georgia, serif;
    letter-spacing: 0.5px;
    margin: 0;
    line-height: 1.2;
}

.title-bar p {
    font-size: 13px;
    color: #D4CFC4;
    margin: 4px 0 0;
    font-family: 'Inter', -apple-system, sans-serif;
    font-weight: 400;
}
```

---

## Card Area

The bottom card/verse area uses:

```css
#card-area {
    background-color: #F6F4EE;
    border-top: 1px solid #EBE5D9;
    padding-top: 10px;
}

.verse-card-wrapper {
    margin: 0 auto;
    padding: 0 16px 8px;
}

.verse-card {
    background: #FFFFFF;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 2px 14px rgba(44,36,22,0.06);
}

.verse-card-content {
    padding: 10px 16px;
    height: 100px;
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
| Title bar | ~55px | padding 18px + title + subtitle |
| Diagram wrapper | 370px max | This is the largest element. Keep ≤ 370px. For new widgets, target 300px. |
| Card area chrome | ~15px | border-top 1px + padding-top 10px + wrapper padding-bottom 8px = ~19px minus overlap |
| Verse card bar | 4px | Accent color strip |
| Verse card content | 100px | Fixed height to prevent button shift between steps |
| Nav bar | ~46px | margin-top 10px + button height ~36px |
| **Total** | **~590px** | Must fit inside the iframe height with a few px of buffer |

### Standard iframe heights

Use these values in the lesson JSON `"height"` field:

| Widget type | Diagram area | iframe height |
|-------------|-------------|---------------|
| Small diagram (≤ 250px) + card + nav | ≤ 250px | `"520px"` |
| Medium diagram (~300px) + card + nav | ~300px | `"560px"` |
| Large diagram (370px) + card + nav | 370px | `"600px"` |
| No card/nav (e.g. bookshelf, standalone) | varies | Set to content height + 20px buffer |

**For new widgets with the standard card/nav layout, target a 300px diagram area and a 560px iframe height.** Only use 370px / 600px when the diagram genuinely needs the extra space. Never go above 600px — if the content does not fit in 600px, redesign the internal layout rather than growing the iframe.

### Card area CSS values (must use these exact values)

```css
#card-area {
    padding-top: 10px;
}

.verse-card-wrapper {
    padding: 0 16px 8px;
}

.verse-card-content {
    padding: 10px 16px;
    height: 100px;
}
```

Do not increase these values. The card text must be written concisely enough to fit in 100px of content height. If text is too long, shorten the text — do not grow the card.

---

## Common Mistakes to Avoid

1. **Body padding** — any `padding` on `body` eats into the available width and causes clipping on phones. Always `padding: 0`.
2. **Fixed max-width on widget-outer** — `max-width: 370px` on the outer container means the widget stops at 370px even when more space is available, and clips on smaller screens. Always `max-width: 100%`.
3. **Border-radius on widget-outer** — since the widget bleeds edge-to-edge, rounded corners on the outer shell look wrong. Save border-radius for inner cards only.
4. **Fixed SVG width** — a fixed `width="350"` on an SVG means labels on the right side clip when the iframe is narrower than 350px. Use `width="100%"` and a `viewBox` instead, or design the internal layout to fit 350px minimum.
5. **Wrong height in JSON** — if the height is too small, the card area and navigation buttons get clipped off the bottom and the user cannot interact with the widget. Always calculate the total height using the budget table above, and test on a 390px-wide phone screen.
6. **Card content too tall** — the verse-card-content height is locked at 100px. If card text overflows, shorten the text. Do not increase the card height, or the nav buttons will be pushed below the iframe edge.
7. **Growing the iframe instead of redesigning** — if a widget does not fit in 600px, the answer is never to make the iframe taller. Reduce the diagram area, tighten padding, or simplify the layout. Tall iframes break the reading experience on standard iPhones.
