import { PrismaClient } from '@prisma/client';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import PriceDisplay from '@/components/PriceDisplay';
import { Product } from '@/types/product';

const prisma = new PrismaClient();

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

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);

  try {
    const product = await prisma.product.findUnique({
      where: { slug }
    });

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
            url: product.image || '/images/logo.png',
            width: 800,
            height: 600,
            alt: product.name,
          },
        ],
      },
    };
  } catch (error) {
    return {};
  } finally {
    clearTimeout(timeout);
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);

  try {
    const product = await prisma.product.findUnique({
      where: { slug }
    });

    if (!product) {
      notFound();
    }

    return (
      <div className="min-h-screen bg-white">
        {/* Breadcrumb */}
        <div className="bg-gray-50 py-4">
          <div className="container mx-auto px-4">
            <nav className="flex text-sm text-gray-600">
              <Link href="/" className="hover:text-primary">Home</Link>
              <span className="mx-2">/</span>
              <Link href="/products" className="hover:text-primary">Products</Link>
              <span className="mx-2">/</span>
              <span className="text-gray-900">{product.name}</span>
            </nav>
          </div>
        </div>

        {/* Product Details */}
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Image */}
            <div className="space-y-4">
              <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-gray-100">
                <Image
                  src={product.image || '/images/logo.png'}
                  alt={product.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            </div>
            {/* Right Column - Details */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
                <div className="flex items-center gap-4 mb-4">
                  <PriceDisplay priceNaira={product.priceNaira} />
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    product.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                  </span>
                </div>
                <div className="flex items-center gap-2 mb-6">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                    {product.category}
                  </span>
                  {product.featured && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                      Featured
                    </span>
                  )}
                </div>
              </div>

              <div className="prose prose-gray max-w-none">
                <p className="text-gray-700 leading-relaxed">{product.description}</p>
              </div>

              {/* Call to Action Buttons */}
              <div className="space-y-3">
                <Link
                  href={`/preorder?product=${product.id}`}
                  className={`w-full block text-center py-3 px-6 rounded-lg font-medium transition-colors ${
                    product.stock > 0
                      ? 'bg-primary text-white hover:bg-primary-dark'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                  onClick={(e) => product.stock === 0 && e.preventDefault()}
                >
                  Pre-Order Now
                </Link>
                <Link
                  href="/contact"
                  className="w-full block text-center py-3 px-6 rounded-lg font-medium border border-primary text-primary hover:bg-primary hover:text-white transition-colors"
                >
                  Contact Us for More Information
                </Link>
              </div>

              {/* Additional Info */}
              <div className="border-t pt-6">
                <h3 className="font-semibold text-gray-900 mb-3">Product Information</h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Category:</span>
                    <Link href={`/products?category=${encodeURIComponent(product.category)}`} className="text-primary hover:underline">
                      {product.category}
                    </Link>
                  </div>
                  <div className="flex justify-between">
                    <span>Availability:</span>
                    <span className={product.stock > 0 ? 'text-green-600' : 'text-red-600'}>
                      {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>SKU:</span>
                    <span>{product.slug}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error fetching product:', error);
    notFound();
  } finally {
    clearTimeout(timeout);
  }
}
