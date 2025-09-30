import { readDatabase } from '@/lib/database-server';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import ProductClient, { Product } from '@/components/ProductClient';

interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
  searchParams: Promise<{
    [key: string]: string | string[] | undefined;
  }>;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const data = readDatabase();
  const product = data.products.find((p: Product) => p.slug === slug);

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
  const { slug } = await params;
  const data = readDatabase();
  const product = data.products.find((p: Product) => p.slug === slug);

  if (!product) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <div className="relative aspect-square w-full overflow-hidden rounded-lg">
            <img
              src={product.image}
              alt={product.name}
              className="object-cover w-full h-full"
              style={{ objectFit: "cover" }}
            />
          </div>
        </div>
        
        <ProductClient product={product} />
      </div>
    </div>
  );
}
