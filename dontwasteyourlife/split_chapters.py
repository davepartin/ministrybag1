
import re
import os

def split_and_extract():
    # Read the full text dump
    # Assuming full_text_dump.txt exists and is concatenated from dump_app2_text.py
    # If not, we should probably read the HTML again to be robust. 
    # Let's read the HTML directly again to be self-contained.
    
    with open('dont-waste-your-life-app2.html', 'r') as f:
        html_content = f.read()

    match = re.search(r'const chapterData = ({.*});', html_content, re.DOTALL)
    if not match:
        print("No JSON")
        return
    
    import json
    data = json.loads(match.group(1))
    
    # Concatenate in order
    full_text = ""
    # Keys in order of content flow. 
    # 'preface'
    # 'ch1'
    # 'ch2' .. 'ch9' 
    # Note: earlier analysis showed ch keys contain multiple chapters.
    # We just merge them all and split by headers.
    
    keys = ['preface', 'ch1', 'ch2', 'ch3', 'ch4', 'ch5', 'ch6', 'ch7', 'ch8', 'ch9']
    
    for k in keys:
        if k in data:
            chunk = data[k]['html']
            # Remove <p> and </p> - replace with newlines to ensure separation
            chunk = chunk.replace('<p>', '\n').replace('</p>', '\n')
            full_text += chunk + "\n"

    # Identify Splits
    # Looking for standalone numbers 1 to 10
    # regex: \n(\d+)\n
    
    # Actually, Preface is at start.
    # Ch 1 is after "\n1\n"
    # ...
    # Ch 10 is after "\n10\n"
    # Ch 10 end? "General Index"
    
    # Splits will be list of (start_index, chapter_num)
    
    splits = []
    
    # Find Preface start? It's at 0.
    splits.append((0, 'Preface'))
    
    # Find numbered chapters
    # Use regex iter
    # Matches "\n1\n", "\n2\n", ...
    # Be careful of footnotes "1." or similar. The regex \n\d+\n ensures no dot.
    
    for m in re.finditer(r'\n(\d+)\n', full_text):
        num = int(m.group(1))
        if 1 <= num <= 10:
            splits.append((m.start(), f"ch{num}"))
            print(f"Found Chapter {num} at {m.start()}")
            # Context
            print(f"Context: {full_text[m.start()-20:m.end()+50].replace(chr(10), ' ')}")

    # Add Index split if possible
    idx_match = re.search(r'\nGeneral Index\n', full_text)
    if idx_match:
        splits.append((idx_match.start(), 'Index'))
        print(f"Found Index at {idx_match.start()}")

    # Sort splits by position just in case
    splits.sort(key=lambda x: x[0])
    
    # Iterate and extract
    for i in range(len(splits)):
        start_idx = splits[i][0]
        name = splits[i][1]
        
        # End is start of next split, or end of text
        if i < len(splits) - 1:
            end_idx = splits[i+1][0]
        else:
            end_idx = len(full_text)
            
        content = full_text[start_idx:end_idx].strip()
        
        # First check consistency
        print(f"--- Extracted {name} ({len(content)} chars) ---")
        print(f"Start: {content[:100].replace(chr(10), ' ')}")
        print(f"End:   {content[-100:].replace(chr(10), ' ')}")

if __name__ == "__main__":
    split_and_extract()
