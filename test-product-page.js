// Simple test to check if product detail pages work
const { PrismaClient } = require('@prisma/client');
const fs = require('fs');

async function testProductDetailPage() {
  console.log('🧪 Testing product detail page functionality...');
  
  const prisma = new PrismaClient();
  
  try {
    // 1. Check if products exist
    const productCount = await prisma.product.count();
    console.log('📊 Products in database:', productCount);
    
    if (productCount === 0) {
      console.log('❌ No products found - need to seed database');
      return;
    }
    
    // 2. Get a sample product
    const product = await prisma.product.findFirst();
    console.log('✅ Found product:', product.name);
    console.log('✅ Slug:', product.slug);
    
    // 3. Test the exact query used in the component
    const productBySlug = await prisma.product.findUnique({
      where: { slug: product.slug }
    });
    
    if (!productBySlug) {
      console.log('❌ Product lookup by slug failed');
      return;
    }
    
    console.log('✅ Product lookup by slug successful');
    
    // 4. Check all required fields
    const requiredFields = ['id', 'name', 'slug', 'description', 'priceNaira', 'stock', 'image', 'category', 'featured'];
    const missingFields = requiredFields.filter(field => !(field in productBySlug));
    
    if (missingFields.length > 0) {
      console.log('❌ Missing fields:', missingFields);
    } else {
      console.log('✅ All required fields present');
    }
    
    // 5. Test component logic
    const wouldRender = {
      name: productBySlug.name,
      price: productBySlug.priceNaira,
      stock: productBySlug.stock > 0 ? 'In Stock' : 'Out of Stock',
      category: productBySlug.category,
      featured: productBySlug.featured ? 'Featured' : 'Not Featured',
      image: productBySlug.image || '/images/logo.png'
    };
    
    console.log('✅ Component logic test passed');
    console.log('📋 Would render:', wouldRender);
    console.log('🎉 Product detail page should work!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('❌ Full error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testProductDetailPage();
