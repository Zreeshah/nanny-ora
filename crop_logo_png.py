from PIL import Image

try:
    img = Image.open('public/logo.png')
    width, height = img.size
    print(f"Original PNG size: {width}x{height}")

    # Ignore 5% margin to avoid any potential photo borders
    ignore_x = int(width * 0.05)
    ignore_y = int(height * 0.05)

    left = width
    top = height
    right = 0
    bottom = 0

    pixels = img.load()
    # Check pixels and find min/max coordinates
    for y in range(ignore_y, height - ignore_y):
        for x in range(ignore_x, width - ignore_x):
            r, g, b = pixels[x, y][:3] # handle RGB or RGBA
            # Detect anything darker than the cream background
            if r < 238 or g < 235 or b < 225:
                if x < left: left = x
                if y < top: top = y
                if x > right: right = x
                if y > bottom: bottom = y

    print(f"Detected bounding box: left={left}, top={top}, right={right}, bottom={bottom}")

    if right > left and bottom > top:
        # Add small padding
        padding_x = 24
        padding_y = 16
        left = max(0, left - padding_x)
        top = max(0, top - padding_y)
        right = min(width, right + padding_x)
        bottom = min(height, bottom + padding_y)

        print(f"Cropping to: left={left}, top={top}, right={right}, bottom={bottom} (new size: {right - left}x{bottom - top})")
        cropped_img = img.crop((left, top, right, bottom))
        cropped_img.save('public/logo.png')
        print("Success: Cropped PNG logo saved to public/logo.png.")
    else:
        print("Error: Bounding box detection failed.")

except Exception as e:
    print("Failed to crop PNG logo:", e)
