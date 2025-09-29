import { notFound } from 'next/navigation';
import { Metadata, ResolvingMetadata } from 'next';
import { Suspense, cache } from 'react';
import ProductClient, { Product } from './ProductClient';

// Imported Product interface from ProductClient

// Loading spinner component
const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
  </div>
);

interface ProductPageProps {
  params: {
    slug: string;
  };
}

// Cache the getProductBySlug call to prevent multiple fetches
const getProduct = cache(async (slug: string) => {
  const { getProductBySlug } = await import('@/lib/db-utils');
  return getProductBySlug(slug);
});

// This is a server component that fetches the initial data
export default async function ProductPage({ params }: { params: { slug: string } }) {
  // Fetch the initial product data on the server side with caching
  const product = await getProduct(params.slug);
  
  if (!product) {
    notFound();
  }

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <ProductClient slug={params.slug} initialProduct={product} />
    </Suspense>
  );
}

// Metadata generation remains the same
export async function generateMetadata(
  { params }: { params: { slug: string } },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { getProductBySlug } = await import('@/lib/db-utils');
  const product = await getProductBySlug(params.slug);
  
  if (!product) {
    return {
      title: 'Product Not Found',
    };
  }

  return {
    title: `${product.name} | PoshPOULE Farms`,
    description: product.description,
    openGraph: {
      title: `${product.name} | PoshPOULE Farms`,
      description: product.description,
      images: product.images && product.images.length > 0 ? [product.images[0]] : [],
    },
  };
}

export async function generateStaticParams() {
  // Return an empty array and rely on dynamic rendering
  return [];
}
