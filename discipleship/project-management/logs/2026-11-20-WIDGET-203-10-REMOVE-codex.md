# WIDGET-203-10-REMOVE

Dave explicitly requested removing the203-10 widget because a better one is planned. Remove only widgets/great-command-v5-201.html embed from203-10.json, its Diagram contents link, and the obsolete Greatest Commandment cross Subtitle/Tool metadata fields in the203.10 TOC row. Preserve Mark12 and all other lesson prose/Scripture, active and retired question objects, saved answers and shared widget files used by other lessons. No placeholder or new design. ACTIVE for QA, browser verification, PR merge and deployment.


## Completion

DONE. Final head147db14f2ed8db238baa760bc0b5708df9566b40 passed foundation QA; export212, storage73, assets140, images1572 and iframe32 passed.30 local and30 exact-preview checks passed at390/1280: no lesson iframe, Mark12 text retained, all current question values retained, reload and retired-answer history preserved, active/retired Email export preserved, no overflow or page exceptions. All remaining lesson JSON values matched current main after removing only the widget and Diagram contents entry. Shared widget, images and renderer files byte-identical.

All3 PR checks passed and mergeable_state was clean. PR #343 merged1ff1002dd05fe5ed903065a0ca810dce4ad7e574. Firebase44736024654 succeeded. Live lesson JSON, TOC and shared widget HTML returned200 and exactly matched source.30 production phone/laptop checks passed. No new widget or placeholder added; future design remains separate. Documentation completion only follows.
