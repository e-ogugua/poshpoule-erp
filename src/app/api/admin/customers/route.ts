import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Verify admin access
    const session = await getServerSession(authOptions);
    
    if (!session?.user || session.user.role !== 'admin') {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const customers = await prisma.user.findMany({
      where: {
        role: 'customer',
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        orders: {
          select: {
            id: true,
            totalAmount: true,
            createdAt: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
          take: 1,
        },
      },
    });

    // Format the response to match the frontend expectations
    const formattedCustomers = customers.map((customer: any) => {
      const totalOrders = customer.orders.length;
      const totalSpent = customer.orders.reduce(
        (sum: number, order: { totalAmount?: number }) => sum + (order.totalAmount || 0),
        0
      );
      const lastOrder = customer.orders[0]?.createdAt.toISOString().split('T')[0];

      return {
        id: customer.id,
        name: customer.name || 'Unnamed Customer',
        email: customer.email,
        phone: customer.phoneNumber || '',
        totalOrders,
        totalSpent,
        lastOrder,
      };
    });

    return NextResponse.json(formattedCustomers);
  } catch (error) {
    console.error('Error fetching customers:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    // Verify admin access
    const session = await getServerSession(authOptions);
    
    if (!session?.user || session.user.role !== 'admin') {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = await request.json();
    const { name, email, phone, password } = body;

    // Basic validation
    if (!name || !email || !password) {
      return new NextResponse('Missing required fields', { status: 400 });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return new NextResponse('User already exists', { status: 400 });
    }

    // In a real app, you would hash the password here
    // For now, we'll store it as is (not recommended for production)
    const hashedPassword = password; // In production, use bcrypt: await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: 'customer',
        emailVerified: new Date(),
      },
    });

    // Don't return the password hash
    const { password: _, ...customerWithoutPassword } = user;

    return NextResponse.json(customerWithoutPassword, { status: 201 });
  } catch (error) {
    console.error('Error creating customer:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
