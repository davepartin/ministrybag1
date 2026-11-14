# DAVE-101-05-SERVICE-FLOW

Dave confirms 101-05 remains Silver. Applied only his requested serving choices and moved the unchanged 5.3 prompt after the potluck teaching (including its supporting verse), before the checklist. Teaching and Discipleship Group are separate; Cleaning Team, Community Service Team, Lawn Team, Hospitality and Other are added. First Impressions, Financial Giving and the old combined Teaching / Bible Study tile are hidden. Original numeric positions remain reserved so saved selections are not reinterpreted; Email identifies a selected old option as an earlier selection. All other copy, question objects/IDs, reading keys and images stay unchanged.

Technical scope: optional retiredItemIndexes metadata, hidden reserved DOM slots and earlier-selection export labels. No storage migration, key change or mutation of old saved arrays. New unit/browser checks cover old and new choices, reload, editing answers and Email scope. Exact-head preview/live verification follows on the PR.

Verification: npm ci and foundation, export (186), storage (64), asset paths (127), images (1367), serving checklist browser (93 across 375/390/1280) all exit 0. Object comparison proves only requested choices and question order change. Gold 101-02 renders through the shared checklist/export update; its data and visual assets are byte-unchanged.
