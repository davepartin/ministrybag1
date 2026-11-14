# FIREBASE-PR-CLEANUP-RESOURCE

November14,2026. Codex. Follow-up to PR224 under Dave's explicit automatic-cleanup authorization.

First real automatic run43566489692 stopped before deletion because Firebase returned canonical project-qualified channel names. The prior validator accepted only sites/<site>/channels/<id>; the pinned CLI15.36.0 requests projects/<project>/sites/<site>/channels. No channel was deleted by that failed run.

Accept both canonical projects/<project-id-or-number>/sites/<exact-site>/channels/<id> and short names. The site is still exact (Hosting site IDs are globally unique), every CLI call still fixes project and site, and deletion still requires the exact closed-PR prefix. All records are validated before any delete. Other-site, malformed, live and unrelated PR guards remain. Added regressions for canonical project IDs and numeric project identifiers.

All19 actual-workflow synthetic tests pass; YAML/Python/shell syntax pass. Required foundation, export177, storage64, assets127 and images1367 pass, exit0. No app/lesson change, no manual sweep or deletion. Automatic close-event execution on this fix and subsequent221/223 will verify real behavior. Evidence recorded on the follow-up PR and PR224.
