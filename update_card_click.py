import re

filepath = "src/components/CaseStudyCard.astro"
with open(filepath, "r", encoding="utf-8") as f:
    content = f.read()

# 1. Update the hint text
content = content.replace("Hover to view details &rarr;", "<span class=\"blink-text\">Click to view details &rarr;</span>")

# 2. Change :hover to .is-expanded for the hint and expandable content
content = content.replace(".case-study-card:hover .csc-desktop-hint {", ".case-study-card.is-expanded .csc-desktop-hint {")
content = content.replace(".case-study-card:hover .csc-expandable-content {", ".case-study-card.is-expanded .csc-expandable-content {")

# 3. Add the blinking animation and cursor pointer
blink_css = """
  .blink-text {
    animation: blinker 2s linear infinite;
  }
  @keyframes blinker {
    50% { opacity: 0.3; }
  }
  .case-study-card {
    cursor: pointer;
  }
"""
content = content.replace("</style>", blink_css + "</style>")

# 4. Add the Javascript to toggle the class on click
js_code = """
<script>
  // Add click to expand functionality
  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.case-study-card').forEach(card => {
      card.addEventListener('click', () => {
        // close others if desired, or just toggle this one
        // document.querySelectorAll('.case-study-card').forEach(c => {
        //   if (c !== card) c.classList.remove('is-expanded');
        // });
        card.classList.toggle('is-expanded');
      });
    });
  });
</script>
"""
content = content + "\n" + js_code

with open(filepath, "w", encoding="utf-8") as f:
    f.write(content)
print("Updated CaseStudyCard.astro successfully.")
