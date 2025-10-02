// Seed admin user for PoshPOULE Farms
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Check if admin already exists
  const existingAdmin = await prisma.user.findFirst({
    where: { role: 'admin' }
  });

  if (existingAdmin) {
    console.log('✅ Admin user already exists:', existingAdmin.email);
    return;
  }

  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 10);
  
  const admin = await prisma.user.create({
    data: {
      email: 'admin@poshpoule.com',
      name: 'PoshPOULE Admin',
      password: hashedPassword,
      role: 'admin',
    }
  });

  console.log('✅ Admin user created successfully!');
  console.log('📧 Email: admin@poshpoule.com');
  console.log('🔑 Password: admin123');
  console.log('👤 Role: admin');
}

main()
  .catch((e) => {
    console.error('❌ Error creating admin user:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
