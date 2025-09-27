import os
import shutil
import hashlib
from pathlib import Path
from PIL import Image
import json
from datetime import datetime
import subprocess

# Configuration
BASE_DIR = Path('public')
DUPLICATES_DIR = BASE_DIR / 'duplicates'
PROCESSED_DIR = BASE_DIR / 'images'
REPORT_FILE = 'image_cleanup_report.json'

# Ensure output directories exist
DUPLICATES_DIR.mkdir(parents=True, exist_ok=True)
PROCESSED_DIR.mkdir(parents=True, exist_ok=True)

def get_file_hash(filepath):
    """Generate MD5 hash of file content"""
    hash_md5 = hashlib.md5()
    with open(filepath, "rb") as f:
        for chunk in iter(lambda: f.read(4096), b""):
            hash_md5.update(chunk)
    return hash_md5.hexdigest()

def find_images(directory):
    """Find all image files in directory"""
    image_extensions = {'.jpg', '.jpeg', '.png', '.webp', '.heic', '.heif'}
    images = []
    for root, _, files in os.walk(directory):
        # Skip processing duplicates and node_modules directories
        if 'duplicates' in root or 'node_modules' in root:
            continue
        for file in files:
            if any(file.lower().endswith(ext) for ext in image_extensions):
                images.append(Path(root) / file)
    return images

def is_image_optimized(image_path):
    """Check if image is already optimized"""
    try:
        if image_path.suffix.lower() == '.webp':
            return True
            
        # Check if optimized version already exists
        webp_path = image_path.with_suffix('.webp')
        if webp_path.exists():
            original_size = os.path.getsize(image_path)
            optimized_size = os.path.getsize(webp_path)
            # If optimized version is smaller, consider it already optimized
            if optimized_size < original_size * 0.9:  # At least 10% smaller
                return True
        return False
    except Exception as e:
        print(f"Error checking if image is optimized: {e}")
        return False

def optimize_image(image_path, output_path):
    """Optimize image and save to output path"""
    try:
        img = Image.open(image_path)
        
        # Convert to RGB if necessary (for PNG with transparency)
        if image_path.suffix.lower() in ['.png', '.jpg', '.jpeg']:
            img = img.convert('RGB')
        
        # Resize if image is too large
        max_size = (1920, 1080)  # Max dimensions
        img.thumbnail(max_size, Image.Resampling.LANCZOS)
        
        # Save as WebP with quality settings
        output_path = output_path.with_suffix('.webp')
        img.save(output_path, 'WEBP', quality=85, optimize=True)
        return output_path
    except Exception as e:
        print(f"Error optimizing {image_path}: {e}")
        return None

def process_images():
    print("🔍 Starting image cleanup and optimization...")
    
    # Initialize report with default values
    report = {
        'timestamp': datetime.now().isoformat(),
        'total_processed': 0,
        'optimized': [],
        'duplicates_found': [],
        'heic_converted': [],
        'errors': []
    }
    
    # Load previous report if exists
    if os.path.exists(REPORT_FILE):
        try:
            with open(REPORT_FILE, 'r') as f:
                existing_report = json.load(f)
                # Only keep previous data that we want to preserve
                for key in ['optimized', 'duplicates_found', 'heic_converted']:
                    if key in existing_report:
                        report[key] = existing_report[key]
        except Exception as e:
            print(f"Warning: Could not load previous report: {e}")
    
    # Find all images
    images = find_images(BASE_DIR)
    print(f"Found {len(images)} images to process")
    
    # Skip HEIC files as they require additional dependencies
    images = [p for p in images if p.suffix.lower() not in {'.heic', '.heif'}]
    
    # Process remaining images
    hash_map = {}
    for img_path in images:
        try:
            # Skip already processed files
            if str(img_path).startswith(str(PROCESSED_DIR)):
                continue
                
            file_hash = get_file_hash(img_path)
            
            # Check for duplicates
            if file_hash in hash_map:
                duplicate_of = hash_map[file_hash]
                duplicate_info = {
                    'duplicate': str(img_path),
                    'original': str(duplicate_of),
                    'size': os.path.getsize(img_path)
                }
                report['duplicates_found'].append(duplicate_info)
                
                # Move duplicate to duplicates folder
                rel_path = img_path.relative_to(BASE_DIR)
                dup_path = DUPLICATES_DIR / rel_path
                dup_path.parent.mkdir(parents=True, exist_ok=True)
                shutil.move(img_path, dup_path)
                print(f"Moved duplicate: {img_path} -> {dup_path}")
                continue
                
            # If not a duplicate, process and optimize
            hash_map[file_hash] = img_path
            
            # Skip if already optimized
            if is_image_optimized(img_path):
                print(f"Skipping already optimized: {img_path}")
                continue
                
            # Determine output path
            rel_path = img_path.relative_to(BASE_DIR)
            output_path = PROCESSED_DIR / rel_path
            output_path.parent.mkdir(parents=True, exist_ok=True)
            
            # Skip if output already exists and is newer than source
            if output_path.exists() and output_path.stat().st_mtime > img_path.stat().st_mtime:
                print(f"Skipping, optimized version exists: {output_path}")
                continue
                
            # Optimize image
            print(f"Optimizing: {img_path}")
            optimized_path = optimize_image(img_path, output_path)
            if optimized_path:
                original_size = os.path.getsize(img_path)
                new_size = os.path.getsize(optimized_path)
                
                report['optimized'].append({
                    'original': str(img_path),
                    'optimized': str(optimized_path),
                    'original_size': original_size,
                    'new_size': new_size,
                    'saved': original_size - new_size
                })
                
                # Remove original if it's not the same as the optimized file
                if optimized_path != img_path and optimized_path.exists():
                    os.remove(img_path)
                    # Remove empty directories
                    try:
                        img_path.parent.rmdir()
                    except OSError:
                        pass  # Directory not empty or other error
                
                print(f"Optimized: {img_path} (saved {original_size - new_size} bytes)")
            
            report['total_processed'] += 1
            
        except Exception as e:
            error_msg = f"Error processing {img_path}: {str(e)}"
            print(error_msg)
            report['errors'].append(error_msg)
    
    # Save final report
    report['timestamp'] = datetime.now().isoformat()
    with open(REPORT_FILE, 'w') as f:
        json.dump(report, f, indent=2)
    
    # Generate summary
    total_saved = sum(item.get('saved', 0) for item in report['optimized'] + report['heic_converted'])
    
    print("\n✅ Cleanup and optimization complete!")
    print(f"Total images processed: {report['total_processed']}")
    print(f"Duplicates found: {len(report['duplicates_found'])}")
    print(f"HEIC files converted: {len(report['heic_converted'])}")
    print(f"Total space saved: {total_saved / (1024*1024):.2f} MB")
    print(f"\n📊 Full report saved to: {REPORT_FILE}")
    
    return report

if __name__ == "__main__":
    process_images()
