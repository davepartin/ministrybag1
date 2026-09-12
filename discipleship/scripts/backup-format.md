# Growing Together backup format v1

ENG-006a defines this local backup envelope. It is a download only. ENG-006b validates a user-selected local file and shows a read-only restore preview. Confirmed restore writes are ENG-006c. This file is the format contract those packets should read.

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

## Import validation (ENG-006b)

A user-selected local file is checked before any preview text is built. Preview, cancel and invalid files must not write storage, change in-memory learner data, change migration flags or clear a write guard.

### Size and read order

Read `File.size` before reading bytes or parsing JSON. Reject files larger than **1,048,576 bytes (1 MiB)** with a useful message. That limit covers current learner stores plus retained `originalRaw` evidence and avoids loading an accidental huge file. After a size pass, read the file as UTF-8 text and parse JSON. Empty files and malformed JSON are rejected.

### Kind and version

- `kind` must be `growing-together-backup` and `formatVersion` must be the integer `1`.
- `growing-together-in-memory-recovery` is an older ENG-005 per-store snapshot. Reject it as a recovery snapshot, not as a versioned backup.
- A `growing-together-original-storage` name, a `.txt` original-copy download, or a JSON object with no backup `kind` that looks like raw store keys is an older storage copy. Reject it instead of pretending it is versioned.
- Any other `kind` or version is unsupported.

### Untrusted content

Treat the file as untrusted. Display strings as text, never as executable markup. Reject object keys named `__proto__`, `constructor` or `prototype` at any depth. Do not trust claimed `counts`, `complete`, `emptyValid`, `includesUnsavedEdits` or duplicated `ambiguousAnswers` metadata. Derive those values from validated store data and surface mismatches. Preserve multiline and Unicode strings, stable IDs, `false` flags and empty strings or empty arrays.

### Value types

Known learner keys must use these JSON types:

| Prefix or internal key | Valid type |
|---|---|
| `question-*`, `commitment-*`, `notes-*` | string, including empty |
| `checklist-*` | array of finite numbers |
| `complete-*`, `check-*` | boolean, including `false` |
| `__gtSharedKeyMigrationV1` | boolean |
| `__gtAmbiguousSharedAnswers` | object with `items` as a plain object |

Ambiguous items keep `status: "ambiguous"`, a value, and `candidateLessons` as an array of strings. Lesson attribution is not inferred. Invalid structures or types fail the file with a useful message.

### Unknown keys

A key that is not a known learner prefix and not an internal `__gt` key is an **unknown key**. List it in the preview. Do not drop it, rename it or assign it to a lesson. A future restore would keep unknown keys as stored keys. Unknown values may be JSON strings, numbers, booleans, null, arrays or plain objects, still subject to the dangerous-key rule.

### originalRaw

`originalRaw` is recovery evidence for an unreadable store. Keep it as a string. Do not parse it and do not treat it as learner `data`. A partial file cannot claim to recover inaccessible stored data. Only included `data` from that store could be considered in a later apply step.

### Proposed selection (not applied)

Preview describes a future restore. It does not apply one.

- Backup-only known keys: would be added from the file.
- Device-only keys: would stay on the device.
- Matching values: no change.
- Conflicting values: held for a later choice. The proposed default is keep the current device value.
- Unknown keys: keep as stored unknown keys, no lesson assignment.
- Ambiguous answers: remain retained metadata with candidate lessons, never auto-assigned.
- `originalRaw`: remain evidence only.

Applying a backup is not available yet (ENG-006c).
