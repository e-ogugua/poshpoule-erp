import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import Link from 'next/link';
import Image from 'next/image';
import ProductsGrid from '@/components/ProductsGrid';
import LoadingSkeleton from '@/components/LoadingSkeleton';

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  priceNaira: number;
  category: string;
  stock: number;
  image: string;
  featured: boolean;
  available: boolean;
  createdAt: string;
}

async function getProducts(category?: string) {
  try {
    const url = category
      ? `${process.env.NEXTAUTH_URL}/api/products?category=${encodeURIComponent(category)}`
      : `${process.env.NEXTAUTH_URL}/api/products`;

    const response = await fetch(url, {
      next: { revalidate: 0 } // Force fresh data, no cache
    });

    if (!response.ok) {
      throw new Error(`Products API failed: ${response.status}`);
    }

    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

// Category filter component
function CategoryFilter({ categories, selectedCategory }: { categories: string[], selectedCategory: string | null }) {
  return (
    <div className="mb-6 sm:mb-8">
      <h3 className="font-heading text-lg sm:text-xl font-heading-semibold mb-4">Filter by Category</h3>
      <div className="flex flex-wrap gap-2 sm:gap-3">
        <Link
          href="/products"
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors touch-target-sm ${
            !selectedCategory
              ? 'bg-primary text-white shadow-sm'
              : 'bg-white text-neutral-600 hover:bg-neutral-100 border border-neutral-200'
          }`}
        >
          All Products
        </Link>
        {categories.map((category) => (
          <Link
            key={category}
            href={`/products?category=${encodeURIComponent(category)}`}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors touch-target-sm ${
              selectedCategory === category
                ? 'bg-primary text-white shadow-sm'
                : 'bg-white text-neutral-600 hover:bg-neutral-100 border border-neutral-200'
            }`}
          >
            {category}
          </Link>
        ))}
      </div>
    </div>
  );
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>
}) {
  const searchParamsResolved = await searchParams;
  const selectedCategory = searchParamsResolved?.category || null;

  // Fetch products from API
  const products = await getProducts(selectedCategory || undefined);

  const categories = Array.from(new Set(products.map((p: Product) => p.category))) as string[];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <div className="relative bg-gradient-to-br from-primary to-green-700 text-white overflow-hidden">
          <div className="absolute inset-0">
            <Image
              src="/images/farm/farmFreshEggs.PNG"
              alt="PoshPOULE Farm Products"
              fill
              className="object-cover opacity-20"
              sizes="100vw"
            />
          </div>
          <div className="relative container mx-auto container-spacing text-center section-spacing">
            <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-heading-bold mb-4 sm:mb-6">
              Our Products
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl opacity-90 max-w-3xl mx-auto leading-relaxed">
              Fresh, organic, and sustainably grown produce from our farm
            </p>
          </div>
        </div>

        {/* Products Section */}
        <div className="section-spacing">
          <div className="container mx-auto container-spacing">
            <CategoryFilter categories={categories} selectedCategory={selectedCategory} />

            <ProductsGrid products={products} />
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-neutral-50 section-spacing">
          <div className="container mx-auto container-spacing text-center">
            <h2 className="font-heading text-2xl sm:text-3xl font-heading-bold mb-4 sm:mb-6">
              Ready to Place Your Order?
            </h2>
            <p className="text-body text-base sm:text-lg mb-6 sm:mb-8 max-w-2xl mx-auto leading-relaxed">
              Experience the freshness and quality of our organic products.
              Order now and taste the difference that sustainable farming makes.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <Link href="/preorder" className="btn-primary">
                Start Your Order
              </Link>
              <Link href="/contact" className="btn-outline">
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
