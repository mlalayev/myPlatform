"use client";

import React from "react";
import {
  FiAward,
  FiGift,
  FiUnlock,
  FiLock,
} from "react-icons/fi";
import achievementStyles from "../ProfileAchievements.module.css";

interface ProfileAchievementsProps {
  userStats: any;
  loading: boolean;
}

export default function ProfileAchievements({
  userStats,
  loading,
}: ProfileAchievementsProps) {
  // Achievement data structure
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
          icon: <FiAward />,
          rarity: "bronze",
          progress: userStats?.completedLessons > 0 ? 100 : 0,
          target: 1,
          unlocked: true, // userStats?.completedLessons > 0,
          reward: "50 coins",
        },
        {
          id: "lesson_explorer",
          name: "Knowledge Seeker",
          description: "Complete 10 lessons",
          icon: <FiAward />,
          rarity: "bronze", // changed from silver to bronze for demo
          progress: Math.min(
            ((userStats?.completedLessons || 0) / 10) * 100,
            100
          ),
          target: 10,
          unlocked: true, // (userStats?.completedLessons || 0) >= 10,
          reward: "200 coins",
        },
        {
          id: "lesson_master",
          name: "Learning Legend",
          description: "Complete 50 lessons",
          icon: <FiAward />,
          rarity: "gold",
          progress: Math.min(
            ((userStats?.completedLessons || 0) / 50) * 100,
            100
          ),
          target: 50,
          unlocked: true, // (userStats?.completedLessons || 0) >= 50,
          reward: "1000 coins",
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
          icon: <FiAward />,
          rarity: "bronze",
          progress: userStats?.solvedExercises > 0 ? 100 : 0,
          target: 1,
          unlocked: true, // userStats?.solvedExercises > 0,
          reward: "75 coins",
        },
        {
          id: "coding_ninja",
          name: "Code Ninja",
          description: "Solve 25 exercises",
          icon: <FiAward />,
          rarity: "silver",
          progress: Math.min(
            ((userStats?.solvedExercises || 0) / 25) * 100,
            100
          ),
          target: 25,
          unlocked: true, // (userStats?.solvedExercises || 0) >= 25,
          reward: "500 coins",
        },
        {
          id: "algorithm_master",
          name: "Algorithm Master",
          description: "Solve 100 exercises",
          icon: <FiAward />,
          rarity: "legendary",
          progress: Math.min(
            ((userStats?.solvedExercises || 0) / 100) * 100,
            100
          ),
          target: 100,
          unlocked: true, // (userStats?.solvedExercises || 0) >= 100,
          reward: "2500 coins",
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
          icon: <FiAward />,
          rarity: "bronze",
          progress: Math.min(((userStats?.loginStreak || 0) / 3) * 100, 100),
          target: 3,
          unlocked: true, // (userStats?.loginStreak || 0) >= 3,
          reward: "100 coins",
        },
        {
          id: "week_warrior",
          name: "Week Warrior",
          description: "Login for 7 days in a row",
          icon: <FiAward />,
          rarity: "silver",
          progress: Math.min(((userStats?.loginStreak || 0) / 7) * 100, 100),
          target: 7,
          unlocked: true, // (userStats?.loginStreak || 0) >= 7,
          reward: "300 coins",
        },
        {
          id: "month_master",
          name: "Month Master",
          description: "Login for 30 days in a row",
          icon: <FiAward />,
          rarity: "legendary",
          progress: Math.min(((userStats?.loginStreak || 0) / 30) * 100, 100),
          target: 30,
          unlocked: true, // (userStats?.loginStreak || 0) >= 30,
          reward: "1500 coins",
        },
      ],
    },
    {
      id: "special",
      name: "⭐ Special Edition",
      description: "Rare and unique achievements",
      achievements: [
        {
          id: "early_bird",
          name: "Early Bird",
          description: "Join during beta testing",
          icon: <FiAward />,
          rarity: "platinum",
          progress: 100,
          target: 1,
          unlocked: true,
          reward: "Beta Badge",
        },
        {
          id: "night_owl",
          name: "Night Owl",
          description: "Study after midnight",
          icon: <FiAward />,
          rarity: "gold",
          progress: 0,
          target: 1,
          unlocked: true, // false,
          reward: "Night Badge",
        },
      ],
    },
  ];

  const totalAchievements = achievementCategories.reduce(
    (acc, cat) => acc + cat.achievements.length,
    0
  );
  const unlockedAchievements = achievementCategories.reduce(
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
                  <div className={achievementStyles.achievementIcon}>
                    {achievement.unlocked ? achievement.icon : <FiLock />}
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

                    <div className={achievementStyles.achievementReward}>
                      <FiGift className={achievementStyles.rewardIcon} />
                      <span>{achievement.reward}</span>
                    </div>

                    {achievement.unlocked && (
                      <div className={achievementStyles.unlockedBadge}>
                        <FiUnlock
                          className={achievementStyles.unlockedIcon}
                        />
                        <span>Unlocked!</span>
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