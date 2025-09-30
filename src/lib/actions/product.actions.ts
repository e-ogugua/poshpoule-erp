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
    const url = new URL('/api/products', process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000');
    console.log('Fetching products from:', url.toString());
    
    const response = await fetch(url.toString(), {
      cache: 'no-store', // Ensure we get fresh data
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Failed to fetch products:', {
        status: response.status,
        statusText: response.statusText,
        error: errorText,
      });
      throw new Error(`Failed to fetch products: ${response.status} ${response.statusText}`);
    }
    
    const responseData = await response.json();
    
    // Log the response for debugging
    console.log('Products API response:', {
      hasData: !!responseData,
      dataType: Array.isArray(responseData) ? 'array' : typeof responseData,
      dataKeys: responseData ? Object.keys(responseData) : [],
      itemsCount: responseData?.data?.length || 0,
    });
    
    // Handle different possible response formats
    if (Array.isArray(responseData)) {
      return responseData as Product[];
    } else if (responseData && Array.isArray(responseData.data)) {
      return responseData.data as Product[];
    } else if (responseData && Array.isArray(responseData.products)) {
      return responseData.products as Product[];
    }
    
    console.warn('Unexpected API response format:', responseData);
    return [];
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
}
