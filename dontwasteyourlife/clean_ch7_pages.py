
import re

def clean_chapter_7():
    with open('chapter_7_text.txt', 'r') as f:
        lines = f.readlines()

    cleaned_lines = []
    
    # Header Pattern 1: Title + Page Num
    # "The Majesty of Christ in Missions and Mercy: A Plea to This Generation 165"
    # "The Majesty of Christ in Missions and Mercy: A Plea to This Generation 167"
    # "166 Don’t Waste Your Life"
    # "168 Don’t Waste Your Life"
    
    # Regex for "166 Don’t Waste Your Life"
    page_header_pattern_simple = re.compile(r'^(\d+)\s+Don’t Waste Your Life\s*$')
    
    # Regex for Title + Num
    # The title in headers is long: "The Majesty of Christ in Missions and Mercy: A Plea to This Generation"
    # Or part of it.
    title_snippet = "The Majesty of Christ in Missions and Mercy"
    
    for i, line in enumerate(lines):
        line = line.strip()
        if not line:
            cleaned_lines.append("")
            continue
            
        # Check simple header: "166 Don't Waste Your Life"
        m1 = page_header_pattern_simple.match(line)
        if m1:
            page_num = m1.group(1)
            cleaned_lines.append(f"\n**[Page {page_num}]**\n")
            continue

        # Check for title/page num combination
        # Often at end of line.
        if line.endswith(title_snippet) or title_snippet in line:
            # Check if it ends with digits
            parts = line.rsplit(None, 1)
            if len(parts) == 2 and parts[1].isdigit():
                page_num = parts[1]
                cleaned_lines.append(f"\n**[Page {page_num}]**\n")
                continue
            # Sometimes the number is at the start? No, mainly end for right-side pages.
            
        # Check for numeric-only lines that look like page numbers
        # In the raw text, we saw "34", "10", etc. which seemed like footnotes or line numbers.
        # But we also saw "165" at end of line 4.
        
        # Footnotes removal check (same list as before + specifics for Ch7 if any)
        # Ch7 footnotes start with numbers e.g. "30. This growth..."
        if re.match(r'^\d+\.\s+', line): 
             continue
             
        # Specific Ch7 Footnote continuations?
        # "Christendom (Oxford: Oxford University Press, 2002), 2:"
        # "Over the past century..."
        # "Christian communities on the planet..."
        # "living in a village in Nigeria..."
        # "Athens, Paris, London..."
        # "Manila. Whatever Europeans..."
        # "31. Johnstone, The Church Is Bigger..."
        # "world .org."
        # "33. Ibid., 222."
        # "34. Ibid., 223."
        # "ed. James D. Bratt..."
        
        skips = [
            "Christendom (Oxford:", "Over the past century", "Christian communities on the planet",
            "living in a village in Nigeria", "Athens, Paris, London", "Manila. Whatever Europeans",
            "31. Johnstone,", "world .org.", "33. Ibid.,", "34. Ibid.,", "ed. James D. Bratt"
        ]
        should_skip = False
        for s in skips:
            if line.startswith(s): 
                should_skip = True
                break
        if should_skip: continue

        cleaned_lines.append(line)

    with open('content/ch7.md', 'w') as f:
        f.write('\n'.join(cleaned_lines))

if __name__ == "__main__":
    clean_chapter_7()
