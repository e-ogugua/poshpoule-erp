import { NextRequest, NextResponse } from 'next/server';
import { readDatabase, writeDatabase, Product, getNextId } from '@/lib/database';
import { getCachedProducts, getProductBySlug, invalidateProductsCache } from '@/lib/db-utils';

export async function GET(request: NextRequest) {
  try {
    // Get query parameters
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') || undefined;
    const featured = searchParams.get('featured');
    const available = searchParams.get('available');
    const search = searchParams.get('search') || undefined;
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = Math.min(50, parseInt(searchParams.get('pageSize') || '10'));

    // Get filtered and paginated products
    const { data, pagination } = getCachedProducts(
      {
        category,
        featured: featured ? featured === 'true' : undefined,
        available: available ? available === 'true' : undefined,
        search,
      },
      { page, pageSize }
    );

    // Return only necessary fields
    const products = data.map((product: Product) => ({
      id: product.id,
      name: product.name,
      slug: product.slug,
      description: product.description,
      priceNaira: product.priceNaira,
      category: product.category,
      stock: product.stock,
      image: product.image,
      featured: product.featured,
      available: product.available,
    }));

    // Set cache control headers (5 minutes client cache, 1 minute CDN cache)
    const response = NextResponse.json({
      data: products,
      pagination,
    });

    response.headers.set('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=60');
    return response;
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500, headers: { 'Cache-Control': 'no-store' } }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = readDatabase();
    const productData = await request.json();

    // Validate required fields
    const requiredFields = ['name', 'slug', 'description', 'priceNaira', 'category', 'stock'];
    for (const field of requiredFields) {
      if (!productData[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400, headers: { 'Cache-Control': 'no-store' } }
        );
      }
    }

    // Check for existing product with same slug
    const slugExists = data.products.some((p: Product) => p.slug === productData.slug);
    if (slugExists) {
      return NextResponse.json(
        { error: 'A product with this slug already exists' },
        { status: 400, headers: { 'Cache-Control': 'no-store' } }
      );
    }

    // Create new product
    const newProduct: Product = {
      id: getNextId(data.products),
      ...productData,
      basePriceNaira: productData.priceNaira,
      image: productData.image || '/images/farm/farmFreshEggs.PNG',
      images: productData.images || [],
      featured: productData.featured || false,
      available: productData.available !== false,
      createdAt: new Date().toISOString(),
    };

    // Add to database
    data.products.push(newProduct);
    writeDatabase(data);
    
    // Invalidate cache
    invalidateProductsCache();

    // Return only necessary fields
    const { basePriceNaira, ...responseProduct } = newProduct;
    
    const response = NextResponse.json(responseProduct, { status: 201 });
    response.headers.set('Cache-Control', 'no-store');
    return response;
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500, headers: { 'Cache-Control': 'no-store' } }
    );
  }
}
