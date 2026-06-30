import re

css_path = "src/styles/global.css"
with open(css_path, "r", encoding="utf-8") as f:
    css_content = f.read()

# 1. Fix .niche-card headers which are h2, not h3
css_content = css_content.replace(
    "body.light-mode .niche-card h3 { color: #0F172A !important; }",
    "body.light-mode .niche-card h2 { color: #0F172A !important; }"
)

# 2. Fix .cta-inner h2 text color in light mode. 
# Make sure it's dark and explicitly overriding any text fill or background clips.
cta_light_fix = """body.light-mode .cta-inner h2 {
  color: #0F172A !important;
  background: none !important;
  -webkit-text-fill-color: initial !important;
  -webkit-background-clip: initial !important;
  filter: none !important;
}"""

if "body.light-mode .cta-inner h2" in css_content:
    # Replace existing rule
    css_content = re.sub(r'body\.light-mode \.cta-inner h2\s*\{[^}]*\}', cta_light_fix, css_content)
else:
    # Append rule near the end
    css_content = css_content.replace(
        "body.light-mode .cta-bg-glow {",
        cta_light_fix + "\nbody.light-mode .cta-bg-glow {"
    )

with open(css_path, "w", encoding="utf-8") as f:
    f.write(css_content)

print("Fixed light mode visibility issues.")
