const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testAchievements() {
  try {
    console.log('Testing achievement system...\n');

    // Get a test user (first user in the database)
    const user = await prisma.user.findFirst({
      select: {
        id: true,
        email: true,
        createdAt: true,
        visitedLessons: true,
        solvedExercises: true,
        savedLessons: true,
        dailyLoginPoints: true
      }
    });

    if (!user) {
      console.log('No users found in database. Please create a user first.');
      return;
    }

    console.log(`Testing with user: ${user.email} (ID: ${user.id})`);
    console.log(`Current coins: ${user.dailyLoginPoints}`);
    console.log(`Join date: ${user.createdAt}`);
    
    // Calculate stats
    let completedLessons = 0;
    let completedLanguages = 0;
    
    if (user.visitedLessons) {
      if (Array.isArray(user.visitedLessons)) {
        completedLessons = user.visitedLessons.length;
      } else if (typeof user.visitedLessons === 'object') {
        const visitedData = user.visitedLessons;
        Object.keys(visitedData).forEach(language => {
          const lessons = visitedData[language];
          if (Array.isArray(lessons)) {
            completedLessons += lessons.length;
          }
        });
        completedLanguages = Object.keys(visitedData).length;
      }
    }

    const solvedExercises = (user.solvedExercises || []).length;
    const savedLessonsCount = (user.savedLessons || []).length;

    console.log(`\nUser Stats:`);
    console.log(`- Completed lessons: ${completedLessons}`);
    console.log(`- Completed languages: ${completedLanguages}`);
    console.log(`- Solved exercises: ${solvedExercises}`);
    console.log(`- Saved lessons: ${savedLessonsCount}`);

    // Check existing achievements
    const existingAchievements = await prisma.achievement.findMany({
      where: { userId: user.id },
      select: {
        id: true,
        name: true,
        description: true,
        unlockedAt: true,
        claimed: true,
        points: true,
        rarity: true
      }
    });

    console.log(`\nExisting achievements: ${existingAchievements.length}`);
    existingAchievements.forEach(achievement => {
      console.log(`- ${achievement.name} (${achievement.rarity}): ${achievement.unlockedAt ? 'UNLOCKED' : 'LOCKED'} ${achievement.claimed ? '[CLAIMED]' : '[NOT CLAIMED]'} - ${achievement.points} points`);
    });

    // Test achievement creation logic
    console.log('\nTesting achievement conditions:');
    
    const testConditions = [
      { name: 'First Steps', condition: completedLessons > 0, expected: completedLessons > 0 },
      { name: 'Knowledge Seeker', condition: completedLessons >= 10, expected: completedLessons >= 10 },
      { name: 'Learning Legend', condition: completedLessons >= 50, expected: completedLessons >= 50 },
      { name: 'Polyglot', condition: completedLanguages >= 5, expected: completedLanguages >= 5 },
      { name: 'Completionist', condition: completedLessons >= 100, expected: completedLessons >= 100 },
      { name: 'Problem Solver', condition: solvedExercises > 0, expected: solvedExercises > 0 },
      { name: 'Code Ninja', condition: solvedExercises >= 25, expected: solvedExercises >= 25 },
      { name: 'Algorithm Master', condition: solvedExercises >= 100, expected: solvedExercises >= 100 },
      { name: 'Early Bird', condition: new Date(user.createdAt) < new Date('2024-12-31'), expected: new Date(user.createdAt) < new Date('2024-12-31') },
      { name: 'Bookmark Collector', condition: savedLessonsCount >= 20, expected: savedLessonsCount >= 20 }
    ];

    testConditions.forEach(test => {
      console.log(`- ${test.name}: ${test.condition ? '✅ PASS' : '❌ FAIL'} (Expected: ${test.expected})`);
    });

    console.log('\nTest completed successfully!');

  } catch (error) {
    console.error('Error testing achievements:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testAchievements(); 