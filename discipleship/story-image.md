# Story Image Pattern

This file explains the reusable **story-image dissolve pattern** used in Lesson `201-03`.

Use this when a lesson has:

- a story or parable near the top
- a black-and-white sketch
- a matching color version of the same image
- a desire to reveal the color version gradually as the learner scrolls

The goal is simple:

- the learner first sees the image in **black and white**
- as the image moves upward on the page, the **black-and-white layer dissolves away**
- the **color image underneath** is slowly revealed
- if motion should not run, the **color image is shown by default**

This pattern is especially good for parables, story hooks, Bible scenes, and visual anchors early in a lesson.

## Best Structure

Do **not** put the dissolve image inside the parable card itself.

The cleaner pattern is:

1. A dedicated `image` block for the dissolve image
2. A `parable` block directly underneath for the story text

This gives better control over layout and scroll behavior.

It also lets the image and story card visually touch without awkward spacing.

## JSON Shape

For a dissolve image, use an `image` block with these fields:

```json
{
  "type": "image",
  "imageBw": "images/pillar-fire-bw.png",
  "imageColor": "images/pillar-fire-color.png",
  "alt": "Israel gathered in the wilderness at night as the pillar of fire rises before them",
  "touchNext": true
}
```

Then place the story card immediately after it:

```json
{
  "type": "parable",
  "title": "The Pillar in the Wilderness",
  "text": "Story text here..."
}
```

### Field meanings

- `imageBw`: the black-and-white image shown first
- `imageColor`: the matching color image underneath
- `alt`: the accessible description
- `touchNext`: removes the gap between the image block and the next parable card

## Rendering Logic

The working pattern is:

- the **color image is the base layer**
- the **black-and-white image sits on top**
- scrolling reduces the opacity of the black-and-white layer

This is more reliable than trying to fade the color image in.

Why:

- the learner begins with a true black-and-white view
- the color is always already present underneath
- the effect is just "erase the sketch layer"

## Validation Rule

If you add this pattern to another lesson, the renderer must treat an `image` block as valid when it has either:

- `src`
- or both `imageBw` and `imageColor`

In `index.html`, the validation logic was updated to allow:

```js
case 'image':
    return requireString(block.src) || (requireString(block.imageBw) && requireString(block.imageColor));
```

## CSS Pattern

The dissolve image block uses:

- a wrapper for layout and spacing
- a dissolve container with `position: relative`
- a color image underneath
- a black-and-white image absolutely positioned on top

Conceptually:

```css
.block-image-dissolve {
    position: relative;
    overflow: hidden;
}

.block-image-dissolve .parable-img-color {
    position: relative;
    z-index: 1;
}

.block-image-dissolve .parable-img-bw {
    position: absolute;
    inset: 0;
    z-index: 2;
    opacity: 1;
    pointer-events: none;
}

.block-image-dissolve.parable-dissolve-static .parable-img-bw {
    opacity: 0 !important;
}
```

## Touching Layout

If the image should visually connect to the story card below it:

- add `touchNext: true` to the `image` block
- remove the bottom radius from the image block
- remove the top radius from the following parable card
- remove the gap between them

This creates one visual unit while keeping the content blocks separate.

## Reduced Motion Rule

If the user prefers reduced motion, or if the scroll-based effect should not run, the black-and-white overlay should be removed immediately so the learner sees the color image statically.

Conceptually:

```js
if (prefersReducedMotion || !canAnimateOnScroll) {
    el.classList.add('parable-dissolve-static');
    bwImg.style.opacity = '0';
}
```

## Scroll Timing We Landed On

The current `201-03` dissolve uses these two timing numbers:

```js
const fadeStartY = contentTop + (visibleHeight * 0.40);
const fadeEndY = contentTop + (visibleHeight * -0.22);
```

### Meaning

- `0.40` means the dissolve begins when the image reaches about **40% down the visible lesson area**
- `-0.22` means the dissolve does not fully finish until the image has moved **22% above** the visible lesson area

This gives the effect we liked:

- black-and-white at first
- the sketch lingers a good while
- the color slowly emerges
- the sketch is still hanging on as the image nears the top

### Memory phrase

Use:

- `start at 40`
- `finish at -22`

## Update Formula

The current dissolve is driven by the image's position in the visible lesson area, taking the sticky top bar into account.

Conceptually:

```js
const viewportHeight = window.innerHeight || document.documentElement.clientHeight || 1;
const topbar = document.querySelector('.lesson-topbar');
const contentTop = topbar ? topbar.getBoundingClientRect().bottom : 0;
const visibleHeight = Math.max(viewportHeight - contentTop, 1);

const fadeStartY = contentTop + (visibleHeight * 0.40);
const fadeEndY = contentTop + (visibleHeight * -0.22);
const fadeRange = Math.max(fadeStartY - fadeEndY, 1);

const progress = clamp((fadeStartY - rect.top) / fadeRange, 0, 1);
bwImg.style.opacity = (1 - progress).toFixed(3);
```

The important idea is:

- compare the image's top edge to the **visible content area**
- do **not** key this off a naive full-window top edge if a sticky topbar exists

## AI Instructions Template

If you want to hand this to an AI for another lesson, use something like this:

> Add a standalone story image block before the parable text. Use a black-and-white image and a matching color image. The color image should sit underneath and the black-and-white image should sit on top and dissolve away as the learner scrolls. The image should start fully black and white. The dissolve should begin when the image reaches about 40% down the visible lesson area and finish after the image has moved a bit above the visible area, using the current `201-03` timing pattern. If reduced motion is preferred, show the color image statically. The image block should visually touch the parable card below it with no gap.

## When To Use This Pattern

Use it when:

- the image is a key emotional hook
- the lesson opens with a strong Bible scene
- a subtle reveal helps the learner feel the transition from sketch to living scene

Do not use it when:

- the image is unrelated decoration
- the two versions are not precisely matched
- the lesson does not benefit from scroll interaction

## Files Touched In 201-03

For the current implementation, the pattern lives in:

- [index.html](/Users/dpartin/Library/Mobile%20Documents/com~apple~CloudDocs/Documents/GitHub/ministrybag1/discipleship/index.html)
- [data/201-03.json](/Users/dpartin/Library/Mobile%20Documents/com~apple~CloudDocs/Documents/GitHub/ministrybag1/discipleship/data/201-03.json)

If you reuse it in another lesson, those are the first places to study.
