import { NextRequest, NextResponse } from 'next/server';
import { readDatabase, writeDatabase, getNextId } from '@/lib/database';

export async function POST(request: NextRequest) {
  try {
    const data = readDatabase();
    const leadData = await request.json();

    // Validate required fields
    const requiredFields = ['name', 'email', 'subject', 'message'];
    for (const field of requiredFields) {
      if (!leadData[field]) {
        return NextResponse.json({ error: `Missing required field: ${field}` }, { status: 400 });
      }
    }

    // Create new lead
    const newLead = {
      id: getNextId(data.orders), // Using orders collection for ID generation
      ...leadData,
      status: 'new',
      createdAt: new Date().toISOString(),
    };

    // In a real application, you would store leads in the database
    // For this demo, we'll just log it and return success
    console.log('New lead received:', newLead);

    // For demo purposes, we'll add it to a leads array if it exists
    if (!data.leads) {
      data.leads = [];
    }
    data.leads.push(newLead);
    writeDatabase(data);

    return NextResponse.json({ message: 'Message sent successfully' }, { status: 201 });
  } catch (error) {
    console.error('Error creating lead:', error);
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
  }
}
