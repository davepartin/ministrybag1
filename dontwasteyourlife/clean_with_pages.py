
import re

def clean_chapter_with_page_numbers(input_file, output_file, chapter_scan_string):
    with open(input_file, 'r') as f:
        lines = f.readlines()

    cleaned_lines = []
    
    # Patterns
    # Header type 1: "56 Don’t Waste Your Life"
    page_header_pattern_1 = re.compile(r'^(\d+)\s+Don’t Waste Your Life\s*$')
    
    # Header type 2: "Chapter Title X" e.g. "Risk Is Right... 75"
    # We'll use the chapter_scan_string to match specific chapter titles
    # flexible regex to catch "Title Text <PageNum>"
    # Note: Special chars in title need escaping or dot matching
    escaped_title = re.escape(chapter_scan_string)
    # The title might be slightly different or truncated, but usually matches the PDF header
    # For Ch4: "Magnifying Christ through Pain and Death"
    # For Ch5: "Risk Is Right—Better to Lose Your Life Than to Waste It"
    # Using a looser pattern to catch the page number at the end
    # Assuming the line ENDS with a number
    
    page_number_only_pattern = re.compile(r'^(\d+)\s*$')
    footnote_start_pattern = re.compile(r'^\d+\.\s+')
    
    for i, line in enumerate(lines):
        line = line.strip()
        if not line:
            cleaned_lines.append("")
            continue
            
        # Check for Page Header 1: "56 Don’t Waste Your Life"
        m1 = page_header_pattern_1.match(line)
        if m1:
            page_num = m1.group(1)
            cleaned_lines.append(f"\n**[Page {page_num}]**\n")
            continue

        # Check for Page Header 2: "Title <Num>"
        # checking if line ends with a number and contains part of title key words
        if line[0].isalpha() and line[-1].isdigit():
            # Potential header
            parts = line.rsplit(None, 1) # split off last word
            if len(parts) == 2 and parts[1].isdigit():
                possible_num = parts[1]
                # Check if the text part vaguely matches our chapter title
                text_part = parts[0]
                if chapter_scan_string in text_part or text_part in chapter_scan_string:
                     cleaned_lines.append(f"\n**[Page {possible_num}]**\n")
                     continue

        # Check for simple page number line (rare in these files but possible)
        m_num = page_number_only_pattern.match(line)
        if m_num:
             # It's just a number. It might be a page number or a list item.
             # In these PDF extracts, page numbers often appear floating.
             # Let's assume standalone small numbers are page numbers if they fit the range (50-100ish)
             # But be careful of "1" for footnotes.
             num = int(m_num.group(1))
             if num > 40 and num < 200: # Safe range for this book's chapters
                 cleaned_lines.append(f"\n**[Page {num}]**\n")
                 continue
            
        # Footnotes - stripping as per previous request to clean clutter? 
        # User only asked for page numbers, implies they want the text clean otherwise.
        # But maybe they want footnotes too? The prompt didn't say restore footnotes.
        # I'll stick to cleaning footnotes to keep text readable.
        if footnote_start_pattern.match(line):
            continue

        # Specific footnote continuation checks (tailored)
        # We'll reuse the skip logic from before
        if is_footnote_continuation(line):
            continue
        
        cleaned_lines.append(line)

    with open(output_file, 'w') as f:
        f.write('\n'.join(cleaned_lines))

def is_footnote_continuation(line):
    skips = [
        "the Devil.",
        "Press, 1978),",
        "Bunyan, ed. George",
        "date Sermon at Bethlehem",
        "events that he sets in motion",
        "Theodicy (Downers Grove",
        "by R. K. McGregor Wright",
        "(Downers Grove, IL: InterVarsity Press",
        "minished God of Open Theism",
        "God: A Response to Open Theism",
        "Biblical Christianity (Wheaton",
        "itations on God’s Delight in Being God",
        "Missions (Middlesex: Penguin",
        "to the effect that the needs of the righteous",
        "think this is (1) generally true",
        "prosper and have enough",
        "able to endure for the sake of Christ"
    ]
    for s in skips:
        if line.startswith(s): return True
    return False

if __name__ == "__main__":
    # Clean Ch 4
    print("Cleaning Ch4...")
    clean_chapter_with_page_numbers(
        'chapter_4_only.txt', 
        'content/ch4.md', 
        "Magnifying Christ through Pain and Death"
    )
    
    # Clean Ch 5
    print("Cleaning Ch5...")
    clean_chapter_with_page_numbers(
        'chapter_5_only.txt', 
        'content/ch5.md', 
        "Risk Is Right" # partial match ok
    )
