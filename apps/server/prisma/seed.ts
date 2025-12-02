import { PrismaClient } from '@prisma/client';
import { generateSalt, hashPassword } from '../src/utils/crypto';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create admin user
  const adminSalt = generateSalt();
  const adminPassword = hashPassword('admin123', adminSalt);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@parking.com' },
    update: {},
    create: {
      username: 'admin',
      email: 'admin@parking.com',
      password: adminPassword,
      salt: adminSalt,
    },
  });

  console.log('✅ Created admin user:', admin.email);

  // Create test user
  const userSalt = generateSalt();
  const userPassword = hashPassword('user123', userSalt);

  const user = await prisma.user.upsert({
    where: { email: 'user@parking.com' },
    update: {},
    create: {
      username: 'testuser',
      email: 'user@parking.com',
      password: userPassword,
      salt: userSalt,
    },
  });

  console.log('✅ Created test user:', user.email);

  console.log('🎉 Database seeding completed!');
}

main()
  .catch(e => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
