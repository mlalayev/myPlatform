// scripts/remove-duplicate-achievements.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const allAchievements = await prisma.achievement.findMany();
  const grouped = {};
  for (const ach of allAchievements) {
    const key = ach.userId + '::' + ach.name;
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(ach);
  }
  let totalDeleted = 0;
  for (const key in grouped) {
    if (grouped[key].length > 1) {
      // Sort by unlockedAt (earliest first), then by id
      grouped[key].sort((a, b) => {
        if (a.unlockedAt && b.unlockedAt) {
          return new Date(a.unlockedAt) - new Date(b.unlockedAt);
        } else if (a.unlockedAt) {
          return -1;
        } else if (b.unlockedAt) {
          return 1;
        } else {
          return a.id - b.id;
        }
      });
      // Keep the first, delete the rest
      const toDelete = grouped[key].slice(1);
      for (const ach of toDelete) {
        await prisma.achievement.delete({ where: { id: ach.id } });
        totalDeleted++;
        console.log(`Deleted duplicate achievement id=${ach.id} userId=${ach.userId} name=${ach.name}`);
      }
    }
  }
  console.log(`Done. Deleted ${totalDeleted} duplicate achievements.`);
  await prisma.$disconnect();
}

main().catch(e => {
  console.error(e);
  process.exit(1);
}); 