import { NextRequest, NextResponse } from 'next/server';
import { readDatabase, writeDatabase } from '@/lib/database';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
