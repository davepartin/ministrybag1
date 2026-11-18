# PRAYERS-LORDS-TOP

November 18, 2026. Codex / codex/daily-prayers-lords-reference. Dave requested the Lord's Prayer dropdown at the top of the prayer reading view with the same appearance as his personal prayer.

Moved the existing native details above the personal prayer article. It inherits prayer-paper background/border/radius/accent and uses the same prayer-content type and line spacing. Summary uses the same serif family; horizontal padding matches at phone and laptop widths. The already-hidden mobile quiet-note wrapper no longer leaves an empty grid row. The moved dropdown is excluded from print so the existing print-only Lord's Prayer stays present exactly once. All Lord/personal prayer wording, saved keys, app JavaScript, generation/editing and other apps/lessons remain unchanged. Legacy MinistryBag HTML/CSS are generated from the same source.

Checks: Daily Prayers browser suite294 across canonical/legacy paths; one-off Playwright at320/390/1280 proves dropdown before personal prayer, equal background/font/size/line-height/padding/radius, unchanged Lord's Prayer text, no overflow and single print rendering. Phone screenshot inspected. Mirror parity, protected-file diff and whitespace checks pass. The first local browser attempt found the development server stopped; restarting it and rerunning passed. Only synthetic prayer content used.

Dave's exact presentation request authorizes publication. Merge/live evidence follows on the PR; task is DONE after the production verification below.

PR #310 passed all3 checks at29e80ec22c9c404f322334100f27d5f4ccbfd9b1 (preview run44389015041), was MERGEABLE/CLEAN and merged atcc45ef1cee3ef5b7b27e1ba380fff79cb5f3195b. Firebase live run44389222205 succeeded. Live HTML/CSS return200 and match source; a390px live browser check confirms dropdown first, identical prayer background/type/line spacing and untouched synthetic saved prayer. Completion updates are documentation only.
