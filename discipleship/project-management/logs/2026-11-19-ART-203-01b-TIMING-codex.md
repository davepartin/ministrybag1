# ART-203-01b-TIMING

Dave requested20 percent sooner dissolve on PR #322. Interpret as an earlier transition, not faster playback: finish0.80 times0.8 equals0.64; move start0.42 to0.26 so duration remains0.38. Sequence is [high, high, low], stops [0,0.26,0.64]. Normal scrolling; no pinning or runtime change. Artwork remains exact9ec511c.

Merged current main617a152 into the review branch, keeping current203-01 Great Commission wording/placement and all saved-answer IDs. HANDOFF conflict kept both histories. Removed obsolete browser assertion requiring the static love-moves-out image that main already retired; new final-frame assertion requires the entire picture visible below the header. No other lesson/widget/runtime/artwork changed in this timing follow-up. REVIEW; no main publication requested.

Final local verification: foundation QA passed; export212, storage73, assets139, images1552 and iframe32 passed. Updated story browser check80 passed at375/390/1280 and reduced motion. At0.64, image tops are51.1-51.8px with header bottom49px; full bottoms240.1/248.0/389.3px remain within viewport844/844/800px. Artwork matches9ec511c exactly. All current-main lesson values outside the story-image block match exactly, including6 active question IDs and the retired203-01-hand. The older test expected7 active fields and a static circle image already retired on main; refreshed those assertions without changing learner data. Updated remaining phase sampling from old0.42/0.56/0.66 to0.26/0.40/0.50. Preview evidence follows.


## Approved merge and live deployment

Dave approved the timing and explicitly requested merge. Reviewed exact head468ee66088fbbb89e1e3677f77b9e820471e9d60: all3 PR checks passed; preview80 browser checks passed and deployed lesson bytes matched. New main eb17706 changed only202-08 copy and unrelated direction/tracking, leaving203-01/renderer/art inventory untouched. GitHub clean merge preserved those edits. PR #322 merged26007937fbfb01e708ce5440b62f936930334ee2.

Firebase run44660866685 succeeded. Live https://growingtogetherdiscipleship.com/index.html#203-1 passed80 story-image checks at375/390/1280 plus reduced motion. Exact live lesson JSON and all4 optimized WebP delivery copies match source. Source JPG URLs are intentionally excluded by firebase.json images/*.jpg; originals remain in Git, and the served delivery copies are verified. The entire picture is visible below the49px header at0.64, ending around240/248/389px for the three widths. DONE. No whole-lesson Gold or other lesson approval inferred.
