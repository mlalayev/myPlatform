import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/app/api/auth/authOptions";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        activities: {
          where: {
            type: {
              in: ['EXERCISE_SOLVE', 'EXERCISE_SUBMIT', 'QUIZ_SUBMIT', 'QUIZ_PASS']
            }
          },
          orderBy: { timestamp: 'desc' },
          take: 50
        }
      }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get all published exercises from database
    const allExercises = await prisma.exercise.findMany({
      where: { published: true },
      orderBy: { createdAt: 'desc' }
    });

    // Get user's solved exercises from solvedExercises array
    const userSolvedExercises = user.solvedExercises || [];
    
    // Get user's exercise activities
    const exerciseActivities = user.activities || [];

    // Create exercise history with real data
    const exerciseHistory = allExercises.map((exercise: any) => {
      const isSolved = userSolvedExercises.includes(exercise.id);
      
      // Find all activities for this exercise
      const exerciseActivitiesForThis = exerciseActivities.filter((activity: any) => 
        activity.metadata && 
        typeof activity.metadata === 'object' && 
        'exerciseId' in activity.metadata && 
        activity.metadata.exerciseId === exercise.id
      );

      // Determine status based on user's activity
      let status = "new";
      let lastAttempt = null;
      let submissions: any[] = [];

      if (exerciseActivitiesForThis.length > 0) {
        // Sort activities by timestamp to get the latest first
        const sortedActivities = exerciseActivitiesForThis.sort((a: any, b: any) => 
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );
        
        const latestActivity = sortedActivities[0];
        lastAttempt = latestActivity.timestamp;

        if (isSolved) {
          status = "solved";
        } else if (exerciseActivitiesForThis.length > 0) {
          status = "attempted";
        }
        
        // Create submission history from all activities
        submissions = sortedActivities.slice(0, 3).map((activity: any, index: number) => {
          // Determine if this was the final successful submission
          const isFinalSuccess = isSolved && index === 0;
          // Determine if this was a wrong submission
          const isWrongSubmission = !isSolved || (isSolved && index > 0);
          
          return {
            status: isFinalSuccess ? "accepted" : "wrong",
            time: formatTimeAgo(activity.timestamp),
            runtime: isFinalSuccess ? "68ms" : "-"
          };
        });
      }

      return {
        id: exercise.id,
        title: exercise.title,
        description: exercise.description,
        category: getCategoryDisplayName(exercise.category),
        categoryClass: getCategoryClass(exercise.category),
        difficulty: exercise.difficulty.toLowerCase(),
        status,
        timeComplexity: (exercise.content as any)?.timeComplexity || "O(n)",
        spaceComplexity: (exercise.content as any)?.spaceComplexity || "O(n)",
        acceptanceRate: (exercise.content as any)?.acceptance || 75,
        submissions,
        lastAttempt,
        averageTime: getAverageTime(exercise.difficulty)
      };
    });

    // Calculate real performance stats
    const totalExercises = allExercises.length;
    const solvedExercises = exerciseHistory.filter((ex: any) => ex.status === 'solved');
    const attemptedExercises = exerciseHistory.filter((ex: any) => ex.status === 'attempted');

    const easyExercises = exerciseHistory.filter((ex: any) => ex.difficulty === 'easy');
    const mediumExercises = exerciseHistory.filter((ex: any) => ex.difficulty === 'medium');
    const hardExercises = exerciseHistory.filter((ex: any) => ex.difficulty === 'hard');

    const easySolved = easyExercises.filter((ex: any) => ex.status === 'solved').length;
    const mediumSolved = mediumExercises.filter((ex: any) => ex.status === 'solved').length;
    const hardSolved = hardExercises.filter((ex: any) => ex.status === 'solved').length;

    // Get exercise categories with real stats
    const exerciseCategories = [
      {
        id: "algorithms",
        name: "Algorithms",
        icon: "FiCpu",
        solved: exerciseHistory.filter((ex: any) => ex.category === "Algorithms" && ex.status === 'solved').length,
        total: exerciseHistory.filter((ex: any) => ex.category === "Algorithms").length,
        progress: calculateProgress("Algorithms", exerciseHistory),
        className: "algorithms"
      },
      {
        id: "data-structures",
        name: "Data Structures",
        icon: "FiLayers",
        solved: exerciseHistory.filter((ex: any) => ex.category === "Data Structures" && ex.status === 'solved').length,
        total: exerciseHistory.filter((ex: any) => ex.category === "Data Structures").length,
        progress: calculateProgress("Data Structures", exerciseHistory),
        className: "dataStructures"
      }
    ];

    // If user hasn't solved any exercises, show 2 random exercises
    let exercisesToShow = exerciseHistory;
    if (solvedExercises.length === 0 && attemptedExercises.length === 0) {
      // Only show random exercises if user has never attempted or solved any exercises
      const randomExercises = allExercises
        .sort(() => 0.5 - Math.random())
        .slice(0, 2)
        .map((exercise: any) => ({
          id: exercise.id,
          title: exercise.title,
          description: exercise.description,
          category: getCategoryDisplayName(exercise.category),
          categoryClass: getCategoryClass(exercise.category),
          difficulty: exercise.difficulty.toLowerCase(),
          status: "new",
          timeComplexity: (exercise.content as any)?.timeComplexity || "O(n)",
          spaceComplexity: (exercise.content as any)?.spaceComplexity || "O(n)",
          acceptanceRate: (exercise.content as any)?.acceptance || 75,
          submissions: [],
          lastAttempt: null,
          averageTime: getAverageTime(exercise.difficulty)
        }));
      exercisesToShow = randomExercises;
    } else {
      // Show ALL exercises that have any activity (solved, attempted, or wrong submissions)
      const exercisesWithAnyActivity = exerciseHistory.filter((ex: any) => 
        ex.submissions.length > 0 || ex.lastAttempt !== null
      );
      
      exercisesToShow = exercisesWithAnyActivity;
      
      // If no exercises with activity found, show some new exercises
      if (exercisesToShow.length === 0) {
        exercisesToShow = exerciseHistory.filter((ex: any) => ex.status === 'new').slice(0, 2);
      }
    }

    const response = {
      exerciseCategories,
      exercises: exercisesToShow,
      performanceStats: {
        totalSolved: solvedExercises.length,
        totalExercises,
        successRate: totalExercises > 0 ? Math.round((solvedExercises.length / totalExercises) * 100) : 0,
        easySolved,
        easyTotal: easyExercises.length,
        mediumSolved,
        mediumTotal: mediumExercises.length,
        hardSolved,
        hardTotal: hardExercises.length
      },
      userActivity: exerciseActivities,
      recentExercises: exercisesToShow.slice(0, 6),
      hasExercises: exerciseHistory.length > 0,
      hasSolvedExercises: solvedExercises.length > 0,
      showingRandomExercises: solvedExercises.length === 0
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error("Error fetching exercise data:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Helper functions
function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diffInMs = now.getTime() - new Date(date).getTime();
  const diffInSeconds = Math.floor(diffInMs / 1000);
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInDays > 0) {
    return `${diffInDays} gün əvvəl`;
  } else if (diffInHours > 0) {
    return `${diffInHours} saat əvvəl`;
  } else if (diffInMinutes > 0) {
    return `${diffInMinutes} dəqiqə əvvəl`;
  } else if (diffInSeconds > 30) {
    return `${diffInSeconds} saniyə əvvəl`;
  } else {
    return "İndicə";
  }
}

function getCategoryDisplayName(category: string): string {
  const categoryMap: { [key: string]: string } = {
    'ALGORITHMS': 'Algorithms',
    'DATA_STRUCTURES': 'Data Structures',
    'ARRAYS': 'Arrays & Lists',
    'STRINGS': 'String Manipulation',
    'GRAPHS': 'Graph Theory',
    'DYNAMIC_PROGRAMMING': 'Dynamic Programming'
  };
  return categoryMap[category] || category;
}

function getCategoryClass(category: string): string {
  const classMap: { [key: string]: string } = {
    'ALGORITHMS': 'algorithms',
    'DATA_STRUCTURES': 'dataStructures',
    'ARRAYS': 'arrays',
    'STRINGS': 'strings',
    'GRAPHS': 'graphs',
    'DYNAMIC_PROGRAMMING': 'dynamic'
  };
  return classMap[category] || 'algorithms';
}

function getAverageTime(difficulty: string): string {
  const timeMap: { [key: string]: string } = {
    'EASY': '15 min',
    'MEDIUM': '30 min',
    'HARD': '60 min'
  };
  return timeMap[difficulty] || '30 min';
}

function calculateProgress(category: string, exercises: any[]): number {
  const categoryExercises = exercises.filter(ex => ex.category === category);
  if (categoryExercises.length === 0) return 0;
  
  const solved = categoryExercises.filter(ex => ex.status === 'solved').length;
  return Math.round((solved / categoryExercises.length) * 100);
} 