import { NextRequest, NextResponse } from "next/server";
import { auth } from "../../auth/authOptions";
import { prisma } from "@/lib/prisma";

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

    // Get solved exercises data separately
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

    // Get total lessons count - use fixed values to prevent fluctuations
    let totalLessons = 0;
    try {
      totalLessons = await prisma.tutorial.count({
        where: { published: true }
      });
      
      // If no tutorials in database, use fixed estimates
      if (totalLessons === 0) {
        // Fixed total lessons count based on available content
        const fixedLanguageTotals: any = {
          'c': 25,
          'java': 30,
          'c++': 25,
          'c%2B%2B': 25,
          'algorithms': 20,
          'javascript': 35,
          'python': 30,
          'csharp': 30,
          'data-structures': 25,
          'typescript': 25,
          'php': 20,
          'go': 20,
          'rust': 20,
          'swift': 20,
          'kotlin': 20,
          'ruby': 20,
          'r': 15,
          'sql': 15,
          'dart': 15,
          'haskell': 15,
          'scala': 15,
          'bash': 15,
          'matlab': 15
        };
        
        // Calculate total based on all available languages (not just visited ones)
        totalLessons = Object.values(fixedLanguageTotals).reduce((sum: number, count: any) => sum + count, 0);
        
        // If still 0, use a reasonable default
        if (totalLessons === 0) {
          totalLessons = 400; // reasonable default for all available content
        }
      }
    } catch (error: any) {
      console.log("Tutorial table not available, using fixed estimate:", error.message);
      totalLessons = 400; // fixed fallback value
    }

    // Get completed lessons count
    let completedLessons = 0;
    try {
      console.log('Raw visitedLessons data:', {
        type: typeof user.visitedLessons,
        value: user.visitedLessons,
        isArray: Array.isArray(user.visitedLessons),
        isObject: typeof user.visitedLessons === 'object' && user.visitedLessons !== null
      });
      
      if (user.visitedLessons) {
        if (Array.isArray(user.visitedLessons)) {
          // If it's an array, count directly
          completedLessons = user.visitedLessons.length;
          console.log('VisitedLessons is array, count:', completedLessons);
        } else if (typeof user.visitedLessons === 'object') {
          // If it's an object, count lessons in each language
          const visitedData = user.visitedLessons as any;
          console.log('VisitedLessons is object:', visitedData);
          
          // Count all lessons across all languages
          Object.keys(visitedData).forEach(language => {
            const lessons = visitedData[language];
            if (Array.isArray(lessons)) {
              completedLessons += lessons.length;
              console.log(`Language ${language}: ${lessons.length} lessons`);
            }
          });
          
          console.log('Total completed lessons:', completedLessons);
        }
      } else {
        console.log('No visitedLessons data found');
      }
    } catch (error: any) {
      console.log("Error parsing visitedLessons:", error.message);
      completedLessons = 0;
    }

    console.log('Lessons data:', {
      totalLessons,
      completedLessons,
      completionRate: totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0,
      visitedLessons: user.visitedLessons
    });

    // Get total exercises count
    let totalExercises = 0;
    try {
      totalExercises = await prisma.exercise.count({
        where: { published: true }
      });
    } catch (error: any) {
      console.log("Exercise table not available, using fallback:", error.message);
      totalExercises = 300; // Fallback value
    }

    // Calculate completion percentage
    const completionRate = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

    // Get activity tracking data first
    let recentActivities: any[] = [];
    let sessionStats = { _sum: { duration: 0 } };
    let todayActivity = null;
    let loginStreak = 0;
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
        take: 10,
        select: {
          id: true,
          type: true,
          description: true,
          timestamp: true,
          metadata: true
        }
      });

      console.log('Raw recent activities:', recentActivities.map(a => ({
        id: a.id,
        type: a.type,
        description: a.description,
        metadata: a.metadata
      })));

      console.log('Recent activities data:', {
        count: recentActivities.length,
        activities: recentActivities.map(a => ({ 
          id: a.id, 
          type: a.type, 
          description: a.description, 
          timestamp: a.timestamp 
        }))
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
      
      console.log('Study time data:', {
        totalDuration: sessionResult._sum.duration,
        studyTimeHours: Math.floor((sessionResult._sum.duration || 0) / 3600),
        sessions: await prisma.userSession.count({ where: { userId: user.id } })
      });

      // Get weekly statistics
      const weekStart = new Date();
      weekStart.setDate(weekStart.getDate() - 7);
      
      weeklyStats = await prisma.userActivity.aggregate({
        where: {
          userId: user.id,
          timestamp: { gte: weekStart }
        },
        _sum: {
          lessonsViewed: true,
          exercisesSolved: true,
          studyTime: true,
          pointsEarned: true
        }
      });

      // Get login streak
      const dailyActivities = await prisma.dailyActivity.findMany({
        where: { userId: user.id },
        orderBy: { date: 'desc' },
        take: 30
      });

      loginStreak = 0;
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      for (let i = 0; i < dailyActivities.length; i++) {
        const activityDate = new Date(dailyActivities[i].date);
        activityDate.setHours(0, 0, 0, 0);
        
        const expectedDate = new Date(today);
        expectedDate.setDate(today.getDate() - i);
        
        if (activityDate.getTime() === expectedDate.getTime()) {
          loginStreak++;
        } else {
          break;
        }
      }

    } catch (error: any) {
      console.log("Activity tracking tables not available");
      recentActivities = [];
      sessionStats = { _sum: { duration: 0 } };
      weeklyStats = { _sum: { lessonsViewed: 0, exercisesSolved: 0, studyTime: 0, pointsEarned: 0 } };
      loginStreak = 0;
    }

    // Get recent activities for last studied calculation
    let recentActivitiesForLanguages: any[] = [];
    try {
      recentActivitiesForLanguages = await prisma.userActivity.findMany({
        where: { 
          userId: user.id,
          type: 'LESSON_VIEW'
        },
        orderBy: { timestamp: 'desc' },
        take: 50,
        select: {
          id: true,
          type: true,
          description: true,
          timestamp: true,
          metadata: true
        }
      });
      console.log('Recent activities for languages:', recentActivitiesForLanguages.length);
    } catch (error: any) {
      console.log("Could not fetch recent activities for languages:", error.message);
      recentActivitiesForLanguages = [];
    }

    // Calculate completed languages (100% completed) and language progress
    let completedLanguages = 0;
    let completedLanguagesList: string[] = [];
    let languageProgress: any = {};
    
    try {
      if (user.visitedLessons && typeof user.visitedLessons === 'object') {
        const visitedData = user.visitedLessons as any;
        
        // Fixed lesson counts for each language
        const languageLessonCounts: any = {
          'c': 25,
          'java': 30,
          'c++': 25,
          'c%2B%2B': 25,
          'cpp': 25,
          'algorithms': 20,
          'javascript': 35,
          'python': 30,
          'csharp': 30,
          'data-structures': 25,
          'typescript': 25,
          'php': 20,
          'go': 20,
          'rust': 20,
          'swift': 20,
          'kotlin': 20,
          'ruby': 20,
          'r': 15,
          'sql': 15,
          'dart': 15,
          'haskell': 15,
          'scala': 15,
          'bash': 15,
          'matlab': 15
        };

        // Helper function to format language names
        const formatLanguageName = (language: string): string => {
          const languageMap: any = {
            'c': 'C',
            'java': 'Java',
            'c++': 'C++',
            'c%2B%2B': 'C++',
            'cpp': 'C++',
            'algorithms': 'Algorithms',
            'javascript': 'JavaScript',
            'python': 'Python',
            'csharp': 'C#',
            'data-structures': 'Data Structures',
            'typescript': 'TypeScript',
            'php': 'PHP',
            'go': 'Go',
            'rust': 'Rust',
            'swift': 'Swift',
            'kotlin': 'Kotlin',
            'ruby': 'Ruby',
            'r': 'R',
            'sql': 'SQL',
            'dart': 'Dart',
            'haskell': 'Haskell',
            'scala': 'Scala',
            'bash': 'Bash',
            'matlab': 'MATLAB'
          };
          
          return languageMap[language] || language;
        };

        // Calculate progress for each language
        Object.keys(visitedData).forEach(language => {
          const lessons = visitedData[language];
          const totalForLanguage = languageLessonCounts[language] || 0;
          
          if (Array.isArray(lessons)) {
            const completedLessons = lessons.length;
            const progress = totalForLanguage > 0 ? Math.round((completedLessons / totalForLanguage) * 100) : 0;
            
            // Find the most recent lesson date
            let lastStudied = null;
            if (lessons.length > 0) {
              // Find the most recent activity for this language from recentActivitiesForLanguages
              const languageActivities = recentActivitiesForLanguages.filter((activity: any) => 
                activity.metadata?.language === language
              );
              
              console.log(`Language ${language} activities:`, languageActivities);
              
              if (languageActivities.length > 0) {
                // Sort by timestamp and get the most recent
                const sortedActivities = languageActivities.sort((a: any, b: any) => 
                  new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
                );
                lastStudied = sortedActivities[0].timestamp;
                console.log(`Language ${language} last studied:`, lastStudied);
              } else {
                // Fallback: use a date based on lesson count (more recent for more lessons)
                const now = new Date();
                const daysAgo = Math.max(1, 10 - lessons.length); // More lessons = more recent
                const recentDate = new Date(now.getTime() - (daysAgo * 24 * 60 * 60 * 1000));
                lastStudied = recentDate.toISOString();
                console.log(`Language ${language} fallback last studied:`, lastStudied);
              }
            }
            
            languageProgress[language] = {
              displayName: formatLanguageName(language),
              lessons: completedLessons,
              totalLessons: totalForLanguage,
              progress: progress,
              lastStudied: lastStudied
            };
            
            // Check for 100% completion
            if (completedLessons >= totalForLanguage && totalForLanguage > 0) {
            completedLanguages++;
            completedLanguagesList.push(formatLanguageName(language));
            }
          }
        });
      }
    } catch (error: any) {
      console.log("Error calculating completed languages:", error.message);
      completedLanguages = 0;
      completedLanguagesList = [];
      languageProgress = {};
    }

    // Get achievements from database
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

    // Activity tracking data is already fetched above

    try {
      // Get recent activities
      recentActivities = await prisma.userActivity.findMany({
        where: { userId: user.id },
        orderBy: { timestamp: 'desc' },
        take: 10,
        select: {
          id: true,
          type: true,
          description: true,
          timestamp: true,
          metadata: true
        }
      });

      console.log('Raw recent activities:', recentActivities.map(a => ({
        id: a.id,
        type: a.type,
        description: a.description,
        metadata: a.metadata
      })));

      console.log('Recent activities data:', {
        count: recentActivities.length,
        activities: recentActivities.map(a => ({ 
          id: a.id, 
          type: a.type, 
          description: a.description, 
          timestamp: a.timestamp 
        }))
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
      
      console.log('Study time data:', {
        totalDuration: sessionResult._sum.duration,
        studyTimeHours: Math.floor((sessionResult._sum.duration || 0) / 3600),
        sessions: await prisma.userSession.count({ where: { userId: user.id } })
      });

      // Get today's activity
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      todayActivity = await prisma.dailyActivity.findUnique({
        where: {
          userId_date: {
            userId: user.id,
            date: today
          }
        }
      });

      // Calculate login streak using study time instead of login count
      let checkDate = new Date(today);
      while (true) {
        const dayActivity = await prisma.dailyActivity.findUnique({
          where: {
            userId_date: {
              userId: user.id,
              date: checkDate
            }
          }
        });
        
        if (dayActivity && (dayActivity.studyTime > 0 || dayActivity.exercisesSolved > 0 || dayActivity.lessonsViewed > 0)) {
          loginStreak++;
          checkDate.setDate(checkDate.getDate() - 1);
        } else {
          break;
        }
      }

      // Get weekly stats - use UserActivity for accurate lesson counting
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);

      // Count actual lesson views from UserActivity table
      const weeklyLessonViews = await prisma.userActivity.count({
        where: {
          userId: user.id,
          type: 'LESSON_VIEW',
          timestamp: { gte: weekAgo }
        }
      });

      // Get other stats from dailyActivity
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
          lessonsViewed: weeklyLessonViews, // Use accurate count from UserActivity
          exercisesSolved: weeklyResult._sum.exercisesSolved || 0, 
          studyTime: weeklyResult._sum.studyTime || 0, 
          pointsEarned: weeklyResult._sum.pointsEarned || 0 
        } 
      };

    } catch (error: any) {
      console.log("Activity tracking tables not available:", error.message);
    }
    
    // Calculate study time from session data with better formatting
    const totalSeconds = sessionStats._sum.duration || 0;
    const studyTimeHours = Math.floor(totalSeconds / 3600);
    const studyTimeMinutes = Math.floor((totalSeconds % 3600) / 60);
    const studyTimeSeconds = totalSeconds % 60;
    
    // Format study time as "1s 15dəq" or "2s 30dəq 45san" etc.
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
    
    // If no time, show "0dəq"
    if (!formattedStudyTime.trim()) {
      formattedStudyTime = '0dəq';
    }
    
    // Also keep the old format for backward compatibility
    const studyTimeHoursSimple = Math.floor(totalSeconds / 3600);
    
    // Get user rank based on points and activity
    let rank = "Beginner";
    const totalPoints = user.dailyLoginPoints || 0;
    if (totalPoints >= 5000) rank = "Expert";
    else if (totalPoints >= 2000) rank = "Advanced";
    else if (totalPoints >= 500) rank = "Intermediate";
    
    // Calculate today's coins based on today's activity
    const todayCoins = todayActivity?.pointsEarned || 0;
    
    // Calculate learning streak (consecutive days with activity)
    const learningStreak = loginStreak;

    // Calculate achievements data - use same logic as frontend
    let totalAchievements = 0;
    let unlockedAchievements = 0;
    
    try {
      // Calculate user stats for achievement conditions
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
      
      // Define achievement definitions (same as frontend)
      const achievementDefinitions = [
        // Learning achievements
        { id: "first_lesson", name: "First Steps", unlocked: completedLessons > 0 },
        { id: "lesson_explorer", name: "Knowledge Seeker", unlocked: completedLessons >= 10 },
        { id: "lesson_master", name: "Learning Legend", unlocked: completedLessons >= 50 },
        { id: "language_master", name: "Polyglot", unlocked: completedLanguages >= 5 },
        { id: "completionist", name: "Completionist", unlocked: completedLessons >= 100 },
        
        // Coding achievements
        { id: "first_solve", name: "Problem Solver", unlocked: solvedExercises > 0 },
        { id: "coding_ninja", name: "Code Ninja", unlocked: solvedExercises >= 25 },
        { id: "algorithm_master", name: "Algorithm Master", unlocked: solvedExercises >= 100 },
        { id: "speed_demon", name: "Speed Demon", unlocked: false }, // Would need weekly tracking
        { id: "perfect_score", name: "Perfect Score", unlocked: false }, // Would need separate tracking
        
        // Consistency achievements - now using calculated values
        { id: "daily_learner", name: "Daily Learner", unlocked: loginStreak >= 3 },
        { id: "week_warrior", name: "Week Warrior", unlocked: loginStreak >= 7 },
        { id: "month_master", name: "Month Master", unlocked: loginStreak >= 30 },
        { id: "study_hours", name: "Study Enthusiast", unlocked: studyTimeHours >= 10 },
        { id: "dedicated_learner", name: "Dedicated Learner", unlocked: studyTimeHours >= 50 },
        
        // Social achievements
        { id: "early_bird", name: "Early Bird", unlocked: true }, // Always true for existing users
        { id: "bookmark_collector", name: "Bookmark Collector", unlocked: savedLessonsCount >= 20 },
        { id: "helpful_member", name: "Helpful Member", unlocked: false }, // Future feature
        { id: "feedback_provider", name: "Feedback Provider", unlocked: false }, // Future feature
        { id: "community_ambassador", name: "Community Ambassador", unlocked: false }, // Future feature
        
        // Special achievements
        { id: "night_owl", name: "Night Owl", unlocked: false }, // Would need time tracking
        { id: "weekend_warrior", name: "Weekend Warrior", unlocked: false }, // Would need date tracking
        { id: "multitasker", name: "Multitasker", unlocked: false }, // Would need daily tracking
        { id: "persistent", name: "Persistent", unlocked: false }, // Would need attempt tracking
      ];
      
      totalAchievements = achievementDefinitions.length;
      unlockedAchievements = achievementDefinitions.filter(ach => ach.unlocked).length;
      
      console.log('Achievements data:', {
        totalAchievements,
        unlockedAchievements,
        completedLessons,
        completedLanguages,
        solvedExercises,
        savedLessonsCount,
        loginStreak,
        studyTimeHours,
        totalSeconds: sessionStats._sum.duration || 0
      });
      
      // Log which achievements are unlocked
      const unlockedAchievementList = achievementDefinitions.filter(ach => ach.unlocked);
      console.log('Unlocked achievements:', unlockedAchievementList.map(ach => `${ach.name} (${ach.id})`));
    } catch (error: any) {
      console.log("Achievements calculation error:", error.message);
      totalAchievements = 24; // Fallback to total number of achievements
      unlockedAchievements = 0;
    }

    // Format recent activities for frontend
    let formattedActivities = [];
    
    if (recentActivities.length > 0) {
      formattedActivities = recentActivities
        .map(activity => ({
          type: activity.type.toLowerCase(),
          text: activity.description,
          time: formatTimeAgo(activity.timestamp),
          metadata: activity.metadata,
          language: activity.metadata?.language || null, // Add language info for icons
          id: activity.id
        }))
        .filter((activity, index, array) => {
          const firstIndex = array.findIndex(a => a.text === activity.text);
          return firstIndex === index;
        })
        .slice(0, 10);
    } else {
      // Show default activities if no real activities exist
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
      loginStreak, // This is the calculated streak from daily activity
      
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
      studyTimeHours: studyTimeHoursSimple, // Keep old format for compatibility
      formattedStudyTime, // New formatted time
      rank,
      
      // Achievements
      totalAchievements,
      unlockedAchievements,
      learningStreak,
      achievements, // Include the full achievements data
      
      // Real activities from tracking system
      recentActivities: formattedActivities,
      
      // Progress trends from real data
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
        thisWeekStudyTime: weeklyStats._sum.studyTime || 0, // Keep in seconds for proper formatting
        thisWeekStudyTimeFormatted: formatStudyTime(weeklyStats._sum.studyTime || 0), // Pre-formatted
        dailyActivities: await getDailyActivities(user.id, 7) // Last 7 days
      }
    };

    console.log('Profile API response:', {
      totalLessons,
      completedLessons,
      completionRate,
      solvedExercises,
      totalExercises,
      totalAchievements,
      unlockedAchievements,
      studyTimeHours,
      weeklyProgress: {
        lessonsThisWeek: weeklyStats._sum.lessonsViewed || 0,
        exercisesThisWeek: weeklyStats._sum.exercisesSolved || 0,
        studyTimeThisWeek: Math.floor((weeklyStats._sum.studyTime || 0) / 3600),
        pointsThisWeek: weeklyStats._sum.pointsEarned || 0,
      }
    });

    return NextResponse.json(userStats);
    
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

// Helper function to get daily activities for calendar
async function getDailyActivities(userId: number, days: number) {
  try {
    const activities = [];
    
    // Azərbaycan vaxtı ilə bugünkü gün
    const now = new Date();
    const azerbaijanTime = new Date(now.getTime() + (4 * 60 * 60 * 1000)); // UTC+4
    const today = new Date(azerbaijanTime.getFullYear(), azerbaijanTime.getMonth(), azerbaijanTime.getDate());
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      
      const dayActivity = await prisma.dailyActivity.findUnique({
        where: {
          userId_date: {
            userId,
            date
          }
        }
      });
      
      // Count actual lesson views from UserActivity for this day
      const nextDay = new Date(date);
      nextDay.setDate(nextDay.getDate() + 1);
      
      const lessonViewsCount = await prisma.userActivity.count({
        where: {
          userId,
          type: 'LESSON_VIEW',
          timestamp: {
            gte: date,
            lt: nextDay
          }
        }
      });
      
      // Azərbaycan vaxtı ilə tarix formatı
      const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
      
      activities.push({
        date: dateStr,
        hasActivity: dayActivity ? (dayActivity.studyTime > 0 || lessonViewsCount > 0 || dayActivity.exercisesSolved > 0) : (lessonViewsCount > 0),
        studyTime: dayActivity?.studyTime || 0,
        lessonsViewed: lessonViewsCount, // Use accurate count from UserActivity
        exercisesSolved: dayActivity?.exercisesSolved || 0,
        pointsEarned: dayActivity?.pointsEarned || 0
      });
    }
    
    return activities;
  } catch (error: any) {
    console.log("Error getting daily activities:", error.message);
    // Return mock data if table doesn't exist
    const now = new Date();
    const azerbaijanTime = new Date(now.getTime() + (4 * 60 * 60 * 1000));
    const today = new Date(azerbaijanTime.getFullYear(), azerbaijanTime.getMonth(), azerbaijanTime.getDate());
    
    return Array.from({ length: days }, (_, i) => {
      const date = new Date(today);
      date.setDate(date.getDate() - (days - 1 - i));
      const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
      
      return {
        date: dateStr,
      hasActivity: Math.random() > 0.3,
      studyTime: Math.floor(Math.random() * 3600),
      lessonsViewed: Math.floor(Math.random() * 3),
      exercisesSolved: Math.floor(Math.random() * 2),
      pointsEarned: Math.floor(Math.random() * 50)
      };
    });
  }
} 