window.processChapterContent = function (rawContent) {
    // 1. Remove form feeds
    let lines = rawContent.replace(/\f\d?/g, '').split('\n');
    let html = '';
    let currentBlock = [];

    // Helper to process a accumulated text block
    function flushBlock() {
        if (currentBlock.length === 0) return;

        let fullText = currentBlock.join(' ').trim();
        if (!fullText) {
            currentBlock = [];
            return;
        }

        // Footnote Check
        // If the block STARTS with a footnote marker, treating the whole block as a footnote.
        if (/^\d+\.\s/.test(fullText)) {
            html += `<div class="footnote">${fullText}</div>`;
        }
        else {
            // Header vs Paragraph Check
            let isHeader = false;

            // Length Check: Headers are usually short
            if (fullText.length < 150) {
                // Punctuation Check:
                // If it DOES NOT end with standard sentence punctuation, it's likely a header.
                if (!/[.!?]["”]?$/.test(fullText)) {
                    isHeader = true;
                } else {
                    // Title Case Check for exceptions like "What Is Risk?"
                    let words = fullText.split(/\s+/).filter(w => w.length > 0);
                    let caps = words.filter(w => /^[“"']?[A-Z]/.test(w));
                    if (words.length > 0 && (caps.length / words.length) > 0.7) {
                        isHeader = true;
                    }
                }
            }

            if (isHeader) {
                html += `<h2>${fullText}</h2>`;
            } else {
                html += `<p>${fullText}</p>`;
            }
        }
        currentBlock = [];
    }

    lines.forEach(line => {
        let trimmed = line.trim();

        // Blank line forces flush
        if (!trimmed) {
            flushBlock();
            return;
        }

        // Page Marker Check force flush
        let pageMatch = trimmed.match(/^\[PAGE\s+(\d+)\]$/i);
        if (pageMatch) {
            flushBlock();
            let num = parseInt(pageMatch[1], 10) + 2;
            html += `<p style="text-align: center; font-weight: bold;">**[Page ${num}]**</p>`;
            return;
        }

        // Footnote Start Check force flush
        // If line starts with "1. " (or similar), it starts a new block (likely footnote)
        if (/^\d+\.\s/.test(trimmed)) {
            flushBlock();
            currentBlock.push(trimmed);
            return;
        }

        // Normal text line, accumulate
        currentBlock.push(trimmed);
    });

    flushBlock(); // Final flush

    return html;
};
