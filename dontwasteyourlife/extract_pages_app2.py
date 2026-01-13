
import json
import re
import os

def extract_and_format():
    print("Reading HTML...")
    with open('dont-waste-your-life-app2.html', 'r') as f:
        html_content = f.read()

    match = re.search(r'const chapterData = ({.*});', html_content, re.DOTALL)
    if not match:
        print("ERROR: No JSON found")
        return
    
    data = json.loads(match.group(1))
    
    # Merge all content
    # Order: preface, ch1...ch9 (ch9 contains tail info, keys are messy but content flows if ordered by key?)
    # Wait, Ch3 key starts with Ch4 text. Ch2 key has Ch2+Ch3.
    # So sequence ch1, ch2, ch3, ch4, ch5, ch6, ch7, ch8, ch9 covers the book?
    # Let's assume yes based on previous analysis.
    
    keys = ['preface', 'ch1', 'ch2', 'ch3', 'ch4', 'ch5', 'ch6', 'ch7', 'ch8', 'ch9']
    full_text = ""
    for k in keys:
        if k in data:
            chunk = data[k]['html']
            # Basic cleanup
            chunk = re.sub(r'<p>', '\n', chunk)
            chunk = re.sub(r'</p>', '\n', chunk)
            full_text += chunk + "\n"

    # Define Chapter Markers (Start Pattern)
    # Using strict regex
    markers = [
        (0, 'Preface', r'(?:\n|^)Preface\n'),
        (1, 'ch1', r'(?:\n|^)1\s*\nMy Search'),
        (2, 'ch2', r'(?:\n|^)2\s*\nBreakthrough'),
        (3, 'ch3', r'(?:\n|^)3\s*\nBoasting Only'),
        (4, 'ch4', r'(?:\n|^)4\s*\nMagnifying Christ'),
        (5, 'ch5', r'(?:\n|^)5\s*\nRisk Is Right'),
        (6, 'ch6', r'(?:\n|^)6\s*\nThe Goal of Life'),
        (7, 'ch7', r'(?:\n|^)7\s*\nLiving to Prove'),
        (8, 'ch8', r'(?:\n|^)(?:8\s*\n)?Making Much of Christ'),
        (9, 'ch9', r'(?:\n|^)9\s*\nThe Majesty of Christ'),
        (10, 'ch10', r'(?:\n|^)(?:10\s*\n)?Oh, Lord,'),
        (11, 'Index', r'(?:\n|^)General Index\n')
    ]

    # Find offsets
    found_chapters = []
    
    for num, code, pattern in markers:
        m = re.search(pattern, full_text, re.IGNORECASE)
        if m:
            print(f"MATCH: {code} at {m.start()}")
            # capture the exact start for cutting
            found_chapters.append({'code': code, 'start': m.start(), 'num': num})
        else:
            print(f"MISSING: {code} (Pattern: {pattern})")

    found_chapters.sort(key=lambda x: x['start'])
    
    # Slice and Save
    if not os.path.exists('content'):
        os.makedirs('content')

    for i in range(len(found_chapters)):
        data = found_chapters[i]
        code = data['code']
        start = data['start']
        
        # Determine End
        if i < len(found_chapters) - 1:
            end = found_chapters[i+1]['start']
        else:
            end = len(full_text)
            
        raw_content = full_text[start:end].strip()

        # Reflow Content (Unwrap paragraphs, identifying headings)
        def is_heading(line):
            if len(line) > 100 or line.endswith('.'):
                return False
            # Check for pure number matches (exclude from being headings)
            if re.match(r'^\d+$', line) or re.match(r'^\d+\.$', line):
                 return False
            # Check for Footnote style "1. Text..." - Exclude from Heading
            if re.match(r'^\d+\.\s+', line):
                 return False
            
            # Headings must start with an Uppercase letter (or quote?)
            first_alpha = next((c for c in line if c.isalpha()), None)
            if first_alpha and first_alpha.islower():
                 return False

            # Check title case (simple heuristic)
            words = [w for w in line.split() if w.lower() not in ['a', 'an', 'the', 'and', 'but', 'or', 'for', 'nor', 'on', 'at', 'to', 'from', 'by', 'with', 'in', 'of', 'is', 'are', 'be', 'it', 'if', 'i']]
            if not words: return False
            capitalized = sum(1 for w in words if w[0].isupper() or w[0].isdigit())
            return (capitalized / len(words)) > 0.6
            
        def is_footnote(line):
             # Pattern: Start with number, dot, space. e.g. "1. Text"
             return re.match(r'^\d+\.\s+', line) is not None

        raw_lines = raw_content.split('\n')
        blocks = []
        current_block = ""
        
        # Helper to check for sentence ending punctuation
        def ends_sentence(text):
            if not text: return False
            return text.strip()[-1] in ['.', '!', '?', '”', '"']

        for line_idx, line in enumerate(raw_lines):
            line = line.strip()
            if not line: continue
            
            # Handle Page Number Lines explicit in source
            if re.match(r'^\d+\s+Don’t Waste Your Life', line) or re.match(r'^[A-Za-z\s—,]+\s+\d+$', line):
                 if current_block: blocks.append(current_block)
                 blocks.append(line)
                 current_block = ""
                 continue

            # Drop standalone numbers (OLD Footnote markers logic - keep dropping "1", "2")
            if re.match(r'^\d+$', line):
                 if not blocks and not current_block: pass # Keep Chapter Num
                 else: continue

            if not current_block:
                current_block = line
                continue
            
            # Decision: Merge or Split?
            should_split = False
            
            # Check if we are currently building a footnote block
            if is_footnote(current_block):
                 # If we are in a footnote, only split if:
                 # 1. New footnote starts
                 # 2. Previous line ended clearly with sentence punctuation (likely end of footnote)
                 if is_footnote(line):
                      should_split = True
                 elif ends_sentence(current_block):
                      should_split = True
                 # Otherwise merge (ignore is_heading!)
                 
            else:
                 # Standard logic for normal text
                if ends_sentence(current_block):
                    should_split = True
                elif is_heading(line):
                    should_split = True
                elif is_heading(current_block):
                     should_split = True
                elif is_footnote(line):
                     should_split = True
            
            if should_split:
                blocks.append(current_block)
                current_block = line
            else:
                current_block += " " + line
        
        if current_block: blocks.append(current_block)

        # Post-process blocks to add format
        final_blocks = []
        for blk in blocks:
             if re.match(r'^\d+\s+Don’t Waste Your Life', blk) or re.match(r'^[A-Za-z\s—,]+\s+\d+$', blk):
                  final_blocks.append(blk)
             elif is_heading(blk):
                  final_blocks.append(f"## {blk}")
             elif is_footnote(blk):
                  final_blocks.append(f'<div class="footnote">{blk}</div>')
             else:
                  final_blocks.append(blk)
        
        processed = "\n\n".join(final_blocks)

        # Apply Page Number Formatting (Regex adapted for blocks)
        # 0. Helper for offset
        def format_page(num_str):
            try:
                val = int(num_str)
                return f"**[Page {val + 2}]**"
            except:
                return f"**[Page {num_str}]**"

        # 1. Book Title Headers
        def header_page_replacer(match):
            return f"\n\n{format_page(match.group(1))}\n"

        processed = re.sub(r'(\d+)\s+Don’t Waste Your Life', header_page_replacer, processed)
        
        # 2. Page Number formatting with Chapter Title heuristic
        def page_replacer(match):
            text = match.group(1).strip()
            page_num = match.group(2)
            # If strict match on block
            return f"\n\n{format_page(page_num)}\n"
        
        # Regex needs to be careful not to match inside sentences if we merged wrongly
        # But we preserved page lines as blocks!
        # Anchor to ^ or \n
        processed = re.sub(r'(?m)^([A-Za-z\s—,]+?)\s+(\d+)$', page_replacer, processed)
        
        # Format Chapter Header (Existing logic needs update to handle ##)
        # We might have added ## to "1\nTitle"
        
        lines = processed.split('\n')
        
        # Find index of first non-empty line
        idx0 = -1
        for i, l in enumerate(lines):
            if l.strip():
                idx0 = i
                break
        
        if idx0 != -1:
            line0 = lines[idx0].strip()
            clean_line0 = line0.lstrip('#').strip()
            
            # Find next non-empty line
            idx1 = -1
            for i in range(idx0 + 1, len(lines)):
                if lines[i].strip():
                    idx1 = i
                    break
            
            # Define Known Titles Map
            known_titles = {
                'ch1': "My Search for a Single Passion to Live By",
                'ch2': "Breakthrough—The Beauty of Christ, My Joy",
                'ch3': "Boasting Only in the Cross",
                'ch4': "Magnifying Christ Through Pain and Death",
                'ch5': "Risk Is Right—Better to Lose Your Life Than to Waste It",
                'ch6': "The Goal of Life—Gladly Making Others Glad in God",
                'ch7': "Living to Prove He Is More Precious Than Life",
                'ch8': "Making Much of Christ from 8 to 5",
                'ch9': "The Majesty of Christ in Missions and Mercy",
                'ch10': "My Prayer—Let None Say in the End, 'I’ve Wasted It'",
                'Preface': "Preface",
                'Index': "General Index"
            }
            
            if code in known_titles:
                 # Force the title
                 lines[idx0] = f"# {known_titles[code]}"
                 
                 # cleanup artifacts in the next few lines
                 scan_range = min(len(lines), idx0 + 5)
                 for i in range(idx0 + 1, scan_range):
                      line_strip = lines[i].strip().lstrip('#').strip()
                      if not line_strip: continue
                      
                      # Ch1 Artifacts
                      if code == 'ch1' and (line_strip.startswith('Passion to Live By') or line_strip.startswith('My Search for a Single')):
                           lines[i] = ""
                      # Ch7 Artifacts
                      elif code == 'ch7' and (line_strip.startswith('Precious Than Life') or line_strip.startswith('Living to Prove He Is More')):
                           lines[i] = ""
                      # Chapter Markers (e.g. isolated "7" or "1")
                      elif re.match(r'^\d+$', line_strip):
                           lines[i] = ""
            
            # Fallback (disabled if known title used)
            # Fallback for dynamic logic
            elif re.match(r'^\d+$', clean_line0) and idx1 != -1:
                title = lines[idx1].strip().lstrip('#').strip()
                lines[idx0] = f"# {title}"
                lines[idx1] = "" # Clear the moved title line
                
            # Specific Title overrides
            elif code == 'ch8' and 'Making Much' in clean_line0:
                 lines[idx0] = "# Making Much of Christ from 8 to 5"
            elif code == 'ch10' and 'Oh, Lord' in clean_line0:
                 lines[idx0] = "# Chapter 10: My Prayer"
            elif code == 'Preface':
                 lines[idx0] = "# Preface"
            elif code == 'Index':
                 lines[idx0] = "# General Index"
            else:
                 # Ensure H1
                 if line0.startswith('## '):
                      lines[idx0] = '#' + line0[2:]
                 elif not line0.startswith('#'):
                      lines[idx0] = f"# {clean_line0}"
        
        processed = '\n'.join(lines)
        processed = re.sub(r'\n{3,}', '\n\n', processed) # Normalize newlines

        filename = f"content/{code.lower()}.md"
        with open(filename, 'w') as f_out:
            f_out.write(processed)
        print(f"Wrote {filename} ({len(processed)} chars)")

if __name__ == "__main__":
    extract_and_format()
