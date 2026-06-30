import re

with open('public/main.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace lenis settings
old_lenis = '''lenis = new Lenis({
        lerp: deviceTier === 'low-tier' ? 0.1 : 0.06,
        smoothWheel: true,
        wheelMultiplier: 0.9,
        smoothTouch: false,
        infinite: false,
      });'''

new_lenis = '''lenis = new Lenis({
        lerp: 0.04,
        wheelMultiplier: 0.7,
        smoothWheel: true,
        smoothTouch: false,
        infinite: false,
      });'''

content = content.replace(old_lenis, new_lenis)

with open('public/main.js', 'w', encoding='utf-8') as f:
    f.write(content)
