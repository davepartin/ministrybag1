# Widget Build Prompt: Biblical Storyline

Build a single self-contained HTML file called `biblical-storyline.html`. This is an interactive discipleship widget that lives inside an iframe in a mobile-first web app. Match the overall framework and feel of the other widgets such as `learning-circle2.html` and `armor-of-god.html`: title bar at top, diagram area in the middle, teaching card below, and back/next controls at the bottom.

## Core Concept

This widget teaches the biblical storyline using the visual of a single line that rises, falls, and rises again. The four movements of the Bible's story, Creation, Fall, Redemption, and Restoration, are mapped onto this line. The key teaching idea is that this four-movement pattern is not just the shape of the Bible's big story, but the shape of almost every story inside the Bible, and ultimately the shape of each believer's own story.

The widget walks through 7 states total, each showing the same line shape but with different story content mapped onto it.

## States

Build the widget in 7 states:

1. **Intro slide** - The line with the four movement labels only (Creation, Fall, Redemption, Restoration)
2. **The Bible's Big Story** - The same line with Bible-story labels: "God creates the world" at the top left, "Sin breaks everything" at the bottom of the dip, "Jesus comes to redeem" at the turning point, "Restored relationship with God" as the line rises back up
3. **Noah and the Flood** - Same line shape: "A good world and a righteous man" / "Humanity corrupts everything" / "God provides the ark" / "The waters recede, a covenant and a rainbow"
4. **Joseph to Egypt** - Same line shape: "Dreams and a father's favor" / "Betrayed, sold, imprisoned" / "God raises him from pit to palace" / "'You meant it for evil, but God meant it for good'"
5. **Moses and the Exodus** - Same line shape: "God's chosen people, Israel" / "Enslaved in Egypt for 400 years" / "God parts the sea and leads them out" / "The Promised Land and God's presence"
6. **Paul the Apostle** - Same line shape: "Brilliant, trained, zealous for God" / "Zeal turns murderous, persecutes the church" / "Jesus meets him on the road to Damascus" / "The church's greatest destroyer becomes its greatest builder"
7. **Your Story** - Same line shape with blank or reflective labels: "Made in God's image with purpose" / "Something broke" / "Jesus found you" / "Being restored, day by day"

## Title Bar

Use this title and subtitle:

- **Title:** The Biblical Storyline
- **Subtitle:** One story in four movements, told across all of Scripture

## Design System (must match existing widgets exactly)

### Fonts
- Title: `'Playfair Display', Georgia, serif` (weight 600)
- Subtitle / nav labels: `'Inter', -apple-system, sans-serif`
- Body text: `Georgia, Cambria, serif`
- Import: `@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Playfair+Display:wght@400;600;700&display=swap')`

### Colors
- Page background: `#F8F6F1`
- Card background: `#FFFFFF`
- Title bar background: `#2C2416`
- Title bar text: `#FAF8F3`
- Title bar subtitle: `#D4CFC4`
- Border color: `#EBE5D9`
- Body text: `#2C2416` or `#3D3426`
- Card shadow: `0 6px 20px rgba(44, 36, 22, 0.08)`

### Layout
- Full-width on mobile (no border-radius, no border)
- At `min-width: 560px`: add `border-radius: 12px`, `box-shadow`, `border: 1px solid #EBE5D9`, and `max-width: 460px` centered
- Match the responsive pattern from `learning-circle2.html`

## Diagram Design

Use SVG for the storyline diagram. The line should be the centerpiece of every state.

### The Line Shape
Draw one smooth, continuous line (using SVG `<path>` with curves or a polyline with rounded joins) that follows this shape:

1. Starts at the upper left (Creation), level and steady
2. Drops downward in a clear descent (Fall)
3. Reaches the lowest point (the bottom of the dip)
4. Turns and begins to rise (Redemption, the turning point)
5. Rises back up to the original level or slightly higher (Restoration)

The shape should feel like a valley, not a V. Use smooth curves, not sharp angles. The line should feel organic and hand-drawn in spirit, matching the warm aesthetic of the app.

### Labels on the Line
Each state places four labels at the four key points on the line:

- **Creation label** - positioned at the start/top of the line
- **Fall label** - positioned at the descent or lowest point
- **Redemption label** - positioned at the turning point where the line begins to rise
- **Restoration label** - positioned at the end where the line has risen back up

Labels should be short text blocks (2-6 words max) styled as small cards or tags near their point on the line.

### Visual Style

**The line itself:**
- Use a warm, muted color palette. Not bright primary colors.
- Suggested line color: a warm dark brown or charcoal (`#5A4E3C` or `#2C2416`) with a stroke width of 3-4px
- The line should animate in smoothly when each state loads (draw-on effect, about 0.8s ease)

**Movement markers:**
- Place small circles (8-10px) at each of the four key points on the line
- Use a subtle accent color for the current movement being highlighted
- Suggested accent colors (one per movement):
  - Creation: `#4A7C59` (forest green)
  - Fall: `#8A4E42` (muted red-brown)
  - Redemption: `#55697B` (slate blue)
  - Restoration: `#B8860B` (warm gold)

**State transitions:**
- When navigating between states, the line should remain the same shape (it never changes)
- Only the labels change, fading out and fading in (0.35s ease)
- The story title in the card below should also transition

**"Your Story" state (final):**
- The line should use a slightly different visual treatment: dashed or lighter stroke, suggesting the story is still being written
- The labels should feel more personal and reflective

## Card Content Structure

Below the diagram, use the same teaching card pattern as the other widgets.

For each state, the card should include:
- **Story title** as the card heading (e.g., "The Bible's Big Story", "Noah and the Flood", etc.)
- A **one-sentence summary** of the story and how it maps to the four movements
- A small **label or tag** showing which scenario you are on (e.g., "1 of 7" or progress indicator)

### Card Content for Each State

**Intro:**
- Title: The Four Movements
- Body: Every story in the Bible follows the same pattern: something good, something broken, God stepping in, and a new beginning. This is the biblical storyline.

**The Bible's Big Story:**
- Title: The Bible's Big Story
- Body: From Genesis to Revelation, the Bible tells one continuous story. God creates a good world, sin breaks it, Jesus comes to rescue, and one day God will make all things new.

**Noah:**
- Title: Noah and the Flood
- Body: Humanity fell so far that God grieved He had made them. But He provided an ark, a way of rescue through judgment, and set a rainbow in the sky as a promise to start again.

**Joseph:**
- Title: Joseph to Egypt
- Body: Betrayed by his brothers and imprisoned for years, Joseph was raised from the pit to the palace. What others meant for evil, God meant for good.

**Moses:**
- Title: Moses and the Exodus
- Body: God's people cried out from slavery for four hundred years. God heard them, sent Moses, and led them out through blood and water into the land He had promised.

**Paul:**
- Title: Paul the Apostle
- Body: A man who hunted the church was met by Jesus on the road and turned inside out. The greatest destroyer became the greatest builder.

**Your Story:**
- Title: Your Story
- Body: You were made with purpose. Something broke. Jesus found you. And now the same God who has been writing rescue into every story is writing it into yours.

## Behavior

- Intro screen starts with the line and four movement labels, no story content
- Each tap of Next advances to the next scenario
- Back returns to the previous scenario
- Progress dots or indicators should match the number of states (7)
- The line shape never changes between states, only the labels and card content
- "Your Story" state should have a "Start Over" button instead of "Next"
- The line draws itself in on the intro state, then stays static for subsequent states (only labels animate)

## Technical Requirements

- Single self-contained HTML file
- No external frameworks
- Mobile-first layout
- SVG must use `viewBox` and responsive sizing
- Do not use fixed pixel width on the SVG element itself
- Keep the widget visually consistent with the existing discipleship widgets
- Use clean CSS and vanilla JavaScript
- All data should come from a single array of scenario objects

## Design Goal

This should feel thoughtful, warm, and mature. The storyline should feel like a thread connecting everything in Scripture, not a chart in a textbook. The finished widget should help someone see the shape of the Bible's story and realize it is the same shape as their own.
