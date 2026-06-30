import re

with open('src/styles/global.css', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace .eyebrow using regex
pattern = re.compile(r'\.eyebrow\s*\{[^}]*\}', re.DOTALL)

new_eyebrow = '''.eyebrow{
  display:inline-flex;align-items:center;gap:.6rem;
  background:rgba(255, 255, 255, 0.03);
  border:1px solid rgba(255, 255, 255, 0.12);
  color:#FFFFFF;
  font-family:'Space Grotesk',sans-serif;
  font-size:.75rem;
  font-weight:700;
  letter-spacing:.18em;
  text-transform:uppercase;
  padding:.45rem 1.4rem;
  border-radius:50px;
  margin-bottom:2rem;
  box-shadow: 0 4px 12px rgba(0,0,0,0.2), inset 0 1px 1px rgba(255,255,255,0.1);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}'''

content = re.sub(pattern, new_eyebrow, content, count=1)

with open('src/styles/global.css', 'w', encoding='utf-8') as f:
    f.write(content)
