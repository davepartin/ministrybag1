# Rooted to Reproduce - Discipleship Series

**App name:** Rooted to Reproduce
**Subtitle:** Discipleship Series
**Anchor verse:** "As you received Christ Jesus the Lord, so walk in him, rooted and built up in him and established in the faith." - Colossians 2:6-7 ESV
**Tagline (pillars):** Rooted · Built-Up · Established
**Folder name:** `discipleship`
**Main HTML file:** `christian-foundations-model.html`
**Current BUILD_VERSION:** `20260224f`

## Church Vision & Tone (guides every decision)
- Church: Neighborhood Church, Overland Park, KS
- Core phrase: "Loving God and our neighbors together"
- We are a gospel-centered church plant focused on life-on-life discipleship, Neighborhood Groups, and helping people belong to the family of God (not just attend).
- Tone: Warm, relational, hopeful, practical, encouraging, deeply biblical. Speak like a caring pastor/discipler, never academic or preachy.
- Self-paced language: This study is designed to be worked through at your own pace. Avoid "we" language, "together" framing, "meetings" references, or anything that assumes a group setting. Write as if speaking directly to one person doing this on their own. It should still feel relational and warm, but not assume a partner or group is present.
- **Zero emdashes.** Use no emdashes (the long dash character) anywhere in this project. Use " - " (space, hyphen, space) instead. This applies to all JSON content, CSV data, HTML, Markdown, and any new files created.
- Goal of this app: Make personal spiritual growth feel excellent, simple, and joyful on a phone.

## What This App Is
Rooted to Reproduce is a self-paced, phone-friendly app that walks someone through the entire journey of following Jesus - from the very first foundations of faith all the way to multiplying disciples. It is 47 lessons across five courses, each one built around the image of a growing tree: putting down roots in the gospel, growing deep in theology, growing up in character, growing out in mission, and eventually planting an orchard by leading others to do the same. Every lesson is written in a warm, conversational tone with Scripture, reflection questions, and real-life application - so it feels less like a classroom and more like a trusted friend walking beside you.

## Naming Convention & Language Standards

### Terminology (enforced everywhere)
- **Course** - the big container (e.g., "Starting in Discipleship," "Growing Deep in Discipleship")
- **Lesson** - each individual unit within a course (e.g., "Lesson 3: Prayer")
- **Never use** "session," "study," "module," or "unit" - always "course" and "lesson"
- The JSON `title` field for every lesson uses the format: `"Lesson X: Title Here"`
- The topbar displays the full course name with the first word (Starting/Growing/Leading) highlighted in the course's accent color
- The "All Lessons" TOC panel shows a course header (e.g., "Growing Deep") followed by clean lesson titles without redundant numbering

### The Five Courses

| Series | Course Name | Color | Lessons | Focus | Tree Metaphor |
|--------|-------------|-------|---------|-------|---------------|
| 101 | **Starting in Discipleship** | Blue | 7 | The roots - foundation in Christ | Root system (7 labeled roots going down) |
| 201 | **Growing Deep in Discipleship** | Teal-mint green | 10 | Deep in Christ - the heart of the gospel | The trunk (gospel theology core, layered upward) |
| 202 | **Growing Up in Discipleship** | Mid green | 10 | Strong in character - becoming more like Jesus | Branches growing strong (character, sanctification) |
| 203 | **Growing Out in Discipleship** | Deep green | 10 | Out to the world - living on mission | Fruit on the branches (mission, evangelism, justice) |
| 301 | **Leading in Discipleship** | Rose/pink | 10 | The full orchard - leading & multiplying | One tree becomes an orchard (multiplying leaders) |

The home screen shows five equal course cards, each with its own color-coded marker. The three Growing courses use a progression of greens to show they are related but distinct. 301 Leading uses a warm rose/pink (changed from orange-red to match the brand logo).

### Course Colors (exact hex values)

| Series | Marker Text | Marker Background | Keyword/Topbar |
|--------|------------|-------------------|----------------|
| 101 | `#1E6FA0` | `#DCEEFB` | `#1E6FA0` |
| 201 | `#1A6B55` | `#D4F2E8` | `#1A6B55` |
| 202 | `#1D6B3F` | `#D1EDD9` | `#1D6B3F` |
| 203 | `#1A5C38` | `#CCE6D4` | `#1A5C38` |
| 301 | `#9A3A5E` | `#FCE4ED` | `#9A3A5E` |

### Numbering System

The entire curriculum uses a three-number coordinate system: **Series.Lesson.Question**

- **101.3.2** = Starting, lesson 3, question 2
- **201.5.3** = Growing Deep, lesson 5, question 3
- **202.3.2** = Growing Up, lesson 3, question 2
- **203.7.1** = Growing Out, lesson 7, question 1
- **301.4.2** = Leading, lesson 4, question 2

This numbering shows up in the question labels users see (e.g., "3.2 -") and in conversation between disciplers and leaders. If someone says "I got stuck on 202.3.2," you know exactly where they are.

### Course Introductions
The first lesson of each course (101.01, 201.01, 202.01, 203.01, 301.01) should include a brief welcome section at the top - typically a heading and 1-2 paragraphs that celebrate what the learner has already completed, cast vision for the course ahead, and remind them to take it at their own pace.

## Visual System: The Tree Infographic

### Concept
The entire curriculum is mapped to the growth of a tree - from roots underground to a full orchard. This gives learners a progressive visual that tracks their journey through all 47 lessons.

### Structure
- **One master graphic** showing the full tree-to-orchard progression (used on the home screen or as a curriculum overview)
- **Five zoomed graphics** (one per course) that highlight the section the learner is currently in
- **Per-lesson indicators** - at the top of each lesson, the zoomed course graphic shows which specific root, trunk section, branch, or fruit the learner is working on

### Tree-to-Curriculum Mapping
- **101 Roots:** 7 roots going downward, each labeled with a lesson topic (Welcome, Salvation, Prayer, Bible, Church, Evangelism, Repentance)
- **201 Trunk:** 10 layered sections of the trunk growing upward (Greatest Commandment, Loving Others, Sin & Fall, Justification, Faith & Repentance, Identity, Suffering, Spiritual Practices, Personal Purity, New Creation)
- **202 Branches:** 10 branches extending outward and upward (Spirit-Filled Walk, Sanctification, Biblical Storyline, Christ in OT, God-Honoring Home, Parenting, Church Membership, One Anothering, Ordinances, Hospitality)
- **203 Fruit:** 10 pieces of fruit on the branches (Mission of God, Missionaries, Relational Evangelism, Your Story, Gospel Diagram, Apologetics, Spiritual Warfare, Work as Worship, Compassion & Justice, Multiplication)
- **301 Orchard:** 10 trees in an orchard (Introduction, Image Bearers, Spiritual Disciplines, Transforming Word, First Neighbors, Leading at Home, Blessing Neighborhood, Belonging, Multiplying, APEST & Calling)

### Brand Logo
- Three-circle logo created by Dave
- Left circle (blue): seedling/pot - represents Starting (101)
- Middle circle (three green bands): full tree - represents the three Growing courses (201/202/203)
- Right circle (pink/rose): orchard of trees - represents Leading (301)
- Logo file: `images/rooted-logo.png` (drop PNG with transparent background here)
- Displayed at top of home screen, 580px wide, max 88% of screen width

### Design Guidelines for Tree Infographic Images
- Warm, hand-drawn feel - earth tones with soft greens and browns
- Not cartoonish - suitable for adults in a church discipleship context
- Clean enough to work at phone screen size
- Color highlight system: one zone highlighted in its accent color, everything else in soft gray
- Labels added as overlays in the app, not baked into the image

## Homepage Design

### Layout (top to bottom)
1. **"Rooted to Reproduce"** - Cinzel bold serif, 1.65rem, dark text
2. **"Discipleship Series"** - Raleway 300 weight, 0.68rem, wide letter-spacing (0.36em), gray
3. **Logo image** (three circles) - 580px, centered
4. **Verse line** - "Col. 2:6,7  As you received Christ Jesus the Lord, so walk in him" - Cinzel regular, 0.78rem
5. **Pillars** - "Rooted · Built-Up · Established" - Raleway 800 weight, 0.78rem, green accent, middle dots (·)
6. **Five course cards** - equal, color-coded by series

### Typography (Google Fonts - loaded in `<head>`)
- **Cinzel** (700, 900) - used for main title and verse reference line. Roman-engraved feel, timeless and bold.
- **Raleway** (300, 700, 800) - used for subtitle and pillars. Clean geometric sans.
- Import URL: `https://fonts.googleapis.com/css2?family=Cinzel:wght@700;900&family=Cormorant+Garamond:ital,wght@1,400;1,500&family=Raleway:wght@700;800&display=swap`

## Lesson Structure

Every lesson follows the same rhythm:
1. **Journey recap** (1 paragraph) - a brief orientation that tells the learner where they have been so far in the course and how this lesson connects to what came before. Keeps it to 2-3 sentences. This is the first text block in every lesson (except the very first lesson of a course, which has a course welcome instead).
2. Opening - a warm, accessible paragraph that draws the reader into the topic
3. Teaching sections - short paragraphs of content with Scripture passages woven in
4. Reflection questions - numbered using the Series.Lesson.Question format (e.g., 3.2)
5. Closing Reflections - every lesson ends with the same three questions:
   - "What is one key thing you learned from this lesson?"
   - "What is one step you are going to take this week?"
   - "What is a prayer request for this week?"

There are no "homework" or "agenda" sections. The lesson IS the homework. People finish a lesson at their own pace and move to the next one naturally. The closing questions create a simple rhythm for one-on-one discipleship conversations.

Lessons are designed to be self-paced (15-20 minutes to read and reflect) but short enough to talk through over lunch with a discipler.

## Lesson Development Workflow
1. Use the Research Prompt from `curriculum-toc.csv` for the target lesson
2. Run the prompt through NotebookLM (loaded with Dave's sermon transcripts) and Gemini
3. Save the combined research output as an .rtf file in `Lesson_research/` (e.g., `201.03_research_sin.rtf`)
4. Build the lesson JSON from the research, following the tone, structure, and theological distinctives documented here
5. Dave does final theological review

## Architecture (current, working)
- One self-contained HTML file: `christian-foundations-model.html`
- Google Fonts loaded via `<link>` in `<head>` (Cinzel, Raleway, Cormorant Garamond)
- Pure CSS with custom properties for theming, pure vanilla JavaScript
- 47 lesson JSON files in the `data/` folder, one per lesson
- The HTML file is the engine; the JSON files are the content

## File Structure
```
discipleship/                          - root project folder
christian-foundations-model.html       - the entire app (styles + JS + HTML)
data/                                  - 47 JSON lesson files
  101-01.json through 101-07.json      - Starting (7 lessons)
  201-01.json through 201-10.json      - Growing Deep (10 lessons)
  202-01.json through 202-10.json      - Growing Up (10 lessons)
  203-01.json through 203-10.json      - Growing Out (10 lessons)
  301-01.json through 301-10.json      - Leading (10 lessons)
images/                                - logo and visual assets
  rooted-logo.png                      - three-circle brand logo (drop PNG here)
curriculum-toc.csv                     - master curriculum outline (8 columns: Course, Lesson, Topic, Description, Key Verse, Goal, Key Bible Chapters, Research Prompt)
Lesson_research/                       - NotebookLM/Gemini research files (one .rtf per lesson)
leadership-archive/                    - source material archive
PROJECT-BRIEF.md                       - this file
```

## How the App Works
- Home screen shows five equal course cards, each color-coded
- Tapping a course loads its JSON files and takes over the full screen
- Sticky top bar with back navigation, course name (first word highlighted in course accent color), lesson counter, and progress bar
- "All Lessons" button opens a table of contents with a course header and completion checkmarks
- Sticky bottom bar with Previous/Next navigation and lesson number
- Textareas auto-grow as the user types (no placeholder text - clean empty boxes)
- All responses auto-save to localStorage silently (no "saved" indicators)
- Email export sends only the current course (not all 47 lessons at once)
- Lesson count is auto-detected - just drop a new JSON file and it appears

## JSON Block Types
Each lesson JSON has a `title`, optional `description`, and a `blocks` array. Available block types:
- `heading` - section header (with optional `subheading: true` flag)
- `subheading` / `subheading2` - smaller section headers
- `text` - paragraph content (supports inline HTML: `<strong>`, `<em>`)
- `verse` - Scripture block with `reference` and `text`
- `list` - ordered items with left accent border
- `box` - warm-toned reflection/activity box with `title` and `content` array
- `question` - textarea with auto-save (`id`, `text`, optional `height`: "short" or "tall")
- `commitment` - yes/no radio buttons
- `romans_road` - special pre-formatted gospel presentation block
- `bible_reading` - expandable chapter cards with ESV API text, audio player, completion checkbox, and notes. Used in the 101 course to read through the Gospel of John (3 chapters per lesson). Structure: `heading`, optional `intro` (shown once in lesson 1), and `chapters` array with `ref` for each chapter (e.g., "John 1"). Text loads on-demand when the card is tapped (lazy loading). Checkboxes and notes save to their own localStorage key (`foundationsReadingData`).

Note: `agenda` and `homework` block types still render in the HTML engine for backward compatibility but are no longer used in any lesson.

## Design Decisions
- Warm off-white background (#FAFAF8) instead of cool gray - better for devotional content
- Scripture verses use parchment tones with a warm brown left border - reverent, set apart
- Reflection boxes use soft warm beige - inviting, not alarming
- No emojis or icons in the level markers - clean 101/201/301 numbers that communicate progression
- All five course cards are visually equal - no card is elevated above another
- Full-screen lesson view so users aren't scrolling past navigation to reach content
- Cards float on soft shadows with transparent borders rather than visible border lines
- Export is a simple inline link, not a large banner
- No placeholder/hint text inside text boxes - clean and undistracting

## Adding a New Lesson
1. Create a JSON file following the naming pattern (e.g., `data/201-08.json`)
2. Use the block types described above
3. Title format: `"Lesson X: Title Here"`
4. Include a journey recap paragraph as the first text block (except for course openers)
5. End with the standard Closing Reflections (heading + three short questions)
6. The app auto-detects it on next load - no code changes needed
7. Update `curriculum-toc.csv` to keep the master list accurate

## Adding a New Block Type
1. Add a new `case` in the `switch` statement inside `buildUI()` in the HTML file
2. Add corresponding CSS styles
3. All 47 lessons immediately support the new type

## Key Technical Details
- localStorage key: `christianFoundationsResponses`
- ESV Bible API Token: `7e4b8df428bed84fc9ee3afd18c666fb64775e06`
- Question IDs in JSON use the file-based format: `201-01-3` (series-lesson-question)
- Display labels shown to users use the dot format: `1.3` (lesson.question)
- Commitment keys: `commitment-{series}` (e.g., `commitment-101`)
- Keyboard nav: Ctrl/Cmd + Arrow Left/Right to move between lessons
- Periodic backup save every 30 seconds
- BUILD_VERSION bump required whenever JSON files change (to bust browser cache)

Dave (pastor at Neighborhood Church) does final theological review on every lesson.

Built for Neighborhood Church to use for years - helping people love God and their neighbors more deeply.
