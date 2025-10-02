import { NextRequest, NextResponse } from 'next/server';
import { readDatabase, writeDatabase } from '@/lib/database';
import { sendSubscriptionConfirmationEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const data = readDatabase();
    const { email } = await request.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Valid email address is required' }, { status: 400 });
    }

    // Check if email already exists
    if (!data.blogSubscribers) {
      data.blogSubscribers = [];
    }

    const existingSubscriber = data.blogSubscribers.find((sub: any) => sub.email === email);
    if (existingSubscriber) {
      return NextResponse.json({ error: 'Email already subscribed' }, { status: 409 });
    }

    // Create new subscriber
    const newSubscriber: any = {
      id: Date.now().toString(),
      email,
      status: 'pending' as const, // For double opt-in
      subscribedAt: new Date().toISOString(),
      confirmedAt: null,
      unsubscribedAt: null,
    };

    data.blogSubscribers.push(newSubscriber);
    writeDatabase(data);

    // Send confirmation email (double opt-in)
    try {
      await sendSubscriptionConfirmationEmail(email);
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      // Don't fail the subscription if email fails
    }

    return NextResponse.json({
      success: true,
      message: 'Please check your email to confirm your subscription'
    });

  } catch (error) {
    console.error('Blog subscription error:', error);
    return NextResponse.json({
      error: 'Failed to process subscription',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}
