# Planting Orchards - Project Brief

**App name:** Planting Orchards Discipleship Series
**Subtitle:** Discipleship Series
**Anchor verse:** "As you received Christ Jesus the Lord, so walk in him, rooted and built up in him and established in the faith." - Colossians 2:6-7 ESV
**Tagline (pillars):** Rooted - Built-Up - Established
**Folder name:** `discipleship`
**Main HTML file:** `index.html`

> For editorial direction, tone, audience, and lesson standards, see **DISCIPLESHIP-COMPASS.md**. This file covers product structure, technical architecture, and content format only.

## What This App Is

Planting Orchards is a self-paced, phone-friendly app that walks someone through the entire journey of following Jesus, from the first foundations of faith all the way to multiplying disciples. It is 47 lessons across five courses, each built around the image of a growing tree. Every lesson is written in a warm, conversational tone with Scripture, reflection questions, and real-life application. The goal: make personal spiritual growth feel excellent, simple, and joyful on a phone.

## The Five Courses

| Series | Course Name | Lessons | Focus | Tree Metaphor |
|--------|-------------|---------|-------|---------------|
| 101 | Starting in Discipleship | 7 | The roots - foundation in Christ | Root system (7 labeled roots going down) |
| 201 | Growing Deep in Discipleship | 10 | Deep in Christ - the heart of the gospel | The trunk (gospel theology core) |
| 202 | Growing Up in Discipleship | 10 | Strong in character - becoming like Jesus | Branches growing strong |
| 203 | Growing Out in Discipleship | 10 | Out to the world - living on mission | Fruit on the branches |
| 301 | Leading in Discipleship | 10 | The full orchard - leading and multiplying | One tree becomes an orchard |

## Course Colors (exact hex values)

| Series | Marker Text | Marker Background | Keyword/Topbar |
|--------|------------|-------------------|----------------|
| 101 | `#1E6FA0` | `#DCEEFB` | `#1E6FA0` |
| 201 | `#1A6B55` | `#D4F2E8` | `#1A6B55` |
| 202 | `#1D6B3F` | `#D1EDD9` | `#1D6B3F` |
| 203 | `#1A5C38` | `#CCE6D4` | `#1A5C38` |
| 301 | `#9A3A5E` | `#FCE4ED` | `#9A3A5E` |

The three Growing courses use a progression of greens to show they are related but distinct. 301 Leading uses a warm rose/pink.

## Naming Convention

### Terminology (enforced everywhere)
- **Course** - the big container (e.g., "Starting in Discipleship")
- **Lesson** - each individual unit within a course (e.g., "Lesson 3: Prayer")
- **Never use** "session," "study," "module," or "unit"

### Numbering System
Three-number coordinate system: **Series.Lesson.Question**
- **101.3.2** = Starting, lesson 3, question 2
- **203.7.1** = Growing Out, lesson 7, question 1

This numbering shows up in question labels users see (e.g., "3.2 -") and in conversation between disciplers and leaders.

### Course Introductions
The first lesson of each course (101.01, 201.01, 202.01, 203.01, 301.01) includes a brief welcome at the top: a heading and 1-2 paragraphs that celebrate what the learner has completed, cast vision for the course ahead, and remind them to take it at their own pace.

## Visual System: The Tree Infographic

### Tree-to-Curriculum Mapping
- **101 Roots:** 7 roots going downward (Welcome, Salvation, Prayer, Bible, Church, Evangelism, Repentance)
- **201 Trunk:** 10 layered sections growing upward (Greatest Commandment, Loving Others, Sin and Fall, Justification, Faith and Repentance, Identity, Suffering, Spiritual Practices, Personal Purity, New Creation)
- **202 Branches:** 10 branches extending outward (Spirit-Filled Walk, Sanctification, Biblical Storyline, Christ in OT, God-Honoring Home, Parenting, Church Membership, One Anothering, Ordinances, Hospitality)
- **203 Fruit:** 10 pieces of fruit (Mission of God, Missionaries, Relational Evangelism, Your Story, Gospel Diagram, Apologetics, Spiritual Warfare, Work as Worship, Compassion and Justice, Multiplication)
- **301 Orchard:** 10 trees (Introduction, Image Bearers, Spiritual Disciplines, Transforming Word, First Neighbors, Leading at Home, Blessing Neighborhood, Belonging, Multiplying, APEST and Calling)

### Brand Logo
Three-circle logo: left circle (blue) is a seedling/pot for Starting (101), middle circle (three green bands) is a full tree for Growing (201/202/203), right circle (pink/rose) is an orchard for Leading (301).

### Design Guidelines for Tree Images
- Warm, hand-drawn feel with earth tones and soft greens and browns
- Not cartoonish, suitable for adults in a church discipleship context
- Clean enough to work at phone screen size
- Color highlight system: one zone highlighted in its accent color, everything else in soft gray

## Homepage Design

### Layout (top to bottom)
1. "Planting Orchards" - Forum bold serif, 1.65rem
2. "Discipleship Series" - Raleway 300 weight, 0.68rem, wide letter-spacing
3. Logo image (three circles) - 580px, centered
4. Verse line - "Col. 2:6,7 As you received Christ Jesus the Lord, so walk in him"
5. Pillars - "Rooted - Built-Up - Established" - Raleway 800 weight
6. Five course cards, equal, color-coded by series

### Typography (Google Fonts)
- **Forum** - home page title
- **Cinzel** (700, 900) - verse reference line
- **Raleway** (300, 700, 800) - subtitle and pillars

## Architecture

- One self-contained HTML file: `index.html` (3100+ lines)
- Google Fonts loaded via `<link>` in `<head>`
- Pure CSS with custom properties for theming, pure vanilla JavaScript
- 47 lesson JSON files in the `data/` folder
- The HTML file is the engine; the JSON files are the content

## File Structure

```
discipleship/
  index.html                            - the entire app (styles + JS + HTML)
  data/                                  - 47 JSON lesson files
    101-01.json through 101-07.json      - Starting (7 lessons)
    201-01.json through 201-10.json      - Growing Deep (10 lessons)
    202-01.json through 202-10.json      - Growing Up (10 lessons)
    203-01.json through 203-10.json      - Growing Out (10 lessons)
    301-01.json through 301-10.json      - Leading (10 lessons)
  widgets/                               - self-contained interactive HTML tools
    bible-bookshelf.html                 - interactive Bible overview (used in 202-04)
  images/                                - logo and visual assets
  curriculum-toc.csv                     - master curriculum outline
  Lesson_research/                       - research files (one per lesson)
  leadership-archive/                    - source material archive
  DISCIPLESHIP-COMPASS.md               - master editorial/curriculum direction
  AI-START-HERE.md                       - AI entry point and reading order
  AI-LESSON-CHECKLIST.md                 - practical lesson drafting checklist
  PROJECT-BRIEF.md                       - this file (product and technical structure)
  PROJECT-STATE.md                       - current progress and session history
  SKILL.md                               - AI behavior guidance (points to Compass)
```

## How the App Works

- Home screen shows five equal course cards, each color-coded
- Tapping a course loads its JSON files and takes over the full screen
- Sticky top bar with back navigation, course name (first word highlighted in course accent color), lesson counter, and progress bar
- "All Lessons" button opens a table of contents with a course header and completion checkmarks
- Sticky bottom bar with Previous/Next navigation and lesson number
- Textareas auto-grow as the user types (no placeholder text)
- All responses auto-save to localStorage silently
- Email export sends only the current course
- Lesson count is auto-detected: drop a new JSON file and it appears

## JSON Block Types

Each lesson JSON has a `title`, optional `description`, and a `blocks` array. Available block types:

- `heading` - section header (with optional `subheading: true` flag, optional `icon` property for image path)
- `subheading` / `subheading2` - smaller section headers
- `text` - paragraph content (supports inline HTML: `<strong>`, `<em>`)
- `verse` - Scripture block with `reference` and `text`
- `list` - ordered items with left accent border
- `box` - warm-toned reflection/activity box with `title` and `content` array
- `question` - textarea with auto-save (`id`, `text`, optional `height`: "short" or "tall")
- `image` - in-lesson image with `src` and `alt`
- `commitment` - yes/no radio buttons
- `bible_reading` - expandable chapter cards with ESV API text, audio, completion checkbox, notes
- `stepper` - step-by-step interactive element
- `tool` - special tool/framework display
- `checklist` - tappable tile grid with `id`, `prompt`, and `items` array (selections auto-save)
- `widget` - embedded interactive HTML tool loaded via iframe with `src` pointing to a file in `widgets/` folder (auto-resizes to content height, optional `height` property for initial min-height)

Note: `agenda` and `homework` block types still render for backward compatibility but are no longer used.

## Widget System

The `widget` block type allows self-contained interactive tools to be embedded directly in lesson flow. Each widget is a standalone HTML file in the `widgets/` folder with its own CSS and JS inline. The app renders it in an auto-sizing iframe that blends seamlessly into the lesson.

### How to add a widget to a lesson

1. Create a self-contained HTML file in `widgets/` (e.g., `widgets/my-tool.html`)
2. Add a widget block to the lesson JSON: `{ "type": "widget", "src": "widgets/my-tool.html", "height": "400px" }`
3. The `height` property is optional (defaults to 500px) and sets the initial minimum height before the iframe auto-sizes

### Design guidelines for widgets

- Phone-first design (max 640px content width)
- Use the same font stack as the app: `-apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif`
- Use warm, earthy color palettes that match the course color system
- Make all interactive elements accessible (keyboard + aria labels)
- Keep the widget self-contained with no external dependencies
- Set `background: transparent` on body so it blends with lesson background

### Current widgets

- `widgets/bible-bookshelf.html` - Interactive Bible overview with 66 color-coded book spines organized by section. Tap any book to see a summary card for its section. Used in 202-04.

## Adding a New Lesson

1. Create a JSON file following the naming pattern (e.g., `data/201-08.json`)
2. Use the block types described above
3. Title format: `"Lesson X: Title Here"`
4. Include a journey recap paragraph as the first text block (except for course openers)
5. End with the standard Closing Reflections (heading + three questions)
6. The app auto-detects it on next load
7. Update `curriculum-toc.csv` to keep the master list accurate

## Key Technical Details

- localStorage key: `christianFoundationsResponses`
- ESV Bible API Token: `7e4b8df428bed84fc9ee3afd18c666fb64775e06`
- Question IDs in JSON: `lesson-question` format (e.g., `1-1`, `1-key`)
- Runtime storage keys: `question-{series}-{id}` (e.g., `question-101-1-key`)
- Display labels: dot format `1.3` (lesson.question)
- Commitment keys: `commitment-{series}`
- Keyboard nav: Ctrl/Cmd + Arrow Left/Right between lessons
- Periodic backup save every 30 seconds
- BUILD_VERSION = Date.now() (automatic cache busting, never bump manually)
- Version badge: `"version": "v03"` in JSON renders as small tag above lesson title

Dave (pastor at Neighborhood Church) does final theological review on every lesson.
