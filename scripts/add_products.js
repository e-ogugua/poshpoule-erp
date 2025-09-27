const fs = require('fs');
const path = require('path');

// Read the current data
const dataPath = path.join(__dirname, '../db/data.json');
const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

// New products to add
const newProducts = [
  {
    id: 'food-stall-export',
    name: 'Food Stall Export Link & TasteBox Subscription',
    slug: 'food-stall-export',
    description: 'PoshPOULE connects authentic Nigerian food stalls and ingredient suppliers with buyers abroad. We offer curated TasteBox™ export packs and direct sourcing for food stall owners, making it easy to bring the true Nigerian experience overseas. Ideal for UK-based students or entrepreneurs who want a trusted export partner back home.',
    priceNaira: 75000,
    basePriceNaira: 75000,
    category: 'Export & Distribution',
    stock: 50,
    image: '/images/farm/VegetableHavest.jpg',
    images: [
      '/images/farm/VegetableHavest.jpg',
      '/images/crops/vegetableGarden.jpg',
      '/images/crops/vegetablesAndCornHarvest.JPG',
      '/images/farm/IfYouAteTodayThankAFarmer.jpg'
    ],
    featured: true,
    available: true,
    features: [
      'Curated TasteBox™ export packs',
      'Direct sourcing from trusted suppliers',
      'Door-to-door delivery',
      'Custom export solutions'
    ]
  },
  {
    id: 'workshop-training',
    name: 'Workshop & Training (3 Months)',
    slug: 'workshop-training',
    description: 'A hands-on 3-month program designed to introduce participants to modern organic farming, agribusiness fundamentals, and practical farm management. Perfect for beginners looking to start their journey in agriculture.',
    priceNaira: 45000,
    basePriceNaira: 45000,
    category: 'Training & Services',
    stock: 25,
    image: '/images/farm/GingerCropHarvest.JPG',
    images: [
      '/images/farm/GingerCropHarvest.JPG',
      '/images/farm/CornFarmBackyard.JPG',
      '/images/farm/LocallyGrownFieldWork2.jpg',
      '/images/farm/UguBucketFarming.JPG'
    ],
    featured: true,
    available: true,
    features: [
      '3 months of hands-on training',
      'Organic farming techniques',
      'Business fundamentals',
      'Field visits and practical sessions'
    ]
  },
  {
    id: 'premium-mentorship',
    name: 'Premium Mentorship Program (1 Year)',
    slug: 'premium-mentorship',
    description: 'An intensive one-year mentorship program providing personalized guidance, strategy sessions, and real-world business insights to help participants scale their agricultural ventures with confidence.',
    priceNaira: 160000,
    basePriceNaira: 160000,
    category: 'Training & Services',
    stock: 15,
    image: '/images/farm/Testimonal5.jpg',
    images: [
      '/images/farm/Testimonal5.jpg',
      '/images/farm/Testimoniaal3.jpg',
      '/images/farm/HowIeatWatermelonPlanningPoshPOULE.JPG',
      '/images/farm/GardenBeds.jpg'
    ],
    featured: true,
    available: true,
    features: [
      '1-year personalized mentorship',
      'Business strategy development',
      'Market access support',
      'Networking opportunities'
    ]
  }
];

// Check if products already exist
const existingProductIds = new Set(data.products.map(p => p.id));
const productsToAdd = newProducts.filter(p => !existingProductIds.has(p.id));

if (productsToAdd.length > 0) {
  // Add new products
  data.products = [...data.products, ...productsToAdd];
  
  // Update the data file
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
  console.log(`Successfully added ${productsToAdd.length} new products:`);
  productsToAdd.forEach(p => console.log(`- ${p.name}`));
  
  // Update sitemap (if exists)
  console.log('\nPlease update your sitemap.xml to include the new product pages.');
} else {
  console.log('All products already exist in the database.');
}
