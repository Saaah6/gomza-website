import re

with open('src/components/CaseStudyCard.astro', 'r', encoding='utf-8') as f:
    content = f.read()

# The wrapper to move
wrapper_pattern = r'(  <div class="case-study-image-wrapper case-study-trigger".*?</div>\n  </div>)'
match = re.search(wrapper_pattern, content, flags=re.DOTALL)
if match:
    wrapper_html = match.group(1)
    # Remove from old position
    content = content.replace(wrapper_html + '\n', '')
    
    # Insert after case-study-header
    header_end = '  </div>'
    header_end_idx = content.find(header_end, content.find('<div class="case-study-header"')) + len(header_end)
    
    new_content = content[:header_end_idx] + '\n\n' + wrapper_html + content[header_end_idx:]
    
    with open('src/components/CaseStudyCard.astro', 'w', encoding='utf-8') as f:
        f.write(new_content)
    print("Successfully reordered!")
else:
    print("Could not find the wrapper.")
