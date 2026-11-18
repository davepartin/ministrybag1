# HEART52-CLEAN-CARD

November 18, 2026. Codex / codex/heart52-remove-kicker. Dave explicitly requested removing Bring it to mind from the live card.

Removed the front kicker span and replaced its unused spacing rule with an automatic top margin on the topic hint, keeping the topic/reference group balanced. Original keywords, reference sizes, verse text, checkboxes, deck links, blue palette, card height and saved-data logic stay intact. Authored HTML/CSS and generated MinistryBag delivery are synchronized. No lesson, app JavaScript, data/audio, logo, shared homepage or other app changes.

Checks: node scripts/build_heart52.js --check; git diff --check; protected-file diff. A one-off Playwright check at375/390/1280 verifies text absence, unchanged Golden Rule / Matthew7:12, exact reverse passage, category surviving flip, no overflow and no page errors. Phone screenshot inspected. The first local attempt found the stopped development server; starting the server and rerunning passed all3 widths. No product repair was needed.

This literal UI deletion is authorized by Dave's request. Merge and live-deployment evidence will be recorded on the PR; no further design approval is required. Task is DONE after the publication verification below.

PR #306 passed all3 checks at9a572c65267e7183315585164e12317daa645faf (preview run44347591493), was MERGEABLE/CLEAN and merged at82103f254eb44b18b32a009c4d5aeec4b3a9b36c. Main Firebase hosting run44347832815 and GitHub Pages run44347832241 succeeded. Live custom-domain Heart52 returns200 with the prompt absent; deployed HTML/CSS match the reviewed source exactly. Completion updates are documentation only.
