# 2026-10-21 UPLIFT g2: Bible trilogy (201-05, 201-06, 201-07)

Branch: `claude/uplift-g2-201-bible`. Worker: Claude. Source: `project-management/reviews/2026-10-21-lesson-grades.md`.

## Changes

**201-05 Overview of the Bible (map).** New opening parable, "The Book Found in the Temple" (Josiah, 2 Kings 22-23), with no art yet. Big truth: "God's Word is a library to open, not a book to lose on a shelf, and every shelf points to Jesus." It is stated after the story and repeated in the Review. New "Every Shelf Points to Jesus" section (John 5:39-40, and Josiah could not change a heart while Jeremiah 31:33 promises a law written on hearts). Ties Josiah's 2 Kings 23:25 to the Shema in Deuteronomy 6. "No human editor... strongest evidence" is softened to "That unity fits what the Bible says about where it came from." The ESV note now reads "Unless noted, quotations in this course are from the ESV" and explains labeled exceptions. Adds a This Week's Practice: read a chapter from three shelves (Deuteronomy 6, Psalm 23, Luke 24). The bridge from 201-04 no longer says "Jesus, the Good Soil" (coordinator note). Questions: new `201-05-found`. `201-05-1` (the 1-to-10 familiarity question) is retired. `201-05-2` and `201-05-3` are kept and simplified. Deuteronomy 6:4-7 is trimmed to 6:4-6, and 32:47 now includes the ESV's opening "For".

**201-06 Biblical Storyline (road trip).** The Road to Emmaus (Luke 24:13-35) is the carrying parable. Dave's "Story Line" parable text now becomes the four-movement teaching, with Jesus at the center (Colossians 1:16 at Creation). "Almost every story" is now "many smaller stories echo this shape", and a new line says not every story fits neatly. Paul's "good" state is qualified ("his zeal was blind"). The Joseph quote of Genesis 50:20 (non-ESV wording) is now a paraphrase, which reduces cross-lesson repetition. The personal mapping now says "made in the image of God... yet born into a broken world with a heart bent away from Him", with separate paths for those who have trusted Jesus and those who have not. 6.3 (`201-06-3`) is retired and merged into 6.4 (`201-06-4`, "including where your own life fits on the line"). New question `201-06-hoped`. Credit line added. Version tag is now v03.

**201-07 How to Study the Bible (skill).** The opening introduces the 101-04 Three Discovery Questions. The Philip parable now includes Acts 8:35, about the lamb in Isaiah. New grace paragraph: God sent Philip, study is not a test, and the Spirit helps (1 Corinthians 2:12). The biblical-timeline widget is replaced by the new `widgets/oia-method.html`. The timeline is dropped rather than linked: no lesson references it now. The Interpret step links Psalm 23 to John 10:11 and then to the Lamb of Isaiah 53. Questions are single-part. 7.5 is now a step: "Write down which passage you will study with OIA this week, and when." Adds a This Week's Practice (suggests Luke 15:1-7) and a credit line (Hendricks, *Living by the Book*). Uses the unused `images/201.07-shepherd-sheep.jpg`. Version tag is now v03.

**New widget `widgets/oia-method.html`.** Built on the A-standard step pattern from three-spaces and covenant-triangle: the same fonts, palette, card, Begin / Show whole diagram / Back / Next / Restart controls, a fixed card height (fitCards) and a width-only refit. A three-node track (Observe, Interpret, Apply) sits over a fixed Psalm 23:1-4 panel, and each step highlights phrases in that step's color. There are 6 steps plus an overview.

Word counts (same counter as the grade report, all text, verses and closing): 201-05 1,482 to 1,544; 201-06 1,587 to 1,544; 201-07 1,517 to 1,422.

## Checks

- `bash scripts/qa_foundation.sh`, `node scripts/test_answer_storage.js`, `node scripts/test_lesson_assets.js`, `node scripts/test_widget_iframe.js`: all pass.
- Playwright at 390x844 and 1280x900. For each visible widget iframe, scrollWidth <= clientWidth (bible-bookshelf, biblical-storyline, oia-method). No page errors and no console errors or warnings. In oia-method, every step was clicked through, and the nav bar stays at the same y on all 6 steps at both widths. The iframe height matches the content height (603/603 at 390, 599/599 at 1280). Screenshots were reviewed, with no clipped text. The screenshots are in the scratch folder only.
- No em dashes in the three lessons or the widget.

## Open items

- Dave review: the Josiah and Emmaus retellings, the Jeremiah 31:33 gospel turn, the non-believer path in 201-06, the credit lines and the "Many scholars believe the scroll was Deuteronomy" line.
- g7: biblical-storyline.html says "Every story in the Bible follows the same pattern" (step 1). The "Your Story" step ("Something broke. Jesus found you.") assumes the reader is redeemed and implies a personal fall from innocence. Paul's "creation" label reads "Brilliant, trained, zealous".
- Coordinator: the index.html footer says "Scripture quotations are from the ESV". It should read "Unless otherwise noted". biblical-timeline.html is now unused. KNOWN_TITLES in widget-iframe.js could add `'oia-method.html': 'Observe, Interpret, Apply'`. The lesson block passes `title`, so this is optional.
- Art needed: Josiah (201-05), Emmaus (201-06).
