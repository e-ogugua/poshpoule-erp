import { NextRequest, NextResponse } from 'next/server';
import { readDatabase, writeDatabase, Product, getNextId } from '@/lib/database';

export async function GET() {
  try {
    // Use Promise.resolve to handle synchronous function in async context
    const data = await Promise.resolve(readDatabase());
    return NextResponse.json(data.products);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await Promise.resolve(readDatabase());
    const productData = await request.json();

    // Validate required fields
    const requiredFields = ['name', 'slug', 'description', 'priceNaira', 'category', 'stock'];
    for (const field of requiredFields) {
      if (!productData[field]) {
        return NextResponse.json({ error: `Missing required field: ${field}` }, { status: 400 });
      }
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

    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}
