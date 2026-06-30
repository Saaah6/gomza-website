import re

# 1. UPDATE CSS for floating pill navbar
css_path = "src/styles/global.css"
with open(css_path, "r", encoding="utf-8") as f:
    css_content = f.read()

nav_target = """nav{
  position:fixed;top:0;left:0;right:0;z-index:100;
  display:flex;justify-content:space-between;align-items:center;
  padding:1.2rem 3rem;
  background:rgba(2,4,10,0.7);
  backdrop-filter:blur(24px);
  -webkit-backdrop-filter:blur(24px);
  border-bottom:1px solid rgba(255,255,255,0.04);
  will-change:background;
  /* backdrop-filter removed on nav — kills mobile fps */
}"""

nav_replacement = """nav {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 100;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: calc(100% - 40px);
  max-width: 1000px;
  padding: 0.8rem 1.5rem;
  background: rgba(10, 15, 30, 0.55);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-top: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 9999px;
  box-shadow: 0 20px 40px rgba(0,0,0,0.3), inset 0 1px 2px rgba(255,255,255,0.05);
  transition: transform 0.4s cubic-bezier(0.165, 0.84, 0.44, 1), background 0.3s ease;
  will-change: transform;
}
nav.nav-hidden {
  transform: translate(-50%, -150%);
}"""

css_content = css_content.replace(nav_target, nav_replacement)

# Ensure light mode nav looks good as a pill
light_nav_target = "body.light-mode #navbar {"
light_nav_replacement = """body.light-mode #navbar {
  background: rgba(255, 255, 255, 0.7) !important;
  border-color: rgba(15, 23, 42, 0.08) !important;
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.05) !important;
"""
css_content = css_content.replace(light_nav_target, light_nav_replacement)

with open(css_path, "w", encoding="utf-8") as f:
    f.write(css_content)


# 2. UPDATE MAIN.JS for smart scroll behavior
js_path = "public/main.js"
with open(js_path, "r", encoding="utf-8") as f:
    js_content = f.read()

scroll_logic = """
  // PWA Navbar Smart Scroll Logic
  let lastScrollY = window.scrollY;
  const navbar = document.getElementById('navbar');
  
  window.addEventListener('scroll', () => {
    if (!navbar) return;
    // Don't hide navbar at the very top
    if (window.scrollY <= 50) {
      navbar.classList.remove('nav-hidden');
    } else if (window.scrollY > lastScrollY) {
      // Scrolling down
      navbar.classList.add('nav-hidden');
    } else {
      // Scrolling up
      navbar.classList.remove('nav-hidden');
    }
    lastScrollY = window.scrollY;
  }, { passive: true });
"""

# Inject before the end of the DOMContentLoaded listener
if "document.addEventListener('DOMContentLoaded', () => {" in js_content:
    # Just append it inside the DOMContentLoaded block
    js_content = js_content.replace(
        "document.addEventListener('DOMContentLoaded', () => {", 
        "document.addEventListener('DOMContentLoaded', () => {" + scroll_logic
    )
    with open(js_path, "w", encoding="utf-8") as f:
        f.write(js_content)
    print("Successfully updated CSS and JS for PWA Navbar.")
else:
    print("Could not find DOMContentLoaded block in main.js")

