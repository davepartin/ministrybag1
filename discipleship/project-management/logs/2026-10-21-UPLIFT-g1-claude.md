# UPLIFT-g1: 201-04 Growing Deep Roots and 201-09 Living the Fruit of the Spirit

Date: 2026-10-21. Worker: Claude. Branch: claude/uplift-g1-201-roots-fruit.

## Changes

### 201-04 Growing Deep Roots in Jesus (2,521 -> 1,452 words)
- Re-anchored on Colossians 2:6-7 ("rooted in Him"). Added Jesus' own explanation of the parable (Mark 4:17, 4:20): the soils are hearers, the good soil is the one who hears and accepts the Word. Removed "Jesus Is the Good Soil", the Shepherd/Healer/Savior name list, and every "Good Soil = Jesus" phrase (description, practice, review).
- Grace line added on the mirror question: you cannot make yourself good soil; God gives a new heart (Ezekiel 36:26, referenced, not quoted).
- Big truth: "Roots before fruit. You grow deep by staying rooted in Jesus." Repeated in the Review.
- Cut "When the Storms Come" (Matthew 7 house on the rock), the "faithful Christians across history" paragraph, and the John 15 abide block (201-09 owns it). Romans 12 shortened to 12:1 with a two-sentence "mercy first" note.
- Five roots trimmed; widget and 30-day practice kept. Ephesians 6:18 switched from NIV ("pray in the Spirit on all occasions") to ESV ("praying at all times in the Spirit"); the deep-roots widget still shows the NIV wording.
- Questions kept ids 201-04-1/2/3, each made a single question. No ids retired.

### 201-09 Living the Fruit of the Spirit (2,324 -> 1,425 words)
- Title changed from "Becoming Who You Already Are" to the TOC title. Description rewritten.
- John 15:1-5 is now the carrying parable ("The Vine and the Branches"), with roles corrected: Jesus the vine, the Father the vinedresser, believers the branches. Grace before command: "Already you are clean" (15:3). Link to the Spirit via John 14:16-17.
- Big truth: "You do not manufacture the fruit. You abide in Jesus, and His Spirit grows it in you." Repeated in the Review.
- Orange-tree story and image removed; reduced to one line in the Review. Matthew 7:16-17 removed.
- Each fruit cut to one or two sentences in three grouped paragraphs; the fruit-of-spirit widget carries the definitions.
- Removed: Good Samaritan, Joseph and Genesis 50:20, "Impatience is a form of unbelief", Bonhoeffer, apple-tree neighbor, "long obedience in the same direction".
- Pruning section corrected ("The Father is the vinedresser, and you are the branch").
- 9.3 and 9.5 merged into 201-09-3. **Retired id: 201-09-5** (do not reuse). Added "This Week's Practice" (John 15:4-5 morning prayer and evening look-back).

## Checks
- scripts/qa_foundation.sh: 415 checks passed. test_answer_storage.js: 64 passed. test_lesson_assets.js: 8 passed. test_widget_iframe.js: 32 passed.
- Playwright (chromium headless) at 390x844 and 1280x900, both lessons opened with openFromDropdown('201', n): no page or console errors, no document overflow, no broken images. deep-roots (6 states) and fruit-of-spirit (11 states) stepped through: iframe scrollWidth <= clientWidth on every state, no element overflow. Screenshots reviewed (kept outside the repo).
- No em or en dashes in either file. JSON parses.

## Open items
- 201-05 opens with "deep roots grow down into Jesus, the Good Soil" (not owned by g1). Suggested: "In the last lesson, you saw that you are rooted in Jesus."
- deep-roots widget intro card says "Jesus is the Good Soil your life reaches into" and Prayer uses NIV Ephesians 6:18 (g7).
- TOC row 201.04 summary still says "Jesus is the Good Soil" and 201.09 summary/story need updating (values in the PR / coordinator report).
- 201-09 John 15 parable has no art; art prompt in the coordinator report.
