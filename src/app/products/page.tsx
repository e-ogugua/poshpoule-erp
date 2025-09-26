import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { readDatabase } from '@/lib/database-server';
import Link from 'next/link';
import Image from 'next/image';

function ProductCard({ product }: { product: any }) {
  return (
    <div className="card p-6">
      <div className="relative w-full h-48 mb-4">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover rounded-lg"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      <h3 className="font-heading text-xl font-heading-semibold mb-2">{product.name}</h3>
      <p className="text-body mb-4 line-clamp-2">{product.description}</p>
      <div className="flex items-center justify-between mb-4">
        <span className="font-bold text-primary text-lg">₦{product.priceNaira.toLocaleString()}</span>
        <span className="text-sm text-neutral-500 capitalize">{product.category}</span>
      </div>
      <div className="flex space-x-2">
        <Link
          href={`/products/${product.slug}`}
          className="flex-1 btn-primary text-center"
        >
          View Details
        </Link>
        <Link
          href={`/preorder?product=${product.id}`}
          className="flex-1 btn-outline text-center"
        >
          Pre-Order
        </Link>
      </div>
    </div>
  );
}
function CategoryFilter({ categories, selectedCategory }: { categories: string[], selectedCategory: string | null }) {
  return (
    <div className="mb-8">
      <h3 className="font-heading text-lg font-heading-semibold mb-4">Filter by Category</h3>
      <div className="flex flex-wrap gap-2">
        <Link
          href="/products"
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            !selectedCategory
              ? 'bg-primary text-white'
              : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
          }`}
        >
          All Products
        </Link>
        {categories.map((category) => (
          <Link
            key={category}
            href={`/products?category=${encodeURIComponent(category)}`}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              selectedCategory === category
                ? 'bg-primary text-white'
                : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
            }`}
          >
            {category}
          </Link>
        ))}
      </div>
    </div>
  );
}

export default function ProductsPage({
  searchParams,
}: {
  searchParams: { category?: string }
}) {
  const data = readDatabase();
  const selectedCategory = searchParams.category || null;

  const categories = Array.from(new Set(data.products.map(p => p.category)));
  const filteredProducts = selectedCategory
    ? data.products.filter(p => p.category === selectedCategory)
    : data.products;

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
          <div className="relative container mx-auto px-4 text-center py-16">
            <h1 className="font-heading text-4xl md:text-5xl font-heading-bold mb-4">
              Our Products
            </h1>
            <p className="text-xl opacity-90">
              Fresh, organic, and sustainably grown produce from our farm
            </p>
          </div>
        </div>

        {/* Products Section */}
        <div className="py-16">
          <div className="container mx-auto px-4">
            <CategoryFilter categories={categories} selectedCategory={selectedCategory} />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <p className="text-neutral-500 text-lg">No products found in this category.</p>
                <Link href="/products" className="btn-primary mt-4">
                  View All Products
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-neutral-50 py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="font-heading text-3xl font-heading-bold mb-4">
              Ready to Place Your Order?
            </h2>
            <p className="text-body text-lg mb-8 max-w-2xl mx-auto">
              Experience the freshness and quality of our organic products.
              Order now and taste the difference that sustainable farming makes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
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
