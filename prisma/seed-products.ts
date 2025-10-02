import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const products = [
  {
    name: 'Fresh Organic Eggs',
    slug: 'fresh-organic-eggs',
    description: 'Farm-fresh organic eggs from free-range chickens, rich in nutrients and naturally delicious.',
    price: 2500,
    category: 'Food',
    stock: 100,
    image: '/images/products/eggs/organicFarmEggs.webp',
    isFeatured: true
  },
  {
    name: 'Broiler & Meat Chickens',
    slug: 'broiler-meat-chickens',
    description: 'Premium quality broiler chickens raised with organic feed for the best taste and nutrition.',
    price: 7000,
    category: 'Meat',
    stock: 50,
    image: '/images/products/OrganicEggs.JPG',
    isFeatured: true
  },
  {
    name: 'Organic Vegetables Pack',
    slug: 'organic-vegetables-pack',
    description: 'Mixed seasonal organic vegetables grown without pesticides or chemicals.',
    price: 4500,
    category: 'Vegetables',
    stock: 30,
    image: '/images/products/OrganicVegetablePack.jpg',
    isFeatured: false
  },
  {
    name: 'Organic Fruits Pack',
    slug: 'organic-fruits-pack',
    description: 'Fresh seasonal fruits picked at peak ripeness from our organic orchards.',
    price: 5000,
    category: 'Fruits',
    stock: 25,
    image: '/images/products/fruitsSalad.jpg',
    isFeatured: false
  },
  {
    name: 'Crop Box Subscription (Monthly)',
    slug: 'crop-box-subscription',
    description: 'Monthly delivery of seasonal organic produce, curated for maximum freshness and variety.',
    price: 25000,
    category: 'Subscription',
    stock: 20,
    image: '/images/products/organicFoodSales.jpg',
    isFeatured: true
  },
  {
    name: 'Premium Organic Snack Pack',
    slug: 'premium-organic-snack-pack',
    description: 'Healthy, organic snacks made from our farm produce - perfect for on-the-go nutrition.',
    price: 8000,
    category: 'Snacks',
    stock: 40,
    image: '/images/products/OrganicShopShelve.jpg',
    isFeatured: false
  },
  {
    name: 'Food Stall Export Link & TasteBox Subscription',
    slug: 'food-stall-export-tastebox',
    description: 'Connect with our export network and receive monthly taste boxes of premium farm products.',
    price: 15000,
    category: 'Export',
    stock: 15,
    image: '/images/products/WhyOrganic.png',
    isFeatured: false
  },
  {
    name: 'Workshop & Training (3 Months)',
    slug: 'workshop-training-3-months',
    description: 'Comprehensive 3-month program covering organic farming techniques and sustainable agriculture.',
    price: 100000,
    category: 'Training',
    stock: 10,
    image: '/images/products/Organicbusiness-growth.png',
    isFeatured: true
  },
  {
    name: 'Premium Mentorship Program (1 Year)',
    slug: 'premium-mentorship-program',
    description: 'One-year personalized mentorship program for aspiring farmers and agricultural entrepreneurs.',
    price: 250000,
    category: 'Mentorship',
    stock: 5,
    image: '/images/products/mangoTreesPathwayOrchards.jpg',
    isFeatured: true
  },
];

async function main() {
  console.log('🌱 Starting product seeding...');

  for (const product of products) {
    try {
      const existingProduct = await prisma.product.findUnique({
        where: { slug: product.slug }
      });

      if (existingProduct) {
        await prisma.product.update({
          where: { slug: product.slug },
          data: product,
        });
        console.log(`✅ Updated: ${product.name}`);
      } else {
        await prisma.product.create({
          data: product,
        });
        console.log(`✅ Created: ${product.name}`);
      }
    } catch (error) {
      console.error(`❌ Failed to process ${product.name}:`, error);
    }
  }

  console.log('🎉 Product seeding completed!');
}

main()
  .then(() => console.log('✅ All products seeded successfully'))
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
