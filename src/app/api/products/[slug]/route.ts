import { NextRequest, NextResponse } from 'next/server';
import { getProductBySlug } from '@/lib/db-utils';

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const product = getProductBySlug(params.slug);

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404, headers: { 'Cache-Control': 'no-store' } }
      );
    }

    // Return only necessary fields
    const { basePriceNaira, ...responseProduct } = product;

    // Set cache control headers (5 minutes client cache, 1 minute CDN cache)
    const response = NextResponse.json(responseProduct);
    response.headers.set('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=60');
    return response;
  } catch (error) {
    console.error(`Error fetching product ${params.slug}:`, error);
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500, headers: { 'Cache-Control': 'no-store' } }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { readDatabase, writeDatabase, getNextId } = await import('@/lib/database');
    const data = readDatabase();
    const productData = await request.json();

    const productIndex = data.products.findIndex((p: any) => p.slug === params.slug);
    if (productIndex === -1) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404, headers: { 'Cache-Control': 'no-store' } }
      );
    }

    // Update product
    const updatedProduct = {
      ...data.products[productIndex],
      ...productData,
      updatedAt: new Date().toISOString(),
    };

    data.products[productIndex] = updatedProduct;
    writeDatabase(data);

    // Invalidate cache
    const { invalidateProductsCache } = await import('@/lib/db-utils');
    invalidateProductsCache();

    // Return only necessary fields
    const { basePriceNaira, ...responseProduct } = updatedProduct;

    const response = NextResponse.json(responseProduct);
    response.headers.set('Cache-Control', 'no-store');
    return response;
  } catch (error) {
    console.error(`Error updating product ${params.slug}:`, error);
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500, headers: { 'Cache-Control': 'no-store' } }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { readDatabase, writeDatabase } = await import('@/lib/database');
    const data = readDatabase();
    
    const initialLength = data.products.length;
    data.products = data.products.filter((p: any) => p.slug !== params.slug);
    
    if (data.products.length === initialLength) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404, headers: { 'Cache-Control': 'no-store' } }
      );
    }

    writeDatabase(data);

    // Invalidate cache
    const { invalidateProductsCache } = await import('@/lib/db-utils');
    invalidateProductsCache();

    const response = NextResponse.json({ success: true });
    response.headers.set('Cache-Control', 'no-store');
    return response;
  } catch (error) {
    console.error(`Error deleting product ${params.slug}:`, error);
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500, headers: { 'Cache-Control': 'no-store' } }
    );
  }
}
