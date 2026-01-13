
import re

def clean_chapter_4():
    with open('chapter_4_only.txt', 'r') as f:
        lines = f.readlines()

    cleaned_lines = []
    # Patterns to remove
    page_header_pattern_1 = re.compile(r'^\d+\s+Don’t Waste Your Life\s*$')
    page_header_pattern_2 = re.compile(r'^Magnifying Christ through Pain and Death\s+\d+\s*$')
    page_number_pattern = re.compile(r'^\d+\s*$')
    footnote_start_pattern = re.compile(r'^\d+\.\s+')
    
    # We also want to try to catch footnote continuations. 
    # Footnotes often look like bibliographic entries.
    skip_next = False
    
    for i, line in enumerate(lines):
        line = line.strip()
        if not line:
            cleaned_lines.append("")
            continue
            
        # Headers/Footers
        if page_header_pattern_1.match(line):
            continue
        if page_header_pattern_2.match(line):
            continue
        if page_number_pattern.match(line):
            continue
            
        # Footnotes
        if footnote_start_pattern.match(line):
            # It's likely a footnote.
            # Check if next line looks like a continuation (indented or small text? can't tell font size)
            # We'll just skip this line.
            continue
            
        # Specific footnote continuation checks (tailored to this file based on viewing)
        if line.startswith("the Devil."): # continuation of footnote 1
             continue
        if line.startswith("Press, 1978),"): # continuation of footnote 5
             continue
        if line.startswith("Bunyan, ed. George"): # continuation of footnote 6
             continue
        if line.startswith("date Sermon at Bethlehem"): # continuation of footnote 4
             continue
             
        # Remove footnote markers in text? e.g. "Beelzebul, 1 how"
        # This is risky with regex, might hit legitimate numbers.
        # But looking at the file, the markers are often space-surrounded " 1 " or " 2 ".
        # Or attached: "Beelzebul, 1"
        
        # Let's just output the lines for now, better to have clean text with some markers than missing text.
            
        cleaned_lines.append(line)

    with open('chapter_4_cleaned.txt', 'w') as f:
        f.write('\n'.join(cleaned_lines))

if __name__ == "__main__":
    clean_chapter_4()
