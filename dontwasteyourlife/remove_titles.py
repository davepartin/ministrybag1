import os

CONTENT_DIR = 'content'

def clean_file(filename):
    path = os.path.join(CONTENT_DIR, filename)
    if not os.path.exists(path):
        print(f"Skipping {filename} (not found)")
        return

    with open(path, 'r') as f:
        lines = f.readlines()

    if not lines:
        return

    new_lines = []
    
    # Logic: Remove first line if it is H1
    start_idx = 0
    if lines[0].startswith('# '):
        print(f"Removing title from {filename}: {lines[0].strip()}")
        start_idx = 1
        # Skip empty lines following the title
        while start_idx < len(lines) and not lines[start_idx].strip():
            start_idx += 1
            
    # Specific cleanup for ch2.md
    if filename == 'ch2.md':
        cleaned = []
        for i in range(start_idx, len(lines)):
            line = lines[i]
            # Remove specific artifacts
            if line.strip().startswith('## Breakthrough—'):
                continue
            if line.strip().startswith('## The Beauty of Christ, My Joy'):
                continue
            cleaned.append(line)
        new_lines = cleaned
    else:
        new_lines = lines[start_idx:]

    with open(path, 'w') as f:
        f.writelines(new_lines)
    print(f"Cleaned {filename}")

files = [
    'preface.md', 'ch1.md', 'ch2.md', 'ch3.md', 'ch4.md', 
    'ch5.md', 'ch6.md', 'ch7.md', 'ch8.md', 'ch9.md', 
    'ch10.md', 'index.md', 'backmatter.md'
]

for f in files:
    clean_file(f)
