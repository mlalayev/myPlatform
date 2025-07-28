"use client";

import React, { useState } from "react";
import {
  FiAward,
  FiGift,
  FiUnlock,
  FiLock,
  FiCheckCircle,
  FiClock,
  FiStar,
  FiTarget,
  FiBook,
  FiCode,
  FiTrendingUp,
  FiZap,
  FiHeart,
  FiUsers,
  FiGlobe,
  FiBookmark,
  FiMessageCircle,
  FiShare2,
} from "react-icons/fi";
import achievementStyles from "../ProfileAchievements.module.css";
import { useI18n } from "../../../../contexts/I18nContext";

interface ProfileAchievementsProps {
  userStats: any;
  loading: boolean;
  onAchievementClaimed?: () => void; // Callback to refresh user stats
}

export default function ProfileAchievements({
  userStats,
  loading,
  onAchievementClaimed,
}: ProfileAchievementsProps) {
  const { t } = useI18n();
  const [claimingAchievement, setClaimingAchievement] = useState<string | null>(null);
  const [claimedAchievements, setClaimedAchievements] = useState<Set<string>>(new Set());
  const [dbAchievements, setDbAchievements] = useState<any[]>([]);
  const [syncingAchievements, setSyncingAchievements] = useState(false);

  // Function to sync achievements with database
  const syncAchievements = async () => {
    if (syncingAchievements) return;
    
    setSyncingAchievements(true);
    
    try {
      const response = await fetch("/api/user/sync-achievements", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      
      if (data.success) {
        console.log("Achievements synced:", data.message);
        // Refresh achievements after sync
        fetchAchievements();
        
        // Show success message if achievements were created or updated
        if (data.createdAchievements.length > 0 || data.updatedAchievements.length > 0) {
          console.log(`Created: ${data.createdAchievements.length}, Updated: ${data.updatedAchievements.length}`);
        }
      } else {
        console.error("Failed to sync achievements:", data.error, data.details);
        // Don't show error to user if it's just that no achievements are unlocked yet
        if (data.error !== "Internal server error") {
          alert(`Failed to sync achievements: ${data.error}`);
        }
      }
    } catch (error) {
      console.error("Error syncing achievements:", error);
    } finally {
      setSyncingAchievements(false);
    }
  };

  // Function to fetch achievements from database
  const fetchAchievements = async () => {
    try {
      const response = await fetch("/api/user/profile");
      if (response.ok) {
        const data = await response.json();
        
        // Check if there are achievements in the profile data
        if (data.achievements && Array.isArray(data.achievements)) {
          const claimedNames = new Set();
          data.achievements.forEach((achievement: any) => {
            if (achievement.claimed) {
              claimedNames.add(achievement.name);
            }
          });
          setClaimedAchievements(claimedNames);
          console.log("Loaded claimed achievements:", Array.from(claimedNames));
        }
      }
    } catch (error) {
      console.error("Error fetching achievements:", error);
    }
  };

  // Function to claim achievement rewards
  const claimAchievementReward = async (achievementName: string, coins: number) => {
    if (claimingAchievement) return; // Prevent multiple simultaneous claims
    
    setClaimingAchievement(achievementName);
    
    try {
      const response = await fetch("/api/user/achievement-claim", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          achievementId: achievementName, // Keep the API parameter name the same
          coins,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setClaimedAchievements(prev => new Set([...prev, achievementName]));
        
        // Show success message (you can add a toast notification here)
        console.log(data.message);
        
        // Update local state immediately - no page reload needed
        // The claimed achievement will be hidden and overlay will show
        
        // Call parent callback to refresh user stats
        if (onAchievementClaimed) {
          onAchievementClaimed();
        }
      } else {
        const errorData = await response.json();
        console.error("Failed to claim reward:", errorData.error, errorData.details);
        
        // Don't show alert, just log the error
        // The user will see the visual feedback through the UI
      }
    } catch (error) {
      console.error("Error claiming reward:", error);
    } finally {
      setClaimingAchievement(null);
    }
  };

  // Sync achievements on component mount
  React.useEffect(() => {
    if (!loading && userStats) {
      syncAchievements();
    }
  }, [loading, userStats]);

  // Achievement data structure with new achievements
  const achievementCategories = [
    {
      id: "learning",
      name: "🎓 Learning Master",
      description: "Complete lessons and expand your knowledge",
      achievements: [
        {
          id: "first_lesson",
          name: "First Steps",
          description: "Complete your first lesson",
          icon: <FiBook />,
          rarity: "bronze",
          progress: userStats?.completedLessons > 0 ? 100 : 0,
          target: 1,
          unlocked: userStats?.completedLessons > 0,
          reward: 50,
        },
        {
          id: "lesson_explorer",
          name: "Knowledge Seeker",
          description: "Complete 10 lessons",
          icon: <FiBook />,
          rarity: "bronze",
          progress: Math.min(((userStats?.completedLessons || 0) / 10) * 100, 100),
          target: 10,
          unlocked: (userStats?.completedLessons || 0) >= 10,
          reward: 200,
        },
        {
          id: "lesson_master",
          name: "Learning Legend",
          description: "Complete 50 lessons",
          icon: <FiBook />,
          rarity: "gold",
          progress: Math.min(((userStats?.completedLessons || 0) / 50) * 100, 100),
          target: 50,
          unlocked: (userStats?.completedLessons || 0) >= 50,
          reward: 1000,
        },
        {
          id: "language_master",
          name: "Polyglot",
          description: "Complete lessons in 5 different programming languages",
          icon: <FiGlobe />,
          rarity: "silver",
          progress: Math.min(((userStats?.completedLanguages || 0) / 5) * 100, 100),
          target: 5,
          unlocked: (userStats?.completedLanguages || 0) >= 5,
          reward: 500,
        },
        {
          id: "completionist",
          name: "Completionist",
          description: "Complete 100 lessons",
          icon: <FiTarget />,
          rarity: "legendary",
          progress: Math.min(((userStats?.completedLessons || 0) / 100) * 100, 100),
          target: 100,
          unlocked: (userStats?.completedLessons || 0) >= 100,
          reward: 2500,
        },
      ],
    },
    {
      id: "coding",
      name: "💻 Code Warrior",
      description: "Solve coding challenges and exercises",
      achievements: [
        {
          id: "first_solve",
          name: "Problem Solver",
          description: "Solve your first exercise",
          icon: <FiCode />,
          rarity: "bronze",
          progress: userStats?.solvedExercises > 0 ? 100 : 0,
          target: 1,
          unlocked: userStats?.solvedExercises > 0,
          reward: 75,
        },
        {
          id: "coding_ninja",
          name: "Code Ninja",
          description: "Solve 25 exercises",
          icon: <FiCode />,
          rarity: "silver",
          progress: Math.min(((userStats?.solvedExercises || 0) / 25) * 100, 100),
          target: 25,
          unlocked: (userStats?.solvedExercises || 0) >= 25,
          reward: 500,
        },
        {
          id: "algorithm_master",
          name: "Algorithm Master",
          description: "Solve 100 exercises",
          icon: <FiCode />,
          rarity: "legendary",
          progress: Math.min(((userStats?.solvedExercises || 0) / 100) * 100, 100),
          target: 100,
          unlocked: (userStats?.solvedExercises || 0) >= 100,
          reward: 2500,
        },
        {
          id: "speed_demon",
          name: "Speed Demon",
          description: "Solve 5 exercises in one day",
          icon: <FiZap />,
          rarity: "gold",
          progress: Math.min(((userStats?.weeklyProgress?.exercisesThisWeek || 0) / 5) * 100, 100),
          target: 5,
          unlocked: (userStats?.weeklyProgress?.exercisesThisWeek || 0) >= 5,
          reward: 300,
        },
        {
          id: "perfect_score",
          name: "Perfect Score",
          description: "Solve 10 exercises with optimal solutions",
          icon: <FiStar />,
          rarity: "platinum",
          progress: 0, // This would need to be tracked separately
          target: 10,
          unlocked: false, // This would need to be tracked separately
          reward: 1000,
        },
      ],
    },
    {
      id: "consistency",
      name: "🔥 Consistency King",
      description: "Build daily learning habits",
      achievements: [
        {
          id: "daily_learner",
          name: "Daily Learner",
          description: "Login for 3 days in a row",
          icon: <FiClock />,
          rarity: "bronze",
          progress: Math.min(((userStats?.loginStreak || 0) / 3) * 100, 100),
          target: 3,
          unlocked: (userStats?.loginStreak || 0) >= 3,
          reward: 100,
        },
        {
          id: "week_warrior",
          name: "Week Warrior",
          description: "Login for 7 days in a row",
          icon: <FiClock />,
          rarity: "silver",
          progress: Math.min(((userStats?.loginStreak || 0) / 7) * 100, 100),
          target: 7,
          unlocked: (userStats?.loginStreak || 0) >= 7,
          reward: 300,
        },
        {
          id: "month_master",
          name: "Month Master",
          description: "Login for 30 days in a row",
          icon: <FiClock />,
          rarity: "legendary",
          progress: Math.min(((userStats?.loginStreak || 0) / 30) * 100, 100),
          target: 30,
          unlocked: (userStats?.loginStreak || 0) >= 30,
          reward: 1500,
        },
        {
          id: "study_hours",
          name: "Study Enthusiast",
          description: "Study for 10 hours total",
          icon: <FiTrendingUp />,
          rarity: "silver",
          progress: Math.min(((userStats?.studyTimeHours || 0) / 10) * 100, 100),
          target: 10,
          unlocked: (userStats?.studyTimeHours || 0) >= 10,
          reward: 400,
        },
        {
          id: "dedicated_learner",
          name: "Dedicated Learner",
          description: "Study for 50 hours total",
          icon: <FiTrendingUp />,
          rarity: "gold",
          progress: Math.min(((userStats?.studyTimeHours || 0) / 50) * 100, 100),
          target: 50,
          unlocked: (userStats?.studyTimeHours || 0) >= 50,
          reward: 2000,
        },
      ],
    },
    {
      id: "social",
      name: "🤝 Community Hero",
      description: "Engage with the community and help others",
      achievements: [
        {
          id: "early_bird",
          name: "Early Bird",
          description: "Join during beta testing",
          icon: <FiHeart />,
          rarity: "platinum",
          progress: 100,
          target: 1,
          unlocked: true, // This would need to be tracked based on join date
          reward: 500,
        },
        {
          id: "helpful_member",
          name: "Helpful Member",
          description: "Help 5 other users (future feature)",
          icon: <FiUsers />,
          rarity: "silver",
          progress: 0,
          target: 5,
          unlocked: false, // Future feature
          reward: 300,
        },
        {
          id: "bookmark_collector",
          name: "Bookmark Collector",
          description: "Save 20 lessons to favorites",
          icon: <FiBookmark />,
          rarity: "bronze",
          progress: Math.min(((userStats?.savedLessons?.length || 0) / 20) * 100, 100),
          target: 20,
          unlocked: (userStats?.savedLessons?.length || 0) >= 20,
          reward: 150,
        },
        {
          id: "feedback_provider",
          name: "Feedback Provider",
          description: "Provide feedback on 10 lessons (future feature)",
          icon: <FiMessageCircle />,
          rarity: "gold",
          progress: 0,
          target: 10,
          unlocked: false, // Future feature
          reward: 600,
        },
        {
          id: "community_ambassador",
          name: "Community Ambassador",
          description: "Share 5 lessons with friends (future feature)",
          icon: <FiShare2 />,
          rarity: "legendary",
          progress: 0,
          target: 5,
          unlocked: false, // Future feature
          reward: 1000,
        },
      ],
    },
    {
      id: "special",
      name: "⭐ Special Edition",
      description: "Rare and unique achievements",
      achievements: [
        {
          id: "night_owl",
          name: "Night Owl",
          description: "Study after midnight",
          icon: <FiClock />,
          rarity: "gold",
          progress: 0,
          target: 1,
          unlocked: false, // This would need to be tracked based on study time
          reward: 200,
        },
        {
          id: "weekend_warrior",
          name: "Weekend Warrior",
          description: "Complete 10 lessons on weekends",
          icon: <FiTarget />,
          rarity: "silver",
          progress: 0,
          target: 10,
          unlocked: false, // This would need to be tracked separately
          reward: 400,
        },
        {
          id: "multitasker",
          name: "Multitasker",
          description: "Study in 3 different languages in one day",
          icon: <FiGlobe />,
          rarity: "platinum",
          progress: 0,
          target: 3,
          unlocked: false, // This would need to be tracked separately
          reward: 800,
        },
        {
          id: "persistent",
          name: "Persistent",
          description: "Try the same exercise 10 times until solved",
          icon: <FiTarget />,
          rarity: "legendary",
          progress: 0,
          target: 10,
          unlocked: false, // This would need to be tracked separately
          reward: 1500,
        },
      ],
    },
  ];

  // Use API-provided achievement counts for consistency
  const totalAchievements = userStats?.totalAchievements || achievementCategories.reduce(
    (acc, cat) => acc + cat.achievements.length,
    0
  );
  const unlockedAchievements = userStats?.unlockedAchievements || achievementCategories.reduce(
    (acc, cat) => acc + cat.achievements.filter((ach) => ach.unlocked).length,
    0
  );

  return (
    <div className={achievementStyles.achievementsContainer}>
      {/* Achievements Header */}
      <div className={achievementStyles.achievementsHeader}>
        <div className={achievementStyles.achievementsStats}>
          <div className={achievementStyles.achievementsSummary}>
            <div className={achievementStyles.achievementsCount}>
              <div className={achievementStyles.countHeader}>
                <FiAward className={achievementStyles.trophyIcon} />
                <span className={achievementStyles.countText}>
                  {unlockedAchievements} / {totalAchievements}
                </span>
              </div>
              <span className={achievementStyles.countLabel}>
                Achievements Unlocked
              </span>
            </div>
            <div className={achievementStyles.achievementsProgress}>
              <span className={achievementStyles.progressText}>
                {Math.round((unlockedAchievements / totalAchievements) * 100)}
                % Complete
              </span>
              <div className={achievementStyles.progressBarContainer}>
                <div
                  className={achievementStyles.progressBarFill}
                  style={{
                    width: `${
                      (unlockedAchievements / totalAchievements) * 100
                    }%`,
                  }}
                ></div>
              </div>
            </div>
            <div className={achievementStyles.syncSection}>
              <button
                className={achievementStyles.syncButton}
                onClick={syncAchievements}
                disabled={syncingAchievements}
              >
                {syncingAchievements ? (
                  <FiClock className={achievementStyles.syncIcon} />
                ) : (
                  <FiAward className={achievementStyles.syncIcon} />
                )}
                {syncingAchievements ? "Syncing..." : "Sync Achievements"}
              </button>
            </div>
          </div>
          <div className={achievementStyles.rarityStats}>
            <div className={achievementStyles.rarityBadge}>
              <span
                className={`${achievementStyles.rarityDot} ${achievementStyles.bronze}`}
              ></span>
              <span>
                Bronze:{" "}
                {achievementCategories.reduce(
                  (acc, cat) =>
                    acc +
                    cat.achievements.filter(
                      (ach) => ach.rarity === "bronze" && ach.unlocked
                    ).length,
                  0
                )}
              </span>
            </div>
            <div className={achievementStyles.rarityBadge}>
              <span
                className={`${achievementStyles.rarityDot} ${achievementStyles.silver}`}
              ></span>
              <span>
                Silver:{" "}
                {achievementCategories.reduce(
                  (acc, cat) =>
                    acc +
                    cat.achievements.filter(
                      (ach) => ach.rarity === "silver" && ach.unlocked
                    ).length,
                  0
                )}
              </span>
            </div>
            <div className={achievementStyles.rarityBadge}>
              <span
                className={`${achievementStyles.rarityDot} ${achievementStyles.gold}`}
              ></span>
              <span>
                Gold:{" "}
                {achievementCategories.reduce(
                  (acc, cat) =>
                    acc +
                    cat.achievements.filter(
                      (ach) => ach.rarity === "gold" && ach.unlocked
                    ).length,
                  0
                )}
              </span>
            </div>
            <div className={achievementStyles.rarityBadge}>
              <span
                className={`${achievementStyles.rarityDot} ${achievementStyles.legendary}`}
              ></span>
              <span>
                Legendary:{" "}
                {achievementCategories.reduce(
                  (acc, cat) =>
                    acc +
                    cat.achievements.filter(
                      (ach) => ach.rarity === "legendary" && ach.unlocked
                    ).length,
                  0
                )}
              </span>
            </div>
            <div className={achievementStyles.rarityBadge}>
              <span
                className={`${achievementStyles.rarityDot} ${achievementStyles.platinum}`}
              ></span>
              <span>
                Platinum:{" "}
                {achievementCategories.reduce(
                  (acc, cat) =>
                    acc +
                    cat.achievements.filter(
                      (ach) => ach.rarity === "platinum" && ach.unlocked
                    ).length,
                  0
                )}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Achievement Categories */}
      {unlockedAchievements === 0 && (
        <div className={achievementStyles.noAchievementsMessage}>
          <div className={achievementStyles.noAchievementsContent}>
            <FiAward className={achievementStyles.noAchievementsIcon} />
            <h3>No Achievements Unlocked Yet</h3>
            <p>Start learning to unlock your first achievements! Complete lessons, solve exercises, and build your learning streak to earn coins and badges.</p>
            <button 
              className={achievementStyles.syncButton}
              onClick={syncAchievements}
              disabled={syncingAchievements}
            >
              {syncingAchievements ? (
                <FiClock className={achievementStyles.syncIcon} />
              ) : (
                <FiAward className={achievementStyles.syncIcon} />
              )}
              {syncingAchievements ? "Checking..." : "Check for Achievements"}
            </button>
          </div>
        </div>
      )}
      
      <div className={achievementStyles.achievementCategories}>
        {achievementCategories.map((category) => (
          <div
            key={category.id}
            className={achievementStyles.categorySection}
          >
            <div className={achievementStyles.categoryHeader}>
              <div className={achievementStyles.categoryInfo}>
                <h3 className={achievementStyles.categoryTitle}>
                  {category.name}
                </h3>
                <p className={achievementStyles.categoryDescription}>
                  {category.description}
                </p>
              </div>
              <div className={achievementStyles.categoryProgress}>
                <span>
                  {category.achievements.filter((ach) => ach.unlocked).length}{" "}
                  / {category.achievements.length}
                </span>
              </div>
            </div>

            <div className={achievementStyles.achievementsGrid}>
              {category.achievements.map((achievement) => (
                <div
                  key={achievement.id}
                  className={`${achievementStyles.achievementCard} ${
                    achievementStyles[achievement.rarity]
                  } ${
                    achievement.unlocked
                      ? achievementStyles.unlocked
                      : achievementStyles.locked
                  }`}
                >
                  {/* Achievement Icon and Status Section */}
                  <div className={achievementStyles.iconAndStatus}>
                    <div className={achievementStyles.achievementIcon}>
                      {achievement.unlocked ? achievement.icon : <FiLock />}
                    </div>
                    <div className={achievementStyles.statusSection}>
                      <div className={achievementStyles.statusIcon}>
                        {achievement.unlocked ? <FiUnlock /> : <FiLock />}
                      </div>
                      <div className={achievementStyles.rewardInfo}>
                        <FiGift className={achievementStyles.rewardIcon} />
                        <span>{achievement.reward} coins</span>
                      </div>
                    </div>
                  </div>

                  <div className={achievementStyles.achievementContent}>
                    <div className={achievementStyles.achievementHeader}>
                      <h4 className={achievementStyles.achievementName}>
                        {achievement.name}
                      </h4>
                      <div className={achievementStyles.rarityBadgeSmall}>
                        <span className={achievementStyles.rarityText}>
                          {achievement.rarity}
                        </span>
                      </div>
                    </div>

                    <p className={achievementStyles.achievementDescription}>
                      {achievement.description}
                    </p>

                    {achievement.unlocked && !claimedAchievements.has(achievement.name) && (
                      <button
                        className={achievementStyles.claimButton}
                        onClick={() => claimAchievementReward(achievement.name, achievement.reward)}
                        disabled={claimingAchievement === achievement.name}
                      >
                        {claimingAchievement === achievement.name ? (
                          <FiClock className={achievementStyles.claimIcon} />
                        ) : (
                          <FiGift className={achievementStyles.claimIcon} />
                        )}
                        {claimingAchievement === achievement.name ? "Claiming..." : "Get Your Coins"}
                      </button>
                    )}

                    {claimedAchievements.has(achievement.name) && (
                      <div className={`${achievementStyles.claimedBadge} ${achievementStyles[`claimed${achievement.rarity.charAt(0).toUpperCase() + achievement.rarity.slice(1)}`]}`}>
                        <FiCheckCircle className={achievementStyles.claimedIcon} />
                        <span>Claimed</span>
                      </div>
                    )}

                    {!achievement.unlocked && (
                      <div className={achievementStyles.achievementProgress}>
                        <div className={achievementStyles.progressBar}>
                          <div
                            className={achievementStyles.progressFill}
                            style={{ width: `${achievement.progress}%` }}
                          ></div>
                        </div>
                        <span className={achievementStyles.progressLabel}>
                          {Math.round(achievement.progress)}% (
                          {Math.floor(
                            (achievement.progress / 100) * achievement.target
                          )}
                          /{achievement.target})
                        </span>
                      </div>
                    )}
                  </div>
                  

                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 