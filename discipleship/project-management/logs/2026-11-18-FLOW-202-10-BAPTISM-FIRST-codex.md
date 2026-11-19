# FLOW-202-10-BAPTISM-FIRST

Dave explicitly approved PR #260 arrangement on November18: baptism first with widget, then bread/cup directly above the Lord's Supper Bible story. Integrating old5b86117 onto main d2b6c9c. Status ACTIVE.

Resolve lesson conflict from current main, moving existing blocks only. Preserve every current-main prose and Scripture block, all8 question IDs including newer202-10-hand, all readings and the newer Supper eligibility paragraph. Only visible numbering10.1/10.2 swaps to follow order; stored IDs stay attached to their original prompts. Current course welcome and covenant wording retained exactly. Move story anchor to bread/cup image and order lesson contents links to follow baptism/widget/story. Remove only the old Last Supper image block; source and optimized image files stay byte-identical on disk. Reconcile story-image.md from latest main, changing only202-10 row, preserving newer203-01 roof-drop sequence and other image records. No widget/runtime/artwork modifications. Final checks and publication evidence follow.


## Verification and publication

DONE. Final head8ae5facc1386203262e075b868eff5d5266f50a6 had all3 PR checks pass and mergeable_state clean. Foundation QA passed; export212, storage73, assets148, images1569 and iframe32 passed. Approved widget browser112, direct/embedded integration114 and ENG-002 teaching-image browser checks passed locally. New layout smoke45 assertions passed at375/390/1280 and390 reduced motion, including single4:3 image directly above the story, widget before Supper,8 questions, visible numbering, image loading, zero overflow and no page errors. Inspected phone screenshot confirms the image/card join.

Preview source lesson and widget returned200 and matched final-head bytes. Hosted layout45 and integration114 passed. Merged normally as PR #260 at b4451a3f8a19ce1474b668034ab26d16785fab17. Firebase merge deployment44457788117 completed successfully. Exact live lesson/widget bytes matched source; the same45 layout and114 integration checks passed on https://growingtogetherdiscipleship.com. Synthetic answers only; reload/revisit, Email export and unrelated answers preserved. No whole-lesson Gold inferred.

Scratch-test corrections: browser native dimensions are density-corrected and rounded for srcset, so aspect comparison allows pixel rounding; request uses browser fetch because Node request API lacks the environment proxy. No production code changed for either test adjustment.
