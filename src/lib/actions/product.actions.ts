'use server';

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  priceNaira: number;
  category: string;
  image: string;
  images: string[];
  featured: boolean;
  available: boolean;
  stock: number;
  basePriceNaira: number;
  createdAt: string;
}

export async function getProducts(): Promise<Product[]> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/products`);
    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }
    
    const responseData = await response.json();
    return Array.isArray(responseData) ? responseData : responseData.data || [];
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
}
