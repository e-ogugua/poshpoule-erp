const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, '../db/data.json');

// Read the current database
const db = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));

// New blog posts to add
const newBlogPosts = [
  {
    "id": "blog-8",
    "title": "The Golden Grain: Exploring the Journey of Corn from Seed to Harvest",
    "slug": "golden-grain-corn-journey",
    "excerpt": "Discover the fascinating journey of corn cultivation at PoshPOULE Farms and its vital role in our organic farming practices.",
    "content": `## The Golden Grain: Exploring the Journey of Corn from Seed to Harvest

At PoshPOULE Farms, corn is more than just a crop—it's a cornerstone of our sustainable agriculture practices. Join us as we explore the complete lifecycle of this golden grain, from planting the first seed to harvesting the mature ears.

### Our Corn Varieties
We cultivate several heirloom and hybrid varieties, each selected for its unique qualities:
- **Golden Bantam**: An heirloom variety known for its rich, sweet flavor
- **Pioneer P1197**: A high-yielding hybrid with excellent disease resistance
- **Country Gentleman**: A shoepeg variety perfect for canning and freezing
- **Glass Gem**: A stunning ornamental variety with multi-colored kernels

### The Growth Journey
1. **Planting (Week 1-2)**
   - Direct seeding when soil reaches 60°F (15.5°C)
   - Spacing: 9-12 inches apart in rows 30 inches apart
   - Depth: 1.5-2 inches

2. **Germination (Week 2-3)**
   - First sprouts emerge, showing the characteristic grass-like leaves
   - Critical weed control period begins

3. **Vegetative Growth (Week 3-8)**
   - Rapid leaf and stalk development
   - Regular monitoring for pests and diseases
   - Side-dressing with organic compost

4. **Tasseling and Silking (Week 8-10)**
   - Male flowers (tassels) release pollen
   - Silks emerge to catch pollen for kernel development
   - Critical watering period begins

5. **Maturation (Week 10-14)**
   - Kernels progress from milky to dough stage
   - Starch content increases as ears mature
   - Regular testing for optimal harvest time

### Sustainable Practices
- **Crop Rotation**: Corn follows legumes to benefit from nitrogen fixation
- **Companion Planting**: Grown with beans and squash in the Three Sisters tradition
- **Natural Pest Control**: Beneficial insects and organic treatments
- **Soil Health**: Annual soil testing and organic amendments

### Harvest and Beyond
- Hand-harvested at peak ripeness
- Immediate cooling to preserve sweetness
- Multiple uses: fresh eating, drying, grinding, and livestock feed

Join us for our annual Corn Festival to see the harvest in action and taste the difference of truly fresh, organic corn!`,
    "image": "/images/farm/corn-field.jpg",
    "author": "PoshPOULE Team",
    "published": true,
    "createdAt": "2025-08-15T00:00:00.000Z",
    "category": "Crop Cultivation"
  },
  {
    "id": "blog-9",
    "title": "Raised Bed Gardening: Maximizing Yields in Minimal Space",
    "slug": "raised-bed-gardening",
    "excerpt": "Learn how raised bed gardening can transform your backyard into a productive, sustainable food source with our comprehensive guide.",
    "content": `# Raised Bed Gardening: Maximizing Yields in Minimal Space

Raised bed gardening is revolutionizing how we grow food in both urban and rural settings. At PoshPOULE Farms, we've perfected the art of intensive, sustainable gardening using raised beds. Here's how you can too!

## Why Choose Raised Beds?

### 1. Superior Soil Quality
- Complete control over soil composition
- Better drainage and aeration
- Warmer soil for extended growing seasons

### 2. Space Efficiency
- Grow up to 4 times more in the same space
- Intensive planting techniques
- No wasted space for walking paths

### 3. Easier Maintenance
- Reduced weeding
- Better pest control
- Accessible gardening (less bending and kneeling)

## Creating Your Raised Bed System

### Step 1: Design and Layout
- Ideal width: 3-4 feet (reachable from both sides)
- Length: As space allows
- Depth: Minimum 12 inches (deeper for root crops)
- Orientation: North-south for maximum sun exposure

### Step 2: Building Materials
- **Wood**: Cedar or redwood (naturally rot-resistant)
- **Stone/Brick**: Permanent and attractive
- **Galvanized Metal**: Long-lasting and modern look
- **Concrete Blocks**: Inexpensive and durable

### Step 3: Soil Mix Formula
- 60% topsoil
- 30% compost
- 10% organic matter (peat moss, coconut coir, or leaf mold)
- Amendments based on soil test results

## Integrating Livestock for Sustainability

### Chicken Tractor System
- Mobile coops that follow garden beds
- Chickens till, fertilize, and control pests
- Rotate between beds to prevent overgrazing

### Compost Production
- Kitchen scraps + chicken manure = black gold
- 3-bin compost system for continuous production
- Vermicomposting with red wigglers

### Manure Tea
- Steep aged manure in water
- Nutrient-rich liquid fertilizer
- Apply during critical growth stages

## Our Favorite Crops for Raised Beds

### High-Value Vegetables
- Leafy greens (kale, spinach, lettuce)
- Root crops (carrots, radishes, beets)
- Alliums (onions, garlic, leeks)

### Space-Saving Varieties
- Bush beans instead of pole beans
- Dwarf fruit trees
- Vertical-growing crops (peas, cucumbers, tomatoes)

## Seasonal Planning

### Spring
- Cool-weather crops (peas, lettuce, radishes)
- Start warm-weather seedlings indoors

### Summer
- Heat-loving plants (tomatoes, peppers, eggplants)
- Succession planting for continuous harvest

### Fall
- Second planting of cool-weather crops
- Garlic planting for next year

### Winter
- Cold frames and row covers
- Planning next year's garden

## Visit Our Demonstration Garden
Come see our raised bed systems in action! We offer workshops and hands-on training throughout the growing season.`,
    "image": "/images/farm/raised-beds.jpg",
    "author": "PoshPOULE Team",
    "published": true,
    "createdAt": "2025-07-22T00:00:00.000Z",
    "category": "Gardening Techniques"
  },
  {
    "id": "blog-10",
    "title": "Container Gardening: Growing Abundance in Buckets and Pots",
    "slug": "container-gardening",
    "excerpt": "No yard? No problem! Discover how to create a thriving edible garden in containers, perfect for urban spaces and small areas.",
    "content": `# Container Gardening: Growing Abundance in Buckets and Pots

Urban living doesn't mean you can't grow your own food. Container gardening brings the farm to your balcony, patio, or windowsill. Here's how to get started!

## Why Container Gardening?
- Perfect for small spaces
- Control over growing conditions
- Mobility to chase the sun
- Fewer weed and pest problems

## Getting Started

### Container Selection
- **Size Matters**: Bigger is usually better
- **Drainage is Key**: Must have drainage holes
- **Material Choices**:
  - Plastic: Lightweight and affordable
  - Terracotta: Breathable but dries quickly
  - Fabric: Excellent aeration for roots
  - Wood: Natural look, insulates roots

### Soil Mix
- Don't use garden soil
- Light, well-draining mix
- Add compost for nutrients
- Consider water-retaining crystals for hot climates

## Best Crops for Containers

### Vegetables
- Cherry tomatoes
- Peppers
- Lettuce and greens
- Radishes and carrots (deep containers)
- Bush beans

### Herbs
- Basil
- Thyme
- Rosemary
- Mint (contain to prevent spreading)
- Chives

### Fruits
- Strawberries
- Dwarf citrus trees
- Blueberries (acidic soil mix)
- Figs (in large containers)

## Care and Maintenance

### Watering
- Check daily in hot weather
- Water until it runs out the bottom
- Consider self-watering containers

### Fertilizing
- Liquid fertilizer every 2-4 weeks
- Organic options: fish emulsion, compost tea
- Slow-release organic fertilizers

### Pest Control
- Handpick pests
- Neem oil for common problems
- Companion planting in containers

## Creative Container Ideas
- Repurposed buckets
- Hanging baskets
- Vertical planters
- Window boxes
- Grow bags

## Seasonal Tips
- Rotate crops
- Refresh soil annually
- Move plants as seasons change
- Overwinter tender perennials indoors

Join our urban gardening workshop to see these techniques in action!`,
    "image": "/images/garden/container-garden.jpg",
    "author": "PoshPOULE Team",
    "published": true,
    "createdAt": "2025-06-10T00:00:00.000Z",
    "category": "Urban Farming"
  },
  {
    "id": "blog-11",
    "title": "Why Organic? The Benefits of Choosing Chemical-Free Produce",
    "slug": "why-organic",
    "excerpt": "Discover the compelling reasons to choose organic produce for your health, your family, and the planet.",
    "content": `# Why Organic? The Benefits of Choosing Chemical-Free Produce

At PoshPOULE Farms, we're passionate about organic agriculture. But what does "organic" really mean, and why does it matter? Let's explore the many benefits of choosing organic produce.

## Health Benefits

### 1. More Nutritious Food
- Higher levels of antioxidants
- More vitamins and minerals
- Better flavor and freshness

### 2. No Harmful Chemicals
- No synthetic pesticides
- No chemical fertilizers
- No GMOs
- No artificial preservatives

### 3. Better for Children
- Lower pesticide exposure
- Reduced risk of developmental issues
- Healthier eating habits

## Environmental Impact

### 1. Soil Health
- Builds organic matter
- Prevents erosion
- Supports beneficial microorganisms

### 2. Water Conservation
- Reduces water pollution
- Improves water retention
- Protects aquatic life

### 3. Biodiversity
- Supports pollinators
- Protects wildlife
- Maintains ecosystem balance

## Our Organic Practices

### Regenerative Agriculture
- Cover cropping
- Crop rotation
- No-till methods
- Compost and green manure

### Natural Pest Control
- Beneficial insects
- Companion planting
- Physical barriers
- Organic pest deterrents

### Animal Welfare
- Free-range practices
- Natural diets
- Humane treatment
- No antibiotics or hormones

## Making the Switch to Organic

### Start Small
- The "Dirty Dozen" (most contaminated produce)
- Staples you eat daily
- Foods with edible skins

### Shop Smart
- Local farmers' markets
- CSAs (Community Supported Agriculture)
- Look for certifications
- Grow your own

### Budget-Friendly Tips
- Buy in season
- Preserve the harvest
- Join a buying club
- Focus on value, not just price

Visit our farm to see organic practices in action and taste the difference for yourself!`,
    "image": "/images/farm/organic-produce.jpg",
    "author": "PoshPOULE Team",
    "published": true,
    "createdAt": "2025-05-05T00:00:00.000Z",
    "category": "Organic Living"
  },
  {
    "id": "blog-12",
    "title": "Rooted in Tradition: The Heritage Crops of West Africa",
    "slug": "heritage-crops-west-africa",
    "excerpt": "Celebrating the cultural and nutritional heritage of traditional West African crops and their role in sustainable agriculture.",
    "content": `# Rooted in Tradition: The Heritage Crops of West Africa

At PoshPOULE Farms, we honor the agricultural wisdom of our ancestors by preserving and promoting traditional West African crops. These nutrient-dense staples have sustained communities for generations and hold the key to food security in a changing climate.

## Cassava: The Resilient Staple

### Cultural Significance
- Staple food for over 500 million people
- Deep roots in West African cuisine
- Used in dishes like gari, fufu, and tapioca

### Growing Practices
- Drought-resistant and low-maintenance
- Thrives in poor soils
- 8-24 month growing cycle
- Propagated from stem cuttings

### Nutritional Benefits
- High in carbohydrates
- Gluten-free
- Good source of vitamin C and manganese
- Contains resistant starch (a prebiotic)

## The Mighty Yam

### Varieties We Grow
- White Yam (Dioscorea rotundata)
- Water Yam (Dioscorea alata)
- Bitter Yam (Dioscorea dumetorum)

### Traditional Uses
- Pounded yam (iyan)
- Yam porridge
- Roasted and fried preparations
- Medicinal uses in traditional healing

## Cocoyam: The Underrated Superfood

### Types in Our Fields
- Taro (Colocasia esculenta)
- Tannia (Xanthosoma sagittifolium)

### Culinary Versatility
- Boiled, fried, or roasted
- Thickens soups and stews
- Leaves used like spinach (kontomire)

### Health Benefits
- Easily digestible starch
- Rich in fiber
- Good source of vitamins A and C
- Contains beneficial antioxidants

## Akidi: The Protein-Powered Bean

### Traditional Importance
- Indigenous to West Africa
- Drought-resistant legume
- Important protein source

### Culinary Uses
- Cooked with palm oil and spices
- Added to soups and stews
- Ground into flour

### Nutritional Profile
- 20-25% protein
- Rich in B-vitamins
- Good source of iron and zinc
- High in dietary fiber

## Ginger and Turmeric: The Healing Rhizomes

### Growing Conditions
- Thrives in warm, humid climates
- Requires well-drained soil
- 8-10 month growing season

### Health Benefits
- Anti-inflammatory properties
- Aids digestion
- Boosts immunity
- Rich in antioxidants

## Preserving Agricultural Heritage

### Seed Saving
- Maintaining genetic diversity
- Preserving heirloom varieties
- Community seed banks

### Sustainable Practices
- Intercropping systems
- Organic fertilization
- Water conservation techniques

### Cultural Education
- Farm tours and workshops
- Cooking demonstrations
- School programs

## Visit Our Heritage Garden
Experience these traditional crops firsthand in our demonstration garden, where we showcase sustainable growing methods and share recipes that have been passed down through generations.`,
    "image": "/images/farm/heritage-crops.jpg",
    "author": "PoshPOULE Team",
    "published": true,
    "createdAt": "2025-04-15T00:00:00.000Z",
    "category": "Traditional Crops"
  }
];

// Add new blog posts to the database
db.blogPosts = [...newBlogPosts, ...db.blogPosts];

// Save the updated database
fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));

console.log('Successfully added new blog posts to the database!');
console.log(`Total blog posts now: ${db.blogPosts.length}`);
