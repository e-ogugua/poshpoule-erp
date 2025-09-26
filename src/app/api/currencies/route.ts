import { NextRequest, NextResponse } from 'next/server';
import { readDatabase, writeDatabase } from '@/lib/database';

export async function GET() {
  try {
    const data = readDatabase();
    return NextResponse.json(data.currencyRates);
  } catch (error) {
    console.error('Error fetching currency rates:', error);
    return NextResponse.json({ error: 'Failed to fetch currency rates' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const data = readDatabase();
    const newRates = await request.json();

    // Validate rates
    if (typeof newRates !== 'object') {
      return NextResponse.json({ error: 'Invalid rates format' }, { status: 400 });
    }

    // Update currency rates
    data.currencyRates = { ...data.currencyRates, ...newRates };
    writeDatabase(data);

    return NextResponse.json(data.currencyRates);
  } catch (error) {
    console.error('Error updating currency rates:', error);
    return NextResponse.json({ error: 'Failed to update currency rates' }, { status: 500 });
  }
}
