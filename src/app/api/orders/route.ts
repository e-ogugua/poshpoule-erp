import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { sendOrderNotificationEmail } from '@/lib/email';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      include: {
        products: true
      },
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

    // Validate required fields
    const requiredFields = ['customerName', 'customerEmail', 'customerPhone', 'products', 'totalAmount'];
    for (const field of requiredFields) {
      if (!orderData[field]) {
        return NextResponse.json({ error: `Missing required field: ${field}` }, { status: 400 });
      }
    }

    // Validate products array
    if (!Array.isArray(orderData.products) || orderData.products.length === 0) {
      return NextResponse.json({ error: 'At least one product is required' }, { status: 400 });
    }

    // Create order with products in a transaction
    const newOrder = await prisma.$transaction(async (tx) => {
      // Create the order
      const order = await tx.order.create({
        data: {
          customerName: orderData.customerName,
          customerEmail: orderData.customerEmail,
          customerPhone: orderData.customerPhone,
          orderType: orderData.orderType || 'pickup',
          scheduledDate: orderData.scheduledDate,
          scheduledTime: orderData.scheduledTime,
          deliveryAddress: orderData.deliveryAddress,
          notes: orderData.notes,
          totalAmount: orderData.totalAmount,
          status: 'new',
        }
      });

      // Create order products
      const orderProducts = orderData.products.map((product: any) => ({
        productId: product.productId,
        name: product.name,
        quantity: product.quantity,
        priceNaira: product.priceNaira,
        orderId: order.id
      }));

      await tx.orderProduct.createMany({
        data: orderProducts
      });

      // Return order with products
      return await tx.order.findUnique({
        where: { id: order.id },
        include: { products: true }
      });
    });

    if (!newOrder) {
      throw new Error('Failed to create order');
    }

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
