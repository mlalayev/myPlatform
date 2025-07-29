const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function addTestData() {
  try {
    // Create a test user
    const user = await prisma.user.upsert({
      where: { email: 'test@example.com' },
      update: {},
      create: {
        email: 'test@example.com',
        name: 'Test User',
        username: 'testuser',
        role: 'USER',
        visitedLessons: {
          'javascript': [
            { id: 1, title: 'Variables', completedAt: new Date('2024-01-15') },
            { id: 2, title: 'Functions', completedAt: new Date('2024-01-16') },
            { id: 3, title: 'Arrays', completedAt: new Date('2024-01-17') },
            { id: 4, title: 'Objects', completedAt: new Date('2024-01-18') },
            { id: 5, title: 'DOM Manipulation', completedAt: new Date('2024-01-19') },
            { id: 6, title: 'Async/Await', completedAt: new Date('2024-01-20') },
            { id: 7, title: 'ES6 Features', completedAt: new Date('2024-01-21') },
            { id: 8, title: 'Modules', completedAt: new Date('2024-01-22') },
            { id: 9, title: 'Error Handling', completedAt: new Date('2024-01-23') },
            { id: 10, title: 'Testing', completedAt: new Date('2024-01-24') }
          ],
          'python': [
            { id: 11, title: 'Variables', completedAt: new Date('2024-01-25') },
            { id: 12, title: 'Functions', completedAt: new Date('2024-01-26') },
            { id: 13, title: 'Lists', completedAt: new Date('2024-01-27') },
            { id: 14, title: 'Dictionaries', completedAt: new Date('2024-01-28') },
            { id: 15, title: 'Classes', completedAt: new Date('2024-01-29') },
            { id: 16, title: 'File I/O', completedAt: new Date('2024-01-30') },
            { id: 17, title: 'Exception Handling', completedAt: new Date('2024-01-31') },
            { id: 18, title: 'Modules', completedAt: new Date('2024-02-01') },
            { id: 19, title: 'Decorators', completedAt: new Date('2024-02-02') },
            { id: 20, title: 'Generators', completedAt: new Date('2024-02-03') }
          ],
          'java': [
            { id: 21, title: 'Variables', completedAt: new Date('2024-02-04') },
            { id: 22, title: 'Methods', completedAt: new Date('2024-02-05') },
            { id: 23, title: 'Classes', completedAt: new Date('2024-02-06') },
            { id: 24, title: 'Inheritance', completedAt: new Date('2024-02-07') },
            { id: 25, title: 'Interfaces', completedAt: new Date('2024-02-08') },
            { id: 26, title: 'Collections', completedAt: new Date('2024-02-09') },
            { id: 27, title: 'Exception Handling', completedAt: new Date('2024-02-10') },
            { id: 28, title: 'File I/O', completedAt: new Date('2024-02-11') },
            { id: 29, title: 'Threading', completedAt: new Date('2024-02-12') },
            { id: 30, title: 'Generics', completedAt: new Date('2024-02-13') }
          ],
          'c++': [
            { id: 31, title: 'Variables', completedAt: new Date('2024-02-14') },
            { id: 32, title: 'Functions', completedAt: new Date('2024-02-15') },
            { id: 33, title: 'Pointers', completedAt: new Date('2024-02-16') },
            { id: 34, title: 'Classes', completedAt: new Date('2024-02-17') },
            { id: 35, title: 'Inheritance', completedAt: new Date('2024-02-18') },
            { id: 36, title: 'Templates', completedAt: new Date('2024-02-19') },
            { id: 37, title: 'STL', completedAt: new Date('2024-02-20') },
            { id: 38, title: 'Exception Handling', completedAt: new Date('2024-02-21') },
            { id: 39, title: 'File I/O', completedAt: new Date('2024-02-22') },
            { id: 40, title: 'Smart Pointers', completedAt: new Date('2024-02-23') }
          ],
          'algorithms': [
            { id: 41, title: 'Sorting', completedAt: new Date('2024-02-24') },
            { id: 42, title: 'Searching', completedAt: new Date('2024-02-25') },
            { id: 43, title: 'Recursion', completedAt: new Date('2024-02-26') },
            { id: 44, title: 'Dynamic Programming', completedAt: new Date('2024-02-27') },
            { id: 45, title: 'Graph Algorithms', completedAt: new Date('2024-02-28') },
            { id: 46, title: 'Greedy Algorithms', completedAt: new Date('2024-02-29') },
            { id: 47, title: 'Backtracking', completedAt: new Date('2024-03-01') },
            { id: 48, title: 'Divide and Conquer', completedAt: new Date('2024-03-02') },
            { id: 49, title: 'String Algorithms', completedAt: new Date('2024-03-03') },
            { id: 50, title: 'Complexity Analysis', completedAt: new Date('2024-03-04') }
          ]
        },
        solvedExercises: [1, 2, 3, 4, 5],
        savedLessons: [1, 2, 3, 4, 5]
      }
    });

    console.log('✅ Test user created:', user.email);

    // Add daily activities for streak calculation (last 30 days)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Create a 12-day streak (current streak: 1 day, longest streak: 12 days)
    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      // Create activity for days 0-11 (12 day streak) and day 29 (current day)
      if (i <= 11 || i === 29) {
        await prisma.dailyActivity.upsert({
          where: {
            userId_date: {
              userId: user.id,
              date: date
            }
          },
          update: {
            studyTime: 3600 + Math.floor(Math.random() * 1800), // 1-1.5 hours
            lessonsViewed: 3 + Math.floor(Math.random() * 5), // 3-7 lessons
            exercisesSolved: 1 + Math.floor(Math.random() * 3), // 1-3 exercises
            pointsEarned: 50 + Math.floor(Math.random() * 100) // 50-150 points
          },
          create: {
            userId: user.id,
            date: date,
            studyTime: 3600 + Math.floor(Math.random() * 1800),
            lessonsViewed: 3 + Math.floor(Math.random() * 5),
            exercisesSolved: 1 + Math.floor(Math.random() * 3),
            pointsEarned: 50 + Math.floor(Math.random() * 100)
          }
        });
      }
    }

    // Add user activities for recent activity tracking
    const activityTypes = ['LESSON_VIEW', 'EXERCISE_SOLVE', 'ACHIEVEMENT_EARNED'];
    const languages = ['javascript', 'python', 'java', 'c++', 'algorithms'];
    
    for (let i = 0; i < 20; i++) {
      const timestamp = new Date();
      timestamp.setHours(timestamp.getHours() - i);
      
      await prisma.userActivity.create({
        data: {
          userId: user.id,
          type: activityTypes[Math.floor(Math.random() * activityTypes.length)],
          description: `Test activity ${i + 1}`,
          timestamp: timestamp,
          metadata: {
            language: languages[Math.floor(Math.random() * languages.length)],
            lessonId: `lesson_${i + 1}`,
            points: 10 + Math.floor(Math.random() * 20)
          }
        }
      });
    }

    // Add user sessions for study time tracking
    for (let i = 0; i < 15; i++) {
      const startTime = new Date();
      startTime.setHours(startTime.getHours() - (i * 2));
      const endTime = new Date(startTime);
      endTime.setMinutes(endTime.getMinutes() + 45 + Math.floor(Math.random() * 30));
      
      await prisma.userSession.create({
        data: {
          userId: user.id,
          startTime: startTime,
          endTime: endTime,
          duration: Math.floor((endTime - startTime) / 1000) // Convert to seconds
        }
      });
    }

    console.log('✅ Test data added successfully!');
    console.log('📊 Data summary:');
    console.log('  - User: test@example.com');
    console.log('  - Languages studied: 5');
    console.log('  - Total lessons: 50');
    console.log('  - Current streak: 1 day');
    console.log('  - Longest streak: 12 days');
    console.log('  - Activities: 20');
    console.log('  - Sessions: 15');

  } catch (error) {
    console.error('❌ Error adding test data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

addTestData(); 