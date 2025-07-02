const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.user.createMany({
    data: [
      { name: "Alice", email: "alice@example.com", password: "password123", role: "USER" },
      { name: "Bob", email: "bob@example.com", password: "password123", role: "USER" },
      { name: "Admin", email: "admin@example.com", password: "adminpass", role: "ADMIN" },
    ],
    skipDuplicates: true,
  });
}

main().finally(() => prisma.$disconnect()); 