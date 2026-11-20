# ART-202-02-RAIN-HOLD

Date: 2026-11-20
Agent: Codex
Status: DONE
Branch: codex/202-02-rain-hold
Base: 38d497d

Dave requests10 percent more scroll time on full rain before collapse. Repeat storm frame2 at stops18 and28 percent, keeping the initial calm hold and the60 percent finish to preserve full-picture visibility. New stops [0,0.08,0.18,0.28,0.38,0.48,0.6]. Collapse completes38 percent, wreckage48 percent, calm60 percent. Normal scrolling and all approved images/lesson content remain intact. Add regression sampling18/23/28 percent to verify rain holds and collapse has not begun.

Foundation QA passes.83 local sequence checks pass at375/390/1280 and reduced motion, including explicit full-rain hold18/23/28 percent and whole final picture visible at60 percent. Parsed comparison confirms only sequence paths/stops differ. No artwork files changed. Preview and publication follow.

## Integration and production

PR #355 head0ff7d8e1e89c49482c0163febac4cf32b4b8add4 passed all GitHub checks and CLEAN merge state. Firebase preview44775845026 succeeded; hosted JSON byte-matches source,83 preview browser checks pass. Merged1d710962fddd8dc71dce5d8f833db028b874caf0. Production Firebase44776039816 succeeded. Live lesson HTTP200, byte-identical to main;83 production browser checks pass at375/390/1280 and reduced motion. Full storm held at18/23/28 percent, entire final image visible at60 percent.

Commands: bash discipleship/scripts/qa_foundation.sh; from discipleship, NODE_OPTIONS=--require=/workspace/scratch/chrome-shim.cjs L20202_BASE_URL=<local, preview or production index.html> node scripts/l202_02_sequence_browser_check.js. Evidence /workspace/scratch/rain-hold-{qa,local,preview,production}.log. No further work remains.
