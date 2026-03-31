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
    padding-top: 16px;
}

.verse-card-wrapper {
    margin: 0 auto;
    padding: 0 16px 12px;
}

.verse-card {
    background: #FFFFFF;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 2px 14px rgba(44,36,22,0.06);
}

.verse-card-content {
    padding: 12px 16px;
    height: 125px;
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

## Height in Lesson JSON

Set widget height generously. The iframe auto-resizes on load, but having a close starting value prevents layout jump. Typical values:

- Simple diagram with card: `"height": "520px"`
- Larger diagram with card and more steps: `"height": "640px"`

---

## Common Mistakes to Avoid

1. **Body padding** - any `padding` on `body` eats into the available width and causes clipping on phones. Always `padding: 0`.
2. **Fixed max-width on widget-outer** - `max-width: 370px` on the outer container means the widget stops at 370px even when more space is available, and clips on smaller screens. Always `max-width: 100%`.
3. **Border-radius on widget-outer** - since the widget bleeds edge-to-edge, rounded corners on the outer shell look wrong. Save border-radius for inner cards only.
4. **Fixed SVG width** - a fixed `width="350"` on an SVG means labels on the right side clip when the iframe is narrower than 350px. Use `width="100%"` and a `viewBox` instead, or design the internal layout to fit 350px minimum.
5. **Wrong height in JSON** - if the height is too small, the card area gets cut off. Test on a 390px wide phone screen and add 20-30px of buffer.
