import fs from 'fs';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'db', 'data.json');

export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  role: 'admin' | 'staff';
  createdAt: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  priceNaira: number;
  basePriceNaira: number;
  category: string;
  stock: number;
  image: string;
  images: string[];
  featured: boolean;
  available: boolean;
  createdAt: string;
}

export interface OrderProduct {
  productId: string;
  name: string;
  quantity: number;
  priceNaira: number;
}

export interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  products: OrderProduct[];
  totalAmount: number;
  currency: string;
  status: 'new' | 'confirmed' | 'ready' | 'completed' | 'cancelled';
  orderType: 'pickup' | 'delivery';
  scheduledDate: string;
  deliveryAddress?: string;
  notes?: string;
  createdAt: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  content: string;
  rating: number;
  image: string;
  featured: boolean;
  createdAt: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image: string;
  author: string;
  published: boolean;
  createdAt: string;
}

export interface GalleryImage {
  id: string;
  title: string;
  image: string;
  category: string;
}

export interface TeamMember {
  id: string;
  name: string;
  position: string;
  bio: string;
  expertise: string[];
  yearsExperience: number;
  image: string;
  featured: boolean;
  createdAt: string;
}

export interface WhyChooseUsItem {
  icon: string;
  title: string;
  description: string;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  createdAt: string;
}

export interface PickupSlot {
  id: string;
  date: string;
  time: string;
  available: boolean;
  maxOrders: number;
}

export interface Database {
  users: User[];
  products: Product[];
  orders: Order[];
  testimonials: Testimonial[];
  blogPosts: BlogPost[];
  galleryImages: GalleryImage[];
  teamMembers: TeamMember[];
  pickupSlots: PickupSlot[];
  leads: Lead[];
  whyChooseUs: WhyChooseUsItem[];
  currencyRates: Record<string, number>;
  settings: {
    siteName: string;
    slogan: string;
    altSlogan?: string;
    mission?: string;
    story?: string;
    values?: string[];
    yearFounded?: number;
    primaryColor: string;
    accentColor?: string;
    highlightColor?: string;
    neutralColor?: string;
    neutralDarkColor?: string;
    contactEmail: string;
    contactPhone: string;
    address: string;
    businessHours?: Record<string, string>;
    socialMedia?: Record<string, string>;
  };
}

let cachedData: Database | null = null;

export function readDatabase(): Database {
  if (cachedData) {
    return cachedData;
  }

  try {
    const data = fs.readFileSync(DB_PATH, 'utf8');
    cachedData = JSON.parse(data);
    if (!cachedData) {
      throw new Error('Database data is null or undefined');
    }
    return cachedData;
  } catch (error) {
    console.error('Error reading database:', error);
    throw new Error('Failed to read database');
  }
}

export function writeDatabase(data: Database): void {
  try {
    // Create backup
    const backupPath = `${DB_PATH}.backup`;
    if (fs.existsSync(DB_PATH)) {
      fs.copyFileSync(DB_PATH, backupPath);
    }

    // Write new data
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
    cachedData = data;
  } catch (error) {
    console.error('Error writing database:', error);
    throw new Error('Failed to write database');
  }
}

export function getNextId(collection: any[]): string {
  const maxId = Math.max(...collection.map(item => parseInt(item.id.split('-')[1] || '0')));
  return `${collection[0]?.id.split('-')[0] || 'item'}-${maxId + 1}`;
}
