"use client";

import React from "react";
import {
  FiTrendingUp,
  FiCode,
  FiDatabase,
  FiCpu,
  FiHash,
} from "react-icons/fi";
import progressStyles from "../ProfileProgress.module.css";

interface ProfileProgressProps {
  userStats: any;
  loading: boolean;
  setSelectedTab: (tab: string) => void;
}

export default function ProfileProgress({
  userStats,
  loading,
  setSelectedTab,
}: ProfileProgressProps) {
  if (loading) {
    return (
      <div className={progressStyles.progressContainer}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ 
              width: '40px', 
              height: '40px', 
              border: '4px solid #f3f3f3', 
              borderTop: '4px solid #667eea', 
              borderRadius: '50%', 
              animation: 'spin 1s linear infinite',
              margin: '0 auto 16px'
            }}></div>
            <span style={{ color: '#718096' }}>Loading your progress...</span>
          </div>
        </div>
      </div>
    );
  }

  // Calculate user level based on total XP
  const totalXP = (userStats?.completedLessons || 0) * 100 + (userStats?.solvedExercises || 0) * 150;
  const userLevel = Math.floor(totalXP / 1000) + 1;
  const xpForNextLevel = userLevel * 1000;
  const currentLevelXP = totalXP % 1000;
  const levelProgress = (currentLevelXP / 1000) * 100;

  const skills = [
    {
      name: "JavaScript",
      level: "Intermediate",
      progress: Math.min(((userStats?.completedLessons || 0) / 20) * 100, 100),
      xp: (userStats?.completedLessons || 0) * 50,
      icon: <FiCode />,
      lessons: Math.min(userStats?.completedLessons || 0, 15),
      exercises: Math.min(userStats?.solvedExercises || 0, 10),
      className: "javascript"
    },
    {
      name: "Python",
      level: "Beginner",
      progress: Math.min(((userStats?.completedLessons || 0) / 30) * 100, 100),
      xp: (userStats?.completedLessons || 0) * 35,
      icon: <FiDatabase />,
      lessons: Math.max(0, (userStats?.completedLessons || 0) - 10),
      exercises: Math.max(0, (userStats?.solvedExercises || 0) - 5),
      className: "python"
    },
    {
      name: "C++",
      level: "Advanced",
      progress: Math.min(((userStats?.solvedExercises || 0) / 15) * 100, 100),
      xp: (userStats?.solvedExercises || 0) * 75,
      icon: <FiCpu />,
      lessons: Math.max(0, (userStats?.completedLessons || 0) - 5),
      exercises: Math.max(0, (userStats?.solvedExercises || 0) - 8),
      className: "cpp"
    },
    {
      name: "Algorithms",
      level: "Expert",
      progress: Math.min(((userStats?.solvedExercises || 0) / 25) * 100, 100),
      xp: (userStats?.solvedExercises || 0) * 100,
      icon: <FiHash />,
      lessons: Math.max(0, (userStats?.completedLessons || 0) - 8),
      exercises: userStats?.solvedExercises || 0,
      className: "algorithms"
    }
  ];

  // Generate streak days (last 28 days)
  const today = new Date();
  const streakDays = Array.from({ length: 28 }, (_, i) => {
    const date = new Date(today);
    date.setDate(date.getDate() - (27 - i));
    const isActive = Math.random() > 0.3; // Random activity for demo
    const isToday = i === 27;
    return { date, isActive, isToday };
  });

  return (
    <div className={progressStyles.progressContainer}>
      {/* Hero Section */}
      <div className={progressStyles.progressHero}>
        <div className={progressStyles.heroContent}>
          <div className={progressStyles.heroLeft}>
            <h1 className={progressStyles.heroTitle}>Learning Progress</h1>
            <p className={progressStyles.heroSubtitle}>
              Track your learning journey and see how you're growing every day
            </p>
            <div className={progressStyles.heroStats}>
              <div className={progressStyles.heroStat}>
                <span className={progressStyles.heroStatNumber}>
                  {userStats?.studyTimeHours || 0}h
                </span>
                <span className={progressStyles.heroStatLabel}>Study Time</span>
              </div>
              <div className={progressStyles.heroStat}>
                <span className={progressStyles.heroStatNumber}>
                  {userStats?.loginStreak || 0}
                </span>
                <span className={progressStyles.heroStatLabel}>Day Streak</span>
              </div>
              <div className={progressStyles.heroStat}>
                <span className={progressStyles.heroStatNumber}>
                  {userStats?.completionRate || 0}%
                </span>
                <span className={progressStyles.heroStatLabel}>Completion</span>
              </div>
            </div>
          </div>
          <div className={progressStyles.heroRight}>
            <div className={progressStyles.levelBadge}>
              <div className={progressStyles.levelNumber}>{userLevel}</div>
              <div className={progressStyles.levelTitle}>Learning Level</div>
              <div className={progressStyles.levelProgress}>
                <div 
                  className={progressStyles.levelProgressBar}
                  style={{ width: `${levelProgress}%` }}
                ></div>
              </div>
              <div className={progressStyles.levelXp}>
                {currentLevelXP}/{1000} XP
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className={progressStyles.chartsSection}>
        <div className={progressStyles.learningChart}>
          <div className={progressStyles.chartHeader}>
            <h3 className={progressStyles.chartTitle}>Learning Analytics</h3>
            <div className={progressStyles.chartTabs}>
              <button className={`${progressStyles.chartTab} ${progressStyles.active}`}>
                Weekly
              </button>
              <button className={progressStyles.chartTab}>Monthly</button>
              <button className={progressStyles.chartTab}>All Time</button>
            </div>
          </div>
          <div className={progressStyles.chartArea}>
            <div className={progressStyles.chartPlaceholder}>
              📊 Interactive charts coming soon!<br />
              Your learning data will be visualized here
            </div>
          </div>
        </div>

        <div className={progressStyles.streakChart}>
          <h3 className={progressStyles.streakTitle}>
            <FiTrendingUp className={progressStyles.streakIcon} />
            Study Streak
          </h3>
          <div className={progressStyles.streakGrid}>
            {streakDays.map((day, index) => (
              <div
                key={index}
                className={`${progressStyles.streakDay} ${
                  day.isActive ? progressStyles.active : ''
                } ${day.isToday ? progressStyles.today : ''}`}
                title={day.date.toLocaleDateString()}
              ></div>
            ))}
          </div>
          <div className={progressStyles.streakStats}>
            <div className={progressStyles.streakStat}>
              <span className={progressStyles.streakStatLabel}>Current Streak</span>
              <span className={progressStyles.streakStatValue}>
                {userStats?.loginStreak || 0} days
              </span>
            </div>
            <div className={progressStyles.streakStat}>
              <span className={progressStyles.streakStatLabel}>Longest Streak</span>
              <span className={progressStyles.streakStatValue}>
                {Math.max(userStats?.loginStreak || 0, 12)} days
              </span>
            </div>
            <div className={progressStyles.streakStat}>
              <span className={progressStyles.streakStatLabel}>This Week</span>
              <span className={progressStyles.streakStatValue}>
                {userStats?.weeklyProgress?.lessonsThisWeek || 0} lessons
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Skills Section */}
      <div className={progressStyles.skillsSection}>
        <div className={progressStyles.skillsHeader}>
          <h3 className={progressStyles.skillsTitle}>Skill Progression</h3>
        </div>
        <div className={progressStyles.skillsGrid}>
          {skills.map((skill, index) => (
            <div key={index} className={progressStyles.skillCard}>
              <div className={progressStyles.skillHeader}>
                <div className={progressStyles.skillInfo}>
                  <div className={progressStyles.skillIcon}>
                    {skill.icon}
                  </div>
                  <div>
                    <h4 className={progressStyles.skillName}>{skill.name}</h4>
                    <p className={progressStyles.skillLevel}>{skill.level}</p>
                  </div>
                </div>
                <div className={progressStyles.skillBadge}>
                  {Math.round(skill.progress)}%
                </div>
              </div>
              <div className={progressStyles.skillProgress}>
                <div className={progressStyles.skillProgressBar}>
                  <div 
                    className={`${progressStyles.skillProgressFill} ${progressStyles[skill.className]}`}
                    style={{ width: `${skill.progress}%` }}
                  ></div>
                </div>
                <div className={progressStyles.skillProgressText}>
                  <span className={progressStyles.skillPercent}>
                    {Math.round(skill.progress)}%
                  </span>
                  <span className={progressStyles.skillXp}>
                    {skill.xp} XP
                  </span>
                </div>
              </div>
              <div className={progressStyles.skillStats}>
                <div className={progressStyles.skillStatItem}>
                  <div className={progressStyles.skillStatNumber}>
                    {skill.lessons}
                  </div>
                  <div className={progressStyles.skillStatLabel}>Lessons</div>
                </div>
                <div className={progressStyles.skillStatItem}>
                  <div className={progressStyles.skillStatNumber}>
                    {skill.exercises}
                  </div>
                  <div className={progressStyles.skillStatLabel}>Exercises</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Achievements Preview */}
      <div className={progressStyles.achievementsPreview}>
        <div className={progressStyles.achievementsPreviewHeader}>
          <h3 className={progressStyles.achievementsPreviewTitle}>
            Recent Achievements
          </h3>
          <button 
            className={progressStyles.viewAllBtn}
            onClick={() => setSelectedTab("achievements")}
          >
            View All
          </button>
        </div>
        <div className={progressStyles.recentAchievements}>
          <div className={`${progressStyles.miniAchievement} ${progressStyles.gold}`}>
            <div className={progressStyles.miniAchievementIcon}>🏆</div>
            <div className={progressStyles.miniAchievementName}>
              Learning Legend
            </div>
          </div>
          <div className={`${progressStyles.miniAchievement} ${progressStyles.silver}`}>
            <div className={progressStyles.miniAchievementIcon}>⚡</div>
            <div className={progressStyles.miniAchievementName}>
              Code Ninja
            </div>
          </div>
          <div className={`${progressStyles.miniAchievement} ${progressStyles.bronze}`}>
            <div className={progressStyles.miniAchievementIcon}>🎯</div>
            <div className={progressStyles.miniAchievementName}>
              Problem Solver
            </div>
          </div>
          <div className={`${progressStyles.miniAchievement} ${progressStyles.gold}`}>
            <div className={progressStyles.miniAchievementIcon}>🔥</div>
            <div className={progressStyles.miniAchievementName}>
              Week Warrior
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 