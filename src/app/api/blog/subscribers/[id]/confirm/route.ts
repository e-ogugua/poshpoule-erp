import { NextRequest, NextResponse } from 'next/server';
import { readDatabase, writeDatabase } from '@/lib/database';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const data = readDatabase();
    const subscribers = data.blogSubscribers || [];
    const subscriberIndex = subscribers.findIndex((sub: any) => sub.id === params.id);

    if (subscriberIndex === -1) {
      return NextResponse.json({ error: 'Subscriber not found' }, { status: 404 });
    }

    // Update subscriber status to confirmed
    subscribers[subscriberIndex].status = 'confirmed';
    subscribers[subscriberIndex].confirmedAt = new Date().toISOString();

    writeDatabase(data);

    return NextResponse.json({
      success: true,
      message: 'Subscription confirmed successfully',
      subscriber: {
        id: subscribers[subscriberIndex].id,
        email: subscribers[subscriberIndex].email,
        status: subscribers[subscriberIndex].status,
        confirmedAt: subscribers[subscriberIndex].confirmedAt,
      }
    });

  } catch (error) {
    console.error('Error confirming subscription:', error);
    return NextResponse.json({
      error: 'Failed to confirm subscription'
    }, { status: 500 });
  }
}
