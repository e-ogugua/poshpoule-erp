// Test script to isolate product detail page issues
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function testProductPage() {
  console.log('🧪 Testing product detail page component...');
  
  try {
    // Test the exact query used in the component
    const product = await prisma.product.findUnique({
      where: { slug: 'premium-mentorship' }
    });
    
    if (!product) {
      console.log('❌ Product not found');
      // List available products
      const products = await prisma.product.findMany({ select: { slug: true, name: true } });
      console.log('📋 Available products:');
      products.forEach(p => console.log('  -', p.slug, ':', p.name));
      return;
    }
    
    console.log('✅ Product found:', product.name);
    
    // Check all fields that the component uses
    const componentFields = [
      'id', 'name', 'slug', 'description', 'priceNaira', 'stock', 
      'image', 'category', 'featured', 'available', 'createdAt'
    ];
    
    const missingFields = componentFields.filter(field => !(field in product));
    if (missingFields.length > 0) {
      console.log('❌ Missing fields:', missingFields);
    } else {
      console.log('✅ All component fields present');
    }
    
    // Test the component logic
    if (product.stock > 0) {
      console.log('✅ Stock check passed');
    } else {
      console.log('❌ Stock check would fail');
    }
    
    if (product.featured) {
      console.log('✅ Featured badge would show');
    }
    
    console.log('🎯 Component would render successfully');
    
  } catch (error) {
    console.error('❌ Product page test failed:', error.message);
    console.error('❌ Error stack:', error.stack);
  } finally {
    await prisma.$disconnect();
  }
}

testProductPage();
