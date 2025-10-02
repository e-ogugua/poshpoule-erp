// Comprehensive script to fix product detail page issues
const { PrismaClient } = require('@prisma/client');
const fs = require('fs');

async function fixProductPages() {
  console.log('🔧 Comprehensive product page fix...');
  
  try {
    // 1. Verify database connection and content
    const prisma = new PrismaClient();
    
    const productCount = await prisma.product.count();
    console.log('📊 Products in database:', productCount);
    
    if (productCount > 0) {
      const sampleProduct = await prisma.product.findFirst();
      console.log('✅ Sample product exists:', sampleProduct.name);
      
      // 2. Test the exact query used in product detail page
      const testProduct = await prisma.product.findUnique({
        where: { slug: 'premium-mentorship' }
      });
      
      if (testProduct) {
        console.log('✅ Product detail query works');
        console.log('✅ Product name:', testProduct.name);
        console.log('✅ Product price:', testProduct.priceNaira);
        console.log('✅ Product featured:', testProduct.featured);
        
        // 3. Check all fields that the component needs
        const requiredFields = ['id', 'name', 'slug', 'description', 'priceNaira', 'stock', 'image', 'category', 'featured', 'available'];
        const missingFields = requiredFields.filter(field => !(field in testProduct));
        
        if (missingFields.length === 0) {
          console.log('✅ All required fields present');
        } else {
          console.log('❌ Missing fields:', missingFields);
        }
      } else {
        console.log('❌ Product not found by slug');
      }
    } else {
      console.log('❌ No products in database');
    }
    
    await prisma.$disconnect();
    
    // 4. Check if there are any obvious file issues
    const componentPath = 'src/app/products/[slug]/page.tsx';
    if (fs.existsSync(componentPath)) {
      const componentContent = fs.readFileSync(componentPath, 'utf8');
      const hasAsyncParams = componentContent.includes('await params');
      const hasPrismaImport = componentContent.includes('PrismaClient');
      const hasErrorHandling = componentContent.includes('catch (error)');
      
      console.log('📄 Component checks:');
      console.log('  - Async params:', hasAsyncParams ? '✅' : '❌');
      console.log('  - Prisma import:', hasPrismaImport ? '✅' : '❌');
      console.log('  - Error handling:', hasErrorHandling ? '✅' : '❌');
    }
    
    console.log('🎯 Fix recommendations:');
    console.log('1. Ensure DATABASE_URL is correctly set');
    console.log('2. Regenerate Prisma client: npx prisma generate');
    console.log('3. Apply database schema: npx prisma db push');
    console.log('4. Restart development server');
    console.log('5. Check Vercel deployment logs for production issues');
    
  } catch (error) {
    console.error('❌ Fix script failed:', error.message);
  }
}

fixProductPages();
