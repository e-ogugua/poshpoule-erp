import os
import hashlib
import shutil
from pathlib import Path
from PIL import Image
from collections import defaultdict
import json

# Configuration
BASE_DIR = Path('public')
DUPLICATES_DIR = BASE_DIR / 'duplicates'
REPORT_FILE = 'image_cleanup_report.json'

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
        for file in files:
            if any(file.lower().endswith(ext) for ext in image_extensions):
                if 'duplicates' not in root:  # Skip duplicates directory
                    images.append(Path(root) / file)
    return images

def analyze_images():
    print("🔍 Scanning for images...")
    images = find_images(BASE_DIR)
    print(f"Found {len(images)} image files")
    
    # Group by hash
    hash_groups = defaultdict(list)
    size_info = {}
    
    for img_path in images:
        try:
            file_hash = get_file_hash(img_path)
            hash_groups[file_hash].append(img_path)
            size_info[img_path] = os.path.getsize(img_path)
        except Exception as e:
            print(f"Error processing {img_path}: {e}")
    
    # Find duplicates
    duplicates = {h: paths for h, paths in hash_groups.items() if len(paths) > 1}
    
    # Find HEIC files
    heic_files = [p for p in images if p.suffix.lower() in {'.heic', '.heif'}]
    
    # Generate report
    report = {
        'total_images': len(images),
        'unique_images': len(hash_groups),
        'duplicate_groups': len(duplicates),
        'heic_files': [str(p) for p in heic_files],
        'duplicates': {str(h): [str(p) for p in paths] for h, paths in duplicates.items()},
        'image_sizes': {str(p): size for p, size in size_info.items()}
    }
    
    # Save report
    with open(REPORT_FILE, 'w') as f:
        json.dump(report, f, indent=2)
    
    print(f"✅ Analysis complete. Report saved to {REPORT_FILE}")
    print(f"Found {len(duplicates)} duplicate groups and {len(heic_files)} HEIC files")

if __name__ == "__main__":
    analyze_images()
