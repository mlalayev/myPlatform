const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function addLanguageProgress() {
  try {
    // Find a test user (replace with actual user email)
    const user = await prisma.user.findFirst({
      where: {
        email: {
          contains: '@'
        }
      }
    });

    if (!user) {
      console.log('No user found. Please create a user first.');
      return;
    }

    console.log('Found user:', user.email);

    // Sample language progress data
    const languageProgress = {
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
    };

    // Update user's visitedLessons with the language progress data
    await prisma.user.update({
      where: { id: user.id },
      data: {
        visitedLessons: languageProgress
      }
    });

    console.log('✅ Language progress data added successfully!');
    console.log('📊 Progress summary:');
    
    Object.keys(languageProgress).forEach(language => {
      const lessons = languageProgress[language];
      console.log(`  ${language}: ${lessons.length} lessons completed`);
    });

    console.log('\n🎯 Now check the Profile > Progress tab to see the skill progression!');

  } catch (error) {
    console.error('❌ Error adding language progress:', error);
  } finally {
    await prisma.$disconnect();
  }
}

addLanguageProgress(); 