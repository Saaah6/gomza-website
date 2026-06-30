import re

with open('src/layouts/Layout.astro', 'r', encoding='utf-8') as f:
    content = f.read()

preload_tags = """<link rel="dns-prefetch" href="https://cdnjs.cloudflare.com" />
<link rel="preload" as="script" href="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js" />
<link rel="preload" as="script" href="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js" />
<link rel="preload" as="script" href="https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js" />
<link rel="preconnect" href="https://fonts.googleapis.com"/>"""

new_content = content.replace('<link rel="preconnect" href="https://fonts.googleapis.com"/>', preload_tags)

with open('src/layouts/Layout.astro', 'w', encoding='utf-8') as f:
    f.write(new_content)
