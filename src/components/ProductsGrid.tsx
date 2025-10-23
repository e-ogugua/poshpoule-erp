import ProductCard from '@/components/ProductCard';
import { Product } from '@/types/product';

interface ProductsGridProps {
  products: Product[];
}

export default function ProductsGrid({ products }: ProductsGridProps) {
  if (products.length === 0) {
    return (
      <div className="text-center py-12 sm:py-16">
        <div className="max-w-md mx-auto">
          <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <svg className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <h3 className="text-lg sm:text-xl font-medium text-gray-900 mb-2">No products found</h3>
          <p className="text-gray-500 mb-6 text-sm sm:text-base">
            We&apos;re working hard to bring you fresh, organic products. Check back soon or contact us for custom orders.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="/contact"
              className="btn-primary text-sm"
            >
              Contact Us for Custom Orders
            </a>
            <a
              href="/preorder"
              className="btn-secondary text-sm"
            >
              Pre-Order Available Products
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid-responsive">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
