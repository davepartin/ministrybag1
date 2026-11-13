# READ-HEADER-STANDARD

November 13, 2026. Codex, codex/reader-header-standard. Status: REVIEW.

Dave explicitly requested the John4-6 header as the standard throughout the series. Removed the lesson101-02 gate and duplicate legacy markup from the shared bible_reading renderer. Every embedded chapter now uses the same Bible Reading eyebrow, book icon, completion status and Open/Close pills, with the same checkbox footer and notes label. Currently this covers21 John chapters across all7 lessons in101. Other courses do not currently embed chapter cards; future bible_reading blocks use this shared renderer too. No new reading assignments or widgets were added.

All lesson JSON, Scripture files, question IDs and reading storage keys remain untouched. The shared reader UI change also reaches101-06 without changing its content. Updated the existing accessibility suite to require all21 headers in the standard form, preserving named-button/expanded/hidden/focus/notes/persistence checks.

Dave also asked for suggestions to reduce proof-text load in101-02. Recommendation only: remove the inline Galatians2:20 quotation from baptism and the separate2Corinthians5:17,21 block; retain John3:16-17 for salvation, Romans6:3-4 for baptism, and1John5:13 for assurance. Fold the brief new-creation idea into assurance rather than opening another identity section. Deeper identity teaching belongs in201-02. The A-D widget already supplies the Romans Road passages. No101-02 prose or verse change is implemented in this packet; Dave is being asked for his editorial choice, not technical approval for the header rollout.

Verification results and exact-head preview/deployment links will be attached to the PR. No Firebase settings/workflow changes or manual deployment.

Final-source verification: fresh npm ci exit0. Required foundation QA, export167, storage64, assets126, images1360 all exit0. GT_BASE_URL=http://127.0.0.1:8796/index.html with system-Chromium shim: read101_a11y_browser_check.js57, read101_notes_browser_check.js36, read101_retry_browser_check.js33 all exit0. Supplemental42 layout checks cover each of7 lessons at375/390/1280. The earlier pre-edit baseline browser run used the old header name while the renderer changed; it is superseded by the clean final-source run above. No lesson JSON diff; git diff --check passes.
