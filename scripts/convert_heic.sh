#!/bin/bash

# Create a directory for converted images if it doesn't exist
mkdir -p public/images/converted

echo "🔍 Looking for HEIC files..."

# Find and convert HEIC files to WebP
find public -type f \( -iname "*.heic" -o -iname "*.heif" \) | while read -r file; do
    # Get the base filename without extension
    base_filename=$(basename "$file" | cut -f 1 -d '.')
    # Create output path
    output_path="public/images/converted/${base_filename}.webp"
    
    echo "🔄 Converting: $file"
    
    # Convert using macOS's sips and cwebp
    if sips -s format jpeg "$file" --out /tmp/temp.jpg && \
       cwebp -q 85 /tmp/temp.jpg -o "$output_path" 2>/dev/null; then
        echo "✅ Converted: $output_path"
        # Remove the temporary file
        rm -f /tmp/temp.jpg
    else
        echo "❌ Failed to convert: $file"
    fi
done

echo "✨ HEIC conversion complete!"
echo "Converted files are in: public/images/converted/"
