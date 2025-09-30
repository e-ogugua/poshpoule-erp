export interface Product {
  id: string;
  name: string;
  description?: string;
  priceNaira: number;
  category: string;
  stock: number;
  images: string[];
  featured: boolean;
  available: boolean;
  createdAt: string;
  updatedAt: string;
  slug?: string;
  // Add any other fields that might be present in your product data
}

export type CartItem = Product & {
  quantity: number;
};

export interface CartState {
  items: CartItem[];
  total: number;
  itemCount: number;
}
