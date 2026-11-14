# WIDGET-202-09-STARTING-GUN

Dave approved only the RUN from Sin widget at 3e1325b6ad2af3019ebea5384d805e019a577dfa in PR #234, following already-merged triangle PR #239 (81b028b). Both starting-gun.html and covenant-triangle.html remain byte-identical to their approved commits (3e1325b and 2c2eb09). Main was merged normally into this branch, retaining all newer frame integrations and both board histories. The sole runtime diff from current main is starting-gun.html. All lesson JSON, index.html, question objects/IDs, reading keys, saved answers and unrelated lessons remain unchanged. Component approval only; no new whole-lesson or image approval is inferred.

Technical review: the self-contained SVG widget uses named native navigation controls, keyboard-enabled R/U/N signs, reduced-motion instant placement, cancellable animation frames and width-only card remeasurement. No network or storage calls. Both approved inline scripts parse. Source comparisons reserve exact approved HTML bytes; no runtime repair is authorized or made.

The supplied RUN browser harness was strengthened: seed only the isolated top window once, observe writes in the actual iframe, verify all lesson answers, full iframe/card fit in tested states, signpost keyboard controls, restart/direct RUN choice, answer edit/reload and lesson-scoped Email. This avoids its previous unconditional seed reset hiding answer preservation problems. All values are synthetic.

Approved RUN SHA256 0a9de55a918404b32ad7696e5098e4bddeeb514a4705a5fb5c183ec525eb348f; triangle SHA256 24ce3d53ddf8c408b5eddab8efdd01169d8085a54e39cda1e676f41116e3e789.

Full requested suite, actual exits 0: npm ci; foundation; export 186; answer storage 64; assets 128; images 1366; iframe 32; RUN widget browser 294 across 375/390/1280 with normal/reduced motion; review_202_08_09_browser_check.js 26 (including actual backup and scroll/resize checks); widget_headers_browser_check.js 4148 across 78 embedded cases. Both approved source hashes, all data/index invariants and inline syntax pass. Final exact-head preview and live evidence will be recorded on PR #234. PR #239 was already merged and live, so it was not reopened or duplicated.
