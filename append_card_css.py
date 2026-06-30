import os

css_path = 'src/styles/global.css'
with open(css_path, 'r', encoding='utf-8') as f:
    css_content = f.read()

new_css = """

/* EXPANDABLE CASE STUDY LIGHT MODE TWEAKS */
body.light-mode .csc-desktop-hint {
  color: #3B6FF0 !important;
}
body.light-mode .results-section {
  background: rgba(15, 23, 42, 0.03) !important;
  border: 1px solid rgba(15, 23, 42, 0.06) !important;
}
body.light-mode .result-item {
  color: #059669 !important;
  text-shadow: none !important;
}
body.light-mode .result-item svg {
  color: #059669 !important;
}
body.light-mode .csc-divider {
  background: linear-gradient(90deg, transparent, rgba(15, 23, 42, 0.1), transparent) !important;
}
body.light-mode .svc-tag {
  background: rgba(59, 111, 240, 0.08) !important;
  color: #3B6FF0 !important;
  border-color: rgba(59, 111, 240, 0.15) !important;
}
body.light-mode .svc-tag:hover {
  background: rgba(59, 111, 240, 0.15) !important;
  color: #1D4ED8 !important;
  border-color: rgba(59, 111, 240, 0.3) !important;
}
body.light-mode .case-study-desc, body.light-mode .csc-objective {
  color: rgba(15, 23, 42, 0.7) !important;
}
"""

if "EXPANDABLE CASE STUDY LIGHT MODE TWEAKS" not in css_content:
    with open(css_path, 'a', encoding='utf-8') as f:
        f.write(new_css)
        print("CSS appended successfully.")
else:
    print("CSS already exists.")
