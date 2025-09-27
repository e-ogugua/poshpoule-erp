#!/bin/bash
set -e

# Create optimized images directory if it doesn't exist
mkdir -p public/optimized/images/products/eggs/

# Optimize images using ImageMagick
echo "Optimizing images..."
for img in "freshegg1.JPG" "freshEgg2.JPG" "FreshEgg3.JPG" "OrganicEggs.JPG" "organicFarmEggs.JPG"; do
    if [ -f "public/images/products/eggs/$img" ]; then
        echo "Optimizing $img..."
        convert "public/images/products/eggs/$img" \
            -resize 1200x900\> \
            -quality 85 \
            -strip \
            "public/optimized/images/products/eggs/${img%.*}.webp"
    else
        echo "Warning: $img not found, skipping..."
    fi
done

# Update blog post with optimized image paths
echo "Updating blog post..."
jq '(.blogPosts[] | select(.id == "blog-1") | .content) |= 
    gsub("/images/products/eggs/freshegg1.JPG"; "/optimized/images/products/eggs/freshegg1.webp") |
    (.blogPosts[] | select(.id == "blog-1") | .content) |=
    gsub("/images/products/eggs/freshEgg2.JPG"; "/optimized/images/products/eggs/freshEgg2.webp")' \
    db/data.json > db/data_optimized.json && mv db/data_optimized.json db/data.json

echo "Optimization complete!"
