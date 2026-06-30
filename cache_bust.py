import re

with open('src/layouts/Layout.astro', 'r', encoding='utf-8') as f:
    content = f.read()

# Cache bust main.min.js
content = re.sub(r'src="/main\.min\.js(\?v=\d+)?"', 'src="/main.min.js?v=3"', content)

with open('src/layouts/Layout.astro', 'w', encoding='utf-8') as f:
    f.write(content)
