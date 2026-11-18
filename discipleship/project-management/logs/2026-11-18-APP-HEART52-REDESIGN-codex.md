# APP-HEART52: verse-first redesign

Date: November 18, 2026 (Dave's local date). Owner: Codex. Branch: codex/heart52-companion. PR: #296. Status: REVIEW; this replaces the first app design for visual review, not live publication.

## Dave's direction

Dave requested a full phone-first redesign: flip cards with a topic or first-two-word hint, large passage text, a continuous reference view, a verse-per-week calendar and a useful opening choice, while keeping the app simple. He also asked about five translations. Codex recommended keeping the original ESV selections for this pass, with future translations needing accurate matched text/audio and permissions. No additional translations were added or substituted.

## Result

Heart52 now has a restrained forest/sage/ivory visual identity and a new small inline heart/cross wordmark. Original logo assets remain unchanged on disk but no longer dictate the screen. The passage is the visual center, with a compact hint face and a readable reverse. Topic/first-two-word hints are switchable; tap, Space or Enter reveals and reconceals the card. Arrow keys and previous/next controls move through the deck. Inactive faces are hidden from assistive technology; reduced motion removes the flip. Long passages grow naturally rather than clipping, shrinking below 24px or using an inner scroll box.

Three views: Your verse, All 52, The year. All 52 displays every original passage back-to-back with existing search/topic filters and practice links. The 52-week local-date plan begins January 1, with week 52 covering remaining days; the interface explicitly describes this convention rather than pretending it is an ISO-week calendar. A first visitor opens on the current week's card. Returning visitors resume their selected verse unless they choose weekly startup; explicit hash links still open their target. Startup/hint preferences live in optional metadata within the existing progress record and travel in portable copies. Opening remains read-only; no old storage or scores are rewritten on launch.

Read/listen, hints, phrase ordering, concealed typed/spoken recall, gentle review dates and safe copy/recovery remain available behind Practice & listen. There is no fake mastery/streak. ESV text, references, themes, existing audio, both optional lesson links, original source fixtures and all lesson/Gold/widget/art files are untouched by this redesign. Existing Daily Prayers and Weekly Connection Time sources and the apps hub are untouched. Generated MinistryBag heart52/ deliveries match authored tools/heart52/ source. No API, package, external font, Firebase configuration or account-sync change.

## Verification

- Foundation QA: all suites passed.
- Export: 186; answer storage: 64; assets: 144 references; lesson images: 1542; widget iframe: 32. All passed.
- TZ=America/Chicago node scripts/test_heart52.js: 1769 checks passed. Includes all original selections/audio, recall fairness, storage failures/recovery and daily calendar coverage in four normal/leap years.
- HEART52_LEGACY_URL=http://127.0.0.1:8854/heart52/ node scripts/heart52_browser_check.js: 674 checks passed across canonical/legacy, actual audio, practice/recall, copies/recovery, 320/375/390/648-at-2x/1280/reduced motion and seven compatibility/failure cases. Selectors were updated for the new navigation and wordmark; scoring/storage assertions were retained.
- node scripts/heart52_cards_browser_check.js: 486 checks passed across six viewport/motion cases. Covers compact opening-card fit, keyboard flip, hidden-answer accessibility, exact reverse text, preferences/resume, all 52 reference passages, year navigation, endpoint, long-passage readability/clipping and zero overflow/errors.
- Companion hub browser check: 340 checks passed, including all three app paths and existing synthetic lesson/prayer answer preservation.
- Mirror parity and both v2 validators passed. No data/audio/other-app/lesson diff versus 6723ee9.
- Phone and laptop card/calendar screenshots inspected. The first layout let a long reverse determine the concealed face's height; repaired it so the front is compact and the reverse grows on reveal. The fit/readability checks now pass on 320px phones too.

## Review and integration

This is a continuation of PR #296, targeting codex/weekly-connection-companion (#288), itself based on Daily Prayers #261. The preview includes the companion family but does not imply those dependencies were merged. New design and UI copy await Dave's review; no new lesson wording approval or Gold stage inferred. Held 201-05 rewrite #292 remains separate and untouched. Merge approved dependencies, retarget and verify current main before final integration. Hosted preview evidence will be posted on PR #296 after deployment; no live deployment is performed here.


## Dave follow-up: larger Scripture addresses

Dave liked the keywords and requested larger references. Front reference increases from 13px to a responsive 24-30px serif; reverse reference from 12px to 22-28px. Both use the main ink color. Topic hints, all verse text, layout/behavior, saved progress, lesson files and other apps stay unchanged. Source CSS and generated legacy CSS only, plus coordination notes.

Verification: all 486 card/reference/calendar/startup browser checks pass across 320/375/390/648/1280 and reduced motion. A separate focused browser pass checked all 52 front references and unchanged keywords at 320/390/1280, minimum front24px/reverse22px and no card overflow. The 390px John10:10 front screenshot was inspected. Build mirror parity and git diff --check pass. Updated exact-head Firebase preview/check results will be recorded on PR #296. Status remains REVIEW; no merge or live publication.


## Dave follow-up: remove stacked headers and restore original logo

Dave requested at least half the space above the card removed and his website logo restored. One 48px header now contains Back, the original unmodified heart52logo1.svg, Apps and preferences. The view selector is the only other navigation row. The repeated tagline, visible hero headline and date sentence are removed from the opening layout; accessible heading/date context remain. Preferences are in the common footer so the header settings control works from all views. Card faces, keywords, large references, passage text, app logic/storage, all lessons and other app sources are untouched.

Measured card top (CSS px) before -> after: 320 wide 291 -> 144; 375/390 wide 300.5 -> 144; 648/1280 wide 306.5 -> 144. This removes 51-53 percent of pre-card space. Original SVG bytes are unchanged; no generated artwork or recoloring. Source/legacy HTML and CSS are synchronized.

Verification: 498 existing/extended card/calendar/startup checks pass across six viewport/motion cases, including the explicit half-height criterion and original-logo load. Global preferences from All52 open visibly with keyboard focus. Mirror parity, protected-file diff guard and git diff --check pass. Phone screenshot inspected. Existing general browser test's wordmark selector now checks the original img instead of the removed custom SVG. Final-head preview/hosting evidence is recorded on PR #296; status remains REVIEW, not published.


## Dave follow-up: blue identity for the memory app

Dave approved the compact direction and requested different blues for Heart52, with distinct colors for each companion app as a family direction. Heart52 now uses navy ink #173B56, pale blue card fronts #E1EFFB, near-white reverse #FCFEFF and primary blue #236B9E. Calendar, hints, tabs, links and borders use matching blues. The browser theme-color matches. Original logo, compact 144px pre-card layout, large reference sizes, all words/data/audio/storage and other app sources are unchanged. Existing amber focus and missed-word markers, plus red error feedback, retain their functional roles.

Authored CSS and browser-theme metadata are mirrored to the legacy MinistryBag delivery. Measured contrast: verse/front 9.99:1, verse/back 11.56:1, button text 5.72:1, muted page text 4.66:1; checked smaller card labels remain at least 4.5:1. Protected-file diff, mirror parity and git diff --check pass. Hosted visual and final browser evidence will be recorded on PR #296. This is color review only; no publication or whole-lesson approval is inferred.

Blue-theme verification: all 498 card/reference/calendar/startup checks pass at 320/375/390/648/1280 and reduced motion. Phone verse and laptop verse/calendar screenshots inspected; shared layout/type and original logo remain unchanged. Final-head hosting evidence follows on PR #296.


## Dave follow-up: Not started / Learning / Memorized

Dave requested persistent learner-controlled categories, visible card labels and quick filtered decks. Below the card, Mark this verse offers three clearly pressed choices. Your decks shows counts and opens only Not started, Learning or Memorized cards; next/previous and keyboard arrows remain inside that deck. The full passage reference list gains a progress filter and links into its filtered deck. Empty decks explain how to add verses and offer a way back to all cards. Moving the final verse out of a deck shows the empty state; changing a category keeps the current revealed face and scroll position if that card remains in the deck. Header/card typography and the 144px card-top position remain unchanged.

Optional per-verse learningStatus enum new/learning/memorized lives in the existing heart52-progress-v1 record. Missing status displays Learning only when existing attempts > 0, otherwise Not started. Opening remains read-only, no old score/mastery implies Memorized, explicit Not started overrides earlier attempts, and practice scores preserve explicit choices. Tagging preserves old metadata and schedules and does not invent scores/attempts. Copy/restore/recovery preserve categories; invalid categories are rejected before replacement. No new store, Firebase/account sync, Scripture/audio/lesson/other-app change. Authored source and root legacy deliveries are synchronized.

Verification: foundation QA, export186, storage64, assets144, images1542 and iframe32 pass. Learning/calendar/storage tests now1780 pass, including enum validation, legacy fallback and category persistence. All498 card/calendar/startup checks and674 canonical/legacy app checks pass. New category browser suite:120 checks pass across320/390/1280/reduced motion, covering old-data read-only opening, counts, manual labels without fake scores, no tagging scroll jump, scoped endpoints, empty decks, reload, copies/restores, invalid import, explicit category surviving recall, other app/lesson data and zero overflow/errors. Phone category controls screenshot inspected. Mirror parity, protected-file diff and whitespace checks pass. Hosted exact-head evidence follows on PR #296. REVIEW, not merged or published.


## Dave follow-up: checked boxes above the card; remove extras

Dave asked for a tight row above the card with exactly one checked square identifying its category, separate clickable category words that open decks, and no download/record-management extras. Native single-choice radios are styled as squares with checkmarks; each has its own accessible label and a separate anchor for its word. Checking assigns; selecting a word navigates without labeling the prior card. Selections remain through flips, reload and practice. Empty decks disable only the squares, retaining navigable links. The row is above both card faces, and position text now shares the existing below-card navigation row. Card begins161px from the top: the compact original-logo header is unchanged, with17px net added for the explicitly requested controls.

Removed the lower category segment, duplicated deck panel, practiced totals/review-dashboard entry, download/export/import/restore/reset controls, record/recovery messaging and related app handlers/helpers. Removed management controls from the DOM, not just hidden. The small opening preference remains. Actual storage errors still have a plain truthful notice. No new archives are created; existing local progress/category/legacy data remain intact, and underlying compatibility storage helpers are retained without UI. No lesson, verse text/audio, other app, approved art/widget or account/Firebase change. User's simplification overrides earlier Heart52 backup-interface directions.

Verification: all foundation suites; export186, storage64, assets144, images1542, iframe32; existing learning/storage/calendar1780 pass. Card/calendar/startup498 checks pass with the161px card position threshold reflecting the new required control row. Revised general canonical/legacy browser599 checks retain audio, hints, phrase ordering, concealed/typed/spoken recall, reload, foreign data and six compatibility/failure scenarios; retired checks target deliberately removed UI only. New/revised category suite136 checks pass at320/390/1280/reduced motion, explicitly proving that box clicks assign without navigation and word clicks navigate without assigning, one checked box remains visible on both faces, scoped navigation and empty decks work, practice preserves categories, and removed management controls are absent. Unit-level compatibility/rollback coverage remains. Phone front and reverse screenshots inspected, mirror/protected-file/whitespace guards pass. Hosted exact-head evidence follows on PR #296. REVIEW, not merged or live.

Test adjustment: Playwright check() assumed the just-clicked radio would remain checked even after moving a card out of a filtered deck. The suite now clicks the control and verifies the resulting moved record/current card, matching the existing scoped-deck behavior. No persistence assertion was weakened.
