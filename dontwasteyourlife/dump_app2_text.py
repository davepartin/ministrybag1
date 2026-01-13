
import json
import re

def dump_text():
    with open('dont-waste-your-life-app2.html', 'r') as f:
        content = f.read()

    match = re.search(r'const chapterData = ({.*});', content, re.DOTALL)
    if not match:
        print("No JSON found")
        return
    
    data = json.loads(match.group(1))
    
    # Order of keys to dump
    # Based on my analysis, data is in ch1, ch2... ch9 (where ch9 is disclaimer? No ch9 key has some text?)
    # Wait, ch6 has Ch9 start. Ch7 has Ch9 end?
    # Let's dump in key order ch1..ch9
    # And Preface
    
    keys = ['preface', 'ch1', 'ch2', 'ch3', 'ch4', 'ch5', 'ch6', 'ch7', 'ch8', 'ch9']
    
    full_text = ""
    for k in keys:
        if k in data:
            html = data[k]['html']
            # Simple unescape/strip tags?
            # The HTML contains <p> tags.
            # I'll keep it raw for now to see structure
            full_text += f"\n\n--- KEY: {k} ---\n\n"
            full_text += html

    with open('full_text_dump.txt', 'w') as f:
        f.write(full_text)

if __name__ == "__main__":
    dump_text()
