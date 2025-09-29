import ProductsClient from './ProductsClient';
import { getProducts } from '@/lib/actions/product.actions';

export interface Product {
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

interface ProductsPageProps {
  searchParams: {
    category?: string;
  };
}

export default async function ProductsPage({
  searchParams,
}: ProductsPageProps) {
  try {
    // Fetch products on the server side
    const products = await getProducts();
    
    // Calculate unique categories
    const uniqueCategories = Array.from(
      new Set(products.map((p: Product) => p.category).filter(Boolean))
    ) as string[];

    return (
      <ProductsClient 
        searchParams={searchParams}
        products={products}
        categories={uniqueCategories}
        isLoading={false}
        error={null}
      />
    );
  } catch (error) {
    console.error('Error in ProductsPage:', error);
    return (
      <ProductsClient 
        searchParams={{}}
        products={[]}
        categories={[]}
        isLoading={false}
        error="Failed to load products. Please try again later."
      />
    );
  }
}
