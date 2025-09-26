import { NextRequest, NextResponse } from 'next/server';
import { readDatabase, writeDatabase, Order, getNextId } from '@/lib/database';

export async function GET() {
  try {
    const data = readDatabase();
    return NextResponse.json(data.orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = readDatabase();
    const orderData = await request.json();

    // Validate required fields
    const requiredFields = ['customerName', 'customerEmail', 'customerPhone', 'products', 'totalAmount'];
    for (const field of requiredFields) {
      if (!orderData[field]) {
        return NextResponse.json({ error: `Missing required field: ${field}` }, { status: 400 });
      }
    }

    // Create new order
    const newOrder: Order = {
      id: getNextId(data.orders),
      ...orderData,
      status: 'new',
      createdAt: new Date().toISOString(),
    };

    // Add to database
    data.orders.push(newOrder);
    writeDatabase(data);

    return NextResponse.json(newOrder, { status: 201 });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}
