import { Metadata } from 'next';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ProductCard } from '@/components/ProductCard';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { debugLogger, safeApiCall } from '@/utils/debug';

export const metadata: Metadata = {
  title: 'Products - PoshPOULE Farms Ltd',
  description: 'Browse our premium organic poultry products, fresh eggs, and farm-fresh produce.',
};

async function fetchProducts() {
  debugLogger.info('Fetching products from API');
  
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/products`, {
      next: { revalidate: 300 }, // Cache for 5 minutes
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const products = await response.json();
    debugLogger.info('Products fetched successfully', { count: products.length });
    return products;
  } catch (error) {
    debugLogger.error('Failed to fetch products', error);
    throw error;
  }
}

export default async function ProductsPage() {
  debugLogger.info('ProductsPage rendering');
  
  let products = [];
  let error = null;
  
  try {
    products = await fetchProducts();
    debugLogger.info('ProductsPage loaded successfully', { productCount: products.length });
  } catch (err) {
    error = err instanceof Error ? err.message : 'Failed to load products';
    debugLogger.error('ProductsPage failed to load', err);
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen flex flex-col">
        <Header />

        <main className="flex-1">
          {/* Hero Section */}
          <section className="relative bg-gradient-to-br from-primary/5 via-white to-emerald-50 py-16 md:py-24">
            <div className="container mx-auto px-4">
              <div className="text-center max-w-3xl mx-auto">
                <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-heading-bold text-primary mb-6">
                  Our Premium Products
                </h1>
                <p className="text-body text-lg md:text-xl text-neutral-700 mb-8 leading-relaxed">
                  Discover our range of organic, farm-fresh products grown with care and sustainability in mind.
                  From free-range eggs to seasonal vegetables, every item tells a story of quality and tradition.
                </p>
              </div>
            </div>
          </section>

          {/* Products Grid */}
          <section className="py-16 md:py-24">
            <div className="container mx-auto px-4">
              {error ? (
                <div className="text-center py-12">
                  <div className="text-red-500 text-6xl mb-4">⚠️</div>
                  <h2 className="font-heading text-2xl font-heading-bold text-neutral-900 mb-2">
                    Failed to Load Products
                  </h2>
                  <p className="text-body text-neutral-600 mb-6">
                    {error}
                  </p>
                  <button
                    onClick={() => window.location.reload()}
                    className="btn-primary"
                  >
                    Try Again
                  </button>
                  {process.env.NODE_ENV === 'development' && (
                    <details className="mt-6 text-left max-w-md mx-auto">
                      <summary className="cursor-pointer text-sm text-neutral-500">
                        Debug Info
                      </summary>
                      <pre className="mt-2 p-3 bg-neutral-100 rounded text-xs">
                        {debugLogger.getLogs().slice(-5).map(log => 
                          `${log.timestamp} [${log.level}] ${log.message}`
                        ).join('\n')}
                      </pre>
                    </details>
                  )}
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {products.map((product: any) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                  
                  {products.length === 0 && (
                    <div className="text-center py-12">
                      <p className="text-neutral-600">No products available at the moment.</p>
                    </div>
                  )}
                </>
              )}
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </ErrorBoundary>
  );
}
