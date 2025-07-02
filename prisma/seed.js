const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  await prisma.user.createMany({
    data: [
      {
        username: "testuser",
        email: "user@example.com",
        passwordHash: "$2b$10$QLZe6kS3e5i6/WSSuFRrTudNTtVwGSvy9yjJ6EqKObGifNJls.q6S", // userpass
        role: "USER",
        isVerified: true,
        progress: {},
        savedLessons: [],
        completedChallenges: [],
        premiumStatus: "FREE",
      },
      {
        username: "adminuser",
        email: "admin@example.com",
        passwordHash: "$2b$10$dRA0en5Sy7HSNPohbHP9v.CluOWnhvoFv2GPxb/FXgfZoXijUXtDC", // adminpass
        role: "ADMIN",
        isVerified: true,
        progress: {},
        savedLessons: [],
        completedChallenges: [],
        premiumStatus: "PREMIUM",
      },
    ],
    skipDuplicates: true,
  });
}

main().finally(() => prisma.$disconnect());
