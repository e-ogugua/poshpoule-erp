// Database setup and testing script
const { PrismaClient } = require('@prisma/client');
const fs = require('fs');

async function setupDatabase() {
  const prisma = new PrismaClient();
  
  try {
    console.log('🔧 Setting up database...');
    
    // Check if products exist
    const productCount = await prisma.product.count();
    console.log('📊 Current products in database:', productCount);
    
    if (productCount === 0) {
      console.log('📦 No products found - database might need seeding');
      
      // Try to seed from the old file-based database
      const dbPath = 'db/data.json';
      if (fs.existsSync(dbPath)) {
        const oldData = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
        console.log('📋 Found old database with', oldData.products?.length || 0, 'products');
        
        // The seeding should happen via the seed script
        console.log('💡 Run: npx tsx prisma/seed-products.ts');
      }
    } else {
      console.log('✅ Database has products');
      
      // Test product lookup
      const firstProduct = await prisma.product.findFirst();
      if (firstProduct) {
        console.log('✅ Sample product:', firstProduct.name);
        console.log('✅ Price:', firstProduct.priceNaira);
        console.log('✅ Slug:', firstProduct.slug);
      }
    }
    
    // Test order creation (to ensure schema is working)
    try {
      const testOrder = await prisma.order.create({
        data: {
          customerName: 'Test User',
          customerEmail: 'test@example.com',
          customerPhone: '08012345678',
          orderType: 'pickup',
          scheduledDate: '2024-12-25',
          totalAmount: 1000,
          status: 'new',
          products: {
            create: [{
              productId: 'test-product',
              name: 'Test Product',
              quantity: 1,
              priceNaira: 1000
            }]
          }
        },
        include: { products: true }
      });
      console.log('✅ Test order created successfully');
      
      // Clean up test order
      await prisma.orderProduct.deleteMany({ where: { orderId: testOrder.id } });
      await prisma.order.delete({ where: { id: testOrder.id } });
      console.log('✅ Test order cleaned up');
      
    } catch (orderError) {
      console.error('❌ Order creation test failed:', orderError.message);
    }
    
  } catch (error) {
    console.error('❌ Database setup failed:', error.message);
    console.error('❌ Full error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

setupDatabase();
