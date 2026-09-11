# Growing Together - Project State

Updated September 11, 2026. This is a lightweight orientation. Current task status lives in [project-management/TASKS.md](project-management/TASKS.md); immediate next work is in [project-management/HANDOFF.md](project-management/HANDOFF.md). Lesson order and browse metadata remain in curriculum-toc.csv.

## Current direction

Dave approved the baseline review's direction on September 11: protect saved work, preserve the pastoral story/Scripture/image/tool/practice rhythm, finish the curriculum, and add a Read/Discuss presentation for laptop preparation and phone conversations. The full project is 47 lessons; the 37 foundational lessons receive production priority. Leadership release timing will be reviewed at week six.

The working plan, all-lesson checklist, approval queue and portable agent prompts are now in `project-management/`. Routine agents take one bounded task. Dave intends to use Astra for daily review when available. This is a manual workflow; no scheduler or automatic account/model switch has been configured.

## Verified baseline

The September 11 audit examined app/content commit `fce80bc`. There are 47 JSON lesson files: 32 with substantive material and 15 empty/brief placeholders. These are writing categories, not approval status. One substantive draft also needs a topic rebuild.

- 101: all seven have substantive text; production/editorial checks remain.
- 201: all ten have substantive text and widgets; priority edits include 201-03/04/08/09. 201-01 and 201-08 are production benchmarks to refine; 201-10 remains a template exemplar.
- 202: 202-08 is empty and 202-09 is a brief stub. 202-02, 202-04 and 202-10 have since been written; the old April list calling them stubs is obsolete.
- 203: 203-06 and 203-10 are brief stubs; 203-09 is empty. 203-08 contains older Belonging material that does not match its current purpose. 203-05 is substantive.
- 301: all ten are placeholders requiring full development.

The baseline foundation QA passes. Additional audit found shared saved-answer IDs in two lesson pairs, four missing images, iframe errors, misleading export scope, and metadata/content drift. See the task board for fixes and the dated review for evidence. None of those app/content repairs were implemented by the initial planning packet.

## Immediate work

ENG-001 is next: preserve saved answers while repairing the ID collisions in 202-05/09 and 203-06/07, with regression checks. ENG-002 restores missing image assets; ENG-003 handles iframe initialization/resizing; ENG-004 corrects export behavior. Security cleanup is tracked separately as SEC-001.

Dave's parallel action is the short pastoral brief for 202-08 and 202-09 in project-management/DAVE.md. His general approval authorizes drafting and fixes; final wording approval is recorded against specific lesson versions.

## Architecture and folder responsibilities

- `index.html`: app shell, styles, lesson renderer, navigation and local answer persistence.
- `data/`: lesson sources; `data/standby/`: historical/alternative material, not current published lessons.
- `curriculum-toc.csv`: lesson order, titles, subtitles, tool/story labels, key verse and summary.
- `widgets/`: standalone interactive HTML tools.
- `images/`: lesson artwork and logos.
- `Lesson_research/`: drafting research.
- `project-management/`: plan, task status, handoff, approval queue, task logs and dated reviews.

The current app stores work in the current browser/device. Login and a database provider are undecided. DATABASE-PLAN.md is a prior proposal, not authorization to select Supabase. Stable IDs, backup/recovery and the device-handoff requirements can be established now.

The current app uses Date.now cache busting. PERF-001 owns the approved future production-versioning change and must update the technical brief when it is implemented. Do not change this as an incidental cleanup.

## Source and coordination rules

Read AGENTS.md and AI-START-HERE.md for task-specific context. Keep theology/voice aligned with the Compass and lesson structure aligned with the template. Keep the intentional 101 closing-question exception. Update the TOC when learner-facing metadata changes. Before stopping, log checks and the next action so another agent can continue from the repository.
