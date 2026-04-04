# Growing Together — Project State
*Last updated: March 6, 2026. Paste this at the start of any new session to get Claude up to speed.*

---

## What This Project Is

A web-based discipleship app built as a single HTML file (`index.html`) running on localhost:4000. Lesson content lives in JSON files in the `data/` folder. Dave (pastor/church planter at Neighborhood Church) is the author. Claude is the editor and dev assistant.

---

## Technical Setup

- **App file:** `index.html` (3100+ lines, do not rewrite, only edit)
- **Lesson data:** `data/[series]-[lesson].json` (e.g. `101-01.json`, `201-01.json`)
- **Curriculum master:** `curriculum-toc.csv` (key categories per lesson: Key Verse, Key Line, Key Framework, Key Story, Key Question)
- **Research files:** `Lesson_research/[lesson]_research.md`
- **Images:** `images/` folder

### Cache Busting (FIXED — NO ACTION NEEDED)
`BUILD_VERSION` is now set to `Date.now()` in index.html. It auto-generates a fresh timestamp on every page load. **You never need to manually bump it again.** JSON, CSV, and in-lesson images all get cache-busted automatically.

The home page logo (`<img>` in static HTML) is still not covered, but it rarely changes. A hard refresh handles it if needed.

Image rename convention (v2, v3) is no longer necessary for lesson images, but can still be used if you want to keep old versions around for reference.

### JSON Lesson Format
Blocks array with types: `heading`, `text`, `verse`, `question`, `image`, `bible_reading`, `stepper`, `tool`, `checklist`, `widget`, `parable`

**Parable block** — for illustrated teaching stories. Renders as a framed card with the image at the top and the story beneath. Required: `title`, `text`. Optional: `image`, `alt`. Do not split into separate heading/image/text blocks. See `data/201-08.json` for the live example.

Image block format: `{"type": "image", "src": "images/filename.png", "alt": "description"}`

Widget block format: `{"type": "widget", "src": "widgets/filename.html", "height": "420px"}`
Widget files live in the `widgets/` folder as self-contained HTML with inline CSS and JS. The app renders them in auto-sizing iframes.

Version field (only on actively-edited lessons): `"version": "v04"` — renders as a small badge in the app header (e.g. `201.01 · v04`). Bump this whenever a lesson is substantively revised.

### Editorial Rules
See DISCIPLESHIP-COMPASS.md (the authoritative source) and AI-START-HERE.md for the full list.

---

## Course Structure

| Series | Title | Tagline | Color |
|--------|-------|---------|-------|
| 101 | Starting in Discipleship | in the Greenhouse | Blue `#1E6FA0` |
| 201 | Growing Deep | with God | Green `#1A6B55` |
| 202 | Growing Up | with Family | Green `#1D6B3F` |
| 203 | Growing Out | with the Gospel | Green |
| 301 | Leading in Discipleship | Multiplying the Harvest | Coral `#C85A56` |

**Home page tagline verse:** Mark 4:20 ("Those that were sown on the good soil...")

**Title font:** Forum (Google Fonts) — applied to `.home-title` in index.html

**Tree analogy thesis:** "We grow deep so we can grow up so we can grow out"

---

## Logo System (Current — Fully Built Out)

The logo system follows a consistent pattern across all Growing series:

- **Series lesson 01** — Shows a 3-circle orientation logo (in the lesson content blocks) so the learner sees where this course fits in the full Growing Together arc
- **Series lessons 02–10** — Shows the series-specific single-circle logo in the **top-right corner** via COURSE_META (same mechanism as 101). No image block needed in the JSON.

| File | Used In | Notes |
|------|---------|-------|
| `3-circles-logo-series.png` | Home page, 101-01.json | Full-color all-3-circles logo |
| `growing-3circles-logo.png` | 201-01.json | All three Growing sections green (Deep, Up, Out) — "entering the full Growing arc" |
| `201-growing-logo.png` | COURSE_META for 201 | Growing Deep green, Up and Out grey — top-right corner on 201-02 through 201-10 |
| `202-3circles-logo.png` | 202-01.json | 3-circle logo with Growing Up highlighted — 202-01 orientation |
| `202-growing-logo.png` | COURSE_META for 202 | Growing Up green, Out and Deep grey — top-right corner on 202-02 through 202-10 |
| `203-3circle-logo.png` | 203-01.json | 3-circle logo with Growing Out highlighted — 203-01 orientation |
| `203-growing-logo.png` | COURSE_META for 203 | Growing Out green, Up and Deep grey — top-right corner on 203-02 through 203-10 |
| `3-circle-logo-growing-focus.png` | Retired from lessons | Superseded by growing-3circles-logo.png |
| `3-circle-logo-starting-focus.png` | Unused (available) | Starting circle, others grey |
| `101-starting-logo-v3.png` | COURSE_META for 101 | Greenhouse pot logo — top-right corner on 101-02 through 101-07 |
| `101-starting-logo.png` / `v2.png` | Retired | Old versions, can delete |
| `203-02-bless-logo.png` | 203-02.json | BLESS framework logo (in-lesson content block) |
| `201.01-peaks-and-valleys.png` | 201-01.json? | Peaks and Valleys exercise example image |
| `rooted-logo.png` | Retired | Replaced by 3-circles logos |
| `201-growing-logo.png` | COURSE_META for 201 + 201-01 roots image | Growing Deep green, Up and Out grey |

### COURSE_META logos (index.html)
All four active series now have a `logo` property in COURSE_META:
- `101`: `images/101-starting-logo-v3.png`
- `201`: `images/201-growing-logo.png`
- `202`: `images/202-growing-logo.png`
- `203`: `images/203-growing-logo.png`

---

## Lesson Status

### 101 — Starting in Discipleship (7 lessons)
| Lesson | Title | Status | Notes |
|--------|-------|--------|-------|
| 101-01 | Welcome. Let's Start Growing. | Active | Full-color 3-circles logo. Key Verse: Mark 4:20. |
| 101-02 | Salvation & Baptism | **v01** | Greenhouse intro paragraph added. ABCs framework. Key Verse: Romans 10:9-10. |
| 101-03 | Prayer | Untouched | 6 Steps of the Lord's Prayer framework. Key Verse: Matthew 6:9. |
| 101-04 | The Bible | **v01** | Passage changed to John 3:1-4, 16-17. Matthew 7:24 bold. Sermon on the Mount context added. Key Verse: 2 Timothy 3:16. |
| 101-05 | The Church | Untouched | Loves/Equips/Serves framework. Acts 2:42-47. Key Verse: Acts 2:42. |
| 101-06 | Sharing Jesus with Others | Untouched | BLESS intro. Key Verse: Romans 10:15. |
| 101-07 | A Life of Repentance | Untouched | Conviction vs. Condemnation. Prodigal Son. Key Verse: 1 John 1:9. |

### 201 — Growing Deep (10 lessons)
All lessons now have `201-growing-logo.png` in the top-right corner (via COURSE_META). 201-01 has the all-green Growing 3-circle logo in the lesson content.

| Lesson | Title | Status | Notes |
|--------|-------|--------|-------|
| 201-01 | The Shema & Greatest Commandment | **v04** | Full rewrite. Echo of Love framework. Tree analogy intro. `growing-3circles-logo.png` at top. John 10:10 replaces Augustine. No em dashes. Series intro paragraph added. |
| 201-02 | Your Identity in Jesus the Son | Untouched | Research file exists |
| 201-03 | The Spirit-Filled Walk | Untouched | Research file has CRU Follow-Up 3 material |
| 201-04 to 201-07 | Various | Untouched | |
| 201-08 | The Grace and Mercy Cycle | **v05** | Full rewrite. Single interactive grace-diagram widget embed. Grace/Mercy/Justified/Righteous cycle. Cycle-comes-back-around teaching. Question IDs updated to 201-08-*. |
| 201-09 | Various | Untouched | |
| 201-10 | Repentance and the Learning Circle | **v02** | Full rewrite. Prodigal Son story (both sons). Learning Circle widget embed (learning-circle2.html). |

### 202 — Growing Up (10 lessons)
All lessons now have `202-growing-logo.png` in the top-right corner (via COURSE_META). 202-01 has the `202-3circles-logo.png` orientation logo + 3-sentence series intro in the lesson content.

| Lesson | Title | Status | Notes |
|--------|-------|--------|-------|
| 202-01 | Greatest Commandment Part 2 - Loving Your Neighbors | Edited | Added `202-3circles-logo.png` + 3-sentence series intro at top. |
| 202-02 to 202-10 | Various | Untouched | Research file for 202-09 has CRU Follow-Up 5 material. |

### 203 — Growing Out (10 lessons)
All lessons now have `203-growing-logo.png` in the top-right corner (via COURSE_META). 203-01 has the `203-3circle-logo.png` orientation logo + 3-sentence series intro.

| Lesson | Title | Status | Notes |
|--------|-------|--------|-------|
| 203-01 | The Great Commission - Your Personal Ministry | **v02** | Replaced single logo with `203-3circle-logo.png`. 3-sentence series intro rewritten. |
| 203-02 to 203-10 | Various | Untouched | |

### 301 — Leading in Discipleship
All lessons untouched.

---

## Session History

### March 6, 2026
- **curriculum-toc.csv** — filled in Key Verse, Key Line, Key Framework, Key Story, Key Question for all 7 lessons in the 101 series. Key Questions refined through conversation (especially 101-03 Prayer: "How are you growing your relationship with God by talking and listening to Him?").
- **Logo system built out** — complete logo framework across all Growing series (201, 202, 203). Series lesson-01 files use 3-circle orientation logos in lesson content. Lessons 02+ use series-specific single-circle logos in top-right corner via COURSE_META. COURSE_META updated in index.html for 201, 202, 203.
- **202-01** — added `202-3circles-logo.png` + 3-sentence series intro ("In 101 you were planted... In 201 you went deep... Now in 202 the tree is growing up...").
- **203-01** — replaced single tree logo with `203-3circle-logo.png` + rewrote 3-sentence intro ("Now in 203 the tree turns outward, and everything that has been growing in you becomes the seed for growing together with others.").
- **201-01** — swapped logo to `growing-3circles-logo.png` (all-green Growing circle, all three sections lit up).

---

## Key Editorial Decisions
Authoritative list lives in DISCIPLESHIP-COMPASS.md under "Key editorial decisions (established)." This section is kept here only as a session-history breadcrumb. If the two ever conflict, the Compass wins.

---

## Research Files (Lesson_research/)

| File | Contents |
|------|----------|
| 201.01_research.md | Shema pronunciation, New Tongue analogy, Echo of Love research |
| 201.03_research.md | CRU Follow-Up 3: Natural/Carnal/Spiritual, Spiritual Breathing, Holy Spirit content |
| 101.07_research.md | CRU Follow-Up 2: Relationship vs. Fellowship, Paid in Full, Confession |
| 202.09_research.md | CRU Follow-Up 5: Protect/Provide, David/Psalm 51, Daniel 1:8, purity |

---

## curriculum-toc.csv Status

All 101-series lessons and 201-01 are fully filled in (Key Verse, Key Line, Key Framework, Key Story, Key Question). 202 and 203 series still have `[IDEA]` placeholders — fill in as lessons are built. 301 has `seek` placeholders throughout.

---

## Known Issues / Pending

1. ~~**`growing-together-roots-zoom.png`**~~ — RESOLVED. Now uses `201-growing-logo.png` in 201-01.json.
2. **`font-sampler.html`** — dev artifact sitting in the discipleship folder. Safe to delete when ready.
3. **Version badges** — only on 101-02, 101-04, and 201-01. Add to any lesson that gets substantively revised.
4. ~~**curriculum-toc.csv stale**~~ — RESOLVED. 101 series fully filled in March 6.
5. ~~**BUILD_VERSION** manual bumping~~ — RESOLVED. Now uses `Date.now()` automatically.

---

## How to Work With Claude on This Project

- ~~Say "bump the build"~~ — no longer needed. Cache busting is automatic.
- Hard refresh handles most image issues now. Rename files only if you want to preserve old versions.
- Reference lessons by number (e.g. "in 101-04") and Claude will read the file before editing.
- Dave trusts Claude to write prose; say "write it, I trust you" to get a full draft.
- Dave's shorthand for approval: "yes build this", "make these changes", "let's do this."
- No em dashes. Ever. In any lesson file.
