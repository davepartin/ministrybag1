
import json
import re

def analyze_app2():
    with open('dont-waste-your-life-app2.html', 'r') as f:
        content = f.read()

    # Extract JSON object
    # It's at the end: const chapterData = { ... };
    match = re.search(r'const chapterData = ({.*});', content, re.DOTALL)
    if not match:
        print("Could not find chapterData JSON")
        return

    json_str = match.group(1)
    # The JSON in the file might be valid JS object but not strict JSON (keys might not be quoted? actually in the file they were quoted)
    # Let's try parsing. keys are "ch1": ...
    
    try:
        data = json.loads(json_str)
    except json.JSONDecodeError as e:
        print(f"JSON Parse Error: {e}")
        # Identify where it failed
        # content is huge, maybe trailing comma?
        # Let's just print keys found via regex as a fallback if load fails
        print("Falling back to manual inspection")
        return

    print("--- Chapter Analysis ---")
    for key in data:
        title = data[key]['title']
        html = data[key]['html']
        print(f"Key: {key}")
        print(f"  Title: {title}")
        print(f"  Length: {len(html)} chars")
        print(f"  Start: {html[:100]}...")
        print(f"  End:   {html[-100:]}")
        print("-" * 30)

if __name__ == "__main__":
    analyze_app2()
