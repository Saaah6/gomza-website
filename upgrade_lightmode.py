import re

def update_css():
    filepath = "src/styles/global.css"
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()

    parts = content.split("/* =============================================================\n   LIGHT MODE")
    if len(parts) != 2:
        print("Could not find light mode section")
        return

    dark_css = parts[0]
    light_css = "/* =============================================================\n   LIGHT MODE" + parts[1]

    # Global color swaps for a richer look
    light_css = light_css.replace("#FAFAF8", "#F8F9FA") # Slightly cooler, cleaner white background
    light_css = light_css.replace("#0D0D14", "#0F172A") # Deep slate instead of pure dark
    light_css = light_css.replace("rgba(13,13,20", "rgba(15,23,42")
    light_css = light_css.replace("rgba(13, 13, 20", "rgba(15, 23, 42")
    
    # Background for body
    light_css = light_css.replace("background: #F8F9FA !important;", "background: radial-gradient(circle at top, #FFFFFF, #F8F9FA) !important;")

    # Navbar glassmorphism
    light_css = light_css.replace("background: rgba(250, 250, 248, 0.96) !important;", "background: rgba(255, 255, 255, 0.75) !important;")
    light_css = light_css.replace("backdrop-filter: blur(16px) !important;", "backdrop-filter: blur(24px) saturate(1.2) !important;")
    light_css = light_css.replace("box-shadow: 0 1px 24px rgba(15,23,42,0.06) !important;", "box-shadow: 0 4px 30px rgba(15,23,42,0.04), 0 1px 2px rgba(15,23,42,0.02) !important;")

    # Buttons
    light_css = light_css.replace("box-shadow: 0 6px 30px rgba(59,111,240,0.32) !important;", "box-shadow: 0 8px 32px rgba(59,111,240,0.35), inset 0 1px 2px rgba(255,255,255,0.3) !important;")
    
    # Cards: srv, niche-card, proof-card, case-study-card, cro-glass, ai-gen-section
    rich_shadow = "box-shadow: 0 12px 40px rgba(15,23,42,0.05), 0 2px 6px rgba(15,23,42,0.02) !important;"
    rich_border = "border: 1px solid rgba(15,23,42,0.04) !important;"
    hover_shadow = "box-shadow: 0 20px 60px rgba(59,111,240,0.12), 0 4px 16px rgba(59,111,240,0.05) !important;"
    
    def replace_card_shadows(css):
        # Base cards
        css = re.sub(r'border: 1px solid rgba\(15,23,42,0\.07\)[ \n]*!important;', rich_border, css)
        css = re.sub(r'box-shadow: 0 [24]px [0-9]{2}px rgba\(15,23,42,0\.055\)[ \n]*!important;', rich_shadow, css)
        
        # Hover states
        css = re.sub(r'box-shadow: 0 1[02]px 4[04]px rgba\(15,23,42,0\.10\)[ \n]*!important;', hover_shadow, css)
        css = re.sub(r'box-shadow: 0 12px 40px rgba\(59,111,240,0\.12\)[ \n]*!important;', hover_shadow, css)
        return css
        
    light_css = replace_card_shadows(light_css)
    
    # Beams
    light_css = light_css.replace("opacity: 0.04 !important; filter: invert(1);", "opacity: 0.15 !important; mix-blend-mode: multiply !important; filter: none !important;")

    with open(filepath, "w", encoding="utf-8") as f:
        f.write(dark_css + light_css)
        
    print("CSS updated successfully!")

if __name__ == "__main__":
    update_css()
