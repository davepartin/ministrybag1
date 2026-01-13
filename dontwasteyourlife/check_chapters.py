
import json
import re

def check_chapters():
    with open('dont-waste-your-life-app2.html', 'r') as f:
        content = f.read()

    match = re.search(r'const chapterData = ({.*});', content, re.DOTALL)
    if not match:
        print("No JSON found")
        return
    
    try:
        data = json.loads(match.group(1))
    except:
        print("JSON decode failed")
        return

    titles = [
        "My Search for a Single Passion",
        "Breakthrough",
        "Boasting Only in the Cross",
        "Magnifying Christ",
        "Risk Is Right",
        "The Goal of Life",
        "Living to Prove",
        "Making Much of Christ",
        "The Majesty of Christ",
        "My Prayer"
    ]

    print("Search Results:")
    for t in titles:
        found = False
        for key, val in data.items():
            html = val.get('html', '')
            if t in html:
                print(f"FAILED TO MATCH: found '{t}' in key '{key}'")
                found = True
            # Case insensitive check
            elif t.lower() in html.lower():
                 print(f"Found '{t}' in key '{key}' (case insensitive)")
                 found = True
        
        if not found:
            print(f"MISSING: '{t}'")

if __name__ == "__main__":
    check_chapters()
