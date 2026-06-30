import re

with open('src/layouts/Layout.astro', 'r', encoding='utf-8') as f:
    content = f.read()

# Remove specific script tags
content = re.sub(r'<script defer src="https://cdnjs\.cloudflare\.com/ajax/libs/three\.js/r134/three\.min\.js" is:inline></script>\n?', '', content)
content = re.sub(r'<script defer src="https://unpkg\.com/@studio-freight/lenis@1\.0\.39/dist/lenis\.min\.js" is:inline></script>\n?', '', content)
content = re.sub(r'<script defer src="https://cdnjs\.cloudflare\.com/ajax/libs/vanilla-tilt/1\.8\.1/vanilla-tilt\.min\.js" is:inline></script>\n?', '', content)

with open('src/layouts/Layout.astro', 'w', encoding='utf-8') as f:
    f.write(content)
