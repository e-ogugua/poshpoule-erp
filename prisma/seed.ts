import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { readFileSync } from 'fs'
import { join } from 'path'

const prisma = new PrismaClient()

async function main() {
  // Read data from JSON file
  const dataPath = join(process.cwd(), 'db', 'data.json')
  const data = JSON.parse(readFileSync(dataPath, 'utf-8'))

  // Hash passwords
  const hashedAdminPassword = await bcrypt.hash('DemoPass123!', 10)
  const hashedStaffPassword = await bcrypt.hash('StaffPass123!', 10)

  // Create admin user
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@poshpoule.com' },
    update: {},
    create: {
      id: 'admin-1',
      email: 'admin@poshpoule.com',
      password: hashedAdminPassword,
      name: 'Admin User',
      role: 'admin',
    },
  })

  // Create staff user
  const staffUser = await prisma.user.upsert({
    where: { email: 'staff@poshpoule.com' },
    update: {},
    create: {
      id: 'staff-1',
      email: 'staff@poshpoule.com',
      password: hashedStaffPassword,
      name: 'Staff User',
      role: 'staff',
    },
  })

  // Seed products
  for (const product of data.products) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {},
      create: {
        id: product.id,
        name: product.name,
        description: product.description,
        priceNaira: product.priceNaira,
        stock: product.stock,
        image: product.image,
        category: product.category,
        slug: product.slug,
        featured: product.featured || false,
      },
    })
  }

  console.log('Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
