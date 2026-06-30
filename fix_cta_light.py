extra = """

/* LOGO GOLD COLOR - preserve za gold in light mode */
body.light-mode .logo div span,
body.light-mode a.logo span { color: #F4A62A !important; }
body.light-mode .fl span { color: #F4A62A !important; }

/* CTA SECTION - light mode redesign */
body.light-mode .cta-inner {
  background: #FFFFFF !important;
  border: 1px solid rgba(59, 111, 240, 0.15) !important;
  box-shadow: 0 4px 40px rgba(13,13,20,0.08), 0 0 0 1px rgba(59,111,240,0.08) !important;
}
body.light-mode .cta-inner::before {
  background: linear-gradient(90deg, transparent, rgba(59,111,240,0.7), rgba(200,134,10,0.5), transparent) !important;
}
body.light-mode .cta-bg-glow {
  background: radial-gradient(ellipse, rgba(59,111,240,0.1), transparent 70%) !important;
}
body.light-mode .cta-inner h2 {
  color: #0D0D14 !important;
}
body.light-mode .cta-inner p { color: rgba(13,13,20,0.60) !important; }
body.light-mode .cta-inner .btn-primary {
  background: linear-gradient(135deg, #3B6FF0, #2952C8) !important;
  color: #fff !important;
  box-shadow: 0 6px 28px rgba(59,111,240,0.35) !important;
}
body.light-mode .cta-inner.is-targeted {
  box-shadow: 0 0 0 1px rgba(59,111,240,0.3), 0 0 60px rgba(59,111,240,0.12) !important;
}
"""

with open('src/styles/global.css', 'a', encoding='utf-8') as f:
    f.write(extra)

print('Done - logo gold + CTA light mode appended')
