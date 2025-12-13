import { NextRequest, NextResponse } from "next/server";
import { auth } from "../../auth/authOptions";
import { prisma } from "@/lib/prisma";

// OPTIMIZED: Add caching to reduce repeated API calls
export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user from database
    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
      select: {
        id: true,
        username: true,
        name: true,
        surname: true,
        email: true,
        avatarUrl: true,
        role: true,
        createdAt: true,
        lastLoginDate: true,
        dailyLoginPoints: true,
        completedChallenges: true,
        visitedLessons: true,
        savedLessons: true,
        solvedExercises: true,
        progress: true,
        premiumStatus: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get solved exercises data
    let solvedExercises = 0;
    let solvedExercisesData: any[] = [];
    try {
      const userWithSolved = await prisma.user.findUnique({
        where: { id: user.id }
      }) as any;
      
      solvedExercises = (userWithSolved?.solvedExercises || []).length;
      
      if (solvedExercises > 0) {
        const solvedExerciseIds = userWithSolved?.solvedExercises || [];
        solvedExercisesData = await prisma.exercise.findMany({
          where: { 
            id: { in: solvedExerciseIds },
            published: true
          },
          select: {
            id: true,
            title: true,
            difficulty: true,
            category: true,
            content: true
          },
          orderBy: { id: 'desc' },
          take: 10
        });
      }
    } catch (error: any) {
      console.log("Solved exercises data not available:", error.message);
      solvedExercises = 0;
      solvedExercisesData = [];
    }

    // Get total lessons count
    let totalLessons = 0;
    try {
      totalLessons = await prisma.tutorial.count({
        where: { published: true }
      });
      
      if (totalLessons === 0) {
        totalLessons = 400; // reasonable default
      }
    } catch (error: any) {
      console.log("Tutorial table not available, using fixed estimate:", error.message);
      totalLessons = 400;
    }

    // Get completed lessons count
    let completedLessons = 0;
    try {
      if (user.visitedLessons) {
        if (Array.isArray(user.visitedLessons)) {
          completedLessons = user.visitedLessons.length;
        } else if (typeof user.visitedLessons === 'object') {
          const visitedData = user.visitedLessons as any;
          Object.keys(visitedData).forEach(language => {
            const lessons = visitedData[language];
            if (Array.isArray(lessons)) {
              completedLessons += lessons.length;
            }
          });
        }
      }
    } catch (error: any) {
      console.log("Error parsing visitedLessons:", error.message);
      completedLessons = 0;
    }

    // Get total exercises count
    let totalExercises = 0;
    try {
      totalExercises = await prisma.exercise.count({
        where: { published: true }
      });
    } catch (error: any) {
      console.log("Exercise table not available, using fallback:", error.message);
      totalExercises = 300;
    }

    // Calculate completion percentage
    const completionRate = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

    // Get activity tracking data
    let recentActivities: any[] = [];
    let sessionStats = { _sum: { duration: 0 } };
    let todayActivity = null;
    let loginStreak = 0;
    let longestStreak = 0;
    let weeklyStats = { 
      _sum: { 
        lessonsViewed: 0, 
        exercisesSolved: 0, 
        studyTime: 0, 
        pointsEarned: 0 
      } 
    };

    try {
      // Get recent activities
      recentActivities = await prisma.userActivity.findMany({
        where: { userId: user.id },
        orderBy: { timestamp: 'desc' },
        take: 100,
        select: {
          id: true,
          type: true,
          description: true,
          timestamp: true,
          metadata: true
        }
      });

      // Get session statistics
      const sessionResult = await prisma.userSession.aggregate({
        where: { 
          userId: user.id,
          duration: { not: null }
        },
        _sum: {
          duration: true
        }
      });
      
      sessionStats = { _sum: { duration: sessionResult._sum.duration || 0 } };

      // Get today's activity
      const now = new Date();
      const azerbaijanOffset = 4 * 60 * 60 * 1000; // 4 hours in milliseconds
      const azerbaijanTime = new Date(now.getTime() + azerbaijanOffset);
      const today = new Date(azerbaijanTime.getFullYear(), azerbaijanTime.getMonth(), azerbaijanTime.getDate());

      todayActivity = await prisma.dailyActivity.findUnique({
        where: {
          userId_date: {
            userId: user.id,
            date: today
          }
        }
      });

      // OPTIMIZED: Calculate login streak with batch query instead of loop
      const last30Days = new Date(today);
      last30Days.setDate(today.getDate() - 30);
      
      const recentDailyActivities = await prisma.dailyActivity.findMany({
        where: {
          userId: user.id,
          date: { gte: last30Days, lte: today }
        },
        orderBy: { date: 'desc' }
      });
      
      // Calculate streak from most recent days
      for (const dayActivity of recentDailyActivities) {
        const dayDate = new Date(dayActivity.date);
        const expectedDate = new Date(today);
        expectedDate.setDate(today.getDate() - loginStreak);
        expectedDate.setHours(0, 0, 0, 0);
        
        if (dayDate.getTime() === expectedDate.getTime() && 
            (dayActivity.studyTime > 0 || dayActivity.exercisesSolved > 0 || dayActivity.lessonsViewed > 0)) {
          loginStreak++;
        } else if (loginStreak > 0) {
          break;
        }
      }

      // Get weekly stats
      const weekNow = new Date();
      const weekAzerbaijanOffset = 4 * 60 * 60 * 1000; // 4 hours in milliseconds
      const weekAzerbaijanTime = new Date(weekNow.getTime() + weekAzerbaijanOffset);
      const weekToday = new Date(weekAzerbaijanTime.getFullYear(), weekAzerbaijanTime.getMonth(), weekAzerbaijanTime.getDate());
      
      const weekAgo = new Date(weekToday);
      weekAgo.setDate(weekToday.getDate() - 7);

      const weeklyLessonViews = await prisma.userActivity.count({
        where: {
          userId: user.id,
          type: 'LESSON_VIEW',
          timestamp: { gte: weekAgo }
        }
      });

      const weeklyResult = await prisma.dailyActivity.aggregate({
        where: {
          userId: user.id,
          date: { gte: weekAgo }
        },
        _sum: {
          exercisesSolved: true,
          studyTime: true,
          pointsEarned: true
        }
      });

      weeklyStats = { 
        _sum: { 
          lessonsViewed: weeklyLessonViews,
          exercisesSolved: weeklyResult._sum.exercisesSolved || 0, 
          studyTime: weeklyResult._sum.studyTime || 0, 
          pointsEarned: weeklyResult._sum.pointsEarned || 0 
        } 
      };

      // OPTIMIZED: Use existing data for longest streak
      longestStreak = Math.max(loginStreak, recentDailyActivities.filter(d => 
        d.lessonsViewed > 0 || d.exercisesSolved > 0 || d.quizzesTaken > 0
      ).length);

    } catch (error: any) {
      console.log("Activity tracking tables not available:", error.message);
      recentActivities = [];
      sessionStats = { _sum: { duration: 0 } };
      weeklyStats = { _sum: { lessonsViewed: 0, exercisesSolved: 0, studyTime: 0, pointsEarned: 0 } };
      loginStreak = 0;
      longestStreak = 0;
    }

    // Calculate completed languages and language progress
    let completedLanguages = 0;
    let completedLanguagesList: string[] = [];
    let languageProgress: any = {};
    
    try {
      if (user.visitedLessons && typeof user.visitedLessons === 'object') {
        const visitedData = user.visitedLessons as any;
        
        const formatLanguageName = (language: string): string => {
          const languageMap: any = {
            'c': 'C', 'java': 'Java', 'c++': 'C++', 'c%2B%2B': 'C++', 'cpp': 'C++',
            'algorithms': 'Algorithms', 'javascript': 'JavaScript', 'python': 'Python',
            'csharp': 'C#', 'data-structures': 'Data Structures', 'typescript': 'TypeScript',
            'php': 'PHP', 'go': 'Go', 'rust': 'Rust', 'swift': 'Swift', 'kotlin': 'Kotlin',
            'ruby': 'Ruby', 'r': 'R', 'sql': 'SQL', 'dart': 'Dart', 'haskell': 'Haskell',
            'scala': 'Scala', 'bash': 'Bash', 'matlab': 'MATLAB'
          };
          return languageMap[language] || language;
        };

        const formatDateAsText = (dateString: string): string => {
          try {
            const date = new Date(dateString);
            // Don't add timezone offset since we want to use the actual date
            const day = date.getDate();
            const month = date.getMonth();
            
            const monthNames = [
              'yanvar', 'fevral', 'mart', 'aprel', 'may', 'iyun',
              'iyul', 'avqust', 'sentyabr', 'oktyabr', 'noyabr', 'dekabr'
            ];
            
            return `${day} ${monthNames[month]}`;
          } catch (error) {
            return 'Never';
          }
        };

        // OPTIMIZED: Use static counts instead of making internal API calls
        const getTopicCount = (language: string): number => {
          const topicCounts: any = {
            'c': 38, 'java': 35, 'c++': 34, 'c%2B%2B': 34, 'cpp': 34,
            'algorithms': 25, 'javascript': 43, 'python': 32, 'csharp': 42,
            'data-structures': 27, 'typescript': 40, 'php': 33, 'go': 20,
            'rust': 20, 'swift': 20, 'kotlin': 20, 'ruby': 20, 'r': 15,
            'sql': 15, 'dart': 15, 'haskell': 15, 'scala': 15, 'bash': 15, 
            'matlab': 15, 'react': 8, 'angular': 1, 'vue': 1, 'svelte': 1, 'nextjs': 1
          };
          
          return topicCounts[language] || 20; // Default to 20 if not found
        };

        for (const language of Object.keys(visitedData)) {
          const lessons = visitedData[language];
          
          if (Array.isArray(lessons)) {
            const completedLessons = lessons.length;
            const totalForLanguage = getTopicCount(language);
            const progress = totalForLanguage > 0 ? Math.round((completedLessons / totalForLanguage) * 100) : 0;
            
            let lastStudied = null;
            let lastStudiedFormatted = 'Never';
            let lastViewedTopic = null;
            let lastViewedTopicId = null;
            
            if (lessons.length > 0) {
              // Use current date without timezone offset
              const now = new Date();
              lastStudied = now.toISOString();
              lastStudiedFormatted = formatDateAsText(lastStudied);
              
              // Get the last viewed topic
              const lastLesson = lessons[lessons.length - 1];
              if (lastLesson) {
                lastViewedTopic = lastLesson;
                lastViewedTopicId = lastLesson;
              }
            }
            
            languageProgress[language] = {
              displayName: formatLanguageName(language),
              lessons: completedLessons,
              totalLessons: totalForLanguage,
              progress: progress,
              lastStudied: lastStudied,
              lastStudiedFormatted: lastStudiedFormatted,
              lastViewedTopic: lastViewedTopic,
              lastViewedTopicId: lastViewedTopicId,
              // Add lesson details for the lessons tab
              lessonDetails: {
                completed: completedLessons,
                total: totalForLanguage,
                progress: progress,
                lastTopic: lastViewedTopic,
                lastTopicId: lastViewedTopicId,
                language: language,
                displayName: formatLanguageName(language)
              }
            };
            
            if (completedLessons >= totalForLanguage && totalForLanguage > 0) {
              completedLanguages++;
              completedLanguagesList.push(formatLanguageName(language));
            }
          }
        }
      }
    } catch (error: any) {
      console.log("Error calculating completed languages:", error.message);
      completedLanguages = 0;
      completedLanguagesList = [];
      languageProgress = {};
    }

    // Get achievements
    let achievements: any[] = [];
    try {
      achievements = await prisma.achievement.findMany({
        where: { userId: user.id },
        select: {
          id: true,
          type: true,
          name: true,
          description: true,
          unlockedAt: true,
          points: true,
          claimed: true
        }
      });
    } catch (error: any) {
      console.log("Achievements table not available:", error.message);
      achievements = [];
    }

    // Calculate study time formatting
    const totalSeconds = sessionStats._sum.duration || 0;
    const studyTimeHours = Math.floor(totalSeconds / 3600);
    const studyTimeMinutes = Math.floor((totalSeconds % 3600) / 60);
    const studyTimeSeconds = totalSeconds % 60;
    
    let formattedStudyTime = '';
    if (studyTimeHours > 0) {
      formattedStudyTime += `${studyTimeHours}s `;
    }
    if (studyTimeMinutes > 0) {
      formattedStudyTime += `${studyTimeMinutes}dəq `;
    }
    if (studyTimeSeconds > 0 && studyTimeHours === 0 && studyTimeMinutes === 0) {
      formattedStudyTime += `${studyTimeSeconds}san`;
    }
    
    if (!formattedStudyTime.trim()) {
      formattedStudyTime = '0dəq';
    }
    
    const studyTimeHoursSimple = Math.floor(totalSeconds / 3600);
    
    // Calculate user rank
    let rank = "Beginner";
    const totalPoints = user.dailyLoginPoints || 0;
    if (totalPoints >= 5000) rank = "Expert";
    else if (totalPoints >= 2000) rank = "Advanced";
    else if (totalPoints >= 500) rank = "Intermediate";
    
    const todayCoins = todayActivity?.pointsEarned || 0;
    const learningStreak = loginStreak;

    // Calculate achievements data
    let totalAchievements = 0;
    let unlockedAchievements = 0;
    
    try {
      let completedLessons = 0;
      let completedLanguages = 0;
      
      if (user.visitedLessons) {
        if (Array.isArray(user.visitedLessons)) {
          completedLessons = user.visitedLessons.length;
        } else if (typeof user.visitedLessons === 'object') {
          const visitedData = user.visitedLessons as any;
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
      
      const achievementDefinitions = [
        { id: "first_lesson", name: "First Steps", unlocked: completedLessons > 0 },
        { id: "lesson_explorer", name: "Knowledge Seeker", unlocked: completedLessons >= 10 },
        { id: "lesson_master", name: "Learning Legend", unlocked: completedLessons >= 50 },
        { id: "language_master", name: "Polyglot", unlocked: completedLanguages >= 5 },
        { id: "completionist", name: "Completionist", unlocked: completedLessons >= 100 },
        { id: "first_solve", name: "Problem Solver", unlocked: solvedExercises > 0 },
        { id: "coding_ninja", name: "Code Ninja", unlocked: solvedExercises >= 25 },
        { id: "algorithm_master", name: "Algorithm Master", unlocked: solvedExercises >= 100 },
        { id: "speed_demon", name: "Speed Demon", unlocked: false },
        { id: "perfect_score", name: "Perfect Score", unlocked: false },
        { id: "daily_learner", name: "Daily Learner", unlocked: loginStreak >= 3 },
        { id: "week_warrior", name: "Week Warrior", unlocked: loginStreak >= 7 },
        { id: "month_master", name: "Month Master", unlocked: loginStreak >= 30 },
        { id: "study_hours", name: "Study Enthusiast", unlocked: studyTimeHours >= 10 },
        { id: "dedicated_learner", name: "Dedicated Learner", unlocked: studyTimeHours >= 50 },
        { id: "early_bird", name: "Early Bird", unlocked: true },
        { id: "bookmark_collector", name: "Bookmark Collector", unlocked: savedLessonsCount >= 20 },
        { id: "helpful_member", name: "Helpful Member", unlocked: false },
        { id: "feedback_provider", name: "Feedback Provider", unlocked: false },
        { id: "community_ambassador", name: "Community Ambassador", unlocked: false },
        { id: "night_owl", name: "Night Owl", unlocked: false },
        { id: "weekend_warrior", name: "Weekend Warrior", unlocked: false },
        { id: "multitasker", name: "Multitasker", unlocked: false },
        { id: "persistent", name: "Persistent", unlocked: false },
      ];
      
      totalAchievements = achievementDefinitions.length;
      unlockedAchievements = achievementDefinitions.filter(ach => ach.unlocked).length;
    } catch (error: any) {
      console.log("Achievements calculation error:", error.message);
      totalAchievements = 24;
      unlockedAchievements = 0;
    }

    // Format recent activities
    let formattedActivities = [];
    
    if (recentActivities.length > 0) {
      formattedActivities = recentActivities
        .map(activity => ({
          type: activity.type.toLowerCase(),
          text: activity.description,
          time: formatTimeAgo(activity.timestamp),
          metadata: activity.metadata,
          language: activity.metadata?.language || null,
          id: activity.id
        }))
        .filter((activity, index, array) => {
          const firstIndex = array.findIndex(a => a.text === activity.text);
          return firstIndex === index;
        })
        .slice(0, 10);
    } else {
      formattedActivities = [
        {
          type: "login",
          text: "Welcome to the platform!",
          time: "Just now",
          metadata: {},
          language: null
        },
        {
          type: "lesson_view",
          text: "Start exploring tutorials",
          time: "Just now",
          metadata: {},
          language: null
        }
      ];
    }

    // Get streak data
    const streakData = await getStreakData(user.id);

    const userStats = {
      // User info
      user: {
        name: user.name,
        surname: user.surname,
        username: user.username,
        email: user.email,
        avatarUrl: user.avatarUrl,
        role: user.role,
        premiumStatus: user.premiumStatus,
        joinDate: user.createdAt,
        lastActive: user.lastLoginDate,
      },
      
      // Coin system
      dailyLoginPoints: user.dailyLoginPoints || 0,
      todayCoins,
      loginStreak,
      longestStreak,
      
      // Learning stats
      totalLessons,
      completedLessons,
      totalExercises,
      solvedExercises,
      solvedExercisesData,
      completionRate,
      completedLanguages,
      completedLanguagesList,
      languageProgress,
      studyTimeHours: studyTimeHoursSimple,
      formattedStudyTime,
      rank,
      
      // Achievements
      totalAchievements,
      unlockedAchievements,
      learningStreak,
      achievements,
      
      // Activities
      recentActivities: formattedActivities,
      
      // Progress trends
      weeklyProgress: {
        lessonsThisWeek: weeklyStats._sum.lessonsViewed || 0,
        exercisesThisWeek: weeklyStats._sum.exercisesSolved || 0,
        studyTimeThisWeek: Math.floor((weeklyStats._sum.studyTime || 0) / 3600),
        studyTimeThisWeekFormatted: formatStudyTime(weeklyStats._sum.studyTime || 0),
        pointsThisWeek: weeklyStats._sum.pointsEarned || 0,
      },
      
      // Calendar data
      calendarData: {
        activeDays: learningStreak,
        thisWeekStudyTime: weeklyStats._sum.studyTime || 0,
        thisWeekStudyTimeFormatted: formatStudyTime(weeklyStats._sum.studyTime || 0),
        dailyActivities: await getDailyActivities(user.id, 7)
      },

      // Streak data
      streakData
    };

    // Add caching headers for better performance (5 seconds cache)
    const response = NextResponse.json(userStats);
    response.headers.set('Cache-Control', 'private, max-age=5, stale-while-revalidate=10');
    return response;
    
  } catch (error: any) {
    console.error("Error fetching user profile:", error);
    return NextResponse.json(
      { 
        error: "Internal server error", 
        details: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}

// Helper function to format time ago
function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInMinutes < 1) return 'Just now';
  if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
  if (diffInHours < 24) return `${diffInHours} hours ago`;
  if (diffInDays < 7) return `${diffInDays} days ago`;
  
  return date.toLocaleDateString();
}

// Helper function to format study time
function formatStudyTime(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const parts = [];
  if (hours > 0) {
    parts.push(`${hours}s`);
  }
  if (minutes > 0) {
    parts.push(`${minutes}dəq`);
  }
  if (seconds > 0 && hours === 0 && minutes === 0) {
    parts.push(`${seconds}san`);
  }

  return parts.join(' ');
}

// OPTIMIZED: Get daily activities with batch query instead of loop
async function getDailyActivities(userId: number, days: number) {
  try {
    const now = new Date();
    const azerbaijanOffset = 4 * 60 * 60 * 1000;
    const azerbaijanTime = new Date(now.getTime() + azerbaijanOffset);
    const today = new Date(azerbaijanTime.getFullYear(), azerbaijanTime.getMonth(), azerbaijanTime.getDate());
    
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - (days - 1));
    startDate.setHours(0, 0, 0, 0);
    
    // Batch fetch all daily activities
    const dailyActivities = await prisma.dailyActivity.findMany({
      where: {
        userId,
        date: { gte: startDate, lte: today }
      }
    });
    
    // Batch count lesson views for the period
    const lessonViews = await prisma.userActivity.groupBy({
      by: ['timestamp'],
      where: {
        userId,
        type: 'LESSON_VIEW',
        timestamp: { gte: startDate }
      },
      _count: true
    });
    
    const activities = [];
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      date.setHours(0, 0, 0, 0);
      
      const dayActivity = dailyActivities.find(da => 
        new Date(da.date).getTime() === date.getTime()
      );
      
      const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
      
      activities.push({
        date: dateStr,
        hasActivity: dayActivity ? (dayActivity.studyTime > 0 || dayActivity.lessonsViewed > 0 || dayActivity.exercisesSolved > 0) : false,
        studyTime: dayActivity?.studyTime || 0,
        lessonsViewed: dayActivity?.lessonsViewed || 0,
        exercisesSolved: dayActivity?.exercisesSolved || 0,
        pointsEarned: dayActivity?.pointsEarned || 0
      });
    }
    
    return activities;
  } catch (error: any) {
    console.log("Error getting daily activities:", error.message);
    return Array.from({ length: days }, (_, i) => ({
      date: new Date().toISOString().split('T')[0],
      hasActivity: false,
      studyTime: 0,
      lessonsViewed: 0,
      exercisesSolved: 0,
      pointsEarned: 0
    }));
  }
}

// OPTIMIZED: Get streak data with minimal logging
async function getStreakData(userId: number) {
  try {
    const now = new Date();
    const azerbaijanOffset = 4 * 60 * 60 * 1000;
    const azerbaijanTime = new Date(now.getTime() + azerbaijanOffset);
    const today = new Date(azerbaijanTime.getFullYear(), azerbaijanTime.getMonth(), azerbaijanTime.getDate());
    
    const oneYearAgo = new Date(today);
    oneYearAgo.setDate(today.getDate() - 364);
    oneYearAgo.setHours(0, 0, 0, 0);

    const dailyActivities = await prisma.dailyActivity.findMany({
      where: {
        userId,
        date: { gte: oneYearAgo }
      },
      orderBy: { date: 'asc' }
    });

    const streakDays = [];
    
    for (let i = 0; i < 365; i++) {
      const currentDate = new Date(oneYearAgo);
      currentDate.setDate(oneYearAgo.getDate() + i);
      currentDate.setHours(0, 0, 0, 0);
      
      const dayActivity = dailyActivities.find((activity: any) => {
        const activityDate = new Date(activity.date);
        activityDate.setHours(0, 0, 0, 0);
        return activityDate.getTime() === currentDate.getTime();
      });
      
      const isActive = dayActivity && (dayActivity.lessonsViewed > 0 || dayActivity.exercisesSolved > 0 || dayActivity.quizzesTaken > 0);
      
      let activityLevel = 0;
      if (dayActivity) {
        const totalActivity = (dayActivity.lessonsViewed || 0) + (dayActivity.exercisesSolved || 0) + (dayActivity.quizzesTaken || 0);
        if (totalActivity >= 10) activityLevel = 4;
        else if (totalActivity >= 7) activityLevel = 3;
        else if (totalActivity >= 4) activityLevel = 2;
        else if (totalActivity >= 1) activityLevel = 1;
      }
      
      streakDays.push({ 
        date: currentDate.toISOString(), 
        day: currentDate.getDate(),
        month: currentDate.getMonth() + 1,
        year: currentDate.getFullYear(),
        dayOfWeek: currentDate.getDay(),
        isActive, 
        isToday: i === 364,
        activityLevel,
        lessonsViewed: dayActivity?.lessonsViewed || 0,
        exercisesSolved: dayActivity?.exercisesSolved || 0,
        quizzesTaken: dayActivity?.quizzesTaken || 0
      });
    }

    return streakDays;
  } catch (error) {
    console.error("Error getting streak data:", error);
    return [];
  }
} 