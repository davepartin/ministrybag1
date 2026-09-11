# Running task board

Updated September 11, 2026. This file is the only current work-status board. Titles/order remain in [curriculum-toc.csv](../curriculum-toc.csv). Process and DONE gates are in [PLAN.md](PLAN.md). Evidence belongs in [logs/](logs/).

Status: TODO, ACTIVE, PAUSED, REVIEW, BLOCKED, DONE. Owner cell format: `agent / branch / date`; `-` means unclaimed. Check `[x]` only for DONE. A dependency must be DONE before claiming a dependent task; independent writing/research can proceed alongside software work in a separate assigned scope.

## Immediate queue

1. **ENG-001:** stop saved-answer collisions and add migration regression checks.
2. **ENG-002:** supply the four missing image assets and check all image references.
3. **ENG-003:** fix widget iframe initialization and resizing errors.
4. **ENG-004:** correct export scope and preview the selected responses.
5. **SEC-001:** remove exposed credential dependency before broader release.

Dave's parallel task is DAVE-001. Login/provider selection remains deferred to DATA-001. Do not start all rows at once.

## Project and software work

| Check | ID | Status | Owner | Depends on | Scope and acceptance evidence |
|---|---|---|---|---|---|
| [x] | PM-001 | DONE | Codex / main / 2026-09-11 | - | Create plan, all-lesson board, handoff prompts, approval queue, task logs and agent entry points. Check links/counts and sync planning packet to GitHub. Evidence: logs/2026-09-11-PM-001-codex.md |
| [ ] | ENG-001 | TODO | - | PM-001 | Repair the six shared runtime question keys across 202-05/09 and 203-06/07. Preserve old data without inventing which lesson it belonged to. Regression checks cover independent new answers, reload/navigation, repeated migration, existing new values, malformed/unavailable storage, and all-course unique runtime IDs. Scope: these four JSON files, answer-storage code, targeted test/QA code. |
| [ ] | ENG-002 | TODO | - | PM-001 | Recover or produce Last Supper and foot-washing B&W/color pairs for 202-10 and 203-04. Verify artwork with Dave and phone display. Add read-only asset checks covering src, image, imageBw/imageColor and imageSequence. Do not replace missing teaching images with generic placeholders. |
| [ ] | ENG-003 | TODO | - | ENG-001 | Fix iframe readiness, resize handling and observer/listener cleanup. No MutationObserver exceptions for affected courses; controls remain reachable through every tested step, back/restart and viewport changes. Add meaningful iframe titles. Preserve existing widget designs. |
| [ ] | ENG-004 | TODO | - | ENG-001 | Default Email Lesson to the current lesson; explicit optional course scope and visible preview before opening a mail draft. Include only selected responses, never auto-send. Verify other lessons' prayers stay out of a current-lesson export. Add tests for scope and text encoding. |
| [ ] | ENG-005 | TODO | - | ENG-001 | Add Saving/Saved/Could not save feedback and preserve edits on storage failure. Verify quota/unavailable-storage behavior and recovery. Do not overwrite a good stored copy with a failed/empty load. |
| [ ] | ENG-006 | TODO | - | ENG-001, ENG-005 | Versioned downloadable backup and validated restore for responses, completion and reading notes. Preview counts/conflicts, preserve a pre-restore backup, reject bad files and prove a round trip. Do not upload learner data. |
| [ ] | SEC-001 | TODO | - | PM-001 | Inventory credential locations without displaying values; remove browser-secret dependency with graceful Scripture fallback. Prepare a concrete server-side route in the current hosting environment only after identifying it. Dave handles provider revocation/replacement if agent access is unavailable. DONE needs verified replacement/revocation or removal of credential use, not just a TODO comment. No history rewrite without explicit direction. |
| [ ] | QA-001 | TODO | - | ENG-001, ENG-002 | Extend foundation checks to all courses: IDs, schemas, assets, TOC coverage, placeholder/readiness reporting, quotation-label review flags. Separate intentional drafts from release errors. Demonstrate checks fail on representative bad fixtures; do not enforce guessed theological rules in code. |
| [ ] | DOC-001 | TODO | - | PM-001 | Reconcile actual block/image/widget conventions and outdated examples in Compass/template/brief/widget guide. Preserve approved tone and 101 exception. Distinguish 201-01 voice benchmark, 201-08 visual benchmark and 201-10 repentance exemplar. Update stale TOC metadata with linked lesson tasks. Do not infer a new theological position from a stale note. |
| [ ] | UX-001 | TODO | - | ENG-001, ENG-003, ENG-004 | Prototype Read/Discuss on 201-08 from the same source/answers: big truth, full diagram, insight, next step, prayer; quick route to prior commitment. No duplicate curriculum and no automatic disclosure. Record a phone conversation test before expanding. |
| [ ] | UX-002 | TODO | - | UX-001 | Reusable widget shell: consistent navigation, complete-diagram view, focus/keyboard behavior, responsive size and static fallback. Convert one representative widget and verify before batching. |
| [ ] | UX-003 | TODO | - | UX-001, UX-002 | Roll out Read/Discuss and the shared widget behavior in bounded batches; verify unchanged teaching and preserved answers. Add a tool index for repeat use only if the pilot validates the need. |
| [ ] | PERF-001 | TODO | - | ENG-003, UX-001 | Active-lesson rendering/deferred resources, responsive compressed images and reserved dimensions. Measure cold/repeat load against the baseline. Pilot one charcoal image pair before batch conversion. Replace Date.now cache busting only in this task and update the technical rule simultaneously; Dave approved the production direction. |
| [ ] | A11Y-001 | TODO | - | UX-002 | Audit/fix keyboard-only operation, focus, labels, contrast, text zoom, touch controls and reduced motion across app and widgets. Record checks at 375/390 px and laptop width. Split conversion into small child packets before execution. |
| [ ] | PRINT-001 | TODO | - | UX-002 | Verify current lesson printing/PDF includes the intended text, answers and static teaching diagram; no hidden lessons, cropped fields or unusable interactive frames. Test blank and completed versions. |
| [ ] | DATA-001 | TODO | - | ENG-006, UX-001 | Choose laptop-to-phone transfer/sync behavior with Dave after prototype evidence. Record anonymous use, identity, privacy, conflicts, backup/import, content versioning and ongoing cost constraints. DATABASE-PLAN.md is a proposal, not an approved provider. |
| [ ] | DATA-002 | TODO | - | DATA-001 | Implement the selected device-handoff approach in reviewable child tasks. If accounts are chosen, test access isolation, sign-in recovery, sync conflicts and local-to-account migration. Do not invent infrastructure before DATA-001. |
| [ ] | PUB-001 | TODO | - | QA-001 | Add explicit lesson readiness/preview handling so placeholders and unapproved drafts do not appear as complete published lessons. Default-safe behavior when status is absent; no silent loss of existing navigation/answers. Align release approval records with actual content versions. |
| [ ] | CHURCH-001 | TODO | - | DOC-001 | Prepare church/discipler guide, configurable local-church naming, explicit doctrinal assumptions and original-material reuse statement; verify attribution/reuse requirements for borrowed diagrams, images and Scripture. Record unresolved permissions honestly. |
| [ ] | PILOT-001 | TODO | Dave | PM-001 | Recruit 4-6 learner/discipler pairs across reading confidence, including another church. Dave contacts people. Record only anonymized observations in Git. Start with 201-01/08, then overlapping course samples. |
| [ ] | PILOT-002 | TODO | - | PILOT-001, UX-001 | Run at least two feedback rounds: reading/writing time, main-truth recall, picture explanation, attempted practice, and phone retrieval. Cover every release lesson by assigned samples; feed defects into task IDs. |
| [ ] | RELEASE-001 | TODO | - | QA-001, ENG-004, ENG-005, ENG-006, SEC-001, UX-003, PERF-001, A11Y-001, PRINT-001, DATA-002, PUB-001, CHURCH-001, PILOT-002 | Review all selected lesson gates; verify zero unresolved data-loss/release blockers; actual-device regression, backup/restore, approved content versions, deployment rollback and support notes. Dave chooses release scope in DAVE-004. Record release commit and live verification. |

## First coding packet: ENG-001

Read `data/202-05.json`, `data/202-09.json`, `data/203-06.json`, `data/203-07.json`, and the renderer/save/load paths in `index.html`. Read only the relevant architecture sections of PROJECT-BRIEF and the baseline audit's saved-answer finding. Baseline is six shared keys, three in each pair; verify before editing.

- 202 pair: `201-09-key`, `201-09-devos`, `201-09-prayer` under the 202 course prefix.
- 203 pair: `203-07-key`, `203-07-devos`, `203-07-prayer` under the 203 course prefix.

Use stable identities and the smallest compatible migration. Keep the original shared values recoverable and clearly ambiguous; do not silently attribute one value to the wrong lesson. Never claim to recover answers already overwritten. Preserve unrelated responses and established 101 keys. Repeating the migration must be safe. Add an all-course runtime uniqueness check, including checklist IDs. Do not rewrite the lesson theology, choose login, reformat every JSON file or redesign the page in this packet.

Deliver a small branch/PR, synthetic regression evidence, a log with migration behavior/limitations, and status REVIEW. The next reviewer verifies and integrates it.

## Lesson production board

Each row is a stable task ID `L-<lesson>`. Initial `present` means substantive text exists, not that it is approved. `missing`, `stub`, `placeholder` and `rebuild` identify writing work. Gate columns use PLAN.md rules. Owner is unclaimed until assigned. Begin with L-201-01 and L-201-08; technical changes must coordinate with engineering file ownership. Every lesson requires the relevant shared software gates before release.

| Task | Status | Owner | Draft | Editorial | Visual | Technical | Dave | Pilot | Next work |
|---|---|---|---|---|---|---|---|---|---|
| L-101-01 | TODO | - | present | pending | pending | pending | unrecorded | pending | Draft: simplify orientation at phone size; test welcome and starting commitment. |
| L-101-02 | TODO | - | present | pending | pending | pending | unrecorded | pending | Draft: review question load, Romans Road controls, and distinction from 202-10. |
| L-101-03 | TODO | - | present | pending | pending | pending | unrecorded | pending | Draft: ten questions; assess writing burden and make prayer practice concrete. |
| L-101-04 | TODO | - | present | pending | pending | pending | unrecorded | pending | Draft: test Bible-study exercise and question load with new readers. |
| L-101-05 | TODO | - | present | pending | pending | pending | unrecorded | pending | Draft: preserve aspen picture; compress the nearly 6 MiB image pair. |
| L-101-06 | TODO | - | present | pending | pending | pending | unrecorded | pending | Draft: preserve witness story; compress images and distinguish BLESS introduction from 203 practice. |
| L-101-07 | TODO | - | present | pending | pending | pending | unrecorded | pending | Draft: test length and eight questions; keep distinct from 201-10. |
| L-201-01 | TODO | - | present | pending | pending | pending | unrecorded | pending | Benchmark candidate: preserve voice; earlier story access and tool-adjacent reflection. |
| L-201-02 | TODO | - | present | pending | pending | pending | unrecorded | pending | Polish: preserve robe/exchange progression; verify sequence and widget together. |
| L-201-03 | TODO | - | present | pending | pending | pending | unrecorded | pending | Revise: precise Trinity/pillar language, discernment guidance, quotation labels. |
| L-201-04 | TODO | - | present | pending | pending | pending | unrecorded | pending | Revise: soil interpretation, competing metaphors, and length. |
| L-201-05 | TODO | - | present | pending | pending | pending | unrecorded | pending | Polish: align TOC story with actual library opening; optimize bookshelf image. |
| L-201-06 | TODO | - | present | pending | pending | pending | unrecorded | pending | Revise: qualify four-movement claims; preserve explain-it exercise. |
| L-201-07 | TODO | - | present | pending | pending | pending | unrecorded | pending | Polish: make OIA the primary reusable tool; compress image pair. |
| L-201-08 | TODO | - | present | pending | pending | pending | unrecorded | pending | Benchmark candidate: justification definition, Scripture accuracy, question placement, compact/full diagram. |
| L-201-09 | TODO | - | present | pending | pending | pending | unrecorded | pending | Revise: vine/vinedresser correction, unsupported anecdote, length and repetition. |
| L-201-10 | TODO | - | present | pending | pending | pending | unrecorded | pending | Polish: faith before action, explicit review, attribution, closing-course transition. |
| L-202-01 | TODO | - | present | pending | pending | pending | unrecorded | pending | Revise: length around 2,200 words and overlap with 201-01; keep neighbor focus. |
| L-202-02 | TODO | - | present | pending | pending | pending | unrecorded | pending | Polish: align metadata to rock/cornerstone framework; distinguish household love from 202-08. |
| L-202-03 | TODO | - | present | pending | pending | pending | unrecorded | pending | Complete presentation: story image and memorable one-another practice; six mid-lesson questions. |
| L-202-04 | TODO | - | present | pending | pending | pending | unrecorded | pending | Polish: update stale assessment/body-parts metadata to Five Gardeners; keep APEST a lens. |
| L-202-05 | TODO | - | present | pending | pending | pending | unrecorded | pending | Revise: fix colliding IDs, add visual/summary, standard closing, pastoral suffering review. |
| L-202-06 | TODO | - | present | pending | pending | pending | unrecorded | pending | Revise: story/visual presentation, lesson review, standard closing. |
| L-202-07 | TODO | - | present | pending | pending | pending | unrecorded | pending | Revise: narrative hook, title/review/closing consistency; practical generosity without overpromising. |
| L-202-08 | TODO | - | missing | pending | pending | pending | unrecorded | pending | EMPTY: write Marriage and Relationships; set scope distinct from family-at-home lesson. |
| L-202-09 | TODO | - | stub | pending | pending | pending | unrecorded | pending | BRIEF STUB: write purity lesson; correct IDs and closing; build practical framework. |
| L-202-10 | TODO | - | present | pending | pending | pending | unrecorded | pending | Complete assets: missing Last Supper pair; verify ordinances widget and doctrinal clarity. |
| L-203-01 | TODO | - | present | pending | pending | pending | unrecorded | pending | Revise: build ministry-map visual; reduce question load and standardize closing/review. |
| L-203-02 | TODO | - | present | pending | pending | pending | unrecorded | pending | Revise: focus on Begin with Prayer per Compass; keep full BLESS only as recap. |
| L-203-03 | TODO | - | present | pending | pending | pending | unrecorded | pending | Revise: intentionally include listening as well as hospitality; add story/tool/review. |
| L-203-04 | TODO | - | present | pending | pending | pending | unrecorded | pending | Complete presentation: missing foot-washing pair, reusable service tool, standard closing. |
| L-203-05 | TODO | - | present | pending | pending | pending | unrecorded | pending | Polish: align Three Stories metadata with Three Circles execution; preserve personal practice. |
| L-203-06 | TODO | - | stub | pending | pending | pending | unrecorded | pending | WRONG-TOPIC STUB: write Faith at Work and School; fix ID collisions and all metadata. |
| L-203-07 | TODO | - | present | pending | pending | pending | unrecorded | pending | Revise: keep warfare here; resolve shared IDs, review heading and closing format. |
| L-203-08 | TODO | - | rebuild | pending | pending | pending | unrecorded | pending | REBUILD: current Belonging content does not teach advertised How to Disciple Others. |
| L-203-09 | TODO | - | missing | pending | pending | pending | unrecorded | pending | EMPTY: write church, missions and ministry partnership; keep one main burden. |
| L-203-10 | TODO | - | stub | pending | pending | pending | unrecorded | pending | BRIEF STUB: write calling/integration; make shared edition usable beyond NC. |
| L-301-01 | TODO | - | placeholder | pending | pending | pending | unrecorded | pending | PLACEHOLDER: full lesson writing, Scripture review, illustration, reusable leadership exercise and pilot. |
| L-301-02 | TODO | - | placeholder | pending | pending | pending | unrecorded | pending | PLACEHOLDER: full lesson writing, Scripture review, illustration, reusable leadership exercise and pilot. |
| L-301-03 | TODO | - | placeholder | pending | pending | pending | unrecorded | pending | PLACEHOLDER: full lesson writing, Scripture review, illustration, reusable leadership exercise and pilot. |
| L-301-04 | TODO | - | placeholder | pending | pending | pending | unrecorded | pending | PLACEHOLDER: full lesson writing, Scripture review, illustration, reusable leadership exercise and pilot. |
| L-301-05 | TODO | - | placeholder | pending | pending | pending | unrecorded | pending | PLACEHOLDER: full lesson writing, Scripture review, illustration, reusable leadership exercise and pilot. |
| L-301-06 | TODO | - | placeholder | pending | pending | pending | unrecorded | pending | PLACEHOLDER: full lesson writing, Scripture review, illustration, reusable leadership exercise and pilot. |
| L-301-07 | TODO | - | placeholder | pending | pending | pending | unrecorded | pending | PLACEHOLDER: full lesson writing, Scripture review, illustration, reusable leadership exercise and pilot. |
| L-301-08 | TODO | - | placeholder | pending | pending | pending | unrecorded | pending | PLACEHOLDER: full lesson writing, Scripture review, illustration, reusable leadership exercise and pilot. |
| L-301-09 | TODO | - | placeholder | pending | pending | pending | unrecorded | pending | PLACEHOLDER: full lesson writing, Scripture review, illustration, reusable leadership exercise and pilot. |
| L-301-10 | TODO | - | placeholder | pending | pending | pending | unrecorded | pending | PLACEHOLDER: full lesson writing, Scripture review, illustration, reusable leadership exercise and pilot. |

## New findings and child tasks

Add new rows to the appropriate table before working beyond scope. Keep task IDs stable, such as `ENG-001a` for a separately assigned child. Include a parent ID, file scope, dependencies, and acceptance evidence. Parent tasks become DONE only when their children and original criteria are satisfied. Do not delete completed rows; the history is useful.
