import re

with open('src/pages/index.astro', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace('<LanyardWrapper client:idle />', '<LanyardWrapper client:media="(min-width: 1024px)" />')

with open('src/pages/index.astro', 'w', encoding='utf-8') as f:
    f.write(content)
