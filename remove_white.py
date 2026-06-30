from PIL import Image
import os

img_path = 'public/assets/doberman_face.png'
out_path = 'public/assets/doberman_cursor.png'

if os.path.exists(img_path):
    with Image.open(img_path) as img:
        img = img.convert('RGBA')
        
        # Get data
        data = img.getdata()
        new_data = []
        for item in data:
            # Change all white (also shades of whites) to transparent
            if item[0] > 230 and item[1] > 230 and item[2] > 230:
                new_data.append((255, 255, 255, 0))
            else:
                new_data.append(item)
                
        img.putdata(new_data)
        
        # Resize after making transparent
        img = img.resize((32, 32), Image.LANCZOS)
        img.save(out_path, 'PNG')
    print('Cursor image created successfully with transparent background')
else:
    print('Image not found')
