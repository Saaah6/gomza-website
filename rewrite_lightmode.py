new_css = """
/* =============================================================
   LIGHT MODE - Premium Editorial White Design
   Dark mode: completely untouched.
   Light mode: rich, readable, aesthetically beautiful.
============================================================= */

/* CSS VARIABLE OVERRIDES */
body.light-mode {
  --navy:       #FAFAF8;
  --navy2:      #F2F2EF;
  --navy3:      #E8E8E3;
  --white:      #0D0D14;
  --blue:       #3B6FF0;
  --blue-bright:#2952C8;
  --blue-glow:  rgba(59, 111, 240, 0.18);
  --gold:       #C8860A;
  --gold-dim:   rgba(200, 134, 10, 0.12);
  --aqua:       #0E7490;
  --rose:       #BE1A4A;
  --muted:      rgba(13, 13, 20, 0.55);
  --faint:      rgba(13, 13, 20, 0.06);
}
body.light-mode {
  background: #FAFAF8 !important;
  color: #0D0D14 !important;
  transition: background 0.45s cubic-bezier(0.4,0,0.2,1), color 0.45s cubic-bezier(0.4,0,0.2,1);
}
body.light-mode h1,
body.light-mode h2,
body.light-mode h3 {
  color: #0D0D14 !important;
  font-family: 'Playfair Display', 'Manrope', Georgia, serif !important;
  letter-spacing: -0.02em;
}
body.light-mode h4, body.light-mode h5, body.light-mode h6 { color: #0D0D14 !important; }
body.light-mode p { color: rgba(13, 13, 20, 0.68) !important; line-height: 1.78; }
body.light-mode li { color: rgba(13, 13, 20, 0.68) !important; }
body.light-mode span { color: inherit; }
body.light-mode strong, body.light-mode b { color: #0D0D14 !important; }
body.light-mode ::-webkit-scrollbar-track { background: #F2F2EF; }
body.light-mode ::-webkit-scrollbar-thumb { background: rgba(13,13,20,0.18); border-radius:4px; }
body.light-mode ::-webkit-scrollbar-thumb:hover { background: rgba(13,13,20,0.30); }
body.light-mode #svg-beams { opacity: 0.04 !important; filter: invert(1); }
body.light-mode #three-bg  { opacity: 0.03 !important; }
body.light-mode #scroll-progress { background: linear-gradient(90deg, #3B6FF0, #C8860A) !important; }
body.light-mode #navbar {
  background: rgba(250, 250, 248, 0.96) !important;
  border-bottom: 1px solid rgba(13,13,20,0.08) !important;
  box-shadow: 0 1px 24px rgba(13,13,20,0.06) !important;
  backdrop-filter: blur(16px) !important;
}
body.light-mode #navbar a, body.light-mode .nav-links a { color: rgba(13,13,20,0.72) !important; }
body.light-mode #navbar a:hover, body.light-mode .nav-links a:hover { color: #3B6FF0 !important; }
body.light-mode .logo { color: #0D0D14 !important; }
body.light-mode .nav-cta, body.light-mode .nav-cta-link {
  background: linear-gradient(135deg, #3B6FF0, #2952C8) !important;
  color: #fff !important;
  box-shadow: 0 4px 20px rgba(59,111,240,0.28) !important;
}
body.light-mode .mob-drawer {
  background: #FAFAF8 !important;
  border-left: 1px solid rgba(13,13,20,0.08) !important;
  box-shadow: -8px 0 40px rgba(13,13,20,0.12) !important;
}
body.light-mode .mob-link { color: #0D0D14 !important; }
body.light-mode .mob-cta { background: linear-gradient(135deg, #3B6FF0, #2952C8) !important; color: #fff !important; }
body.light-mode .mob-overlay { background: rgba(13,13,20,0.4) !important; }
body.light-mode .hamburger span { background: #0D0D14 !important; }
body.light-mode .hero-glow, body.light-mode .hero-glow2 { opacity: 0.05 !important; }
body.light-mode .eyebrow {
  background: rgba(59,111,240,0.08) !important;
  border: 1px solid rgba(59,111,240,0.25) !important;
  color: #3B6FF0 !important;
  font-weight: 600;
}
body.light-mode .eyebrow-dot { background: #3B6FF0 !important; box-shadow: 0 0 8px rgba(59,111,240,0.5) !important; }
body.light-mode #h1 { color: #0D0D14 !important; }
body.light-mode .hero-sub { color: rgba(13,13,20,0.6) !important; }
body.light-mode .btn-primary {
  background: linear-gradient(135deg, #3B6FF0, #2952C8) !important;
  color: #fff !important;
  box-shadow: 0 6px 30px rgba(59,111,240,0.32) !important;
}
body.light-mode .btn-ghost {
  background: transparent !important;
  border: 1.5px solid rgba(13,13,20,0.18) !important;
  color: #0D0D14 !important;
}
body.light-mode .btn-ghost:hover {
  background: rgba(13,13,20,0.05) !important;
  border-color: rgba(13,13,20,0.28) !important;
}
body.light-mode .section-title, body.light-mode .srv-title, body.light-mode .proof-title { color: #0D0D14 !important; }
body.light-mode .section-sub, body.light-mode .srv-sub { color: rgba(13,13,20,0.55) !important; }
body.light-mode .srv {
  background: #FFFFFF !important;
  border: 1px solid rgba(13,13,20,0.07) !important;
  box-shadow: 0 2px 16px rgba(13,13,20,0.055) !important;
  color: #0D0D14 !important;
}
body.light-mode .srv:hover {
  box-shadow: 0 10px 44px rgba(13,13,20,0.10) !important;
  border-color: rgba(59,111,240,0.2) !important;
}
body.light-mode .srv h3 { color: #0D0D14 !important; }
body.light-mode .srv p { color: rgba(13,13,20,0.6) !important; }
body.light-mode .niche-card {
  background: #FFFFFF !important;
  border: 1px solid rgba(13,13,20,0.07) !important;
  box-shadow: 0 4px 24px rgba(13,13,20,0.055) !important;
  color: #0D0D14 !important;
}
body.light-mode .niche-card:hover { box-shadow: 0 12px 40px rgba(59,111,240,0.12) !important; border-color: rgba(59,111,240,0.2) !important; }
body.light-mode .niche-card h3 { color: #0D0D14 !important; }
body.light-mode .niche-card p { color: rgba(13,13,20,0.6) !important; }
body.light-mode .proof-card {
  background: #FFFFFF !important;
  border: 1px solid rgba(13,13,20,0.07) !important;
  box-shadow: 0 4px 24px rgba(13,13,20,0.055) !important;
  color: #0D0D14 !important;
}
body.light-mode .proof-card h3, body.light-mode .proof-card .proof-name { color: #0D0D14 !important; }
body.light-mode .proof-card p, body.light-mode .proof-card .proof-role { color: rgba(13,13,20,0.6) !important; }
body.light-mode .case-study-card, body.light-mode .cro-glass {
  background: #FFFFFF !important;
  border: 1px solid rgba(13,13,20,0.07) !important;
  box-shadow: 0 4px 24px rgba(13,13,20,0.055) !important;
  color: #0D0D14 !important;
}
body.light-mode .ai-gen-section {
  background: #FFFFFF !important;
  border: 1px solid rgba(13,13,20,0.07) !important;
  box-shadow: 0 4px 30px rgba(13,13,20,0.065) !important;
}
body.light-mode .ai-gen-section label, body.light-mode .ai-gen-section h2 { color: #0D0D14 !important; }
body.light-mode .ai-gen-section select, body.light-mode .ai-gen-section input, body.light-mode .ai-gen-section textarea {
  background: #F2F2EF !important;
  border: 1px solid rgba(13,13,20,0.12) !important;
  color: #0D0D14 !important;
}
body.light-mode .gen-btn {
  background: linear-gradient(135deg, #3B6FF0, #2952C8) !important;
  color: #fff !important;
  box-shadow: 0 4px 20px rgba(59,111,240,0.28) !important;
}
body.light-mode #giant-text { color: rgba(13,13,20,0.04) !important; }
body.light-mode footer {
  background: #F2F2EF !important;
  color: #0D0D14 !important;
  border-top: 1px solid rgba(13,13,20,0.08) !important;
}
body.light-mode footer p, body.light-mode footer span, body.light-mode footer a { color: rgba(13,13,20,0.58) !important; }
body.light-mode footer a:hover { color: #3B6FF0 !important; }
body.light-mode .social-link {
  background: rgba(13,13,20,0.06) !important;
  color: #0D0D14 !important;
  border: 1px solid rgba(13,13,20,0.1) !important;
}
body.light-mode .social-link:hover { background: #3B6FF0 !important; color: #fff !important; }
body.light-mode .case-modal, body.light-mode .modal-content {
  background: #FFFFFF !important;
  color: #0D0D14 !important;
  border: 1px solid rgba(13,13,20,0.1) !important;
  box-shadow: 0 24px 80px rgba(13,13,20,0.16) !important;
}
body.light-mode .modal-close { color: #0D0D14 !important; }
body.light-mode .stat-num, body.light-mode .hero-stat-val { color: #3B6FF0 !important; }
body.light-mode .stat-label, body.light-mode .hero-stat-label { color: rgba(13,13,20,0.55) !important; }
body.light-mode .step-num { color: #3B6FF0 !important; }
body.light-mode .step-title { color: #0D0D14 !important; }
body.light-mode .step-desc { color: rgba(13,13,20,0.62) !important; }
body.light-mode .step-line { background: rgba(13,13,20,0.12) !important; }
body.light-mode .step-dot { background: #3B6FF0 !important; box-shadow: 0 0 0 4px rgba(59,111,240,0.15) !important; }

/* THEME TOGGLE BUTTON */
.theme-toggle {
  background: rgba(255,255,255,0.1);
  border: 1px solid rgba(255,255,255,0.2);
  color: #fff;
  cursor: pointer;
  padding: 10px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  margin-left: 10px;
  flex-shrink: 0;
}
.theme-toggle:hover { background: rgba(255,255,255,0.2); transform: scale(1.1); }
body.light-mode .theme-toggle {
  background: rgba(13,13,20,0.06);
  border: 1px solid rgba(13,13,20,0.14);
  color: #0D0D14;
}
body.light-mode .theme-toggle:hover {
  background: rgba(59,111,240,0.1);
  border-color: rgba(59,111,240,0.3);
}

/* ICON VISIBILITY - JS-controlled */
.moon-icon, .sun-icon { display: none; }
.theme-icon { display: none; }
"""

with open('src/styles/global.css', 'r', encoding='utf-8') as f:
    lines = f.readlines()

# Replace lines 1842-1936 (0-indexed 1841-1935)
before = lines[:1841]
after = lines[1935:]

with open('src/styles/global.css', 'w', encoding='utf-8') as f:
    f.writelines(before)
    f.write(new_css)
    f.writelines(after)

print("Done: light mode CSS rewritten successfully")
