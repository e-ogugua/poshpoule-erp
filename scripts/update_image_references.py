import json
import os
from pathlib import Path
import re

# Configuration
BASE_DIR = Path('.')
REPORT_FILE = 'image_cleanup_report.json'

# Load the optimization report
with open(REPORT_FILE, 'r') as f:
    report = json.load(f)

# Create a mapping of original paths to optimized paths
path_mapping = {}
for item in report['optimized']:
    original = item['original']
    optimized = item['optimized']
    # Remove 'public/' prefix for web paths
    web_original = original.replace('public/', '/')
    web_optimized = optimized.replace('public/images/', '/')
    path_mapping[web_original] = web_optimized

def update_file(file_path):
    """Update image references in a file"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        updated = False
        for orig_path, new_path in path_mapping.items():
            if orig_path in content:
                content = content.replace(orig_path, new_path)
                updated = True
        
        if updated:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"✅ Updated: {file_path}")
            return True
        return False
    except Exception as e:
        print(f"⚠️  Error processing {file_path}: {e}")
        return False

def main():
    print("🔄 Updating image references...")
    
    # File extensions to check for image references
    extensions = {'.tsx', '.ts', '.js', '.jsx', '.json', '.md', '.mdx'}
    
    updated_count = 0
    
    # Search through the src directory
    for root, _, files in os.walk('src'):
        for file in files:
            if any(file.endswith(ext) for ext in extensions):
                file_path = Path(root) / file
                if update_file(file_path):
                    updated_count += 1
    
    # Check root directory files
    for file in os.listdir('.'):
        if any(file.endswith(ext) for ext in extensions):
            if update_file(file):
                updated_count += 1
    
    print(f"\n✅ Updated {updated_count} files with new image references")
    print("\n📝 Note: Please manually verify the updated files to ensure all references are correct.")

if __name__ == "__main__":
    main()
