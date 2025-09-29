import { notFound } from 'next/navigation';
import { Metadata, ResolvingMetadata } from 'next';
import dynamic from 'next/dynamic';

// Dynamically import the client component with no SSR
const ProductDetails = dynamic(
  () => import('./ProductDetails'),
  { 
    ssr: false,
    loading: () => (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }
);

// Generate metadata for the page
export async function generateMetadata(
  { params }: { params: { slug: string } },
  parent: ResolvingMetadata
): Promise<Metadata> {
  // Read route params
  const slug = params.slug;
  
  // Fetch product data
  const product = await fetch(`http://localhost:3000/api/products/${slug}`, {
    next: { revalidate: 60 }, // Revalidate every minute
  }).then(res => res.ok ? res.json() : null);

  if (!product) {
    return {
      title: 'Product Not Found',
      description: 'The requested product could not be found.',
    };
  }

  return {
    title: `${product.name} | Posh POULE Farms`,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: [
        {
          url: product.image,
          width: 1200,
          height: 630,
          alt: product.name,
        },
      ],
    },
  };
}

// This function generates the static paths at build time
export async function generateStaticParams() {
  // In a real app, you might fetch all product slugs here
  // For now, we'll return an empty array and rely on dynamic rendering
  return [];
}

interface PageProps {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function ProductPage({ params }: PageProps) {
  // Fetch the product data on the server
  const product = await fetch(`http://localhost:3000/api/products/${params.slug}`, {
    next: { revalidate: 60 }, // Revalidate every minute
  }).then(res => res.ok ? res.json() : null);

  if (!product) {
    notFound();
  }

  return <ProductDetails slug={params.slug} initialProduct={product} />;
}
