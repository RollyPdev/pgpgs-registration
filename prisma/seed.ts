import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Create users with hashed passwords
  const users = [
    {
      name: 'Rolly Paredes',
      username: 'pgpgadmin',
      password: 'admin123',
      role: 'Administrator'
    },
    {
      name: 'Rolly',
      username: 'Rolly',
      password: 'Astigko2025!',
      role: 'Administrator'
    },
    {
      name: 'Jayv Astorias',
      username: 'cpcpress',
      password: 'cpcpress123',
      role: 'Member'
    }
  ];

  for (const userData of users) {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { username: userData.username }
    });

    if (existingUser) {
      console.log(`⚠️ User ${userData.username} already exists, skipping...`);
      continue;
    }

    // Hash the password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(userData.password, saltRounds);

    // Create the user
    const user = await prisma.user.create({
      data: {
        name: userData.name,
        username: userData.username,
        password: hashedPassword,
        role: userData.role
      }
    });

    console.log(`✅ Created user: ${user.username} (${user.role})`);
    console.log(`   Login: ${user.username} | Password: ${userData.password}`);
  }

  // Display all users
  const allUsers = await prisma.user.findMany({
    select: {
      id: true,
      username: true,
      name: true,
      role: true,
      createdAt: true
    }
  });

  console.log('\n📋 All users in database:');
  allUsers.forEach(user => {
    console.log(`   - ${user.username} (${user.role}) - ${user.name}`);
  });

  console.log('\n🎉 Database seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 