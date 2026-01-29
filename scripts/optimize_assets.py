
import os
import sys
from PIL import Image

def optimize_image(file_path, max_size=4096, quality=85):
    try:
        if not os.path.exists(file_path):
            print(f"File not found: {file_path}")
            return

        filename = os.path.basename(file_path)
        name, ext = os.path.splitext(filename)
        dir_path = os.path.dirname(file_path)
        
        # Create optimized directory
        opt_dir = os.path.join(dir_path, "optimized")
        os.makedirs(opt_dir, exist_ok=True)
        
        with Image.open(file_path) as img:
            original_size = os.path.getsize(file_path)
            width, height = img.size
            print(f"\nProcessing {filename}:")
            print(f"  Original: {width}x{height}, {original_size/1024/1024:.2f} MB")

            # Calculate new size maintaining aspect ratio
            if width > max_size or height > max_size:
                ratio = min(max_size/width, max_size/height)
                new_width = int(width * ratio)
                new_height = int(height * ratio)
                img = img.resize((new_width, new_height), Image.Resampling.LANCZOS)
                print(f"  Resizing to: {new_width}x{new_height}")

            # Save as Optimized JPG
            jpg_out = os.path.join(opt_dir, filename)
            img.save(jpg_out, "JPEG", quality=quality, optimize=True)
            jpg_size = os.path.getsize(jpg_out)
            
            # Save as WebP (Usually much smaller and better for web)
            webp_out = os.path.join(opt_dir, f"{name}.webp")
            img.save(webp_out, "WEBP", quality=quality)
            webp_size = os.path.getsize(webp_out)

            print(f"  Optimized JPG: {jpg_size/1024/1024:.2f} MB ({(1 - jpg_size/original_size)*100:.1f}% reduction)")
            print(f"  WebP Alternative: {webp_size/1024/1024:.2f} MB ({(1 - webp_size/original_size)*100:.1f}% reduction)")

    except Exception as e:
        print(f"Error processing {file_path}: {e}")

if __name__ == "__main__":
    # List of files provided by the user
    files = [
        r"c:\Users\User\Desktop\AR\assets\projects\950_2\Mutfak01.jpg",
        r"c:\Users\User\Desktop\AR\assets\projects\950_2\Odalar.jpg",
        r"c:\Users\User\Desktop\AR\assets\projects\950_2\plan_01.jpg",
        r"c:\Users\User\Desktop\AR\assets\projects\950_2\Salon01.jpg",
        r"c:\Users\User\Desktop\AR\assets\projects\950_2\Salon02.jpg",
        r"c:\Users\User\Desktop\AR\assets\projects\950_2\YatakOdası.jpg"
    ]
    
    print("Starting optimization...")
    for f in files:
        optimize_image(f)
    print("\nOptimization complete. Check the 'optimized' folder in the assets directory.")
