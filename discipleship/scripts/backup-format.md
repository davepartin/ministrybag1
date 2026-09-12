# Growing Together backup format v1

ENG-006a defines this local backup envelope. It is a download only. Restore preview is ENG-006b. Confirmed restore writes are ENG-006c. This file is the format contract those later packets should read.

Do not upload the file. Do not treat it as mail, account sync or an import path. Tests and logs must use synthetic data only and must not commit downloaded bytes.

## Envelope

The downloaded file is UTF-8 JSON with a `.json` filename that starts with `growing-together-backup`. Required top-level fields:

| Field | Meaning |
|---|---|
| `kind` | Always `growing-together-backup`. Distinguishes this file from ENG-005 in-memory recovery snapshots (`growing-together-in-memory-recovery`) and from raw original storage copies. |
| `formatVersion` | Integer `1`. |
| `exportedAt` | ISO-8601 timestamp from the page that built the file. |
| `app` | `Growing Together`. |
| `note` | Human reminder that this is a local download, not a restore. |
| `complete` | `true` only when every store loaded as a readable object. Unknown or unreadable stores make the whole backup `complete: false`. |
| `includesUnsavedEdits` | `true` when any store contributes current page edits that were not stored. |
| `scope` | Object naming the three stores and stating that current in-memory values are included. |
| `counts` | Totals for learner items plus retained ambiguous-answer items. Internal migration flags are not learner counts. |
| `stores` | Object with `answers`, `completion` and `reading`. |
| `ambiguousAnswers` | Copy of retained ENG-001 recovery metadata, never auto-assigned to a lesson. |

`complete: true` plus empty `data` objects means the device had valid empty stores. That is not the same as a failed load. A failed or blocked load must set that store's `complete` to `false` and must not look like a finished empty backup.

## Per-store object

Each `stores[id]` object has:

| Field | Meaning |
|---|---|
| `id` | `answers`, `completion` or `reading`. |
| `storageKey` | `christianFoundationsResponses`, `foundationsCompletionData` or `foundationsReadingData`. |
| `loadState` | `ok`, `malformed` or `unavailable`. |
| `writable` | Whether the failed-load guard currently allows writes. |
| `includesUnsavedEdits` | Whether this store's `data` includes page edits that were not stored. |
| `complete` | `true` only when `loadState` is `ok`. |
| `emptyValid` | `true` only when `complete` and the store has no learner keys. |
| `dataRepresents` | `current-memory-and-known-storage` or `current-memory-only-storage-unknown-or-unreadable`. |
| `data` | Current in-memory object for that store, including unsaved edits and preserved internal keys. Never invent values for unread storage. |
| `originalRawAvailable` | `true` when the unreadable original bytes were captured. |
| `originalRaw` | Those original bytes as a string, only when the store is not `ok` and the raw copy exists. Omitted or `null` otherwise. The original device copy is not replaced by this download. |
| `note` | Short honest status for that store. |

Stable runtime IDs stay as stored: `question-*`, `checklist-*`, `commitment-*`, `complete-*`, `notes-*` and `check-*`. Internal keys `__gtSharedKeyMigrationV1` and `__gtAmbiguousSharedAnswers` stay inside answers `data`.

## Ambiguous answers

`ambiguousAnswers.items` copies `__gtAmbiguousSharedAnswers.items` when present. Candidate lessons stay unordered. Status stays `ambiguous`. No packet may write those values into a lesson key.

## What this file is not

- Not an ENG-005 per-store recovery snapshot.
- Not a restore, merge, upload or mail draft.
- Not proof that unread storage was empty.
- Not a place to print or store credentials or real learner answers in Git.
