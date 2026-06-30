from PIL import Image
import os

img_path = 'public/assets/doberman_face.png'
out_path = 'public/assets/doberman_cursor.png'

if os.path.exists(img_path):
    with Image.open(img_path) as img:
        img = img.convert('RGBA')
        img = img.resize((32, 32), Image.LANCZOS)
        img.save(out_path, 'PNG')
    print('Cursor image created successfully')
else:
    print('Image not found')
