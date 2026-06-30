import re

with open('src/layouts/Layout.astro', 'r', encoding='utf-8') as f:
    content = f.read()

# Add <link rel="stylesheet" href="/src/styles/mobile.css" /> right after global.css
new_content = content.replace(
    "import '../styles/global.css';", 
    "import '../styles/global.css';\nimport '../styles/mobile.css';"
)

with open('src/layouts/Layout.astro', 'w', encoding='utf-8') as f:
    f.write(new_content)
