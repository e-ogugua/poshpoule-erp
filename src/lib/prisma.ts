import { Prisma, PrismaClient } from '@prisma/client';

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

// Create a single instance of Prisma Client
const prisma = global.prisma || new PrismaClient({
  log: process.env.NODE_ENV === 'development' 
    ? ['query', 'error', 'warn'] 
    : ['error', 'warn'],
});

type QueryEvent = {
  timestamp: Date;
  query: string;
  params: string;
  duration: number;
  target: string;
};

// Enable Prisma query logging in development
if (process.env.NODE_ENV === 'development') {
  prisma.$on('query' as never, (e: QueryEvent) => {
    console.log('Query: ' + e.query);
    console.log('Params: ' + e.params);
    console.log('Duration: ' + e.duration + 'ms');
  });
}

// Add monitoring for production
prisma.$on('query' as never, (e: QueryEvent) => {
  if (e.duration > 200) { // Log slow queries (over 200ms)
    console.warn(`Slow query detected (${e.duration}ms): ${e.query}`);
  }
});

// Prevent multiple instances of Prisma Client in development
if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}

export default prisma;
