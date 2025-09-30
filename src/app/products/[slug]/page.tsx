import { readDatabase } from '@/lib/database-server';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Metadata } from 'next';
import ProductClient from '@/components/ProductClient';

interface ProductPageProps {
  params: {
    slug: string;
  };
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = params;
  const data = readDatabase();
  const product = data.products.find((p: any) => p.slug === slug);

  if (!product) {
    return {};
  }

  return {
    title: `${product.name} | PoshPOULE Farms`,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: [
        {
          url: product.image,
          width: 800,
          height: 600,
          alt: product.name,
        },
      ],
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = params;
  const data = readDatabase();
  const product = data.products.find((p: any) => p.slug === slug);

  if (!product) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <div className="relative aspect-square w-full overflow-hidden rounded-lg">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          </div>
        </div>
        
        <ProductClient product={product} />
      </div>
    </div>
  );
}

// Ensure the page is always dynamically rendered
export const dynamic = 'force-dynamic';
