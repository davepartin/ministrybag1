# UX-001a: 201-01 and 201-08 learner-journey review

Prepared September 12, 2026 by Grok Build. Supports UX-001. This packet is a read-only usability review, not an implementation, not a human pilot, and not lesson approval.

Reviewed app commit: `ea93b131b1abc6d72a0948e151e8c4e467312899`. Browser: Chrome headless, fresh context per viewport, synthetic answers only. Viewports: 375x812, 390x844, and 1280x800. Actual iPhone/Safari, a real conversation, and cross-device transfer were not tested. Changing viewport is not device handoff.

## Method

From the home view, opened Growing Deep, then lesson 1. Read the opening, found the running-Father image, walked every Great Command step including Back and Restart, answered the mid-lesson and closing fields, returned home, and reopened 201-01. Then opened 201-08 from the course dropdown, viewed the king's-mercy image, walked every Grace and Mercy step including Back and Restart, answered the fields, used Next into 201-09 and Back, returned home, and reopened 201-08. TOC was inspected as a retrieval path. Direct hash `#201-8` was used only as a supporting check.

Synthetic values used the `SYN-201-01-` and `SYN-201-08-` prefixes. They survived home/lesson return and neighbor-lesson round trip in the same browser profile. This does not claim laptop-to-phone transfer.

## What already works

- Home to 201 dropdown to a named lesson is discoverable. Direct hash `#201-8` lands on the same lesson.
- No outer-page horizontal overflow on 201-01 or 201-08 at the three viewports.
- Paired story images load. The king's-mercy color treatment is readable once the image is in view.
- 201-01's completed Great Command tool fits below the topbar at 375px: title, cross, card, Back, and Restart are on one screen.
- Closing answers save in the current browser and reload after navigation away and back.
- Save feedback reports that lesson answers are stored on this device.

There is no Discuss view today. The current lesson is a single long Read scroll.

## Ranked findings

At most five. Observed defects are labeled separately from design suggestions.

### 1. Observed usability gap: a meeting has no shortcut to insight, next step or prayer

- **Lesson / step:** 201-08 Closing Reflections (`201-08-key`, `201-08-step`, `201-08-prayer`). Same pattern on 201-01.
- **Viewport:** 375x812, 390x844, and 1280x800.
- **Expected:** For a meeting, a learner can open the big truth, the complete diagram, the saved insight, the next step, and the prayer in a few taps, from the same saved answers.
- **Observed:** Those fields exist only at the bottom of the Read scroll. TOC lists lessons, not sections. There is no jump to the widget, the closing trio, or the previous lesson's step.

| Viewport | 201-08 widget, screens from top | 201-08 key / step / prayer, screens from top | Lesson scroll height |
|---|---|---|---|
| 375x812 | 5.31 | 11.07 / 11.32 / 11.57 | 9181 px |
| 390x844 | 4.95 | 10.29 / 10.53 / 10.77 | 8543 px |
| 1280x800 | 3.90 | 8.21 / 8.44 / 8.66 | 6815 px |

Reproduction: open 201-08, try to show a partner this week's step. Use the hamburger TOC, then scroll. TOC items are lessons 1-10 only. The closing prompts are after Lesson 8 Review. On 375px the three closing fields themselves do not fit on one screen; prayer sits below key and step.

- **Files:** `index.html` (TOC and lesson topbar), `data/201-08.json` (block order), `data/201-01.json`.
- **Smallest improvement:** Add a Discuss presentation that reads the existing lesson source and `question-201-201-08-*` answers. Do not duplicate the curriculum. See the proposal below.

### 2. Observed usability defect: the completed Grace view needs careful scroll alignment

- **Lesson / step:** 201-08 widget, final step ("Give Grace, Show Mercy, and Forgive").
- **Viewport:** 375x812, 390x844, and 1280x800. 201-01's completed tool is the contrast case: it does fit at 375px.
- **Expected:** Title, all four box labels, the cycle, the card, and Back/Restart share one visible frame, matching the widget guide's rule that a learner should see the title bar and the primary control without scrolling inside the tool. Guide target for a standard iPhone is about 620px of widget space; complete-state iframe height should stay in the 530-560px band.
- **Observed:** At the final step, measured iframe height was 649px at 375/390 and 683px at 1280. The ordinary control-click scroll position can leave the widget title or upper diagram hidden behind the sticky lesson topbar (about 85px). Exact occlusion depends on alignment. Coordinator verification found that manually aligning the iframe below the topbar makes the entire widget fit in all three tested viewports without a save banner. This is awkward positioning and excess height relative to the design budget, not an absolute inability to display the full diagram. A save banner reduces the available space further.

Reproduction: open `#201-8`, tap Begin, tap Next four times until Restart appears, scroll until Back and Restart are in view. The top boxes show "getting a GIFT you don't deserve" and "not getting the PUNISHMENT you do deserve" with their names cut off. The 201-01 completed Great Command at the same 375px alignment keeps title, diagram, card, and controls on screen (iframe 480px).

- **Files:** `widgets/grace-diagram.html`, `scripts/widget-iframe.js`, `index.html` (sticky `.lesson-topbar`), `widgets/widget.md` (height budget).
- **Smallest improvement:** Add a compact complete-diagram state whose title, four labels, and cycle fit below the topbar. Do not solve it by growing the iframe. UX-002 can own the shared shell; UX-001 only needs this one complete view for 201-08 Discuss.

### 3. Observed defect: 201-08 Restart does not return to the start and does not keep the completed diagram

- **Lesson / step:** 201-08 widget Restart, compared with 201-01 Restart.
- **Viewport:** All three. Behavior is in the widget script, then confirmed in Chrome.
- **Expected:** Restart restores a known beginning, or a complete-diagram review state that a conversation can reuse. Back remains available one step at a time.
- **Observed:** 201-01 Restart returns to Begin (intro). 201-08 Restart skips the intro and lands on Mercy with Next as the primary control. There is no "show whole diagram" control. A learner who finished the cycle and wants the picture again must step through five cards or live with the clipped complete state in finding 2.

Reproduction: in 201-08, Begin, Next to Restart, tap Restart. Primary control is Next, not Begin. Back is enabled. In 201-01 the same sequence returns Begin.

- **Files:** `widgets/grace-diagram.html` (Restart sets `step = 0` rather than the intro index), `widgets/great-command.html` (Restart sets `step = -1`).
- **Smallest improvement:** Make 201-08 Restart match 201-01, and add a separate complete-diagram control for Discuss. Do not use Restart as that control.

### 4. Accessibility wording suggestion: describe the running-Father composition more directly

- **Lesson / step:** 201-01 story image, first view and after further scroll.
- **Viewport:** 375x812 (same composition at 390 and 1280).
- **Expected:** Alt text matches the visible picture so a learner, and assistive tech, can hold the same image the lesson is teaching.
- **Observed:** The file shows a father running down a road toward a small distant figure. It does not show an embrace. The existing phrase "running ... to embrace" describes intended action, not necessarily a visible embrace, so this is a clarity suggestion rather than proof of incorrect alt text. Color is a scroll-reveal: black-and-white opacity was 1.0 when the image first entered view, 0.821 when centered, and 0.197 after another 280px of scroll at 375px. The JSON alt string is "A father lifting his robe and running down the road to embrace his returning son".

Reproduction: open 201-01, scroll to the story image before it has moved far up the screen. Compare the picture with the `alt` in `data/201-01.json`.

- **Files:** `data/201-01.json` (image block `alt`), `images/running-father-bw3.jpeg`, `images/running-father-color3.jpeg`.
- **Smallest improvement:** Describe the actual composition: a father running toward a distant son on the road. Keep the embrace in the parable prose, where it belongs. The king's-mercy alt on 201-08 already matches that picture.

### 5. Design suggestion: 201-08 makes the learner tour the four words twice before 8.2 and the closing trio

- **Lesson / step:** 201-08 from the opening definitions through "Walking Through the Five Steps" to question 8.2.
- **Viewport:** All three. This is length and order, not a clipping bug.
- **Expected:** After the widget, a short chance to say what the picture meant, then the mercy application. The completed diagram remains one tap away during a meeting.
- **Observed:** The lesson defines Grace, Mercy, Justified, and Righteous before the parable. Question 8.1 sits immediately above the widget. After the cycle, five explanatory steps retell the same four words before 8.2. At 375px, 8.2 is about 3.4 screens below the widget (8.74 vs 5.31). The closing trio is still later. This is why finding 1 is so costly in a conversation. It matches the earlier editorial note; it is not a new theological claim.

Reproduction: after finishing the widget on 201-08, note the next heading, "Walking Through the Five Steps", and how far 8.2 still is.

- **Files:** `data/201-08.json` (blocks before the parable and after the widget), `project-management/reviews/201-08-benchmark-proposal.md`.
- **Smallest improvement:** Leave wording to Dave and EDIT-001. For UX-001, skip this second tour in Discuss: show the complete diagram and the saved answers instead of restating the five steps.

## Proposed 201-08 Discuss view

Proposal only. Do not implement in this packet. Preserve `data/201-08.json`, `widgets/grace-diagram.html`, and existing answer IDs.

### Purpose

Laptop preparation and phone conversation from the same lesson and the same saved answers. No second curriculum. No automatic disclosure to a discipler. The learner shows the phone, or looks at it together.

### How a learner reaches it

Keep today's lesson as Read.

1. In 201-08, a topbar control labeled Discuss, beside the existing lesson menu.
2. The same control on the current lesson row in the course dropdown and TOC.
3. A shareable in-app hash such as `#201-8-discuss`, resolved only after the lesson is already loadable as `#201-8`.
4. At the end of Read, a line under Closing Reflections: "Use this in a conversation", pointing at the same view.

If Discuss is opened with empty answers, show the prompts and a button back to the Read closing fields. Do not invent text.

### What it shows, in this order

Phone-first. Target: one to two screens at 375x812, with the complete diagram fully labeled.

1. **Main truth.** Use the current Lesson 8 Review paragraph until Dave accepts EDIT-001 wording. If that proposal is accepted, the one-line truth is: Because God has shown you mercy in Christ, you can begin to show that mercy to others.
2. **Complete teaching diagram.** The finished four-box cycle with Mercy, Justified, Righteous, and Grace all labeled, plus the cycle arrow. Compact static complete state from the existing widget source, not a live five-step walk and not a copied lesson. If the iframe cannot fit, render the completed diagram as a static fallback in the same view.
3. **Saved insight.** `question-201-201-08-key`.
4. **Next step.** `question-201-201-08-step`.
5. **Prayer.** `question-201-201-08-prayer`.
6. **Prior commitment.** One tap to `question-201-201-07-step` when present, labeled "Previous lesson's step" to preserve the self-paced course. Do not open a different course. If that field is empty, say no previous step has been recorded. A separate collapsed control may show 8.3 (`question-201-201-08-3`) as "This lesson's mercy application"; never substitute it under the previous-step label.

Read remains available through a matching Read control. Switching Read/Discuss must not copy or clear answers.

### What it must not do

- Store a second set of answers or a parallel lesson JSON.
- Reveal answers to anyone who is not looking at this browser.
- Auto-advance, auto-play, or require walking the widget again to see the picture.
- Depend on login or cross-device sync. DATA-001 still owns transfer. Discuss can ship on one device.

### Implementation handoff

UX-001 can prototype this on 201-08 once shared `index.html` / widget ownership is free. Finding 2's compact complete diagram is the visual dependency. Finding 3's Restart behavior can stay in UX-002 if Discuss has its own complete-diagram path. Do not wait on 201-08 editorial approval to prototype the shell with current text. Do not treat this review as a phone conversation test; that remains a UX-001 gate with a real pair.

## Coordinator verification and interpretation

September 12, 2026, REV-006. Reproduced final-state iframe heights of 649px at 375/390 and 683px at 1280. With no save banner and manual alignment below the 85px topbar, iframe bounds were about y=90..739 on both phone sizes and y=89..772 on laptop. The whole widget therefore fits these tested viewports after alignment. Screenshots confirmed title occlusion at the ordinary post-click position and full visibility after alignment. Restart consistently returned Back/Next rather than Begin. Inspected the actual father image and narrowed finding 4 to a wording suggestion. Findings 1 and 5 support the planned Discuss prototype; they do not authorize removing lesson prose.

The reported screen-distance figures describe the worker's measured state, not fixed layout constants: they vary with current widget state, answer height and banners. The coordinator independently confirmed the long scroll but did not reproduce every numerical figure or every navigation path. Actual iPhone/Safari, a saved-banner fit audit and a human pilot remain unverified in this review.

## Source fingerprints at review

- `data/201-01.json`: `fc09507c03f1b5165fc438c7b9e34c1ecfda8c5ca34d7ae69fe63a8f5e243678`
- `data/201-08.json`: `fcc20b3f2a5e08975dbd7abc43f1be1226e9234dcbee913b1c0609b9f48f00df`
- `widgets/grace-diagram.html`: `5d57617688d3163be855c72502c405ef1d71852a443022d22f728735953bf96b`
- `widgets/great-command.html`: `3965d1e7c219a36b2a2cbbd5cf70a35d5cb8781215f2874f7e75f11f4b8f9c90`
- `index.html`: `90fc795823217384e276ec651c5993ced9ec01114907fc6e4b4c54a8b2249e87`
