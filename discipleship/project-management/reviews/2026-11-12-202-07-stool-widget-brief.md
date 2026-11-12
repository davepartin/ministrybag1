# 202-07: Three-T stewardship stool, proposed Gemini packet

Date: November 12, 2026
Status: REVIEW brief. No implementation started by this document.
Design source: Dave's whiteboard idea in [the source collection](2026-11-12-202-07-dave-stewardship-stool.md).
Editorial pairing: [whole-self manuscript](2026-11-12-202-07-whole-self-draft.md).

## Teaching purpose

Help a learner remember and redraw Time, Talents, Treasure as three connected areas of one life entrusted to God. The whole picture should communicate God owns it all. Do not imply that generosity earns salvation, financial returns or a higher spiritual score. The picture is a memory aid, not a measure of the learner's worth or capacity.

## Whiteboard construction

Draw a triangular stool seat from three separate strokes. Each stroke is the crossbar of a capital T. From the midpoint of each crossbar, draw a downward stem as a leg. Build one complete T at a time and label it before adding another.

A candidate geometry for a mockup, to refine through visual review: seat corners A=(160,40), B=(65,105), C=(255,105) in a 320-wide SVG. The three bars are AB, BC and CA. Stems run downward from their midpoints for about 105 units. The result has a triangular top and three legs; the angled Ts are perspective drawings. Keep the central leg from looking like a fourth support and allow space for distinct labels. Geometry is a proposed starting point, not Dave-approved artwork.

The first visual gate is whether someone can recognize three Ts, see one stool and redraw it. If the geometry obscures any of those, show Dave a static mockup before adding animation. Do not substitute an ordinary three-legged stool where the letter construction disappears.

## Proposed states and copy

| State | Drawing | Candidate supporting copy for Dave/Claude |
|---|---|---|
| Begin | Empty drawing area or a faint guide | God owns it all. |
| Time | First T with Time label | Your hours and attention, used with care and shared in love. |
| Talents | Second T added, both retained | Your abilities, put to use for someone else's good. |
| Treasure | Third T closes the triangle | Your money and possessions, cared for and shared faithfully. |
| Whole life | Complete stool, all labels readable | Time, talents, treasure: one life entrusted to God. |

No need to add a separate verse to every state. The lesson carries the Scripture and teaching. Avoid repeating full lesson paragraphs inside the widget.

## Interaction and visual requirements

Use a compact Begin/Previous/Next construction with a final completed diagram. Restart returns to Begin. A Show whole picture action can reveal the final state; do not conflate it with Restart. Navigation must have native named buttons and visible keyboard focus. Keep the labels readable without using color alone.

Use the current guide in widgets/widget.md for responsive mobile/desktop layout and host resize behavior. Aim for a 280-300px drawing and 530-560px initial iframe height; measure after content is final. Do not solve overflow with a taller iframe or small text. Prefer a simple hand-drawn SVG treatment over new generated artwork. This widget need not duplicate Grok's story image style or replace the widow sequence.

Drawing transitions may use a short stroke reveal. With reduced motion, show each selected state without animated drawing. A screen reader should have a concise explanation of the current state and the complete idea; hide purely decorative duplicate SVG labels from redundant announcements. No autoplay, drag-only controls, audio, hidden learner disclosures or new persistence keys.

Do not mutate the DOM while idle, react to height-only resize, use iframe viewport-height sizing, or move the parent scroll. Preserve the host's existing measurement contract.

## Ownership and integration

Gemini claims the widget task before coding. Suggested new file: widgets/stewardship-three-ts.html. Keep stewardship-flip.html intact until replacement review is complete; do not rewrite the existing widget in place. The first widget PR can add the standalone widget and its targeted check without changing unapproved lesson prose. Wire it into 202-07 only once the manuscript and widget are both reviewed, with a current-main check for Grok's #181 artwork.

Codex reviews the implementation and checks technical integration. Claude reviews teaching copy; Dave approves the visual and exact wording. Do not edit 203-04, story images, generated image maps, app storage or Firebase/workflows in this packet.

## Acceptance checks for the implementation

Run the standing four project checks with actual exit codes, plus node scripts/test_widget_iframe.js. Browser-check at 375, 390 and 1280, including reduced motion and larger text. Verify that the Ts build in order, all labels persist, Previous/Next/Restart and any overview control preserve the promised states, keyboard operation works, and no control or text clips. Test standalone and embedded in an approved test lesson fixture without modifying live JSON prematurely.

Include the existing guide's three host checks: no idle mutations/frame-height writes, scrolling upward continues without snapping, and height-only phone-toolbar resizes cause no frame rewrites. Verify the Action preview, then stop at REVIEW. Do not claim phone Safari or human comprehension from desktop automation alone.
