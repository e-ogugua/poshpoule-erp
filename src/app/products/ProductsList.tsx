'use client';

import type { Product } from '@/lib/database';

export default function ProductsList({ products }: { products: Product[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <div key={product.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
          <h2 className="text-lg font-semibold">{product.name}</h2>
          <p className="text-primary font-medium">
            ₦{product.priceNaira?.toLocaleString()}
          </p>
          {product.description && (
            <p className="text-gray-600 mt-2 text-sm">
              {product.description.length > 100
                ? `${product.description.substring(0, 100)}...`
                : product.description}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
