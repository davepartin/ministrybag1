# QUICKLINKS-201: two quick-link fixes
Date: 2026-11-18
Agent: Claude
Status: REVIEW
Branch: claude/201-quick-links

Dave in chat on November 18: the Story / Study / Diagram quick links were a code idea, labels are kept short so each fits on one line, and this Claude conversation has final authority. Dave: "1 Story, 4 Movements is short; i trust you that you know which link we should use, you can make that change if the links can be better."

- 201-06 Study label: "1 Story, 4 Movements" (Dave's wording; was "One Story, Four Parts", while the section is "One Story in Four Movements").
- 201-03 Study link now goes to the main teaching heading "GUIDE: Five Things the Spirit Does" (label "Five Things He Does"), not the later Jordan section "The Spirit and Jesus". Diagram label "GUIDE" (was "The Spirit, the GUIDE"). The renderer supports anchors on headings, parables, images, widgets and boxes, so the anchor sits on the GUIDE heading.

No lesson wording changed. Other 201 quick links reviewed and left as they are.

Checks: qa_foundation 0; test_lesson_export 0 (186); test_answer_storage 0 (64); check_lesson_assets 0 (145); lesson_navigation_browser_check 0 (964); targeted check at 375/390/1280: three rows, each title on one line, each link's target is the intended section, no errors (36 of 36); click test: each of the six links scrolls its section to the top of the screen and leaves the lesson address unchanged (6 of 6); local render and saved-answer reload of #201-3 and #201-6, 18 of 18 each.
