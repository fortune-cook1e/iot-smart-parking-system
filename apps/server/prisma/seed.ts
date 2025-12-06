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
    // Zone A - Gamla Stan (Old Town)
    {
      sensorId: 'SENSOR_A01',
      name: 'Royal Palace Parking',
      description: 'Near Royal Palace entrance',
      address: 'Slottsbacken 1, Gamla Stan, Stockholm',
      latitude: 59.3268,
      longitude: 18.0717,
      isOccupied: false,
      currentPrice: 45.0,
    },
    {
      sensorId: 'SENSOR_A02',
      name: 'Stortorget Square Parking',
      description: 'Stortorget square area',
      address: 'Stortorget 3, Gamla Stan, Stockholm',
      latitude: 59.3258,
      longitude: 18.0711,
      isOccupied: true,
      currentPrice: 45.0,
    },
    {
      sensorId: 'SENSOR_A03',
      name: 'Nobel Museum Parking',
      description: 'Near Nobel Museum',
      address: 'Stortorget 7, Gamla Stan, Stockholm',
      latitude: 59.3255,
      longitude: 18.0708,
      isOccupied: false,
      currentPrice: 45.0,
    },
    {
      sensorId: 'SENSOR_A04',
      name: 'Västerlånggatan Parking',
      description: 'Västerlånggatan shopping street',
      address: 'Västerlånggatan 42, Gamla Stan, Stockholm',
      latitude: 59.3248,
      longitude: 18.0698,
      isOccupied: false,
      currentPrice: 40.0,
    },

    // Zone B - Södermalm
    {
      sensorId: 'SENSOR_B01',
      name: 'Fotografiska Parking',
      description: 'Near Fotografiska Museum',
      address: 'Stadsgårdshamnen 22, Södermalm, Stockholm',
      latitude: 59.3186,
      longitude: 18.0846,
      isOccupied: false,
      currentPrice: 35.0,
    },
    {
      sensorId: 'SENSOR_B02',
      name: 'Götgatan Parking',
      description: 'Götgatan shopping district',
      address: 'Götgatan 78, Södermalm, Stockholm',
      latitude: 59.3152,
      longitude: 18.0728,
      isOccupied: false,
      currentPrice: 30.0,
    },
    {
      sensorId: 'SENSOR_B03',
      name: 'Medborgarplatsen Parking',
      description: 'Medborgarplatsen square',
      address: 'Medborgarplatsen 3, Södermalm, Stockholm',
      latitude: 59.3147,
      longitude: 18.0712,
      isOccupied: true,
      currentPrice: 30.0,
    },
    {
      sensorId: 'SENSOR_B04',
      name: 'Hornstull Waterfront Parking',
      description: 'Hornstull waterfront',
      address: 'Hornstulls Strand 4, Södermalm, Stockholm',
      latitude: 59.3167,
      longitude: 18.0338,
      isOccupied: false,
      currentPrice: 25.0,
    },
    {
      sensorId: 'SENSOR_B05',
      name: 'SoFo District Parking',
      description: 'SoFo hipster district',
      address: 'Nytorgsgatan 12, Södermalm, Stockholm',
      latitude: 59.3162,
      longitude: 18.0752,
      isOccupied: false,
      currentPrice: 28.0,
    },

    // Zone C - Östermalm (Premium Area)
    {
      sensorId: 'SENSOR_C01',
      name: 'Stureplan Premium Parking',
      description: 'Stureplan luxury shopping',
      address: 'Sturegatan 4, Östermalm, Stockholm',
      latitude: 59.3358,
      longitude: 18.0743,
      isOccupied: false,
      currentPrice: 55.0,
    },
    {
      sensorId: 'SENSOR_C02',
      name: 'Saluhall Market Parking',
      description: 'Near Östermalms Saluhall',
      address: 'Östermalmstorg 5, Östermalm, Stockholm',
      latitude: 59.3342,
      longitude: 18.0752,
      isOccupied: true,
      currentPrice: 50.0,
    },
    {
      sensorId: 'SENSOR_C03',
      name: 'Strandvägen Waterfront Parking',
      description: 'Strandvägen waterfront promenade',
      address: 'Strandvägen 7, Östermalm, Stockholm',
      latitude: 59.3328,
      longitude: 18.0822,
      isOccupied: false,
      currentPrice: 60.0,
    },
    {
      sensorId: 'SENSOR_C04',
      name: 'Karlaplan Park Parking',
      description: 'Karlaplan park area',
      address: 'Karlavägen 56, Östermalm, Stockholm',
      latitude: 59.3401,
      longitude: 18.0889,
      isOccupied: false,
      currentPrice: 45.0,
    },

    // Zone D - Norrmalm (City Center)
    {
      sensorId: 'SENSOR_D01',
      name: 'Central Station Parking',
      description: 'Central Station nearby',
      address: 'Vasagatan 10, Norrmalm, Stockholm',
      latitude: 59.3305,
      longitude: 18.0583,
      isOccupied: false,
      currentPrice: 40.0,
    },
    {
      sensorId: 'SENSOR_D02',
      name: 'Sergels Torg Parking',
      description: 'Sergels Torg square',
      address: 'Sergels Torg 12, Norrmalm, Stockholm',
      latitude: 59.3325,
      longitude: 18.0642,
      isOccupied: true,
      currentPrice: 42.0,
    },
    {
      sensorId: 'SENSOR_D03',
      name: 'Drottninggatan Parking',
      description: 'Drottninggatan pedestrian street',
      address: 'Drottninggatan 45, Norrmalm, Stockholm',
      latitude: 59.3342,
      longitude: 18.0652,
      isOccupied: false,
      currentPrice: 38.0,
    },
    {
      sensorId: 'SENSOR_D04',
      name: 'Hötorget Market Parking',
      description: 'Hötorget market square',
      address: 'Hötorget 8, Norrmalm, Stockholm',
      latitude: 59.3352,
      longitude: 18.0628,
      isOccupied: false,
      currentPrice: 35.0,
    },

    // Zone E - Djurgården (Island Park)
    {
      sensorId: 'SENSOR_E01',
      name: 'Vasa Museum Parking',
      description: 'Near Vasa Museum',
      address: 'Galärvarvsvägen 14, Djurgården, Stockholm',
      latitude: 59.3279,
      longitude: 18.0917,
      isOccupied: false,
      currentPrice: 25.0,
    },
    {
      sensorId: 'SENSOR_E02',
      name: 'Skansen Museum Parking',
      description: 'Skansen open-air museum',
      address: 'Djurgårdsslätten 49, Djurgården, Stockholm',
      latitude: 59.3262,
      longitude: 18.1022,
      isOccupied: true,
      currentPrice: 25.0,
    },
    {
      sensorId: 'SENSOR_E03',
      name: 'ABBA Museum Parking',
      description: 'ABBA Museum parking',
      address: 'Djurgårdsvägen 68, Djurgården, Stockholm',
      latitude: 59.3255,
      longitude: 18.0968,
      isOccupied: false,
      currentPrice: 25.0,
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
