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

  // Create additional test users
  const user2Salt = generateSalt();
  const user2Password = hashPassword('user123', user2Salt);

  const user2 = await prisma.user.upsert({
    where: { email: 'john@parking.com' },
    update: {},
    create: {
      username: 'john',
      email: 'john@parking.com',
      password: user2Password,
      salt: user2Salt,
    },
  });

  console.log('✅ Created test user 2:', user2.email);

  const user3Salt = generateSalt();
  const user3Password = hashPassword('user123', user3Salt);

  const user3 = await prisma.user.upsert({
    where: { email: 'jane@parking.com' },
    update: {},
    create: {
      username: 'jane',
      email: 'jane@parking.com',
      password: user3Password,
      salt: user3Salt,
    },
  });

  console.log('✅ Created test user 3:', user3.email);

  // Create parking spaces
  console.log('\n📍 Creating parking spaces...');

  const parkingSpaces = [
    // Zone A - Indoor Parking (Beijing SOHO)
    {
      sensorId: 'SENSOR_A01',
      description: 'Near entrance, close to elevator',
      address: 'Building A, Floor 1, Spot 15, Beijing SOHO, Chaoyang District, Beijing',
      latitude: 39.9175,
      longitude: 116.458,
      isOccupied: false,
      currentPrice: 5.0,
    },
    {
      sensorId: 'SENSOR_A02',
      description: 'Middle section, standard space',
      address: 'Building A, Floor 1, Spot 32, Beijing SOHO, Chaoyang District, Beijing',
      latitude: 39.9176,
      longitude: 116.4582,
      isOccupied: true,
      currentPrice: 5.0,
    },
    {
      sensorId: 'SENSOR_A03',
      description: 'Corner spot, extra wide',
      address: 'Building A, Floor 1, Spot 48, Beijing SOHO, Chaoyang District, Beijing',
      latitude: 39.9177,
      longitude: 116.4584,
      isOccupied: false,
      currentPrice: 5.0,
    },
    {
      sensorId: 'SENSOR_A04',
      description: 'Floor 2 entrance area',
      address: 'Building A, Floor 2, Spot 12, Beijing SOHO, Chaoyang District, Beijing',
      latitude: 39.9178,
      longitude: 116.4586,
      isOccupied: false,
      currentPrice: 4.5,
    },
    {
      sensorId: 'SENSOR_A05',
      description: 'Floor 2 window side',
      address: 'Building A, Floor 2, Spot 25, Beijing SOHO, Chaoyang District, Beijing',
      latitude: 39.9179,
      longitude: 116.4588,
      isOccupied: true,
      currentPrice: 4.5,
    },

    // Zone B - Outdoor Parking (Sanlitun Area)
    {
      sensorId: 'SENSOR_B01',
      description: 'Main entrance with shade cover',
      address: 'Zone B, Level 1, Spot 5, Sanlitun Village, Chaoyang District, Beijing',
      latitude: 39.9375,
      longitude: 116.456,
      isOccupied: false,
      currentPrice: 3.0,
    },
    {
      sensorId: 'SENSOR_B02',
      description: 'Middle row, open air',
      address: 'Zone B, Level 1, Spot 18, Sanlitun Village, Chaoyang District, Beijing',
      latitude: 39.9376,
      longitude: 116.4562,
      isOccupied: false,
      currentPrice: 3.0,
    },
    {
      sensorId: 'SENSOR_B03',
      description: 'Near exit, convenient',
      address: 'Zone B, Level 1, Spot 42, Sanlitun Village, Chaoyang District, Beijing',
      latitude: 39.9377,
      longitude: 116.4564,
      isOccupied: true,
      currentPrice: 3.0,
    },
    {
      sensorId: 'SENSOR_B04',
      description: 'Corner position, budget friendly',
      address: 'Zone B, Level 1, Spot 56, Sanlitun Village, Chaoyang District, Beijing',
      latitude: 39.9378,
      longitude: 116.4566,
      isOccupied: false,
      currentPrice: 2.5,
    },
    {
      sensorId: 'SENSOR_B05',
      description: 'Level 2 open air parking',
      address: 'Zone B, Level 2, Spot 8, Sanlitun Village, Chaoyang District, Beijing',
      latitude: 39.9379,
      longitude: 116.4568,
      isOccupied: false,
      currentPrice: 2.0,
    },

    // Zone C - VIP Parking (Guomao CBD)
    {
      sensorId: 'SENSOR_C01',
      description: 'VIP space, spacious and comfortable',
      address: 'Zone C VIP, Floor 1, Spot 3, China World Trade Center, Chaoyang District, Beijing',
      latitude: 39.9088,
      longitude: 116.459,
      isOccupied: false,
      currentPrice: 10.0,
    },
    {
      sensorId: 'SENSOR_C02',
      description: 'VIP space with EV charging station',
      address: 'Zone C VIP, Floor 1, Spot 7, China World Trade Center, Chaoyang District, Beijing',
      latitude: 39.9089,
      longitude: 116.4592,
      isOccupied: true,
      currentPrice: 12.0,
    },
    {
      sensorId: 'SENSOR_C03',
      description: 'VIP space with 24/7 monitoring',
      address: 'Zone C VIP, Floor 1, Spot 11, China World Trade Center, Chaoyang District, Beijing',
      latitude: 39.909,
      longitude: 116.4594,
      isOccupied: false,
      currentPrice: 10.0,
    },

    // Zone D - Underground Parking (Wangjing District)
    {
      sensorId: 'SENSOR_D01',
      description: 'B1 level entrance area',
      address: 'Zone D, B1 Level, Spot 22, Wangjing SOHO, Chaoyang District, Beijing',
      latitude: 39.9958,
      longitude: 116.481,
      isOccupied: false,
      currentPrice: 6.0,
    },
    {
      sensorId: 'SENSOR_D02',
      description: 'B1 level middle section',
      address: 'Zone D, B1 Level, Spot 45, Wangjing SOHO, Chaoyang District, Beijing',
      latitude: 39.9959,
      longitude: 116.4812,
      isOccupied: true,
      currentPrice: 6.0,
    },
    {
      sensorId: 'SENSOR_D03',
      description: 'B2 level deep parking',
      address: 'Zone D, B2 Level, Spot 18, Wangjing SOHO, Chaoyang District, Beijing',
      latitude: 39.996,
      longitude: 116.4814,
      isOccupied: false,
      currentPrice: 5.5,
    },
  ];

  const createdSpaces = [];
  for (const space of parkingSpaces) {
    const created = await prisma.parkingSpace.upsert({
      where: { sensorId: space.sensorId },
      update: space,
      create: space,
    });
    createdSpaces.push(created);
    console.log(`  ✅ Created parking space: ${space.sensorId} - ${space.address}`);
  }

  console.log(`\n✅ Created ${createdSpaces.length} parking spaces`);

  // Create subscriptions
  console.log('\n🔔 Creating subscriptions...');

  const subscriptions = [
    // testuser 订阅了几个A区和B区的车位
    {
      userId: user.id,
      parkingSpaceId: createdSpaces.find(s => s.sensorId === 'SENSOR_A01')!.id,
    },
    {
      userId: user.id,
      parkingSpaceId: createdSpaces.find(s => s.sensorId === 'SENSOR_A03')!.id,
    },
    {
      userId: user.id,
      parkingSpaceId: createdSpaces.find(s => s.sensorId === 'SENSOR_B01')!.id,
    },
    {
      userId: user.id,
      parkingSpaceId: createdSpaces.find(s => s.sensorId === 'SENSOR_B02')!.id,
    },

    // john 订阅了VIP车位和地下停车场
    {
      userId: user2.id,
      parkingSpaceId: createdSpaces.find(s => s.sensorId === 'SENSOR_C01')!.id,
    },
    {
      userId: user2.id,
      parkingSpaceId: createdSpaces.find(s => s.sensorId === 'SENSOR_C03')!.id,
    },
    {
      userId: user2.id,
      parkingSpaceId: createdSpaces.find(s => s.sensorId === 'SENSOR_D01')!.id,
    },

    // jane 订阅了B区和D区的车位
    {
      userId: user3.id,
      parkingSpaceId: createdSpaces.find(s => s.sensorId === 'SENSOR_B01')!.id,
    },
    {
      userId: user3.id,
      parkingSpaceId: createdSpaces.find(s => s.sensorId === 'SENSOR_B04')!.id,
    },
    {
      userId: user3.id,
      parkingSpaceId: createdSpaces.find(s => s.sensorId === 'SENSOR_D03')!.id,
    },

    // admin 订阅了一些关键位置
    {
      userId: admin.id,
      parkingSpaceId: createdSpaces.find(s => s.sensorId === 'SENSOR_A01')!.id,
    },
    {
      userId: admin.id,
      parkingSpaceId: createdSpaces.find(s => s.sensorId === 'SENSOR_C02')!.id,
    },
  ];

  for (const sub of subscriptions) {
    await prisma.subscription.upsert({
      where: {
        userId_parkingSpaceId: {
          userId: sub.userId,
          parkingSpaceId: sub.parkingSpaceId,
        },
      },
      update: {},
      create: sub,
    });
  }

  console.log(`✅ Created ${subscriptions.length} subscriptions`);

  // Print summary
  console.log('\n📊 Seed Summary:');
  console.log('==========================================');
  console.log(`👥 Users: ${await prisma.user.count()}`);
  console.log(`🅿️  Parking Spaces: ${await prisma.parkingSpace.count()}`);
  console.log(
    `   - Available: ${await prisma.parkingSpace.count({ where: { isOccupied: false } })}`
  );
  console.log(`   - Occupied: ${await prisma.parkingSpace.count({ where: { isOccupied: true } })}`);
  console.log(`🔔 Subscriptions: ${await prisma.subscription.count()}`);
  console.log('==========================================');

  console.log('\n🎉 Database seeding completed!');
  console.log('\n📝 Test Accounts:');
  console.log('  - admin@parking.com / admin123');
  console.log('  - user@parking.com / user123');
  console.log('  - john@parking.com / user123');
  console.log('  - jane@parking.com / user123');
}

main()
  .catch(e => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
