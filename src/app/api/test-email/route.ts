import { NextResponse } from 'next/server';
import { sendOrderNotificationEmail } from '@/lib/email';

export async function GET() {
  try {
    const testOrder = {
      id: 'test-order-999',
      customerName: 'Test Customer',
      customerEmail: 'test@example.com',
      customerPhone: '08012345678',
      orderType: 'pickup' as const,
      scheduledDate: '2023-12-31',
      scheduledTime: '14:00',
      notes: 'This is a test order',
      products: [
        {
          productId: 'test-product-1',
          name: 'Test Product',
          quantity: 1,
          priceNaira: 10000
        }
      ],
      totalAmount: 10000,
      currency: 'NGN',
      status: 'new' as const,
      createdAt: new Date().toISOString(),
    };

    await sendOrderNotificationEmail(testOrder);
    return NextResponse.json({ success: true, message: 'Test email sent successfully' });
  } catch (error) {
    console.error('Test email error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to send test email',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}
