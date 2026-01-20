
import re

def clean_chapter_5():
    with open('chapter_5_only.txt', 'r') as f:
        lines = f.readlines()

    cleaned_lines = []
    # Patterns to remove
    page_header_pattern_1 = re.compile(r'^\d+\s+Don’t Waste Your Life\s*$')
    page_header_pattern_2 = re.compile(r'^Risk Is Right—Better to Lose Your Life Than to Waste It\s+\d+\s*$')
    page_number_pattern = re.compile(r'^\d+\s*$')
    footnote_start_pattern = re.compile(r'^\d+\.\s+')
    
    # Simple state machine for footnotes or other skips?
    
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
            # Just a number on a line
            continue
            
        # Footnotes
        if footnote_start_pattern.match(line):
            continue

        # Specific footnote continuation checks (tailored to Ch5)
        # "events that he sets in motion..." (fn 1)
        if line.startswith("events that he sets in motion"): continue
        if line.startswith("Theodicy (Downers Grove"): continue
        if line.startswith("by R. K. McGregor Wright"): continue
        if line.startswith("(Downers Grove, IL: InterVarsity Press"): continue
        if line.startswith("minished God of Open Theism"): continue
        if line.startswith("God: A Response to Open Theism"): continue
        if line.startswith("Biblical Christianity (Wheaton"): continue
        if line.startswith("itations on God’s Delight in Being God"): continue
        if line.startswith("Missions (Middlesex: Penguin"): continue
        if line.startswith("Press, 1978),"): continue
        if line.startswith("Bunyan, ed. George"): continue
        if line.startswith("to the effect that the needs of the righteous"): continue
        if line.startswith("think this is (1) generally true"): continue
        if line.startswith("prosper and have enough"): continue
        if line.startswith("able to endure for the sake of Christ"): continue
        
        cleaned_lines.append(line)

    with open('chapter_5_cleaned.txt', 'w') as f:
        f.write('\n'.join(cleaned_lines))

if __name__ == "__main__":
    clean_chapter_5()
