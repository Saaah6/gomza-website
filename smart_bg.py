from PIL import Image
import math

def remove_bg_smart(input_path, output_path, fuzz=40):
    try:
        img = Image.open(input_path).convert('RGBA')
        data = img.load()
        width, height = img.size
        
        # Assume top-left pixel is the background color
        bg_r, bg_g, bg_b, _ = data[0, 0]
        
        for y in range(height):
            for x in range(width):
                r, g, b, a = data[x, y]
                
                # Calculate color distance from background color
                dist = math.sqrt((r - bg_r)**2 + (g - bg_g)**2 + (b - bg_b)**2)
                
                if dist < fuzz:
                    # It's background, make it transparent
                    data[x, y] = (r, g, b, 0)
                elif dist < fuzz + 20:
                    # Anti-aliasing edge
                    alpha = int(((dist - fuzz) / 20.0) * 255)
                    data[x, y] = (r, g, b, alpha)
                    
        # Resize nicely to cursor size
        img = img.resize((32, 32), Image.LANCZOS)
        img.save(output_path, 'PNG')
        print('Smart BG removal successful')
    except Exception as e:
        print('Error:', e)

remove_bg_smart('public/assets/doberman_face.png', 'public/assets/doberman_cursor.png', fuzz=80)
