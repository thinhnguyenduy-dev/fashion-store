import { PrismaClient, AddressType } from '.prisma/identity-client';
import { faker } from '@faker-js/faker';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting Identity Service Seeding...');

  // Clean up existing data
  await prisma.address.deleteMany();
  await prisma.user.deleteMany();

  console.log('🧹 Cleared existing data');

  // Create Admin User?
  // Maybe not needed for now, but good to have a standard user.
  const passwordHash = await bcrypt.hash('password123', 10);

  // Create Standard Test User
  await prisma.user.create({
    data: {
      email: 'test@example.com',
      firstName: 'Test',
      lastName: 'User',
      passwordHash: passwordHash,
      isActive: true,
      phone: faker.phone.number(),
      addresses: {
        create: [
          {
            type: AddressType.SHIPPING,
            street: '123 Test St',
            city: 'Test City',
            state: 'Test State',
            postalCode: '12345',
            country: 'Testland',
            isDefault: true,
          }
        ]
      }
    }
  });
  console.log('👤 Created test user: test@example.com / password123');

  // Create Random Users
  const userCount = 20;
  console.log(`Creating ${userCount} random users...`);

  for (let i = 0; i < userCount; i++) {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const email = faker.internet.email({ firstName, lastName });

    const user = await prisma.user.create({
      data: {
        email: email,
        firstName: firstName,
        lastName: lastName,
        passwordHash: passwordHash, // Share same password for easy testing
        phone: faker.phone.number(),
        avatarUrl: faker.image.avatar(),
        isActive: true,
        addresses: {
          create: [
            {
              type: AddressType.SHIPPING,
              street: faker.location.streetAddress(),
              city: faker.location.city(),
              state: faker.location.state(),
              postalCode: faker.location.zipCode(),
              country: faker.location.country(),
              isDefault: true,
            },
            {
              type: AddressType.BILLING,
              street: faker.location.streetAddress(),
              city: faker.location.city(),
              state: faker.location.state(),
              postalCode: faker.location.zipCode(),
              country: faker.location.country(),
              isDefault: false,
            }
          ]
        }
      },
    });
  }

  console.log('✅ Identity Service Seeding Completed');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
