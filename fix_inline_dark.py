import os
import re

html_files = [f for f in os.listdir('.') if f.endswith('.html')]

for f in html_files:
    with open(f, 'r', encoding='utf-8') as file:
        content = file.read()
    
    original_content = content
    
    # 1. Fix dark borders on equipment.html (and any others)
    content = re.sub(r'border-bottom:1px solid var\(--ink-pure\);', r'border-bottom:1px solid currentColor;', content)
    
    # 2. Fix inline badge backgrounds (remove them so they inherit from style.css .badge)
    content = re.sub(r'background:\s*var\(--(?:ink-pure|paper-warm)\)\s*;?\s*', r'', content)
    
    # 3. Fix inline arch-panel backgrounds (remove them so they inherit from style.css .arch-panel)
    content = re.sub(r'background:\s*var\(--(?:ink-charcoal|card-bg-warm)\)\s*;?\s*', r'', content)
    
    if content != original_content:
        with open(f, 'w', encoding='utf-8') as file:
            file.write(content)
        print(f"Fixed QA issues in {f}")
