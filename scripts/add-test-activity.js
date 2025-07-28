const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function addTestActivity() {
  try {
    console.log('Adding test activity to user...\n');

    // Get the first user
    const user = await prisma.user.findFirst({
      select: {
        id: true,
        email: true,
        visitedLessons: true,
        solvedExercises: true,
        savedLessons: true
      }
    });

    if (!user) {
      console.log('No users found in database. Please create a user first.');
      return;
    }

    console.log(`Adding activity for user: ${user.email} (ID: ${user.id})`);

    // Add some visited lessons
    const testVisitedLessons = {
      'javascript': [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
      'python': [1, 2, 3, 4, 5],
      'java': [1, 2, 3],
      'c': [1, 2],
      'cpp': [1]
    };

    // Add some solved exercises
    const testSolvedExercises = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30];

    // Add some saved lessons
    const testSavedLessons = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25];

    // Update user with test data
    await prisma.user.update({
      where: { id: user.id },
      data: {
        visitedLessons: testVisitedLessons,
        solvedExercises: testSolvedExercises,
        savedLessons: testSavedLessons,
        dailyLoginPoints: 1000 // Add some coins
      }
    });

    console.log('Test activity added successfully!');
    console.log('\nAdded:');
    console.log('- 26 completed lessons across 5 languages');
    console.log('- 30 solved exercises');
    console.log('- 25 saved lessons');
    console.log('- 1000 coins');

    console.log('\nNow run the achievement sync to see achievements being unlocked!');

  } catch (error) {
    console.error('Error adding test activity:', error);
  } finally {
    await prisma.$disconnect();
  }
}

addTestActivity(); 