import re
with open('src/pages/index.astro', 'r', encoding='utf-8') as f:
    content = f.read()

# Find the blocks
process_match = re.search(r'<!-- PROCESS -->\s*<div id="process".*?(?=<!-- PROOF -->)', content, re.DOTALL)
if process_match:
    process_block = process_match.group(0)
    # Remove process block from original content
    content = content.replace(process_block, '')
    
    # Insert before NICHES
    niches_marker = '<!-- NICHES -->'
    if niches_marker in content:
        content = content.replace(niches_marker, process_block + '\n' + niches_marker)
        with open('src/pages/index.astro', 'w', encoding='utf-8') as f:
            f.write(content)
        print('Successfully moved PROCESS before NICHES')
    else:
        print('Could not find NICHES')
else:
    print('Could not find PROCESS block')
