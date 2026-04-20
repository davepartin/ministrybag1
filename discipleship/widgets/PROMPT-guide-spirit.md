# Build a "GUIDE" Widget: The Five Actions of the Holy Spirit

## The Big Idea

Create a self-contained HTML widget that teaches the five actions of the Holy Spirit using the acronym **GUIDE**. The widget lives in a lesson called "Guided by the Holy Spirit" (lesson 201-03 in a 47-lesson discipleship series called **Growing Together**). The learner is a new or growing Christian reading on their phone, likely during a lunch break with a mentor or a friend.

As the learner taps through, the word **GUIDE** builds one letter at a time across the top of the widget, and a **trail rising up a mountain** (or winding through woods - pick the image that feels most meaningful and warm, but a mountain switchback is preferred) fills in stop by stop. Each stop on the trail displays the name of that action of the Spirit (Glorifies, Unites, Inspires, Directs, Eternal) and stays visible as the next one is added, so by the end the learner sees the whole word GUIDE at the top and the whole trail built out below. At the bottom, a verse card displays the anchor Scripture for each step as they navigate.

## Visual Direction

- Phone-first design (max width about 460px).
- Warm earth tones paired with the course green `#1A6B55` as the accent color. Soft background `#D4F2E8` for card areas.
- Hand-drawn nature feel rather than cartoon or corporate. Think of a subtle trail carved into a hillside with a few trees, a ridge line, and a summit in the distance.
- The trail should feel like a real hiking path with gentle elevation gains. The final stop near the top should open up into a small summit view - the sense that the Spirit has led the disciple into open country with Jesus.
- Avoid clip art. Avoid emojis. The tone is warm, reverent, and quietly beautiful.

## Top Letter Strip

At the very top of the widget (below the title bar) there is a row of five letter slots: **G U I D E**. Each slot starts faint or empty (a light gray placeholder). When the learner clicks Next, the next letter fades and glows into place in a bold serif display using the course green. By step 5 the whole word GUIDE is lit up across the top.

## The Trail and the Five Stops

Below the letter strip sits the diagram area (about 370px tall). A trail begins at the lower-left (the valley) and winds up the hillside to the upper-right (the summit). Five markers sit along the trail - a signpost, a cairn, a tree, or a clearing (designer's choice, but consistent). Each marker is labeled with the action it represents.

As the learner advances, the next trail segment draws itself with a smooth stroke-dashoffset animation and the next stop marker fades in. All previous markers and segments stay visible, so the trail builds toward the summit.

Stops, in order:

1. **G - Glorifies the Savior.** John 16:14 ESV. "He will glorify me, for he will take what is mine and declare it to you." *The Spirit always points to Jesus. If something calls itself "Spirit" but does not exalt Christ, it is not Him.*

2. **U - Unites Sinners to God.** Romans 8:15-16 ESV. "You have received the Spirit of adoption as sons, by whom we cry, 'Abba! Father!' The Spirit himself bears witness with our spirit that we are children of God." *The Spirit closes the distance sin created and makes us sons and daughters.*

3. **I - Inspires and Illuminates Scripture.** 2 Peter 1:21 ESV. "No prophecy of Scripture comes from someone's own interpretation... men spoke from God as they were carried along by the Holy Spirit." *The same Spirit who inspired the Bible is the one who helps you understand it.*

4. **D - Directs Steps.** Romans 8:14 ESV. "For all who are led by the Spirit of God are sons of God." *Like the pillar of cloud and fire that led Israel (Exodus 13:21-22), the Spirit walks ahead of you.*

5. **E - Eternal Security.** Ephesians 1:13-14 ESV. "You were sealed with the promised Holy Spirit, who is the guarantee of our inheritance." *The Spirit is God's deposit in you, guaranteeing the rest of salvation will come.*

## Verse Card at the Bottom

Below the diagram sits a verse card (matching the pattern in `widgets/learning-circle2.html`). For each step, the card displays:

- A small accent bar across the top in the course green
- The action title (e.g., "**Glorifies** the Savior")
- The verse text (ESV) with bold key words
- The verse reference in a smaller caption below

When the learner advances, the card swaps cleanly with a short fade-slide animation.

## Interaction

- **Intro state:** before any step is clicked, the diagram area shows a soft welcome overlay with a short verse. Suggested: John 14:16-17 ESV, "I will ask the Father, and he will give you another Helper, to be with you forever."
- **Begin button** starts the walk at step 1 (G - Glorifies).
- **Next button** reveals the next letter, trail segment, stop marker, and verse card together.
- **Back button** walks it backward one step at a time.
- **Dots** at the bottom show progress and allow tapping back to any previously visited step.
- **Final state** shows the complete word GUIDE, the whole trail, and a subtle "well done" feel. Next turns into **Restart**, which returns to the intro.

## Technical Requirements

- One self-contained HTML file. All CSS and JS inline.
- No external dependencies beyond Google Fonts (Playfair Display, Inter, Trebuchet MS - already used elsewhere in the app).
- `body { background: transparent; }` so the widget blends into the lesson.
- Phone-first but graceful on desktop (max-width 460px, centered, soft border on larger screens).
- SVG for the trail, hills, and markers. CSS transitions and `stroke-dashoffset` animations for smooth reveals.
- Course color for 201: `#1A6B55` (primary green), `#D4F2E8` (soft green background), `#2C2416` (deep warm charcoal for body text).
- Save the finished file as `widgets/guide-spirit.html`.

## Model to Study

Use `widgets/learning-circle2.html` as the structural reference. Match its patterns exactly where possible:

- Title bar at the top with the widget name and subtitle
- Diagram area in the middle that builds progressively with each step
- Verse card area at the bottom with per-step title, verse text, reference, and accent bar
- Navigation row with Back button, progress dots, and Next button
- Intro overlay on first load before any step is clicked
- Opacity fades and stroke-dashoffset animations for smooth reveals

Title bar text for this widget:

- **Title:** The GUIDE of the Holy Spirit
- **Subtitle:** Five actions of the Spirit who walks with you

That is the whole build. Keep it warm, unhurried, and visually quiet. This widget will be the centerpiece of a lesson that teaches new believers how to recognize the Spirit's real work in their life.
