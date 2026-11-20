# UI-203-WIDGET-FRAMES

Date: 2026-11-20
Agent: Codex
Status: DONE
Branch: codex/203-widget-frames
Base: efeca7a

Dave requests Claude's proposed header/frame pass on203-05 through09. No existing open PR implements it, so implement the bounded design task. The3 Circles, Three Spaces, Armor of God, Make Space and Mission Map get dark compact left-title/right-code headers and matching muted desktop borders/radii/shadows. Preserve existing diagram widths and mobile full-bleed layout, including the shared phone side boundaries. Make Space retains its580px desktop breakpoint; others keep560px. No content, SVG, script, control, lesson JSON, question or storage changes.

Foundation QA, export212, storage73, assets144, images1593 and iframe32 checks pass.890 local embedded frame checks pass across25 cases: all5 widgets at320/375/390/1280 reduced motion and390 normal motion, every navigation state through the ending, compact headers, unclipped controls, no horizontal overflow/scroll jumps/page exceptions. Phone/laptop screenshots inspected in /workspace/scratch/frame203-contact.jpg.

Source comparison: every inline script and SVG block byte-identical to base. Outside CSS, only the5 lesson-code spans and Make Space header class changed; all teaching and controls preserved. Lesson JSON untouched. Initial diff check found whitespace from the inserted CSS; removed it. Preview and publication follow.

## Integration and production

PR #358 head456f758e2dbcb32a69ff3463c630bca9ec6680e5 passed all GitHub checks and CLEAN merge state. Firebase preview44798403916 succeeded; all5 widget payloads byte-match reviewed source and890 hosted checks pass. Merged9d8ff6a1d16fa703bc0f5c81e29957e7eca8516e.

Production Firebase44798863408 succeeded. All5 live widget URLs return HTTP200 and match merged source exactly.359 production checks across10 cases cover all5 widgets, every step through the ending,390px normal motion and1280px reduced motion. No header clipping, control clipping, overflow, scroll jumps or page exceptions. Small-phone320/375 cases and additional motion combinations already passed local/preview; production uses the same payload.

Commands: GT_BASE_URL=<index.html URL> GT_CHROMIUM_PATH=/usr/bin/chromium node scripts/widget_203_frames_browser_check.js. Production smoke runs /workspace/scratch/203-frames-live-smoke.cjs, the same assertions limited to phone normal/laptop reduced motion. Evidence /workspace/scratch/203-frames-{browser,preview-browser,production-browser,qa}.log and /workspace/scratch/FRAME203-*.log. Scripts, SVGs, lesson JSON, questions/readings and storage code unchanged. No further work remains.
