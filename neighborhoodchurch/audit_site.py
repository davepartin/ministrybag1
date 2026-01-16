import os
import re
from html.parser import HTMLParser

class SEOParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.title = None
        self.meta_description = None
        self.h1_count = 0
        self.images_without_alt = []
        self.in_title = False
        self.current_tag = None

    def handle_starttag(self, tag, attrs):
        self.current_tag = tag
        if tag == 'title':
            self.in_title = True
        elif tag == 'meta':
            attrs_dict = dict(attrs)
            if attrs_dict.get('name') == 'description':
                self.meta_description = attrs_dict.get('content')
        elif tag == 'h1':
            self.h1_count += 1
        elif tag == 'img':
            attrs_dict = dict(attrs)
            if 'alt' not in attrs_dict or not attrs_dict['alt'].strip():
                self.images_without_alt.append(attrs_dict.get('src', 'unknown_src'))

    def handle_endtag(self, tag):
        if tag == 'title':
            self.in_title = False

    def handle_data(self, data):
        if self.in_title:
            self.title = data

def audit_file(filepath):
    parser = SEOParser()
    with open(filepath, 'r') as f:
        content = f.read()
        parser.feed(content)
    
    print(f"File: {os.path.basename(filepath)}")
    print(f"  Title: {parser.title}")
    print(f"  Meta Description: {'Present' if parser.meta_description else 'MISSING'}")
    if parser.meta_description:
        print(f"    Content: {parser.meta_description[:50]}...")
    print(f"  H1 Count: {parser.h1_count} {'(OK)' if parser.h1_count == 1 else '(WARNING: Should be 1)'}")
    print(f"  Images without Alt: {len(parser.images_without_alt)}")
    for img in parser.images_without_alt:
        print(f"    - {img}")
    print("-" * 40)

def main():
    files = [f for f in os.listdir('.') if f.endswith('.html')]
    for file in files:
        audit_file(file)

if __name__ == "__main__":
    main()
