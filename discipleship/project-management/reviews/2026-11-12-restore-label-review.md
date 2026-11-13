# Restore labels: current-source review of PR 28

Source: main 2940ab2 and PR 28 head 6aff9d8. November 12, 2026. Status: REVIEW.

## Finding

PR 28 remains unmerged and conflicts with current main. It should be ported into a fresh technical packet rather than merged as-is. Its labels-only approach is useful: derive labels from stable IDs and identify unknown historical keys without guessing a lesson. The current source has no backup-labels.js or generated answer-index.json.

Compared the proposed generated index with current lesson question/checklist IDs across all numbered JSON files (including deferred files for storage compatibility):
- 267 indexed keys in the old PR.
- 264 keys in current files.
- 61 current keys missing from the old index.
- 64 old indexed keys absent from current files.
- 109 shared labels differ beyond simple display truncation.

## Recommended implementation packet

Port the UI labels and plain-language messages onto current main. Regenerate the index from current files, retain unknown-key fallback and no-preselection protections, and verify empty, partial, conflicting, unreadable and complete backups with synthetic data. Keep current restore/rollback protections intact. Add index-drift checks and verify phone/keyboard dialog handling before integration. Do not copy the old generated index. This review does not claim the old PR is ready or change storage behavior.

Current backup unit tests are run as verification of the current baseline, not proof that PR 28 passes. No learner data is read.

## Missing labels in the old index

- question-101-1-hand
- question-101-1-step
- question-101-2-step
- question-101-3-hand
- question-101-3-step
- question-101-4-step
- question-101-5-hand
- question-101-5-step
- question-101-6-step
- question-101-7-hand
- question-101-7-step
- question-201-201-02-4
- question-201-201-03-hand
- question-201-201-05-found
- question-201-201-06-hoped
- question-202-202-02-forgive
- question-202-202-02-hand
- question-202-202-04-hand
- question-202-202-05-step
- question-202-202-06-step
- question-202-202-07-step
- question-202-202-08-chisel
- question-202-202-08-first
- question-202-202-08-god
- question-202-202-09-pattern
- question-202-202-09-permission
- question-202-202-10-honest
- question-203-203-01-step
- question-203-203-02-rhythm
- question-203-203-02-step
- question-203-203-02-story
- question-203-203-03-heard
- question-203-203-03-listen
- question-203-203-03-step
- question-203-203-04-hand
- question-203-203-04-step
- question-203-203-06-faithful
- question-203-203-06-people
- question-203-203-06-space
- question-203-203-06-step
- question-203-203-06-story
- question-203-203-07-hand
- question-203-203-07-step
- question-203-203-08-invested
- question-203-203-08-key
- question-203-203-08-prayer
- question-203-203-08-spoke
- question-203-203-08-start
- question-203-203-08-step
- question-203-203-08-who
- question-203-203-09-city
- question-203-203-09-key
- question-203-203-09-nations
- question-203-203-09-plant
- question-203-203-09-prayer
- question-203-203-09-step
- question-203-203-09-story
- question-203-203-10-craft
- question-203-203-10-need
- question-203-203-10-shape
- question-203-203-10-step

## Retired keys still in the old index

- question-101-2-4
- question-101-2-6
- question-101-3-3
- question-101-3-5
- question-101-3-6
- question-101-3-7
- question-101-4-2
- question-101-5-2
- question-101-6-4
- question-101-6-6
- question-101-7-2
- question-101-7-4
- question-201-201-02-2
- question-201-201-05-1
- question-201-201-06-3
- question-201-201-09-5
- question-202-201-05-devos
- question-202-202-02-3
- question-202-202-02-4
- question-202-202-03-3
- question-202-202-03-6
- question-202-202-05-devos
- question-202-202-07-devos
- question-202-202-08-1
- question-202-202-08-2
- question-202-202-08-3
- question-202-202-08-4
- question-202-202-09-motive
- question-202-202-09-story
- question-202-202-10-3
- question-203-203-01-3
- question-203-203-01-5
- question-203-203-01-devos
- question-203-203-02-2
- question-203-203-02-3
- question-203-203-02-4
- question-203-203-02-5
- question-203-203-02-6
- question-203-203-02-devos
- question-203-203-03-1
- question-203-203-03-3
- question-203-203-03-4
- question-203-203-03-5
- question-203-203-03-devos
- question-203-203-04-4
- question-203-203-04-devos
- question-203-203-06-devos
- question-203-203-07-bless
- question-203-203-07-devos
- question-203-203-10-1
- question-203-203-10-bless
- question-203-203-10-devos
- question-203-203-7-1
- question-203-301-08-1
- question-203-301-08-2
- question-203-301-08-3
- question-203-301-08-4
- question-203-301-08-5
- question-203-301-08-6
- question-203-301-08-7
- question-203-301-08-8
- question-203-301-08-devos
- question-203-301-08-key
- question-203-301-08-prayer
