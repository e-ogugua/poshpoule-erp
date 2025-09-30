"use client";

interface Product {
  id: string;
  name: string;
  priceNaira: number;
  images?: string[];
  // Add other product properties as needed
}

interface ProductsPageClientProps {
  products: Product[];
}

export default function ProductsPageClient({ products }: ProductsPageClientProps) {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Our Products</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product.id} className="border rounded-lg p-4">
            {product.images?.[0] && (
              <div className="aspect-square relative mb-4">
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover rounded"
                />
              </div>
            )}
            <h2 className="font-semibold">{product.name}</h2>
            <p className="text-primary">₦{product.priceNaira?.toLocaleString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
