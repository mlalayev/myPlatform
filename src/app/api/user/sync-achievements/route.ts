import { NextRequest, NextResponse } from "next/server";
import { auth } from "../../auth/authOptions";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    console.log("Starting achievement sync...");
    
    const session = await auth();
    if (!session?.user?.email) {
      console.log("No session found - returning success with empty results");
      return NextResponse.json({
        success: true,
        createdAchievements: [],
        updatedAchievements: [],
        message: "No session found - achievements will sync when you log in"
      });
    }

    console.log("Session found for user:", session.user.email);

    // Get user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { 
        id: true, 
        createdAt: true,
        dailyLoginPoints: true,
        visitedLessons: true,
        solvedExercises: true,
        savedLessons: true
      }
    });

    if (!user) {
      console.log("User not found - returning success with empty results");
      return NextResponse.json({
        success: true,
        createdAchievements: [],
        updatedAchievements: [],
        message: "User not found - achievements will sync when you log in"
      });
    }

    console.log("User found:", user.id);

    // Calculate user stats
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

    console.log("User stats calculated:", {
      completedLessons,
      completedLanguages,
      solvedExercises,
      savedLessonsCount
    });

    // Define achievement definitions
    const achievementDefinitions = [
      // Learning achievements
      {
        id: "first_lesson",
        type: "LEARNING",
        name: "First Steps",
        description: "Complete your first lesson",
        icon: "book",
        rarity: "BRONZE",
        points: 50,
        condition: () => completedLessons > 0
      },
      {
        id: "lesson_explorer",
        type: "LEARNING",
        name: "Knowledge Seeker",
        description: "Complete 10 lessons",
        icon: "book",
        rarity: "BRONZE",
        points: 200,
        condition: () => completedLessons >= 10
      },
      {
        id: "lesson_master",
        type: "LEARNING",
        name: "Learning Legend",
        description: "Complete 50 lessons",
        icon: "book",
        rarity: "GOLD",
        points: 1000,
        condition: () => completedLessons >= 50
      },
      {
        id: "language_master",
        type: "LEARNING",
        name: "Polyglot",
        description: "Complete lessons in 5 different programming languages",
        icon: "globe",
        rarity: "SILVER",
        points: 500,
        condition: () => completedLanguages >= 5
      },
      {
        id: "completionist",
        type: "LEARNING",
        name: "Completionist",
        description: "Complete 100 lessons",
        icon: "target",
        rarity: "LEGENDARY",
        points: 2500,
        condition: () => completedLessons >= 100
      },

      // Coding achievements
      {
        id: "first_solve",
        type: "CODING",
        name: "Problem Solver",
        description: "Solve your first exercise",
        icon: "code",
        rarity: "BRONZE",
        points: 75,
        condition: () => solvedExercises > 0
      },
      {
        id: "coding_ninja",
        type: "CODING",
        name: "Code Ninja",
        description: "Solve 25 exercises",
        icon: "code",
        rarity: "SILVER",
        points: 500,
        condition: () => solvedExercises >= 25
      },
      {
        id: "algorithm_master",
        type: "CODING",
        name: "Algorithm Master",
        description: "Solve 100 exercises",
        icon: "code",
        rarity: "LEGENDARY",
        points: 2500,
        condition: () => solvedExercises >= 100
      },

      // Social achievements
      {
        id: "early_bird",
        type: "SOCIAL",
        name: "Early Bird",
        description: "Join during beta testing",
        icon: "heart",
        rarity: "PLATINUM",
        points: 500,
        condition: () => {
          // Always true for existing users - they joined during beta
          return true;
        }
      },
      {
        id: "bookmark_collector",
        type: "SOCIAL",
        name: "Bookmark Collector",
        description: "Save 20 lessons to favorites",
        icon: "bookmark",
        rarity: "BRONZE",
        points: 150,
        condition: () => savedLessonsCount >= 20
      }
    ];

    console.log("Checking existing achievements...");

    // Check and create achievements
    const createdAchievements = [];
    const updatedAchievements = [];

    for (const achievementDef of achievementDefinitions) {
      try {
        console.log(`Checking achievement: ${achievementDef.name}`);
        
        // Check if achievement already exists
        const existingAchievement = await prisma.achievement.findFirst({
          where: {
            userId: user.id,
            name: achievementDef.name
          }
        });

        console.log(`Achievement ${achievementDef.name}: exists=${!!existingAchievement}, condition=${achievementDef.condition()}`);

        if (achievementDef.condition()) {
          if (!existingAchievement) {
            console.log(`Creating new achievement: ${achievementDef.name}`);
            // Create new achievement
            const newAchievement = await prisma.achievement.create({
              data: {
                userId: user.id,
                type: achievementDef.type,
                name: achievementDef.name,
                description: achievementDef.description,
                icon: achievementDef.icon,
                rarity: achievementDef.rarity,
                points: achievementDef.points,
                unlockedAt: new Date(),
                claimed: false
              }
            });
            createdAchievements.push(newAchievement);
            console.log(`Created achievement: ${achievementDef.name}`);
          } else if (!existingAchievement.unlockedAt) {
            console.log(`Updating achievement: ${achievementDef.name}`);
            // Update existing achievement to unlocked
            const updatedAchievement = await prisma.achievement.update({
              where: { id: existingAchievement.id },
              data: {
                unlockedAt: new Date()
              }
            });
            updatedAchievements.push(updatedAchievement);
            console.log(`Updated achievement: ${achievementDef.name}`);
          }
        }
      } catch (achievementError) {
        console.error(`Error processing achievement ${achievementDef.name}:`, achievementError);
        // Continue with other achievements even if one fails
      }
    }

    console.log("Sync completed successfully");

    return NextResponse.json({
      success: true,
      createdAchievements,
      updatedAchievements,
      message: `Synced ${createdAchievements.length} new achievements and updated ${updatedAchievements.length} existing ones`
    });

  } catch (error) {
    console.error("Error syncing achievements:", error);
    return NextResponse.json(
      { 
        success: false,
        error: "Internal server error", 
        details: error instanceof Error ? error.message : "Unknown error",
        createdAchievements: [],
        updatedAchievements: [],
        message: "Failed to sync achievements"
      },
      { status: 500 }
    );
  }
} 