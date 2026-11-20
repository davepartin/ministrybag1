# UI-203-WIDGET-FRAMES

Date: 2026-11-20
Agent: Codex
Status: ACTIVE
Branch: codex/203-widget-frames
Base: efeca7a

Dave requests Claude's proposed header/frame pass on203-05 through09. No existing open PR implements it, so implement the bounded design task. The3 Circles, Three Spaces, Armor of God, Make Space and Mission Map get dark compact left-title/right-code headers and matching muted desktop borders/radii/shadows. Preserve existing diagram widths and mobile full-bleed layout, including the shared phone side boundaries. Make Space retains its580px desktop breakpoint; others keep560px. No content, SVG, script, control, lesson JSON, question or storage changes.

Foundation QA, export212, storage73, assets144, images1593 and iframe32 checks pass.890 local embedded frame checks pass across25 cases: all5 widgets at320/375/390/1280 reduced motion and390 normal motion, every navigation state through the ending, compact headers, unclipped controls, no horizontal overflow/scroll jumps/page exceptions. Phone/laptop screenshots inspected in /workspace/scratch/frame203-contact.jpg.

Source comparison: every inline script and SVG block byte-identical to base. Outside CSS, only the5 lesson-code spans and Make Space header class changed; all teaching and controls preserved. Lesson JSON untouched. Initial diff check found whitespace from the inserted CSS; removed it. Preview and publication follow.
