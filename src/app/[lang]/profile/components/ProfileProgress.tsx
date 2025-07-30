"use client";

import React from "react";
import {
  FiTrendingUp,
  FiCode,
  FiDatabase,
  FiCpu,
  FiHash,
  FiBookOpen,
} from "react-icons/fi";
import { 
  SiJavascript, 
  SiPython, 
  SiOpenjdk, 
  SiC, 
  SiCplusplus, 
  SiTypescript, 
  SiPhp,
  SiGo,
  SiRust,
  SiSwift,
  SiKotlin,
  SiRuby,
  SiR
} from "react-icons/si";
import * as FiIcons from "react-icons/fi";
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

  // Helper function to get language icon (same as ProfileOverview)
  const getLanguageIcon = (language: string) => {
    switch (language?.toLowerCase()) {
      case 'javascript':
        return <SiJavascript size={20} color="#f7df1e" />;
      case 'python':
        return <SiPython size={20} color="#3572A5" />;
      case 'java':
        return <SiOpenjdk size={20} color="#b07219" />;
      case 'c':
        return <SiC size={20} color="#00599C" />;
      case 'c++':
      case 'cpp':
      case 'c%2b%2b':
        return <SiCplusplus size={20} color="#00599C" />;
      case 'c#':
      case 'csharp':
        return <FiIcons.FiHash size={20} color="#178600" />;
      case 'typescript':
        return <SiTypescript size={20} color="#3178c6" />;
      case 'php':
        return <SiPhp size={20} color="#777bb4" />;
      case 'go':
      case 'golang':
        return <SiGo size={20} color="#00ADD8" />;
      case 'rust':
        return <SiRust size={20} color="#dea584" />;
      case 'swift':
        return <SiSwift size={20} color="#ffac45" />;
      case 'kotlin':
        return <SiKotlin size={20} color="#7f52ff" />;
      case 'ruby':
        return <SiRuby size={20} color="#cc342d" />;
      case 'r':
        return <SiR size={20} color="#276dc3" />;
      case 'algorithms':
        return <FiCode size={20} color="#667eea" />;
      case 'data-structures':
        return <FiCode size={20} color="#48bb78" />;
      default:
        return <FiBookOpen size={20} color="#667eea" />;
    }
  };

  // Helper function to get skill level
  const getSkillLevel = (progress: number): string => {
    if (progress >= 80) return "Expert";
    if (progress >= 60) return "Advanced";
    if (progress >= 40) return "Intermediate";
    if (progress >= 20) return "Beginner";
    return "Novice";
  };

  // Helper function to get skill class name
  const getSkillClassName = (language: string): string => {
    // Special handling for C++ to preserve the plus signs
    if (language.toLowerCase() === 'c++' || language.toLowerCase() === 'c%2b%2b') {
      return 'cpp';
    }
    return language.toLowerCase().replace(/[^a-z0-9]/g, '');
  };

  // Helper function to get language icon with debug
  const getLanguageIconWithDebug = (language: string) => {
    const icon = getLanguageIcon(language);
    console.log(`Language: ${language}, Icon found:`, icon ? 'Yes' : 'No');
    return icon;
  };

  // Generate dynamic skills from userStats.languageProgress
  const generateSkills = () => {
    if (!userStats?.languageProgress || Object.keys(userStats.languageProgress).length === 0) {
      return [];
    }

    const skills = Object.entries(userStats.languageProgress)
      .map(([language, data]: [string, any]) => {
        const progress = data.progress || 0;
        const lessons = data.lessons || 0;
        const totalLessons = data.totalLessons || 1;
        const lastStudied = data.lastStudied ? new Date(data.lastStudied) : null;
        
        console.log(`Processing language: ${language}, className: ${getSkillClassName(language)}`);
        return {
          name: data.displayName || language,
          level: getSkillLevel(progress),
          progress: progress,
          xp: lessons * 50,
          icon: getLanguageIconWithDebug(language),
          lessons: lessons,
          totalLessons: totalLessons,
          lastStudied: lastStudied,
          className: getSkillClassName(language)
        };
      })
      .sort((a, b) => {
        // Sort by last studied date (most recent first)
        if (a.lastStudied && b.lastStudied) {
          return b.lastStudied.getTime() - a.lastStudied.getTime();
        }
        // If no lastStudied, sort by progress
        return b.progress - a.progress;
      })
      .slice(0, 4); // Take only the last 4 languages

    return skills;
  };

  const skills = generateSkills();

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
        {skills.length > 0 ? (
        <div className={progressStyles.skillsGrid}>
          {skills.map((skill, index) => (
            <div key={index} className={progressStyles.skillCard}>
              <div className={progressStyles.skillHeader}>
                <div className={progressStyles.skillInfo}>
                  <div 
                    className={progressStyles.skillIcon}
                    data-language={skill.className}
                  >
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
                      {skill.lessons}/{skill.totalLessons}
                  </div>
                  <div className={progressStyles.skillStatLabel}>Lessons</div>
                </div>
                <div className={progressStyles.skillStatItem}>
                  <div className={progressStyles.skillStatNumber}>
                      {skill.lastStudied ? skill.lastStudied.toLocaleDateString() : 'Never'}
                  </div>
                    <div className={progressStyles.skillStatLabel}>Last Studied</div>
                </div>
              </div>
            </div>
          ))}
        </div>
        ) : (
          <div className={progressStyles.noSkills}>
            <p>No programming languages studied yet. Start your learning journey!</p>
          </div>
        )}
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