const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function createDefaultAdmin() {
  try {
    // Check if admin user already exists
    const existingAdmin = await prisma.user.findUnique({
      where: {
        username: 'admin'
      }
    });

    if (existingAdmin) {
      console.log('Admin user already exists');
      return;
    }

    // Create default admin user
    const adminUser = await prisma.user.create({
      data: {
        name: 'Administrator',
        username: 'admin',
        password: 'admin123', // Change this to a secure password
        role: 'Administrator'
      }
    });

    console.log('Default admin user created successfully:', adminUser);
  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createDefaultAdmin(); 