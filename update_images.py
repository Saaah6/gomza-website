import re

with open('src/pages/index.astro', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace img in index.astro
old_img = '<img src="/assets/professional_human_icon.png" alt="Professional Expert"'
new_img = '<img loading="lazy" decoding="async" src="/assets/professional_human_icon.png" alt="Professional Expert"'
content = content.replace(old_img, new_img)

with open('src/pages/index.astro', 'w', encoding='utf-8') as f:
    f.write(content)

with open('src/components/CaseStudyCard.astro', 'r', encoding='utf-8') as f:
    content2 = f.read()

# Replace img in CaseStudyCard.astro
content2 = content2.replace('<img src=', '<img loading="lazy" decoding="async" src=')

with open('src/components/CaseStudyCard.astro', 'w', encoding='utf-8') as f:
    f.write(content2)
