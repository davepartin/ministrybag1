# UI-COURSE-OPENER-LOGOS

Date: 2026-11-20
Agent: Codex
Branch: codex/course-opener-logo-width
Base: e3b4be3
Status: DONE

Dave requests the Growing Deep, Up and Out opener logos fill the available lesson width on201-01,202-01 and203-01. Change only courseLogo.width from60% to100% in those three JSONs. The existing renderer preserves aspect ratios and maximum content width. No CSS, artwork, text, questions, readings, widgets or storage logic changes. Parsed comparisons confirm every other lesson value identical.

Verification: foundation QA and isolated Playwright checks at320/390/1280 widths, checking actual width, left alignment, aspect ratio, alt text and overflow. Hosted verification follows. An initial QA command from repository root could not find scripts; rerun from discipleship.

Foundation QA passes. The browser aspect-ratio assertion allows less than1px of intrinsic-size rounding for responsive WebP delivery; the initial ratio-only tolerance was too strict for the203 logo. No image or runtime repair was needed.

## Publication

PR #347 at cf38545377cf6aebb75bd363dae0bde79f5ba21b passed all GitHub checks and CLEAN merge state. Exact-head Firebase preview44738739925, all three hosted JSONs byte-identical to reviewed source,46 preview browser checks passed. Merged59cce287b8bd2d5932540ca8f6658113196d0820. Production Firebase44738918915 succeeded; all three live JSONs HTTP200 and byte-identical to main.46 live checks pass at320/390/1280, including aspect ratios and zero horizontal overflow. Screenshot inspected at390px: /workspace/scratch/course-logos-phone.png.

Browser command: LOGO_BASE=<local, preview or production index.html URL> node /workspace/scratch/course-logos.cjs. Evidence: /workspace/scratch/course-logos-{local,preview,production}.log and course-logos-qa.log. Foundation QA plus layout checks are appropriate for this three-value layout change; no new committed tests or broader content changes.
