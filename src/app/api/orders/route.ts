import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { sendOrderNotificationEmail } from '@/lib/email';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const orderData = await request.json();

    // Validate required fields for new schema
    const requiredFields = ['user_id', 'items', 'totalAmount'];
    for (const field of requiredFields) {
      if (!orderData[field]) {
        return NextResponse.json({ error: `Missing required field: ${field}` }, { status: 400 });
      }
    }

    // Validate items is a valid JSON object
    if (typeof orderData.items !== 'object' || orderData.items === null) {
      return NextResponse.json({ error: 'Items must be a valid JSON object' }, { status: 400 });
    }

    // Create order with new schema
    const newOrder = await prisma.order.create({
      data: {
        user_id: orderData.user_id,
        totalAmount: orderData.totalAmount,
        status: orderData.status || 'pending',
        items: orderData.items,
        shipping_info: orderData.shipping_info || {}
      }
    });

    // Try to send email notification (don't fail if it fails)
    try {
      await sendOrderNotificationEmail(newOrder);
      console.log('✅ Order notification email sent');
    } catch (emailError) {
      console.error('❌ Email notification failed:', emailError);
      // Don't throw - order is already saved
    }

    return NextResponse.json(newOrder, { status: 201 });
  } catch (error) {
    console.error('❌ Error creating order:', error);
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Failed to create order'
    }, { status: 500 });
  }
}
