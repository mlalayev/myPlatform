const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function seedAchievements() {
  try {
    console.log('🌱 Seeding achievements...');

    // Get all users
    const users = await prisma.user.findMany();
    
    if (users.length === 0) {
      console.log('No users found. Skipping achievement seeding.');
      return;
    }

    // Define achievement templates
    const achievementTemplates = [
      {
        type: 'LEARNING',
        name: 'First Steps',
        description: 'Complete your first lesson',
        points: 50,
        icon: '🎓',
        rarity: 'COMMON'
      },
      {
        type: 'LEARNING',
        name: 'Knowledge Seeker',
        description: 'Complete 10 lessons',
        points: 100,
        icon: '📚',
        rarity: 'COMMON'
      },
      {
        type: 'LEARNING',
        name: 'Learning Legend',
        description: 'Complete 50 lessons',
        points: 500,
        icon: '🏆',
        rarity: 'RARE'
      },
      {
        type: 'CODING',
        name: 'Problem Solver',
        description: 'Solve your first exercise',
        points: 75,
        icon: '💻',
        rarity: 'COMMON'
      },
      {
        type: 'CODING',
        name: 'Code Ninja',
        description: 'Solve 25 exercises',
        points: 200,
        icon: '⚡',
        rarity: 'RARE'
      },
      {
        type: 'CODING',
        name: 'Algorithm Master',
        description: 'Solve 100 exercises',
        points: 1000,
        icon: '🧠',
        rarity: 'EPIC'
      },
      {
        type: 'STREAK',
        name: 'Week Warrior',
        description: 'Maintain a 7-day learning streak',
        points: 150,
        icon: '🔥',
        rarity: 'COMMON'
      },
      {
        type: 'STREAK',
        name: 'Month Master',
        description: 'Maintain a 30-day learning streak',
        points: 750,
        icon: '🌟',
        rarity: 'RARE'
      },
      {
        type: 'STREAK',
        name: 'Century Champion',
        description: 'Maintain a 100-day learning streak',
        points: 2500,
        icon: '👑',
        rarity: 'LEGENDARY'
      },
      {
        type: 'COMMUNITY',
        name: 'Community Voice',
        description: 'Make your first comment',
        points: 25,
        icon: '💬',
        rarity: 'COMMON'
      },
      {
        type: 'COMMUNITY',
        name: 'Helpful Hero',
        description: 'Help 10 other learners',
        points: 300,
        icon: '🤝',
        rarity: 'RARE'
      }
    ];

    // Create achievements for each user
    for (const user of users) {
      console.log(`Creating achievements for user: ${user.email}`);
      
      for (const template of achievementTemplates) {
        // Check if achievement already exists
        const existingAchievement = await prisma.achievement.findFirst({
          where: {
            userId: user.id,
            type: template.type,
            name: template.name
          }
        });

        if (!existingAchievement) {
          // Determine if achievement should be unlocked based on user progress
          let unlockedAt = null;
          
          if (template.name === 'First Steps') {
            // Unlock if user has any visited lessons
            const visitedLessons = user.visitedLessons;
            if (visitedLessons && (Array.isArray(visitedLessons) ? visitedLessons.length > 0 : Object.keys(visitedLessons).length > 0)) {
              unlockedAt = new Date();
            }
          } else if (template.name === 'Knowledge Seeker') {
            // Unlock if user has 10+ visited lessons
            const visitedLessons = user.visitedLessons;
            const lessonCount = visitedLessons && (Array.isArray(visitedLessons) ? visitedLessons.length : Object.keys(visitedLessons).length);
            if (lessonCount >= 10) {
              unlockedAt = new Date();
            }
          } else if (template.name === 'Problem Solver') {
            // Unlock if user has completed challenges
            if (user.completedChallenges && user.completedChallenges.length > 0) {
              unlockedAt = new Date();
            }
          } else if (template.name === 'Code Ninja') {
            // Unlock if user has 25+ completed challenges
            if (user.completedChallenges && user.completedChallenges.length >= 25) {
              unlockedAt = new Date();
            }
          } else if (template.name === 'Week Warrior') {
            // Unlock if user has login streak >= 7
            if (user.dailyLoginPoints >= 350) { // Rough estimate for 7 days
              unlockedAt = new Date();
            }
          }

          await prisma.achievement.create({
            data: {
              userId: user.id,
              type: template.type,
              name: template.name,
              description: template.description,
              points: template.points,
              icon: template.icon,
              rarity: template.rarity,
              unlockedAt
            }
          });
        }
      }
    }

    console.log('✅ Achievements seeded successfully!');
  } catch (error) {
    console.error('❌ Error seeding achievements:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedAchievements(); 