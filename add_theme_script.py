import os

# 1. Update index.astro
index_path = 'src/pages/index.astro'
with open(index_path, 'r', encoding='utf-8') as f:
    content = f.read()

toggle_html = '''  <button id="theme-toggle" class="theme-toggle" aria-label="Toggle theme">
    <svg class="sun-icon" viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
    <svg class="moon-icon" viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
  </button>'''

if 'theme-toggle' not in content:
    content = content.replace('<a href="https://form.typeform.com/to/S1It3Kbv" target="_blank" rel="noopener" class="nav-cta nav-cta-link">Book a Call</a>', '<a href="https://form.typeform.com/to/S1It3Kbv" target="_blank" rel="noopener" class="nav-cta nav-cta-link">Book a Call</a>\n' + toggle_html)
    with open(index_path, 'w', encoding='utf-8') as f:
        f.write(content)


# 2. Update tool.astro
tool_path = 'src/pages/tool.astro'
if os.path.exists(tool_path):
    with open(tool_path, 'r', encoding='utf-8') as f:
        content = f.read()
    if 'theme-toggle' not in content:
        content = content.replace('<a href="https://form.typeform.com/to/S1It3Kbv" target="_blank" rel="noopener" class="nav-cta">Book a Call</a>', '<a href="https://form.typeform.com/to/S1It3Kbv" target="_blank" rel="noopener" class="nav-cta">Book a Call</a>\n' + toggle_html)
        with open(tool_path, 'w', encoding='utf-8') as f:
            f.write(content)

# 3. Update global.css
css_path = 'src/styles/global.css'
with open(css_path, 'r', encoding='utf-8') as f:
    css_content = f.read()

light_mode_css = '''
/* ── LIGHT MODE ── */
body.light-mode {
  --navy: #f8fafc;
  --navy2: #f1f5f9;
  --navy3: #e2e8f0;
  --white: #0f172a;
  --blue-glow: rgba(59, 130, 246, 0.15);
  --gold-dim: rgba(245, 158, 11, 0.1);
  --muted: rgba(15, 23, 42, 0.7);
  --faint: rgba(15, 23, 42, 0.08);
}
.theme-toggle {
  background: var(--navy3);
  border: 1px solid var(--faint);
  color: var(--white);
  cursor: pointer;
  padding: 10px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  margin-left: 10px;
}
.theme-toggle:hover {
  background: var(--blue-glow);
  transform: scale(1.05);
}
.moon-icon { display: none; }
body.light-mode .moon-icon { display: block; }
body.light-mode .sun-icon { display: none; }
'''

if 'body.light-mode' not in css_content:
    with open(css_path, 'a', encoding='utf-8') as f:
        f.write('\n' + light_mode_css)

# 4. Update main.js
js_path = 'public/main.js'
with open(js_path, 'r', encoding='utf-8') as f:
    js_content = f.read()

toggle_js = '''
/* ── THEME TOGGLE ── */
(function(){
  const themeBtn = document.getElementById('theme-toggle');
  if(themeBtn) {
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme === 'light') {
      document.body.classList.add('light-mode');
    }
    themeBtn.addEventListener('click', () => {
      document.body.classList.toggle('light-mode');
      const theme = document.body.classList.contains('light-mode') ? 'light' : 'dark';
      localStorage.setItem('theme', theme);
    });
  }
})();
'''

if 'THEME TOGGLE' not in js_content:
    with open(js_path, 'a', encoding='utf-8') as f:
        f.write('\n' + toggle_js)

print("Toggle successfully injected.")
