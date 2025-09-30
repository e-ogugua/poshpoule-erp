import { readDatabase } from '@/lib/database-server';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import type { Metadata } from 'next';
import ProductClient from '@/components/ProductClient';

type Product = {
  slug: string;
  name: string;
  description: string;
  priceNaira: number;
  originalPrice?: number;
  discountPercentage?: number;
  image: string;
};

// ✅ Fix: params & searchParams are now Promises in Next.js 15
type PageParams = Promise<{ slug: string }>;
type PageSearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

// Generate metadata for the page
export async function generateMetadata(
  { params }: { params: PageParams }
): Promise<Metadata> {
  const { slug } = await params;
  const data = readDatabase();

  const product = data.products.find(
    (p: any): p is Product =>
      p.slug === slug &&
      p.name &&
      p.description &&
      p.priceNaira !== undefined &&
      p.image
  );

  if (!product) {
    console.error('Product not found or invalid data for slug:', slug);
    notFound();
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

// ✅ Main Page component
export default async function Page({
  params,
  searchParams,
}: {
  params: PageParams;
  searchParams: PageSearchParams;
}) {
  const { slug } = await params;
  // We don't actually need to await searchParams here unless you're using them
  await searchParams;

  const data = readDatabase();
  const product = data.products.find(
    (p: any): p is Product =>
      p.slug === slug &&
      p.name &&
      p.description &&
      p.priceNaira !== undefined &&
      p.image
  );

  if (!product) {
    console.error('Product not found or invalid data for slug:', slug);
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

export const dynamic = 'force-dynamic';
