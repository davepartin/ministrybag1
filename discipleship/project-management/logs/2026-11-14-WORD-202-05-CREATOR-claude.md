# WORD-202-05-CREATOR: Trust the Creator replaces Trust the Artist
Date: 2026-11-14
Agent: Claude (editorial)
Status: REVIEW. Dave's wording approval pending.
Branch: claude/202-05-trust-creator
Base commit: origin/main at branch creation

## Assignment

Dave, November 14: "i want it to be Trust the Creator and replace Trust the Artist. Change it in the lesson and change the titles and the wording where it makes sense in the lesson." The mosaic widget is being finished separately by Gemini.

## Changes

- Summary line: "this lesson shows a God who sees the whole of it" became "this lesson shows your Creator, who sees the whole of it".
- God Meant It for Good / one piece paragraph: "He is the Artist, and He sees all of it" became "He is your Creator, the One who made you and is still making the whole picture". Bold line: "You do not have to see the whole mosaic to trust the Creator."
- New heading "Trust the Creator" before "Picture a mosaic...". "God Meant It for Good" now holds the Joseph and Genesis 50:20 paragraph; the mosaic, the one piece, the cross and the word of care sit under "Trust the Creator", which is where the mosaic widget is planned to go.
- Word of care: "Trusting the Creator is not the same as calling evil good."
- Practice: "If you can, add: I trust the Creator."
- Review bold line: "You do not have to see the whole picture to trust the Creator."
- No "Artist" remains in the lesson. Questions, verse blocks, image, parable, widget and the credit line are byte-identical to main.

Lesson words 1,619 (was about 1,610 by the chart; the new heading adds three words).

## Verification

qa_foundation exit 0; test_lesson_export exit 0 (177); test_answer_storage exit 0 (64); check_lesson_assets exit 0 (125); local Playwright render of #202-5 at 375/390/1280, 18 of 18, exit 0. Non-prose blocks compared with origin/main: identical and in order.

## Handoff

The mosaic widget brief used "Trust the Artist" for its title bar and last card; Gemini should use "Trust the Creator" (Dave relays). Placing the widget, the five-question count and length remain for the wiring pass.

## Merge note

Before merge, origin/main already carried INTEGRATE-202-05-MOSAIC (0c5d0f1): the Trust the Creator mosaic widget (widgets/trust-the-artist.html) placed after the cross paragraph and Valley Road removed. Merging main into this branch combined that with the Creator wording without conflict. The widget now sits under the new Trust the Creator heading, as planned. DAVE.md records both the reviewed sha256 and the combined sha256.
