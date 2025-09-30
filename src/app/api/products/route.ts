import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

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

    // Get filtered and paginated products from Prisma
    const where: any = {};
    if (category) where.category = category;
    if (featured) where.isFeatured = featured === 'true';
    if (available) where.stock = { gt: 0 };
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { category: { contains: search, mode: 'insensitive' } }
      ];
    }

    const skip = (page - 1) * pageSize;
    const products = await prisma.product.findMany({
      where,
      skip,
      take: pageSize,
      orderBy: { createdAt: 'desc' }
    });

    const totalItems = await prisma.product.count({ where });
    const totalPages = Math.ceil(totalItems / pageSize);

    // Return only necessary fields
    const responseProducts = products.map((product) => ({
      id: product.id,
      name: product.name,
      slug: product.slug,
      description: product.description,
      priceNaira: product.price,
      category: product.category,
      stock: product.stock,
      image: product.image,
      featured: product.isFeatured,
      available: product.stock > 0,
    }));

    // Set cache control headers (5 minutes client cache, 1 minute CDN cache)
    const response = NextResponse.json({
      data: responseProducts,
      pagination: {
        page,
        pageSize,
        totalItems,
        totalPages,
      },
    });

    response.headers.set('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=60');
    return response;
  } catch (error) {
    console.error('Error in /api/products:', error);

    // Check if it's a database error
    const errorMessage = error instanceof Error 
      ? error.message 
      : 'An unknown error occurred';

    return NextResponse.json(
      { 
        error: 'Failed to fetch products',
        details: errorMessage,
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const productData = await request.json();

    // Validate required fields
    const requiredFields = ['name', 'slug', 'description', 'price', 'category', 'stock'];
    for (const field of requiredFields) {
      if (!productData[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400, headers: { 'Cache-Control': 'no-store' } }
        );
      }
    }

    // Check for existing product with same slug
    const slugExists = await prisma.product.findUnique({
      where: { slug: productData.slug }
    });
    if (slugExists) {
      return NextResponse.json(
        { error: 'A product with this slug already exists' },
        { status: 400, headers: { 'Cache-Control': 'no-store' } }
      );
    }

    // Create new product
    const newProduct = await prisma.product.create({
      data: {
        name: productData.name,
        slug: productData.slug,
        description: productData.description,
        price: productData.price,
        category: productData.category,
        stock: productData.stock,
        image: productData.image || '/optimized/images/products/eggs/organicFarmEggs.webp',
        isFeatured: productData.featured || false,
      },
    });

    // Return only necessary fields
    const response = NextResponse.json(newProduct, { status: 201 });
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
