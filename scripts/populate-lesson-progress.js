const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function populateLessonProgress() {
  try {
    console.log('Starting lesson progress population...');

    // Get all users
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        visitedLessons: true
      }
    });

    console.log(`Found ${users.length} users`);

    for (const user of users) {
      console.log(`Processing user: ${user.email}`);

      // Get user's lesson activities from the last 30 days
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const lessonActivities = await prisma.userActivity.findMany({
        where: {
          userId: user.id,
          type: 'LESSON_VIEW',
          timestamp: {
            gte: thirtyDaysAgo
          }
        },
        orderBy: {
          timestamp: 'asc'
        }
      });

      console.log(`Found ${lessonActivities.length} lesson activities for user ${user.email}`);

      // Group activities by date
      const activitiesByDate = {};
      lessonActivities.forEach(activity => {
        const date = new Date(activity.timestamp);
        date.setHours(0, 0, 0, 0);
        const dateKey = date.toISOString().split('T')[0];
        
        if (!activitiesByDate[dateKey]) {
          activitiesByDate[dateKey] = [];
        }
        activitiesByDate[dateKey].push(activity);
      });

      // Calculate cumulative progress
      let cumulativeLessons = 0;
      const dates = Object.keys(activitiesByDate).sort();

      for (const dateKey of dates) {
        const date = new Date(dateKey);
        const lessonsOnThisDay = activitiesByDate[dateKey].length;
        cumulativeLessons += lessonsOnThisDay;

        // Create or update lesson progress record
        try {
          await prisma.userLessonProgress.upsert({
            where: {
              userId_date: {
                userId: user.id,
                date: date
              }
            },
            update: {
              totalLessonsCompleted: cumulativeLessons,
              lessonsCompletedToday: lessonsOnThisDay
            },
            create: {
              userId: user.id,
              date: date,
              totalLessonsCompleted: cumulativeLessons,
              lessonsCompletedToday: lessonsOnThisDay,
              exercisesCompletedToday: 0,
              studyTimeToday: 0
            }
          });
        } catch (error) {
          console.log(`Error creating lesson progress for user ${user.email} on ${dateKey}:`, error.message);
        }
      }

      // If user has visitedLessons data, use it to set initial cumulative total
      if (user.visitedLessons && typeof user.visitedLessons === 'object') {
        const visitedData = user.visitedLessons;
        let totalVisitedLessons = 0;
        
        Object.keys(visitedData).forEach(language => {
          const lessons = visitedData[language];
          if (Array.isArray(lessons)) {
            totalVisitedLessons += lessons.length;
          }
        });

        if (totalVisitedLessons > 0) {
          console.log(`User ${user.email} has ${totalVisitedLessons} visited lessons`);
          
          // Create a progress record for today with the total lessons
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          
          await prisma.userLessonProgress.upsert({
            where: {
              userId_date: {
                userId: user.id,
                date: today
              }
            },
            update: {
              totalLessonsCompleted: totalVisitedLessons,
              lessonsCompletedToday: totalVisitedLessons // Set today's lessons to the total for now
            },
            create: {
              userId: user.id,
              date: today,
              totalLessonsCompleted: totalVisitedLessons,
              lessonsCompletedToday: totalVisitedLessons,
              exercisesCompletedToday: 0,
              studyTimeToday: 0
            }
          });
        }
      }
    }

    console.log('Lesson progress population completed!');
  } catch (error) {
    console.error('Error populating lesson progress:', error);
  } finally {
    await prisma.$disconnect();
  }
}

populateLessonProgress(); 