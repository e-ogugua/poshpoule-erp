// Client-side database utilities - no Node.js imports
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
  pickupSlots: PickupSlot[];
  currencyRates: Record<string, number>;
  settings: {
    siteName: string;
    slogan: string;
    primaryColor: string;
    secondaryColor: string;
    contactEmail: string;
    contactPhone: string;
    address: string;
  };
  leads?: any[];
}

// Client-side function to get next ID
export function getNextId(collection: any[]): string {
  const maxId = Math.max(...collection.map(item => parseInt(item.id.split('-')[1] || '0')));
  return `${collection[0]?.id.split('-')[0] || 'item'}-${maxId + 1}`;
}
