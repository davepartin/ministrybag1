# ART-202-02-EARLY-FINISH: complete the house story while visible

Date: 2026-11-20
Agent: Codex
Status: ACTIVE
Branch: codex/202-02-earlier-finish
Base: 2a7e292

## Changes

Dave requested earlier ending timing for202-02, keeping the approved visual storytelling. Stops change from [0,0.08,0.16,0.24,0.32,0.48,0.72] to [0,0.067,0.133,0.2,0.267,0.4,0.6]. Earlier beats are proportionally compressed. The last dissolve remains longest, running40 to60 percent. Normal scrolling and all source/delivery artwork remain unchanged. Only imageSequenceStops changes in the lesson; prose, Scripture, question objects, readings and saved-answer behavior stay intact.

The browser regression now requires the entire final picture below the header and above the viewport bottom at completion, rather than accepting a partly visible image. It also checks all frames in order, stable layout, IDs, delivery proportions and reduced motion.

## Verification

From discipleship: bash scripts/qa_foundation.sh, node scripts/test_lesson_export.js (212), node scripts/test_answer_storage.js (73), node scripts/check_lesson_assets.js (140), node scripts/test_lesson_images.js (1572), node scripts/test_widget_iframe.js (32), all pass. An initial runner invocation from repository root failed to locate scripts; rerun from discipleship passed.

Initial browser run:77 checks passed at375/390/1280. At390px, final top71.3px, bottom307px, header49px. Entire picture visible,22px below header. Final local browser run:80 checks pass including reduced motion. Only timing differs in a parsed comparison of the lesson against base. Hosted verification pending.
