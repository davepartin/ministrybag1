# UI-COURSE-OPENER-LOGOS

Date: 2026-11-20
Agent: Codex
Branch: codex/course-opener-logo-width
Base: e3b4be3
Status: ACTIVE

Dave requests the Growing Deep, Up and Out opener logos fill the available lesson width on201-01,202-01 and203-01. Change only courseLogo.width from60% to100% in those three JSONs. The existing renderer preserves aspect ratios and maximum content width. No CSS, artwork, text, questions, readings, widgets or storage logic changes. Parsed comparisons confirm every other lesson value identical.

Verification: foundation QA and isolated Playwright checks at320/390/1280 widths, checking actual width, left alignment, aspect ratio, alt text and overflow. Hosted verification follows. An initial QA command from repository root could not find scripts; rerun from discipleship.

Foundation QA passes. The browser aspect-ratio assertion allows less than1px of intrinsic-size rounding for responsive WebP delivery; the initial ratio-only tolerance was too strict for the203 logo. No image or runtime repair was needed.
