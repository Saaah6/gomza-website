const fs = require('fs');
const path = require('path');

const btn = `
<!-- FLOATING THEME TOGGLE -->
<button id="theme-toggle" class="theme-toggle" aria-label="Toggle theme" title="Dark mode">
  <svg class="theme-icon icon-sun" viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
  <svg class="theme-icon icon-moon" viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
  <svg class="theme-icon icon-system" viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
    <g class="sys-desktop"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></g>
    <g class="sys-tablet"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect><line x1="12" y1="18" x2="12.01" y2="18"></line></g>
    <g class="sys-mobile"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect><line x1="12" y1="18" x2="12.01" y2="18"></line></g>
  </svg>
</button>
`;

let layout = fs.readFileSync('src/layouts/Layout.astro', 'utf8');
if (!layout.includes('id="theme-toggle"')) {
  layout = layout.replace('<slot />', '<slot />' + btn);
  fs.writeFileSync('src/layouts/Layout.astro', layout);
}

function walk(dir) {
  let files = fs.readdirSync(dir);
  for (let file of files) {
    let p = path.join(dir, file);
    if (fs.statSync(p).isDirectory()) {
      walk(p);
    } else if (p.endsWith('.astro')) {
      let content = fs.readFileSync(p, 'utf8');
      let removed = content.replace(/<!-- FLOATING THEME TOGGLE -->\s*<button id="theme-toggle"[\s\S]*?<\/button>/g, '');
      if (removed !== content) {
        fs.writeFileSync(p, removed);
        console.log('Removed from ' + p);
      }
    }
  }
}
walk('src/pages');
