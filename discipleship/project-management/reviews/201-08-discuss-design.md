# 201-08 Discuss view: design proposal

Prepared September 12, 2026 by Grok Build. Documentation only. This is not implementation, lesson approval, a human conversation test, or a claim that UX-001 is done.

Coordinator review REV-009, September 12: corrected the illustrative Mercy wording and clarified source fidelity, long-answer navigation, live unsaved values and diagram reuse. This is an accepted prototype specification, not a tested screen.

Supports parent task UX-001. Builds on [UX-001a](2026-09-12-UX-001a-grok-build.md), [UX-001b / REV-007](../logs/2026-09-12-REV-007-codex.md), and [EDIT-001](201-08-benchmark-proposal.md). Shared `index.html` remains with engineering until ENG-006b is finished. Do not start the Discuss UI from this file.

## Purpose

Give a learner one phone-sized meeting surface for 201-08 that shows, from the same lesson and the same saved answers:

1. The main truth
2. The complete Grace and Mercy diagram
3. The saved insight
4. The next step
5. The prayer

Laptop preparation and phone conversation use that one view. There is no second curriculum and no automatic disclosure to a discipler. The learner opens the phone, or sits with someone and shows it.

## Constraints that stay in force

- Reuse `data/201-08.json` and existing runtime IDs. Do not add a parallel lesson file or a second answer store.
- Reuse the existing Grace diagram data already in `widgets/grace-diagram.html`. Prefer the compact **Show whole diagram** state from UX-001b (444px on phone as a full tool). In Discuss, hide guided chrome (Begin, Next, Back, Restart, Return to steps) so the picture can sit with the answers.
- Do not rewrite widget theology, verse text, or box definitions here. EDIT-001 wording waits on Dave.
- DATA-001 still owns device handoff. Discuss ships on the current browser and device.
- A real conversation test remains a UX-001 gate after a prototype exists.

## Phone layout (375px)

Target: the five required pieces visible in one or two short screens at 375x812 for short sample answers, after the sticky course header. This is a design target, not a measured fit or a limit on learner writing. Provide in-view jump links to Insight, Next step and Prayer so long answers never force scrolling through everything above them. Preserve full answers, line breaks and readable type; do not silently truncate or shrink text to meet the target.

Use the current Lesson 8 Review text from its existing block as the main truth until Dave accepts EDIT-001. The abbreviated main-truth text in the sketch below is a layout illustration, not replacement lesson prose. The prototype must render the actual source block without a hard-coded rewrite. If that proposal is accepted, replace the paragraph with: Because God has shown you mercy in Christ, you can begin to show that mercy to others.

```
+--------------------------------------+
|  <  201 Growing Deep           [=]   |
|     8. The Grace and Mercy Cycle     |
|  [ Read ]  [ Discuss ]               |
+--------------------------------------+
| MAIN TRUTH                           |
| Four words name what God did for     |
| you at the cross: Mercy, Justified,  |
| Righteous, and Grace. The mercy and  |
| grace you have received are the      |
| mercy and grace you now extend.      |
+--------------------------------------+
|                                      |
|   +--------+        +--------+       |
|   | Grace  | -----> | Mercy  |       |
|   | GIFT   |        |not getting|     |
|   |        |        | PUNISH-|       |
|   | you    |        | MENT   |       |
|   | don't  |        | you do |       |
|   | deserve|        | deserve|       |
|   +--------+        +--------+       |
|        ^     [cross]     |           |
|        |                 v           |
|   +--------+        +--------+       |
|   |Righteous| <---- |Justified|      |
|   | seen as |       | PAID    |      |
|   | PERFECT |       |         |      |
|   +--------+        +--------+       |
|                                      |
| Give Grace, Show Mercy, & Forgive    |
+--------------------------------------+
| INSIGHT                              |
| What is one key thing you learned    |
| from this lesson?                    |
| ----------------------------------   |
| [saved text from 201-08-key]         |
+--------------------------------------+
| NEXT STEP                            |
| What is one step you are going to    |
| take this week?                      |
| ----------------------------------   |
| [saved text from 201-08-step]        |
+--------------------------------------+
| PRAYER                               |
| What is a prayer request for this    |
| week?                                |
| ----------------------------------   |
| [saved text from 201-08-prayer]      |
+--------------------------------------+
| Previous lesson's step          [>]  |
| This lesson's mercy application [>]  |
+--------------------------------------+
```

Layout notes:

- **Read / Discuss** is a two-control switch in the lesson header, not a second course card and not a TOC row that leaves 201-08.
- The diagram is the complete four-box cycle with existing names and definitions: Mercy, Justified, Righteous, Grace. Include the cycle arrows and the existing overview caption. Do not walk the five teaching cards in this view.
- Insight, next step, and prayer are read-only in Discuss. Editing happens in Read at the existing closing fields.
- **Previous lesson's step** and **This lesson's mercy application** stay collapsed. They are not part of the first five pieces. Tapping them is explicit, not automatic.
- Start with the existing compact overview and preserve its full definitions, arrows and caption. The sketch abbreviates labels for space; it is not the text source. Hiding controls requires an explicit presentation mode in the widget that removes both behavior and tab stops, not host CSS that leaves invisible interactive tiles. Prefer a static, noninteractive meeting mode backed by the same in-file renderer/data. If a shared renderer is later extracted, both presentations must consume it; do not hand-copy boxes or teaching strings into index.html. Do not shrink teaching labels to fit answers above the fold.

## Existing content and IDs

Renderer IDs follow the current pattern `question-{course}-{block.id}`.

| Discuss slot | Source | Runtime ID |
|---|---|---|
| Main truth | Lesson 8 Review text in `data/201-08.json` (EDIT-001 one-line truth later, if approved) | none (lesson text) |
| Complete diagram | `widgets/grace-diagram.html` overview data (`boxDescriptions` plus cycle caption) | none (not an answer) |
| Insight | Closing prompt "What is one key thing you learned from this lesson?" | `question-201-201-08-key` |
| Next step | Closing prompt "What is one step you are going to take this week?" | `question-201-201-08-step` |
| Prayer | Closing prompt "What is a prayer request for this week?" | `question-201-201-08-prayer` |
| Previous lesson's step | 201-07 closing step, same prompt wording | `question-201-201-07-step` |
| This lesson's mercy application | 8.3, collapsed, never labeled as the previous step | `question-201-201-08-3` |

Do not create `201-08-discuss-*` IDs. Do not copy values into another key. Switching Read and Discuss must read the canonical live answer state already used by save, export, and backup, including unsaved current-page edits. Do not rely only on localStorage or on a textarea still being mounted. Call these learner responses rather than claiming every value is saved. Preserve the existing save-error banner and distinguish current-page-only edits from saved values without triggering writes on a mode switch. An unreadable store is not an empty answer: retain available page values and the warning instead of saying no previous step has ever been recorded.

## Switching between Read and Discuss

Keep today's long lesson as **Read**. **Discuss** is another presentation of that lesson, not a different week.

How a learner opens Discuss:

1. On 201-08, tap **Discuss** in the lesson header beside the existing menu.
2. For the first prototype, use the header switch and Closing Reflections link only; defer duplicate dropdown/TOC switches until the pilot shows they are needed.
3. In-app hash `#201-8-discuss`, resolved only after `#201-8` can already load.
4. Under Closing Reflections in Read, a line "Use this in a conversation" that opens the same Discuss view.

How a learner returns to Read:

- Tap **Read** in the same switch.
- From a blank-answer prompt, tap "Answer in the lesson" to land on the matching closing field in Read.
- Optional: "Open the teaching tool" from the diagram scrolls Read to the existing widget, still on 201-08.

Rules for the switch:

- Default for a first open of 201-08 is Read.
- The chosen mode is only for this lesson in this browser session. Do not invent a global account preference.
- Hash updates with the mode (`#201-8` or `#201-8-discuss`) so Back/Forward matches what is on screen.
- No save, copy, or clear of answers on switch.
- Do not auto-play the widget or auto-open previous-step text. Reset previous-step and 8.3 disclosures to collapsed whenever Discuss is entered, including reload and history navigation. Never persist revealed text or disclosure state in the URL. The explicit Discuss action reveals the three current closing responses on this device; it does not transmit them.

## Blank answers

Discuss never invents learner text.

| Field | If empty | What the learner sees | Next action |
|---|---|---|---|
| Insight, next step, or prayer | No saved value for that runtime ID | The existing prompt, then "Not written yet" | Button: Answer in the lesson. Opens Read scrolled to that textarea. |
| All three closing fields empty | Learner opened Discuss before finishing Read | Main truth and diagram still show. Answer slots stay empty. A single line: "Your insight, next step, and prayer will appear here after you write them in the lesson." | Same Answer in the lesson control, focused on the key field. |
| Previous lesson's step | `question-201-201-07-step` missing or blank | After explicit tap: "No previous step has been recorded." | Do not fill with 8.3 or any other lesson. |
| Mercy application (8.3) | Blank | After explicit tap: the 8.3 prompt and "Not written yet." | Answer in the lesson at 8.3. |

Partial completion is allowed. A saved next step can show while prayer is still empty. Never hide the diagram because answers are blank.

## Previous lesson's commitment, without automatic disclosure

UX-001 asks for a quick route to the prior commitment. That means the previous lesson's step on this course, `question-201-201-07-step`, labeled **Previous lesson's step**. Self-paced use may not be "last week."

Do not:

- Show 201-07-step on first paint.
- Show 8.3 under the previous-step label if 201-07-step is empty.
- Email, export, or otherwise send answers to a discipler because Discuss opened.
- Display another person's answers, a shared meeting code, or a leader dashboard.

Do:

- Keep the previous-step control collapsed until the learner taps it.
- If the learner is sitting with a discipler, the discipler sees only what is on this screen, after that tap.
- Keep 8.3 on a separate collapsed control, **This lesson's mercy application**, because it can name a person and should not lead the meeting view.
- Leave login, sync, and laptop-to-phone transfer to DATA-001.

Export and backup stay the existing ENG-004 / ENG-006 tools. Discuss does not add a silent share.

## What this proposal does not do

- Implement UI, change `index.html`, or edit lesson JSON.
- Duplicate 201-08 or store a second set of answers.
- Approve EDIT-001 wording or L-201-08.
- Replace Read, print, or the guided widget tour.
- Depend on ENG-006c restore writes, accounts, or cross-device sync.
- Count as the phone conversation test.

## Implementation handoff

When shared app-code ownership is free after ENG-006b, UX-001 can prototype this view on 201-08 only.

1. Allocate `index.html` navigation and the 201-08 lesson chrome explicitly. Keep `widgets/grace-diagram.html` as the diagram source.
2. Read existing answers by the IDs above. Preserve save, export, and backup behavior.
3. Verify at 375x812, 390x844, and about 1280x800: switch Read/Discuss, direct hash and Back/Forward, restored Read scroll position, focus on the chosen field after Answer in the lesson, blank/short/long/multiline responses, live unsaved edits and unreadable storage, disclosures reset on entry, keyboard use, plain-text rendering of learner values, and no extra or duplicate answer/DOM IDs. Prove switches do not save, erase or copy responses. Keep the same save/export/backup behavior. Verify Prayer is directly reachable with long answers and 200% text zoom.
4. Then run a real conversation test before expanding to other lessons.

Until that packet is assigned, this file is the Discuss design, not authorization to edit the host.
