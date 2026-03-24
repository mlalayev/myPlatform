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
      {
        type: 'LEARNING',
        name: 'First Steps',
        description: 'Complete your first lesson',
        icon: '🎓',
        rarity: 'BRONZE',
        points: 50,
        condition: () => completedLessons >= 1
      },
      {
        type: 'LEARNING',
        name: 'Knowledge Seeker',
        description: 'Complete 10 lessons',
        icon: '📚',
        rarity: 'SILVER',
        points: 100,
        condition: () => completedLessons >= 10
      },
      {
        type: 'LEARNING',
        name: 'Learning Legend',
        description: 'Complete 50 lessons',
        icon: '🏆',
        rarity: 'GOLD',
        points: 500,
        condition: () => completedLessons >= 50
      },
      {
        type: 'LEARNING',
        name: 'Polyglot',
        description: 'Study 5 different programming languages',
        icon: '🌍',
        rarity: 'PLATINUM',
        points: 300,
        condition: () => completedLanguages >= 5
      },
      {
        type: 'LEARNING',
        name: 'Completionist',
        description: 'Complete 100 lessons',
        icon: '💎',
        rarity: 'LEGENDARY',
        points: 1000,
        condition: () => completedLessons >= 100
      },
      {
        type: 'CODING',
        name: 'Problem Solver',
        description: 'Solve your first exercise',
        icon: '💻',
        rarity: 'BRONZE',
        points: 75,
        condition: () => solvedExercises >= 1
      },
      {
        type: 'CODING',
        name: 'Code Ninja',
        description: 'Solve 25 exercises',
        icon: '⚡',
        rarity: 'SILVER',
        points: 200,
        condition: () => solvedExercises >= 25
      },
      {
        type: 'CODING',
        name: 'Algorithm Master',
        description: 'Solve 100 exercises',
        icon: '🧠',
        rarity: 'GOLD',
        points: 1000,
        condition: () => solvedExercises >= 100
      },
      {
        type: 'STREAK',
        name: 'Early Bird',
        description: 'Login for the first time',
        icon: '🌅',
        rarity: 'BRONZE',
        points: 25,
        condition: () => true // Always true for testing
      },
      {
        type: 'TEST',
        name: 'Test Achievement',
        description: 'This is a test achievement to verify popup works',
        icon: '🧪',
        rarity: 'GOLD',
        points: 100,
        condition: () => true // Always true for testing
      },
      {
        type: 'STREAK',
        name: 'Bookmark Collector',
        description: 'Save 20 lessons to favorites',
        icon: 'bookmark',
        rarity: 'BRONZE',
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

    // Prepare achievement data for popup (newly created and updated ones)
    const newAchievementsForPopup = [
      ...createdAchievements.map(achievement => ({
        name: achievement.name,
        description: achievement.description,
        rarity: achievement.rarity.toLowerCase() as 'bronze' | 'silver' | 'gold' | 'platinum',
        coins: achievement.points
      })),
      ...updatedAchievements.map(achievement => ({
        name: achievement.name,
        description: achievement.description,
        rarity: achievement.rarity.toLowerCase() as 'bronze' | 'silver' | 'gold' | 'platinum',
        coins: achievement.points
      }))
    ];

    return NextResponse.json({
      success: true,
      createdAchievements,
      updatedAchievements,
      newAchievementsForPopup, // For triggering popups
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