# ART-201-04-SCROLL-PACE: Codex

Date: November 17, 2026. Branch: codex/20104-soils-scroll-timing. Current base: 03524f6 (main including #278). Status: REVIEW, no merge/live timing change.

## Previous normal-scroll trial (superseded)

Dave clarified that the opening four-soils illustration starts and switches too fast. The first trial pinned the picture in the viewport. Dave rejected that behavior: "i still want the image to scroll up the page like all the other lessons" and proposed a 20 percent opening hold followed by 15 percent per frame, with dissolves.

Removed the pinned trial completely, including its shared engine/CSS, image flag and extra scroll section. index.html now matches current main byte-for-byte. The only lesson change is imageSequenceStops from [0, 0.14, 0.27, 0.40, 0.53, 0.66] to [0.20, 0.35, 0.50, 0.65, 0.80, 0.95]. The first frame holds through 20 percent of the existing scroll-progress range; five transitions each receive 15 percent; the last frame stays after 95 percent. The image moves up with the page throughout. There is no timer, pinning, added height, autoplay or scroll interception.

This requested schedule finishes later than the usual early-completion preset. The upper image may pass behind the lesson header by the last frame; normal document flow is preserved as Dave requested. Reduced motion remains the static final frame. Source art, six delivery frames/order, approved #273 wording, Scripture, all six questions/IDs/answers, and five-roots widget remain unchanged.

Merged current main normally, preserving Claude's #275 101-05 and #276 101-06 changes. No unrelated lesson changes in this PR's final diff. Updated story-image.md with this lesson's explicit timing exception.

## Earlier trial verification

Required foundation/export/storage/assets/images checks exit 0: export 186, storage 64, assets 144, images 1525. Structured comparison confirms that only six timing stops change in 201-04.json; shared index.html matches main exactly. git diff --check passes.

The 201-04 sequence browser test retains all 61 assertions, with its expected stops and sampling points updated to the new timing. The dedicated normal-scroll test verifies the initial 20 percent hold, five halfway dissolves, image top moving by the same distance as page scroll, no pinning/extra section, all six frames, reversal, no overflow/page errors, and reduced motion. Scratch lesson/answer smoke checks all six restored answers, editing/reloading question 4.3, retained other responses, and unchanged root widget fit.

Final local counts, exact-head preview deployment and hosted browser evidence are posted on PR #274. This corrected preview supersedes the rejected 60af8c5 pinned preview. No whole-lesson Gold or fresh artwork approval is inferred.

## Visible-finish correction

Dave found that the normal-scroll 95 percent finish was halfway off the screen and suggested finishing 15 percent earlier, with the first frame holding only 10 percent. Measured the actual geometry before changing the stops. In the existing engine, image top relative to header = visibleHeight * (0.40 - 0.62 * progress). On a 390x844 phone the 233.5px image was 143.4px above the header at 95 percent (61 percent hidden). At 80 percent it would still be 72.8px above it (31 percent hidden). At 60 percent the top is 21.2px BELOW the header; on desktop it is 20px below. Explained why 80 percent would not fulfill the full-visibility goal, then chose a 10 percent hold and five equal 10 percent dissolves, finishing at 60 percent.

Final current stops: [0.10, 0.20, 0.30, 0.40, 0.50, 0.60]. Earlier 95 percent schedule and pinned preview are superseded. The image continues moving normally throughout. No shared engine/CSS changes, pinning, new flag, extra scroll space, artwork or lesson wording changes. Main through #278 merged normally. Updated the browser regression to require the entire final frame below the fixed header and within the viewport at completion, in addition to upward scrolling, cross-dissolves, reversal, static reduced motion, unchanged height and no overflow.

Final verification counts and exact-head preview evidence are posted on PR #274. Still REVIEW, no merge or live timing change.

Current local validation: foundation QA, export 186, storage 64, assets 144, images 1525, updated normal-scroll/visible-finish browser regression 103 and existing sequence browser checks 61 all exit 0. The new finish assertion passes at 375x812, 390x844 and 1280x800, with static reduced motion also checked.

## Dave approval and integration

Dave explicitly approved the 10 percent opening hold, five equal 10 percent dissolves, 60 percent visible finish and normal scrolling, and requested merge to main. Approved lesson source: b1779da116d6f87ed5f18858a9e800918c8904fc. Mark ART-201-04-SCROLL-PACE DONE; no whole-lesson Gold inferred.

Merged current main feecd32 (#279 roof marker artwork). Only the three tracking-document top inserts conflicted; preserved both 201-04 and 202-09 sections. The image guide merged normally. Approved 201-04 JSON remains byte-identical to b1779da, and shared runtime remains byte-identical to current main. No generated map conflict or manual map merge. Current 202-09 approved artwork/delivery/map/JSON/widget and the older roof PNGs are retained. Final-head QA/preview and automatic merge/live evidence is posted on PR #274.
