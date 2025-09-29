import { NextResponse } from 'next/server';
import { readDatabase } from '@/lib/database-server';

interface StatsResponse {
  totalOrders: number;
  pendingOrders: number;
  totalProducts: number;
  totalRevenue: number;
}

export const dynamic = 'force-dynamic'; // Ensure we get fresh data on every request

export async function GET() {
  try {
    const data = readDatabase();
    
    if (!data) {
      return NextResponse.json(
        { error: 'Database not available' },
        { status: 500 }
      );
    }
    
    // Ensure we have the expected data structure
    const orders = Array.isArray(data.orders) ? data.orders : [];
    const products = Array.isArray(data.products) ? data.products : [];
    
    const totalOrders = orders.length;
    const pendingOrders = orders.filter(
      (order) => order.status === 'new' || order.status === 'confirmed'
    ).length;
    const totalProducts = products.length;
    const totalRevenue = orders
      .filter((order) => order.status === 'completed')
      .reduce((sum, order) => sum + (order.totalAmount || 0), 0);
    
    const response: StatsResponse = {
      totalOrders,
      pendingOrders,
      totalProducts,
      totalRevenue,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error in /api/admin/stats:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch stats',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
