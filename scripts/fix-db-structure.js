const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '../db/data.json');

// Read the existing database
let db = {};
try {
  const data = fs.readFileSync(dbPath, 'utf8');
  db = JSON.parse(data);
} catch (err) {
  console.error('Error reading database:', err);
  process.exit(1);
}

// Define default collections with empty arrays if they don't exist
const defaultDb = {
  users: [],
  products: [],
  orders: [],
  testimonials: [],
  blogPosts: [],
  galleryImages: [],
  teamMembers: [],
  pickupSlots: [],
  leads: [],
  whyChooseUs: [],
  currencyRates: {},
  settings: {},
  ...db // Spread existing data to preserve it
};

// Ensure all arrays exist
const arrayCollections = [
  'users', 'products', 'orders', 'testimonials', 'blogPosts',
  'galleryImages', 'teamMembers', 'pickupSlots', 'leads', 'whyChooseUs'
];

arrayCollections.forEach(collection => {
  if (!Array.isArray(defaultDb[collection])) {
    defaultDb[collection] = [];
  }
});

// Ensure objects exist
if (typeof defaultDb.currencyRates !== 'object') {
  defaultDb.currencyRates = {};
}

if (typeof defaultDb.settings !== 'object') {
  defaultDb.settings = {};
}

// Save the fixed database
try {
  fs.writeFileSync(dbPath, JSON.stringify(defaultDb, null, 2));
  console.log('Database structure has been fixed successfully!');
} catch (err) {
  console.error('Error writing to database:', err);
  process.exit(1);
}
