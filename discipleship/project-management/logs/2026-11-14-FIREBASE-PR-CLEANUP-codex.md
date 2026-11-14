# FIREBASE-PR-CLEANUP / PR224

November 14, 2026. Codex, isolated worktree codex/review-cleanup224.

Dave explicitly authorized automatic closed-PR preview cleanup and merging224,221,223. This is a narrow exception to his earlier Firebase hold. No manual channel sweep, billing/retention setting or production-channel change is authorized or performed.

Reviewed adaf8aa and tightened the close-only, same-repository workflow. Pin firebase-tools15.36.0 (verified published Node engine support) with Node22; add job/command timeouts and a per-PR cleanup concurrency group. Parse and validate successful channels output and every resource's site/name before issuing any deletion. Deduplicate exact pr<PR_NUMBER>- targets; live and neighboring PR numbers are excluded. A private mkstemp credential is removed in finally on success, failure or CLI timeout. The original auto-generated preview workflow is unchanged.

The actual inline workflow code passed17 synthetic CLI tests, with no Firebase calls: exact-prefix matching, live/unrelated preservation, empty lists, malformed/error payloads, other-site records, duplicate targets, invalid PR input, missing credentials, list/delete failures and timeouts, private file permissions and credential removal. YAML structure, embedded Python compilation and bash -n passed. Fresh npm ci exit0; foundation QA, export177, storage64, assets127 and images1367 all exit0. No lesson/app runtime changes; no browser behavior change requiring a new visual test.

DAVE/board/handoff record the standing exception and that closed previews disappear after merge. Exact-head Action preview, merge and automatic cleanup execution are recorded on PR224 and the subsequently closed221/223. Existing automatic merge publishing is retained; no manual Firebase deployment.
