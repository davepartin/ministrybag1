import os
import re

def get_html_files(directory):
    html_files = []
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.endswith(".html"):
                html_files.append(os.path.join(root, file))
    return html_files

def check_links(directory):
    html_files = get_html_files(directory)
    errors = []
    
    print(f"Checking {len(html_files)} HTML files in {directory}...")

    # Regex to find href="..."
    href_pattern = re.compile(r'href=["\']([^"\']+)["\']')

    for file_path in html_files:
        rel_path = os.path.relpath(file_path, directory)
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
        except Exception as e:
            errors.append(f"Could not read {rel_path}: {e}")
            continue

        links = href_pattern.findall(content)
        
        for href in links:
            # Skip external links, mailto, tel, javascript
            if href.startswith(('http', 'https', 'mailto:', 'tel:', 'javascript:')):
                continue
            
            # Handle local links
            if href.startswith('#'):
                # Internal anchor, skip verify for now (regex parsing IDs is hard)
                continue

            # Split path and anchor
            parts = href.split('#')
            target_filename = parts[0]

            if not target_filename:
                continue
            
            # Resolve target path
            dir_of_current_file = os.path.dirname(file_path)
            target_abs_path = os.path.join(dir_of_current_file, target_filename)
            
            if not os.path.exists(target_abs_path):
                errors.append(f"{rel_path}: Broken link to '{href}'")

    print("\n--- Results ---")
    if not errors:
        print("✅ No broken file links found!")
    
    if errors:
        print(f"❌ Found {len(errors)} broken links:")
        for e in errors:
            print(f"  - {e}")

if __name__ == "__main__":
    check_links(os.getcwd())

