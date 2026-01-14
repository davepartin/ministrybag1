import json
import os
import re

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
CONTENT_DIR = os.path.join(BASE_DIR, 'content')
TEMPLATE_FILE = os.path.join(BASE_DIR, 'template.html')
OUTPUT_FILE = os.path.join(BASE_DIR, 'index.html')

# Chapter definitions: key, filename, title
CHAPTERS = [
    ('preface', 'preface.md', "Preface"),
    ('ch1', 'ch1.md', "Chapter 1: My Search for a Single Passion to Live By"),
    ('ch2', 'ch2.md', "Chapter 2: Breakthrough—The Beauty of Christ, My Joy"),
    ('ch3', 'ch3.md', "Chapter 3: Boasting Only in the Cross"),
    ('ch4', 'ch4.md', "Chapter 4: Magnifying Christ Through Pain and Death"),
    ('ch5', 'ch5.md', "Chapter 5: Risk Is Right—Better to Lose Your Life Than to Waste It"),
    ('ch6', 'ch6.md', "Chapter 6: The Goal of Life—Gladly Making Others Glad in God"),
    ('ch7', 'ch7.md', "Chapter 7: Living to Prove He Is More Precious Than Life"),
    ('ch8', 'ch8.md', "Chapter 8: Making Much of Christ from 8 to 5"),
    ('ch9', 'ch9.md', "Chapter 9: The Majesty of Christ in Missions and Mercy"),
    ('ch10', 'ch10.md', "Chapter 10: My Prayer—Let None Say in the End, 'I’ve Wasted It'"),
    ('index', 'index.md', "General Index"),
    ('backmatter', 'backmatter.md', "Resources") 
]

def md_to_html(md_text):
    if not md_text: return ""
    
    html = md_text
    
    # Simple formatting
    # Headers ### -> <h3>
    html = re.sub(r'(?m)^### (.*?)$', r'<h3>\1</h3>', html)
    # Headers ## -> <h2>
    html = re.sub(r'(?m)^## (.*?)$', r'<h2>\1</h2>', html)
    # Headers # -> <h1>
    html = re.sub(r'(?m)^# (.*?)$', r'<h1>\1</h1>', html)
    
    # Blockquotes >
    # This is simple; assumes > at start of line
    html = re.sub(r'(?m)^> (.*?)$', r'<blockquote>\1</blockquote>', html)
    
    # Paragraphs: split by double newline
    paragraphs = re.split(r'\n\s*\n', html)
    formatted_paragraphs = []
    
    for p in paragraphs:
        p = p.strip()
        if not p: continue
        
        # Don't wrap if already HTML tag (h3, blockquote, div)
        if p.startswith('<h') or p.startswith('<blockquote') or p.startswith('<div'):
            formatted_paragraphs.append(p)
        else:
            # Wrap in p
            # Handle inner newlines as <br> or spaces? 
            # Standard markdown treats single newline as space.
            p_content = p.replace('\n', ' ')
            formatted_paragraphs.append(f'<p>{p_content}</p>')
            
    return '\n\n'.join(formatted_paragraphs)

def build():
    if not os.path.exists(TEMPLATE_FILE):
        print(f"Error: {TEMPLATE_FILE} not found.")
        return

    chapter_data = {}
    
    # Process each chapter
    for key, filename, title in CHAPTERS:
        file_path = os.path.join(CONTENT_DIR, filename)
        content = ""
        if os.path.exists(file_path):
            with open(file_path, 'r') as f:
                raw_md = f.read()
                content = md_to_html(raw_md)
        else:
            print(f"Warning: {filename} not found.")
            content = "<p>[Content Missing]</p>"
            
        chapter_data[key] = {
            "title": title,
            "html": content
        }
        print(f"Processed {key}: {title}")

    # Read template
    with open(TEMPLATE_FILE, 'r') as f:
        template = f.read()
        
    # Generate JSON string
    # We use json.dumps but we need to match the variable format slightly?
    # The placeholder is {{CHAPTER_DATA}}
    
    # Inject data (Robust regex replacement)
    json_str = json.dumps(chapter_data, indent=4)
    final_html = re.sub(r'\{\{\s*CHAPTER_DATA\s*\}\}', lambda x: json_str, template)
    
    # Generate Home Buttons HTML
    buttons_html = []
    for key, filename, title in CHAPTERS:
        # Extract "Chapter X" or "Preface" for subtitle if possible
        display_title = title
        subtitle = "Chapter"
        
        if ":" in title:
            parts = title.split(":", 1)
            subtitle = parts[0].strip()
            display_title = parts[1].strip()
        elif "Preface" in title:
            subtitle = "Introduction"
            display_title = title
        elif "Index" in title:
            subtitle = "Reference"
        elif "Resources" in title:
            subtitle = "Backmatter"
            
        btn = f'''
        <button class="chapter-btn" onclick="loadChapter('{key}')">
            <span class="btn-subtitle">{subtitle}</span>
            {display_title}
        </button>
        '''
        buttons_html.append(btn.strip())
        
    final_buttons_html = "\n".join(buttons_html)
    final_html = re.sub(r'\{\{\s*HOME_BUTTONS\s*\}\}', lambda x: final_buttons_html, final_html)
    
    # OPTIONAL: Construct <select> options if we can find the injection point
    # We look for <select id="citation-source" ...> or similar?
    # No, the chapter selector is likely <select id="chapter-select"> or similar class.
    # Let's try to update it.
    
    # Regex for existing options inside chapter selector
    # Find <input class="chapter-picker" ... list="chapter-list"> ?
    # Or <select ...>
    # In previous views I saw: `<select class="chapter-selector" onchange="displayChapter(this.value)">`
    
    select_start = final_html.find('<select class="chapter-selector"')
    if select_start != -1:
        select_end = final_html.find('</select>', select_start)
        if select_end != -1:
            # Build new options
            options_html = ['<select class="chapter-selector" onchange="displayChapter(this.value)">']
            # Default option?
            options_html.append('                <option value="" disabled selected>Select a Chapter</option>')
            
            for key, _, title in CHAPTERS:
                options_html.append(f'                <option value="{key}">{title}</option>')
            
            new_select = '\n'.join(options_html)
            
            # Replace old select content (KEEPING THE TAG open/close? No, I reconstructed the open tag)
            # Actually, reusing the existing open tag is safer for attributes I might miss.
            # But I need to identify the content start.
            
            # Use regex to replace inner HTML of select?
            # Safer: just replace the known block if it matches pattern.
            pass # Skipping for now to avoid breaking layout, but ideally should do this.
            
            # Let's try to find the inner content start
            content_start = final_html.find('>', select_start) + 1
            if content_start < select_end:
                 # Generate ONLY options
                opts = []
                # First logic in original file was...
                # <option value="" disabled selected>Select a Chapter</option>
                opts.append('\n                <option value="" disabled selected>Select a Chapter</option>')
                for key, _, title in CHAPTERS:
                     opts.append(f'                <option value="{key}">{title}</option>')
                opts.append('            ')
                
                new_inner = '\n'.join(opts)
                final_html = final_html[:content_start] + new_inner + final_html[select_end:]
                print("Updated chapter selector options.")

    # Write output
    with open(OUTPUT_FILE, 'w') as f:
        f.write(final_html)
    print(f"Successfully built {OUTPUT_FILE}")

if __name__ == "__main__":
    build()
