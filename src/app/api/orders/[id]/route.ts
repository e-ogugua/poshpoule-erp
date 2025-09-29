import { NextRequest, NextResponse } from 'next/server';
import { readDatabase, writeDatabase } from '@/lib/database';

interface RouteParams {
  params: { id: string };
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params;
  try {
    const data = readDatabase();
    const updateData = await request.json();

    const orderIndex = data.orders.findIndex(order => order.id === params.id);

    if (orderIndex === -1) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Update the order
    data.orders[orderIndex] = { ...data.orders[orderIndex], ...updateData };
    writeDatabase(data);

    return NextResponse.json(data.orders[orderIndex]);
  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
  }
}
