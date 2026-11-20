# UPDATE-203-10-COPY: Claude, 2026-11-19

Branch claude/203-10-update from main 569186e6 (includes Codex's BRIEF-203-10-UPDATE note).

## Direction

Dave: "Read the 203-10 update handoff linked in HANDOFF.md. Only documentation changed; the lesson itself is unchanged. Continue with working on the lesson." The handoff (reviews/2026-11-19-203-10-update-handoff.md) assigns Claude the approved copy packet and widget placement; Gemini builds the Romans 12 shared-table widget.

## Changes to data/203-10.json

- Story closing line: "A war ended at a dinner table." became "The raids stopped at a dinner table." 2 Kings 6:23 says the raids stopped; 6:24 has Ben-hadad besieging Samaria, so "war ended" overstated it (the handoff asked for this check).
- Item 1, after the Romans 12 marks: "Some of these words may show you how much you still need to grow…" Placed after the Up / Toward your family / Out paragraphs so it closes the section that lists the commands.
- Item 5, directly after item 1: the opened-eyes paragraph, word for word. Placed together so the widget can sit right before both.
- Item 2: 10.2 reworded to "What are three ways God has grown you through Growing Together? Describe what has changed and where you see it in everyday life." ID 203-10-changed kept.
- Item 3: 10.4 "What is next for you?" moved to retiredQuestions as 203-10-next with its original prompt. New active 10.4 "Who could you begin Growing Together with, and how could you invite them?" with new ID 203-10-invite (unused anywhere before). The old answer is not copied into the new field.
- Item 4: Lesson 10 Review replaced word for word.
- Cleanup: the Mark 12 lead-in said "Growing Deep began with a question Jesus was asked…" while the new review says "Growing Deep began with a Father running toward His wayward son." Both are true of 201-01, but two different "began with" lines read as a contradiction. The lead-in now reads "The first lesson of Growing Deep asked which commandment matters most. Jesus' answer is where Growing Together ends."
- Unchanged: title, description, contents, recap, Romans 12 verse block and the three shape paragraphs, Disciples Who Make Disciples, Look Back, What Is Next text, Mark 12:30-31, the Greatest Commandment widget, practice, closing reflections, all other question IDs and the three earlier retired questions.

## Widget placement

Recorded in the handoff note under "Claude implementation status" for Gemini. The Greatest Commandment widget stays until the new widget is approved.

## Verification

New scripts/update_203_10_browser_check.js: 92 checks at 375, 390 and 1280 with synthetic answers (approved lines render, one "Growing Deep began with", seven active fields restore, retired fields absent, the invite field starts empty and survives reload, email export has the new answer plus Earlier saved responses with all four retired prompts and answers, other lesson excluded, no sideways scroll, no page errors). Foundation QA, lesson export 212, answer storage 73, assets 148, lesson images 1569, widget iframe 32, story art sequences 266, lesson navigation 964: pass.

Contents check on all ten 203 lessons at six widths: 306 of 306. The earlier "known 203-10 Diagram miss at 320 px" was the test reading the position before a long smooth scroll finished; once the test waits for scrolling to settle, the Diagram link lands at 104 px (bar 49) at 320 and 390. Not run: physical iPhone or Safari.

## For Dave to reread

The two new paragraphs at the end of The Marks of Genuine Love, questions 10.2 and 10.4, the Lesson 10 Review, the story's last line, and the Mark 12 lead-in.
