import { NextRequest, NextResponse } from 'next/server';
import { sendSubscriptionConfirmationEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Valid email address is required' }, { status: 400 });
    }

    await sendSubscriptionConfirmationEmail(email);

    return NextResponse.json({
      success: true,
      message: 'Subscription confirmation sent successfully'
    });

  } catch (error) {
    console.error('Blog subscription error:', error);
    return NextResponse.json({
      error: 'Failed to process subscription',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}
