import { Database, Product, Order, BlogPost, Testimonial } from './database';

let cache: {
  products: Product[] | null;
  lastUpdated: number | null;
  cacheDuration: number;
} = {
  products: null,
  lastUpdated: null,
  cacheDuration: 5 * 60 * 1000, // 5 minutes cache
};

type ProductFilter = {
  category?: string;
  featured?: boolean;
  available?: boolean;
  search?: string;
};

type PaginationOptions = {
  page?: number;
  pageSize?: number;
};

export function getCachedProducts(filter: ProductFilter = {}, pagination: PaginationOptions = {}) {
  const now = Date.now();
  
  // Invalidate cache if expired
  if (!cache.products || !cache.lastUpdated || (now - cache.lastUpdated > cache.cacheDuration)) {
    const { readDatabase } = require('./database');
    const data = readDatabase();
    cache.products = data.products;
    cache.lastUpdated = now;
  }

  let filtered = [...(cache.products || [])];

  // Apply filters
  if (filter.category) {
    filtered = filtered.filter(p => p.category === filter.category);
  }
  
  if (filter.featured !== undefined) {
    filtered = filtered.filter(p => p.featured === filter.featured);
  }
  
  if (filter.available !== undefined) {
    filtered = filter.available 
      ? filtered.filter(p => p.available && p.stock > 0)
      : filtered.filter(p => !p.available || p.stock <= 0);
  }
  
  if (filter.search) {
    const searchLower = filter.search.toLowerCase();
    filtered = filtered.filter(
      p => p.name.toLowerCase().includes(searchLower) ||
           p.description.toLowerCase().includes(searchLower) ||
           p.category.toLowerCase().includes(searchLower)
    );
  }

  // Apply pagination
  const page = Math.max(1, pagination.page || 1);
  const pageSize = Math.min(50, Math.max(1, pagination.pageSize || 10));
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const paginated = filtered.slice(start, end);

  return {
    data: paginated,
    pagination: {
      page,
      pageSize,
      totalItems: filtered.length,
      totalPages: Math.ceil(filtered.length / pageSize),
    },
  };
}

export function getProductBySlug(slug: string): Product | undefined {
  const { readDatabase } = require('./database');
  const data = readDatabase();
  return data.products.find((p: Product) => p.slug === slug);
}

export function getFeaturedProducts(limit = 4): Product[] {
  const { readDatabase } = require('./database');
  const data = readDatabase();
  return data.products
    .filter((p: Product) => p.featured && p.available)
    .slice(0, limit);
}

export function getCategories(): string[] {
  const { readDatabase } = require('./database');
  const data = readDatabase();
  return Array.from(new Set(data.products.map((p: Product) => p.category)));
}

// Invalidate cache when products are updated
export function invalidateProductsCache() {
  cache.products = null;
  cache.lastUpdated = null;
}
