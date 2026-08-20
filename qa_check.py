import os
import re

html_files = [f for f in os.listdir('.') if f.endswith('.html')]
issues_found = []

for f in html_files:
    with open(f, 'r', encoding='utf-8') as file:
        content = file.read()
        
        # Look for hardcoded black borders or backgrounds that will fail on charcoal
        matches = re.finditer(r'(border[^:]*:\s*[^;]*var\(--(?:ink-pure|ink-charcoal|black-pure)\)[^;]*;?)', content)
        for m in matches:
            issues_found.append(f"{f} (Dark Border): {m.group(1)}")
            
        matches = re.finditer(r'(background[^:]*:\s*[^;]*var\(--(?:ink-pure|ink-charcoal|black-pure)\)[^;]*;?)', content)
        for m in matches:
            # check if it's a badge or panel
            issues_found.append(f"{f} (Dark Background): {m.group(1)}")

for issue in issues_found:
    print(issue)
