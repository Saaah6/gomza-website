extra = """

/* SVG BEAMS - visible in light mode */
body.light-mode #svg-beams {
  opacity: 0.35 !important;
  filter: none !important;
  mix-blend-mode: multiply !important;
}
"""

with open('src/styles/global.css', 'a', encoding='utf-8') as f:
    f.write(extra)

print('Done - beams light mode fix appended')
