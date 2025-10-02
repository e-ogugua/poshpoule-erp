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
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    // Format the response to match the frontend expectations
    const formattedCustomers = customers.map((customer: any) => {
      return {
        id: customer.id,
        name: customer.name || 'Unnamed Customer',
        email: customer.email,
        phone: '', // Not stored in user table for guest orders
        totalOrders: 0, // Will need separate query if needed
        totalSpent: 0,  // Will need separate query if needed
        lastOrder: null, // Will need separate query if needed
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
