const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '../db/data.json');

// Read the existing database
const db = require(dbPath);

// Ensure all required collections exist with default values
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
  ...db
};

// Save the fixed database
fs.writeFileSync(dbPath, JSON.stringify(defaultDb, null, 2));
console.log('Database structure has been fixed.');
