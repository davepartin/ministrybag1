# Story Image and Scroll-Animation Guide

This file is the single source of truth for **scroll-animated story images** in the Growing Together Discipleship Series. Any AI or human adding, upgrading, or testing lesson story images should read this file first.

## The look: read this before generating anything

Dave's reference is `images/good-samaritan-story.jpg`, with `fruit-tree-story.jpg`, `jesus-sends-72.jpg` and `jesus-light-bw.jpg` as further examples. Study them before you prompt an image model. The look is a **storyboard marker sketch**, not a painting and not a children's Bible illustration:

- Black felt-tip ink on white paper. Fast, confident, visible strokes. Hatching and scribbled marker fills for shadow, with the white of the paper left as the light.
- Mid-grey marker blocks for the ground and sky, laid in quickly, edges rough.
- Figures are gestural and slightly rough, not polished faces. No soft shading, no painterly blending, no sepia wash, no warm glow.
- Wide cinematic framing (16:9 or close), one clear focal action.
- **Color, when there is a color layer, is one or two small accents only**: the orange fruit on the tree, the red on the Samaritan's hands. The picture stays black, white and grey. A full-color version of the scene is wrong for this series.

Drift to avoid (seen on 2026-11-12): full-color painterly renderings, golden-hour sunsets, soft blended skin tones, sepia paper textures, children's-storybook faces. If your generated frame has any of these, do not wire it; regenerate with the reference image attached.

A prompt that works: "black felt-tip marker storyboard sketch on white paper, rough confident strokes, grey marker fills, hatching for shadow, no color, wide 16:9 scene of [the story moment], in the style of the attached reference."

## Already made: check before you generate

Dave drew much of the art himself before the bots arrived. **Before generating anything, list `images/` and look for the lesson's story.** If a finished piece exists, use it, and if you need a color layer, add only small accents to a copy of it. Never replace a Dave original with a generated scene without his word. Pieces of his that are finished but currently unused, as of 2026-11-12:

| File | Story | Status |
|---|---|---|
| `good-samaritan-story.jpg` | Good Samaritan (202-01) | Finished, Dave's look. Was in use until PR #180 proposed replacing it. |
| `fruit-tree-story.jpg`, `fruit-tree-story-color.jpg` | Two people under a fruit tree (201-09 Fruit of the Spirit) | Finished pair in Dave's look. Replaced by the vine sequence in #153. |
| `jesus-sends-72.jpg` | Jesus sending the 72 (203-07) | Finished, Dave's look. Restored to 203-07 on 2026-11-12 at Dave's direction; the generated dissolve files from #169 stay in the folder unused. |
| `jesus-light-bw.jpg`, `jesus-light-color.jpg` | Jesus as light | Finished pair, unused. Ask Dave which lesson. |
| `soils-bw.jpeg`, `soils-color.jpg` | Four soils (201-04) | Finished pair. Replaced by the six-frame sequence in #147. |
| `running-father-bw3.jpeg`, `running-father-color3.jpeg` | Running father (201-01) | Finished pair. Replaced by the five-frame sequence. |
| `house-rock-1.png`, `house-rock-2.jpg`, `house-rock-3.jpg` | Two builders (202-02) | Earlier frames. Replaced by the storm sequence in #135. |
| `202.08-abram-covenant-bw.png`, `202.08-abram-covenant-color.png` | Abram's covenant (202-08) | Finished pair, unused; 202-08 uses the marble and chisel pair. |
| `boy-and-tree.png` (+ bw, color) | Boy and tree | Unused. Ask Dave. |
| `201.06-country-road.jpg`, `201.06-golden-sunrise.jpg`, `202.04-library-bookshelf.jpg`, `202.04-open-bible.jpg`, `aspen-grove.jpg`, `Farmer-color3.jpg` | Photos and earlier variants | Unused. Not the sketch look; keep as references only. |

Naming for new files so they can be found: `LLL-NN-story-bw.jpg` and `LLL-NN-story-color.jpg` for a dissolve, `LLL-NN-story-seq-1.jpg` and so on for a sequence, where LLL-NN is the lesson. When you adopt one of Dave's older files, keep the original and add a copy under the lesson-numbered name so both can be found.

## Two Scroll-Animation Patterns

Every lesson opens with a story or parable near the top. Above that `parable` block sits a standalone `image` block with `"touchNext": true` so the artwork and story card fuse into one card without a gap.

The app engine (`index.html`, in `initParableDissolves()`) supports **two scroll-driven patterns**:

1. **Pattern A: Multi-Frame Scroll Sequence (`imageSequence` + `imageSequenceStops`)** - A flipbook/stop-motion sequence of 2 to 6 frames (like `201-01` The Running Father) that cross-fades from frame to frame as the learner scrolls.
2. **Pattern B: Two-Layer B&W-to-Color Dissolve (`imageBw` + `imageColor`)** - A black-and-white charcoal sketch that dissolves away on scroll to reveal a matching color version underneath (like `201-03` The Pillar in the Wilderness).

In both patterns, if the user prefers reduced motion (`prefers-reduced-motion: reduce`), the app skips scroll animation and statically displays the final state (the last frame in a sequence, or the color image in a dissolve).

---

## Pattern A: Multi-Frame Scroll Sequence (`imageSequence`)

### How the Artwork Works (Exemplar: `201-01` Running Father)

Look at `data/201-01.json` and `images/running-father-seq-1.jpg` through `images/running-father-seq-5.jpg`:

- **Identical dimensions across all frames:** Every frame in a sequence must have the exact same pixel width and height (for example, `1248x832` in `201-01`) so the container height never shifts during scroll.
- **Locked background plate:** Keep the background environment, horizon, road, lighting, and stationary figures locked in the exact same pixel positions across every frame.
- **Progressive subject motion:** Only the moving subject changes from frame to frame. In `201-01`, the returning son stands at the same spot down the road in all 5 frames while the father progresses from large in the foreground (`seq-1`), down the road (`seq-2`, `seq-3`, `seq-4`), to standing right beside his son with his arm reaching out (`seq-5`).
- **Hold a beat by repeating a frame:** If a frame needs to pause on screen longer during scroll, list the same image path twice in `imageSequence` across two adjacent stops (as `202-02` does with `house-rock-seq-2.jpg`).

### JSON Shape (`imageSequence`)

Place a standalone `image` block immediately above the `parable` block:

```json
{
  "type": "image",
  "imageSequence": [
    "images/running-father-seq-1.jpg",
    "images/running-father-seq-2.jpg",
    "images/running-father-seq-3.jpg",
    "images/running-father-seq-4.jpg",
    "images/running-father-seq-5.jpg"
  ],
  "imageSequenceStops": [
    0,
    0.16,
    0.3,
    0.44,
    0.58
  ],
  "alt": "A father running down the road toward his returning son until he reaches him",
  "touchNext": true
}
```

Followed immediately by the `parable` block (with no `image` field inside the `parable` block itself):

```json
{
  "type": "parable",
  "title": "The Running Father",
  "text": "Story text here..."
}
```

### How `imageSequenceStops` Works

The scroll engine measures `progress` from `0` to `1` as the top of the image block moves through the visible lesson area (below `.lesson-topbar`):

- **`progress = 0` (`fadeStartY`):** Image top is at **40% down** the visible content area (`contentTop + visibleHeight * 0.40`).
- **`progress = 1` (`fadeEndY`):** Image top has scrolled to **22% above** the top bar (`contentTop + visibleHeight * -0.22`).

Important rule for stops: **Finish the final stop around `0.40` to `0.65`, not at `1.0`.** At `progress = 1.0`, the top of the image is already 22% above the top bar. Ending the last stop around `0.50` to `0.60` ensures the learner sees the final arrival frame while the whole picture is still on screen with the parable card visible beneath it.

### Proven Stop Presets by Frame Count

- **2 frames (`203-05` Blind Man):** `[0, 0.4]`
- **3 frames (`201-02` The Family Robe):** `[0, 0.25, 0.45]`
- **4 frames (`201-06` Creation):** `[0, 0.25, 0.4, 0.65]` (or `[0, 0.18, 0.34, 0.5]`)
- **5 frames (`201-01` Running Father):** `[0, 0.16, 0.3, 0.44, 0.58]`
- **6 entries with a hold (`202-02` Wise Builder):** `[0.1, 0.3, 0.38, 0.46, 0.55, 0.65]`

### How the Renderer Animates the Sequence

In `index.html`:

1. Frame 1 (`:first-child`) sits in normal flow and sets the box dimensions.
2. Frames 2 through N (`:not(:first-child)`) are stacked on top with `position: absolute; inset: 0; opacity: 0; pointer-events: none`.
3. As `progress` moves between `stops[segment]` and `stops[segment + 1]`:
   - Frame `segment` stays at `opacity: 1`.
   - Frame `segment + 1` cross-fades from `0` to `1` (`segmentProgress`).
   - Once `progress >= stops[last]`, the final frame stays at `opacity: 1`.

---

## Pattern B: Two-Layer B&W-to-Color Dissolve (`imageBw` + `imageColor`)

Use this when a lesson has a black-and-white charcoal sketch and an identically framed color version.

### JSON Shape (`imageBw` + `imageColor`)

```json
{
  "type": "image",
  "imageBw": "images/pillar-fire-bw.png",
  "imageColor": "images/pillar-fire-color.png",
  "alt": "Israel gathered in the wilderness at night as the pillar of fire rises before them",
  "touchNext": true
}
```

Optional field: `"frame": true` adds a 1px border (`.block-image-dissolve-framed`) when the artwork has a light edge that benefits from a subtle border.

### Rendering Logic

- The **color image** (`parable-img-color`, `z-index: 1`) sits at the base.
- The **black-and-white image** (`parable-img-bw`, `z-index: 2`, `position: absolute; inset: 0`) sits on top at `opacity: 1`.
- Scrolling from `40%` down the visible area to `-22%` above the top bar reduces `bwImg.style.opacity` from `1` to `0`, revealing the color image underneath.

### Art Prompts for Charcoal Pairs or Sequences

- **B&W Base / Sequence Frame Prompt:** `[Describe scene] in a 3:2 or 16:9 wide aspect ratio. A rough black and white charcoal sketch, dynamic and expressive linework, loose and energetic pencil strokes, high contrast lighting with deep shadows, storyboard concept art style, emotional and evocative body language, heavy cross-hatching, warm grayscale monochromatic palette.`
- **Color Reveal Prompt:** `[Describe scene] in the exact same composition and dimensions. A rough charcoal sketch with a warm color-splash/color-highlight treatment on the key focal elements [specify elements], dynamic and expressive linework, loose and energetic pencil strokes, high contrast lighting with deep shadows, storyboard concept art style.`
- **Sequence Frame Edit Prompt:** Keep the background plate fixed and move only the key figure or gesture step by step across frames 1 to N so cross-fades do not ghost the background.

---

## Current Story Image Plan & Inventory (Courses 101 to 203)

| Lesson | Story / Parable | Current Pattern | Current Asset(s) | Status / Next Upgrade |
|--------|-----------------|-----------------|------------------|-----------------------|
| 101-01 | Course Opener | Static diagram | `images/3-circles-coral.png`, `images/201.01-peaks-and-valleys.png` | Course opener (exception) |
| 101-02 | The Greenhouse | **4-Frame Sequence** | `greenhouse-seq-1.jpg` .. `4.jpg` (stops `[0, 0.18, 0.34, 0.5]`) | Live (`touchNext: true`) |
| 101-03 | Teach Us to Pray | None | - | Needs story art |
| 101-04 | The Bible | None | - | Needs parable + story art |
| 101-05 | The Aspen Grove | B&W -> Color | `aspen-bw.png` -> `aspen-color.png` | Live (`touchNext: true`) |
| 101-06 | The Woman at the Well | B&W -> Color | `woman-well-bw.png` -> `woman-well-color.png` | Live (`touchNext: true`) |
| 101-07 | The Shepherd Who Comes Looking | None | - | Needs story art |
| 201-01 | The Running Father | **5-Frame Sequence** | `running-father-seq-1.jpg` .. `5.jpg` (stops `[0, 0.16, 0.3, 0.44, 0.58]`) | **Benchmark sequence** |
| 201-02 | The Family Robe | **3-Frame Sequence** | `robe-down.jpg`, `robe-mid.jpg`, `robe-up.jpg` (stops `[0, 0.25, 0.45]`) | Live sequence |
| 201-03 | The Pillar in the Wilderness | B&W -> Color | `pillar-fire-bw.png` -> `pillar-fire-color.png` | Live (`touchNext: true`) |
| 201-04 | The Sower and the Soil | B&W -> Color | `soils-bw.jpeg` -> `soils-color.jpg` | Live (`touchNext: true`) |
| 201-05 | The Book Found in the Temple | Single static | `bible-journal.jpg` (not attached to parable) | Needs Temple scroll story art |
| 201-06 | The Road to Emmaus | **4-Frame Sequence** | `creation1.jpg` .. `creation4.jpg` (stops `[0, 0.25, 0.4, 0.65]`) | Live sequence |
| 201-07 | Philip and the Ethiopian | B&W -> Color | `philip-eunich-bw2.png` -> `philip-eunich-color2.png` | Live (`touchNext: true`) |
| 201-08 | The Unmerciful Servant | B&W -> Color | `kings-mercy.jpg` -> `kings-mercy-color.jpg` | Live (`touchNext: true`, `frame: true`) |
| 201-09 | The Vine and the Branches | **4-Frame Sequence** | `vine-branches-seq-1.jpg` .. `4.jpg` (stops `[0, 0.18, 0.34, 0.5]`) | Live (`touchNext: true`) |
| 201-10 | Coming to His Senses | B&W -> Color | `prodigal-son-two-brothers-bw.jpg` -> `prodigal-son-two-brothers-color.jpg` | Live (`touchNext: true`) |
| 202-01 | The Good Samaritan | Single static | `good-samaritan-story.jpg` | Upgrade to sequence or dissolve (`touchNext: true`) |
| 202-02 | The Wise and Foolish Builders | **6-Stop Sequence** | `house-rock-seq-1.jpg` .. `5.jpg` (stops `[0.1, 0.3, 0.38, 0.46, 0.55, 0.65]`) | Live sequence |
| 202-03 | The Early Church | **4-Frame Sequence** | `early-church-seq-1.jpg` .. `4.jpg` (stops `[0, 0.18, 0.34, 0.5]`) | Live (`touchNext: true`) |
| 202-04 | The Five Farmers in the Field | B&W -> Color | `Farmer-bw.jpeg` -> `Farmer-color.jpg` | Live (`touchNext: true`) |
| 202-05 | The Pit, the Prison, and the Palace | B&W -> Color | `202-05-joseph-pit-palace-bw.jpg` -> `202-05-joseph-pit-palace-color.jpg` | Live (`touchNext: true`) |
| 202-06 | Songs at Midnight | B&W -> Color | `202-06-midnight-songs-bw.jpg` -> `202-06-midnight-songs-color.jpg` | Live (`touchNext: true`) |
| 202-07 | Two Small Coins | None | - | Needs story art |
| 202-08 | The Marble and the Chisel | B&W -> Color | `202.08-marble-chisel-bw.jpg` -> `202.08-marble-chisel-color.jpg` | Live (`touchNext: true`, `frame: true`) |
| 202-09 | The View from the Roof | B&W -> Color | `202.09-david-roof-bw.png` -> `202.09-david-roof-color.png` | Live (`touchNext: true`, `frame: true`) |
| 202-10 | The Table He Longed For | B&W -> Color | `last-supper-bw.jpg` -> `last-supper-color.jpg` | Live (`touchNext: true`, `frame: true`) |
| 203-01 | On the Mountain | Logo only | `203-3circle-logo.png` | Needs story art if parable kept |
| 203-02 | A Prayer Before the Answer | Logo only | `203-02-bless-logo.png` | Needs Nehemiah story art |
| 203-03 | Stay with Us | B&W -> Color | `203-03-emmaus-table-bw.jpg` -> `203-03-emmaus-table-color.jpg` | Live (`touchNext: true`) |
| 203-04 | The Towel and the Basin | B&W -> Color | `jesus-washing-feet-bw.png` -> `jesus-washing-feet-color.png` | Live (`touchNext: true`) |
| 203-05 | I Was Blind, Now I See | **2-Frame Sequence** | `blind-1-closedeyes.jpg`, `blind-2-openeyes.jpg` (stops `[0, 0.4]`) | Live sequence |
| 203-06 | Faithful in Babylon | B&W -> Color | `203-06-daniel-window-bw.jpg` -> `203-06-daniel-window-color.jpg` | Live (`touchNext: true`) |
| 203-07 | Jesus Sends the 72 | B&W -> Color | `203-07-sends-72-bw.jpg` -> `203-07-sends-72-color.jpg` | Live (`touchNext: true`) |
| 203-08 | Four Generations | Single B&W | `203.08-paul-timothy-bw.jpg` (`touchNext: true`) | Tracked as `ART-008` (add color or sequence) |
| 203-09 | The Tentmakers | B&W -> Color | `203-09-tentmakers-bw.jpg` -> `203-09-tentmakers-color.jpg` | Live (`touchNext: true`) |
| 203-10 | A Place for Every Part | None | - | Needs body/parts story art |

---

## Checklist When Adding or Updating Story Images

1. **Verify dimensions:** Confirm every frame in an `imageSequence` (or both files in an `imageBw`/`imageColor` pair) has the exact same pixel width and height (`sips -g pixelWidth -g pixelHeight images/your-file.jpg`).
2. **Wire the JSON block:** Place the `image` block immediately before the `parable` block with `"touchNext": true` and a clear `"alt"` description. Remove any legacy `"image"` property from inside the `parable` block.
3. **If changing a 101 image:** Run `node scripts/build_lesson_images.js` (and add any new `101-*` image paths to `SOURCES` in `scripts/build_lesson_images.js`) because `scripts/test_lesson_images.js` requires every `101-*.json` image to have an optimized WebP entry in `scripts/lesson-image-assets.js`.
4. **Run the QA suites from `discipleship/`:**
   - `bash scripts/qa_foundation.sh`
   - `node scripts/test_lesson_assets.js`
   - `node scripts/test_lesson_images.js`
   - `node scripts/test_answer_storage.js`
5. **Browser check at 375px, 390px, and 1280px:** Serve `discipleship/` (`python3 -m http.server 8765 --bind 127.0.0.1`) and verify the frames advance in order, the final frame is near full opacity and still on screen at the final stop, `touchNext` connects cleanly to the parable card, and there is no layout shift (`scripts/l201_01_sequence_browser_check.js` is the reference test script).
