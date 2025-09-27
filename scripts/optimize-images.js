const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');
const sharp = require('sharp');

// Configuration
const IMAGE_DIR = 'public/images';
const OUTPUT_DIR = 'public/optimized-images';
const QUALITY = 85;
const WIDTHS = [320, 640, 1024, 1600];

// Create output directory if it doesn't exist
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Get all image files
function getImageFiles(dir) {
  const files = [];
  const items = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const item of items) {
    const fullPath = path.join(dir, item.name);
    if (item.isDirectory()) {
      files.push(...getImageFiles(fullPath));
    } else if (/\.(jpe?g|png|webp)$/i.test(item.name)) {
      files.push(fullPath);
    }
  }
  
  return files;
}

// Optimize a single image
async function optimizeImage(filePath) {
  try {
    const ext = path.extname(filePath).toLowerCase();
    const fileName = path.basename(filePath, ext);
    const relativePath = path.relative(IMAGE_DIR, path.dirname(filePath));
    const outputDir = path.join(OUTPUT_DIR, relativePath);
    
    // Create output directory if it doesn't exist
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    const image = sharp(filePath);
    const metadata = await image.metadata();
    
    // Generate responsive images
    for (const width of WIDTHS) {
      if (width < metadata.width) {
        const outputFile = path.join(outputDir, `${fileName}-${width}w.webp`);
        
        await image
          .resize(width)
          .webp({ quality: QUALITY })
          .toFile(outputFile);
          
        console.log(`✅ Created: ${path.relative(process.cwd(), outputFile)}`);
      }
    }
    
    // Create original size in webp
    const outputFile = path.join(outputDir, `${fileName}.webp`);
    await image
      .webp({ quality: QUALITY })
      .toFile(outputFile);
      
    console.log(`✅ Created: ${path.relative(process.cwd(), outputFile)}`);
    
    return {
      original: filePath,
      optimized: outputFile,
      originalSize: fs.statSync(filePath).size,
      optimizedSize: fs.statSync(outputFile).size
    };
  } catch (error) {
    console.error(`❌ Error optimizing ${filePath}:`, error.message);
    return null;
  }
}

// Main function
async function main() {
  console.log('🚀 Starting image optimization...');
  
  // Install sharp if not already installed
  try {
    require.resolve('sharp');
  } catch (e) {
    console.log('Installing sharp...');
    execSync('npm install sharp --save-dev', { stdio: 'inherit' });
  }
  
  const imageFiles = getImageFiles(IMAGE_DIR);
  console.log(`Found ${imageFiles.length} images to optimize`);
  
  const results = [];
  
  for (const file of imageFiles) {
    const result = await optimizeImage(file);
    if (result) {
      results.push(result);
    }
  }
  
  // Generate a report
  const totalOriginalSize = results.reduce((sum, r) => sum + r.originalSize, 0);
  const totalOptimizedSize = results.reduce((sum, r) => sum + r.optimizedSize, 0);
  const totalSaved = totalOriginalSize - totalOptimizedSize;
  
  const report = {
    timestamp: new Date().toISOString(),
    totalImages: results.length,
    totalOriginalSize,
    totalOptimizedSize,
    totalSaved,
    percentageSaved: ((totalSaved / totalOriginalSize) * 100).toFixed(2) + '%',
    optimizedImages: results.map(r => ({
      original: r.original,
      optimized: r.optimized,
      originalSize: r.originalSize,
      optimizedSize: r.optimizedSize,
      saved: r.originalSize - r.optimizedSize
    }))
  };
  
  fs.writeFileSync('image-optimization-report.json', JSON.stringify(report, null, 2));
  
  console.log('\n📊 Optimization Report:');
  console.log(`Total images: ${results.length}`);
  console.log(`Original size: ${(totalOriginalSize / 1024 / 1024).toFixed(2)} MB`);
  console.log(`Optimized size: ${(totalOptimizedSize / 1024 / 1024).toFixed(2)} MB`);
  console.log(`Total saved: ${(totalSaved / 1024 / 1024).toFixed(2)} MB (${report.percentageSaved})`);
  console.log(`\n📝 Report saved to: image-optimization-report.json`);
  console.log('✨ Image optimization complete!');
}

main().catch(console.error);
