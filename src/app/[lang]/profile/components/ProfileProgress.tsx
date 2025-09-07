"use client";

import React, { useState, useEffect } from "react";
import {
  FiTrendingUp,
  FiCode,
  FiDatabase,
  FiCpu,
  FiHash,
  FiBookOpen,
  FiPlay,
  FiEye,
  FiArrowRight,
  FiClock,
  FiCheckCircle,
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

// Helper function to get month labels for GitHub-style calendar
const getMonthLabels = (streakDays: any[]) => {
  const months = ['Yan', 'Fev', 'Mar', 'Apr', 'May', 'İyn', 'İyl', 'Avq', 'Sen', 'Okt', 'Noy', 'Dek'];
  const labels: string[] = [];
  let currentMonth = -1;
  
  // Group days by weeks (52 weeks)
  for (let week = 0; week < 52; week++) {
    const dayIndex = week * 7; // First day of each week
    if (dayIndex < streakDays.length) {
      const day = streakDays[dayIndex];
      const month = day.month - 1; // Convert to 0-based index
      
      if (month !== currentMonth) {
        labels.push(months[month]);
        currentMonth = month;
      } else {
        labels.push(''); // Empty for weeks that don't start a new month
      }
    }
  }
  
  return labels;
};

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
      default:
        return <FiBookOpen size={20} color="#667eea" />;
    }
  };

  // Generate lesson cards from real data
  const generateLessonCards = () => {
    if (!userStats?.languageProgress || Object.keys(userStats.languageProgress).length === 0) {
      return [];
    }

    return Object.entries(userStats.languageProgress)
      .map(([language, data]: [string, any]) => {
        const progress = data.progress || 0;
        const completed = data.lessons || 0;
        const total = data.totalLessons || 1;
        const lastTopic = data.lastViewedTopic;
        
        // Determine status based on progress
        let status = 'notStarted';
        if (progress >= 100) status = 'completed';
        else if (progress > 0) status = 'inProgress';
        
        return {
          id: language,
          title: `${data.displayName || language} Course`,
          description: `Master ${data.displayName || language} programming with comprehensive lessons and exercises.`,
          category: data.displayName || language,
          categoryClass: language.toLowerCase().replace(/[^a-z0-9]/g, ''),
          status: status,
          progress: progress,
          duration: `${Math.floor(total * 5)} min`, // Estimate 5 min per lesson
          difficulty: progress > 50 ? 'medium' : 'easy',
          lessons: total,
          exercises: Math.floor(total * 0.8), // Estimate 80% of lessons have exercises
          bookmarked: false,
          lastTopic: lastTopic,
          lastTopicId: data.lastViewedTopicId,
          language: language
        };
      })
      .sort((a, b) => b.progress - a.progress); // Sort by progress
  };

  const lessonCards = generateLessonCards();

  const getDifficultyDots = (difficulty: string) => {
    const levels: { [key: string]: number } = { easy: 1, medium: 2, hard: 3 };
    const level = levels[difficulty] || 1;
    
    return Array.from({ length: 3 }, (_, i) => (
      <div
        key={i}
        className={`${progressStyles.difficultyDot} ${
          i < level ? `${progressStyles.filled} ${progressStyles[difficulty]}` : ''
        }`}
      ></div>
    ));
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <FiCheckCircle />;
      case 'inProgress':
        return <FiPlay />;
      default:
        return <FiBookOpen />;
    }
  };

  const handleLessonClick = (lesson: any) => {
    if (lesson.lastTopicId) {
      // Navigate to the last viewed topic
      window.location.href = `/az/tutorials/languages/${lesson.language}/${lesson.lastTopicId}`;
    } else {
      // Navigate to the language overview
      window.location.href = `/az/tutorials/languages/${lesson.language}`;
    }
  };

  const getActionButton = (lesson: any) => {
    const handleClick = () => handleLessonClick(lesson);
    
    switch (lesson.status) {
      case 'completed':
        return (
          <button 
            className={`${progressStyles.actionButton} ${progressStyles.reviewButton} ${progressStyles[lesson.categoryClass]}`}
            onClick={handleClick}
          >
            <FiEye />
            Review
          </button>
        );
      case 'inProgress':
        return (
          <button 
            className={`${progressStyles.actionButton} ${progressStyles.continueButton} ${progressStyles[lesson.categoryClass]}`}
            onClick={handleClick}
          >
            <FiPlay />
            Continue
          </button>
        );
      default:
        return (
          <button 
            className={`${progressStyles.actionButton} ${progressStyles.startButton} ${progressStyles[lesson.categoryClass]}`}
            onClick={handleClick}
          >
            <FiArrowRight />
            Start
          </button>
        );
    }
  };

  // Use streak data from userStats
  const streakDays = userStats?.streakData || [];
  
  // Debug logging for streak data
  console.log('Frontend Streak Debug - streakDays:', streakDays);
  if (streakDays.length > 0) {
    console.log('Frontend Streak Debug - Today position:', streakDays.findIndex((day: any) => day.isToday));
    console.log('Frontend Streak Debug - Today data:', streakDays.find((day: any) => day.isToday));
    console.log('Frontend Streak Debug - Last 5 days:', streakDays.slice(-5));
    console.log('Frontend Streak Debug - Last day number:', streakDays[streakDays.length - 1]?.day);
    console.log('Frontend Streak Debug - Last day isToday:', streakDays[streakDays.length - 1]?.isToday);
  }
  
  return (
    <div className={progressStyles.progressContainer}>
      {/* Hero Section */}
      <div className={progressStyles.progressHero}>
        <div className={progressStyles.heroContent}>
          <div className={progressStyles.heroLeft}>
            <h1 className={progressStyles.heroTitle}>Learning Progress</h1>
            <p className={progressStyles.heroSubtitle}>
              Track your learning journey and see how you&apos;re growing every day
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

      {/* Study Streak Section */}
      <div className={progressStyles.streakSection}>
        <h4 className={progressStyles.sectionTitle} style={{ fontSize: '1.2rem', marginBottom: '16px', color: '#1e293b' }}>
          <FiTrendingUp className={progressStyles.sectionIcon} style={{ fontSize: '1.3rem' }} />
          Study Streak
        </h4>
        <div className={progressStyles.streakContent}>
          {/* GitHub-style calendar */}
          <div className={progressStyles.githubCalendar}>
            {/* Month labels */}
            <div className={progressStyles.monthLabels}>
              {getMonthLabels(streakDays).map((month, index) => (
                <div key={index} className={progressStyles.monthLabel}>
                  {month}
                </div>
              ))}
            </div>
            
            {/* Calendar grid */}
            <div className={progressStyles.calendarGrid}>
              {/* Weekday labels */}
              <div className={progressStyles.weekdayLabels}>
                <div className={progressStyles.weekdayLabel}>B</div>
                <div className={progressStyles.weekdayLabel}></div>
                <div className={progressStyles.weekdayLabel}>Ç</div>
                <div className={progressStyles.weekdayLabel}></div>
                <div className={progressStyles.weekdayLabel}>C</div>
                <div className={progressStyles.weekdayLabel}></div>
                <div className={progressStyles.weekdayLabel}>B</div>
              </div>
              
              {/* Activity squares */}
              <div className={progressStyles.activityGrid}>
                {streakDays.map((day: any, index: number) => (
                  <div 
                    key={index} 
                    className={`${progressStyles.activitySquare} ${progressStyles[`level${day.activityLevel || 0}`]} ${
                      day.isToday ? progressStyles.today : ''
                    }`}
                    title={`${day.month}/${day.day}/${day.year}: ${
                      day.activityLevel > 0 
                        ? `${day.lessonsViewed + day.exercisesSolved + day.quizzesTaken} activities`
                        : 'No activity'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
          
          {/* Stats and Legend */}
          <div className={progressStyles.streakStats}>
            <div className={progressStyles.streakInfo}>
              <div className={progressStyles.streakCount}>
                <span className={progressStyles.streakCountNumber}>
                  {userStats?.loginStreak || 0}
                </span>
                <span className={progressStyles.streakCountLabel}>
                  day streak
                </span>
              </div>
              <div className={progressStyles.streakLongest}>
                <span className={progressStyles.streakLongestLabel}>
                  Longest streak
                </span>
                <span className={progressStyles.streakLongestNumber}>
                  {userStats?.longestStreak || 0} days
                </span>
              </div>
            </div>
            
            {/* Activity Legend */}
            <div className={progressStyles.activityLegend}>
              <span className={progressStyles.legendLabel}>Less</span>
              <div className={progressStyles.legendSquares}>
                <div className={`${progressStyles.activitySquare} ${progressStyles.level0}`}></div>
                <div className={`${progressStyles.activitySquare} ${progressStyles.level1}`}></div>
                <div className={`${progressStyles.activitySquare} ${progressStyles.level2}`}></div>
                <div className={`${progressStyles.activitySquare} ${progressStyles.level3}`}></div>
                <div className={`${progressStyles.activitySquare} ${progressStyles.level4}`}></div>
              </div>
              <span className={progressStyles.legendLabel}>More</span>
            </div>
          </div>
        </div>
      </div>

      {/* Lessons Section */}
      <div className={progressStyles.lessonsSection}>
        <h3 className={progressStyles.sectionTitle}>
          <FiBookOpen className={progressStyles.sectionIcon} />
          My Learning Courses
        </h3>
        <div className={progressStyles.lessonsGrid}>
          {lessonCards.map((lesson) => (
            <div 
              key={lesson.id} 
              className={`${progressStyles.lessonCard} ${progressStyles[lesson.status]}`}
            >
              <div className={`${progressStyles.lessonHeader} ${progressStyles[lesson.categoryClass]}`}>
                <div className={progressStyles.lessonMeta}>
                  <div className={progressStyles.lessonInfo}>
                    <div className={progressStyles.lessonCategory}>
                      {lesson.category}
                    </div>
                    <h4 className={progressStyles.lessonTitle}>
                      {lesson.title}
                    </h4>
                    <p className={progressStyles.lessonDescription}>
                      {lesson.description}
                    </p>
                  </div>
                  <div className={`${progressStyles.lessonStatus} ${progressStyles[lesson.status]}`}>
                    {getStatusIcon(lesson.status)}
                    {lesson.status === 'completed' ? 'Completed' : 
                     lesson.status === 'inProgress' ? 'In Progress' : 'Start'}
                  </div>
                </div>
              </div>

              <div className={progressStyles.lessonContent}>
                <div className={progressStyles.lessonProgress}>
                  <div className={progressStyles.progressLabel}>
                    <span className={progressStyles.progressText}>Progress</span>
                    <span className={progressStyles.progressPercent}>
                      {lesson.progress}%
                    </span>
                  </div>
                  <div className={progressStyles.progressBar}>
                    <div 
                      className={`${progressStyles.progressFill} ${progressStyles[lesson.status]} ${progressStyles[lesson.categoryClass]}`}
                      style={{ width: `${lesson.progress}%` }}
                    ></div>
                  </div>
                </div>

                <div className={progressStyles.lessonDetails}>
                  <div className={progressStyles.lessonStats}>
                    <div className={progressStyles.lessonStat}>
                      <FiClock className={progressStyles.statIcon} />
                      {lesson.duration}
                    </div>
                    <div className={progressStyles.lessonStat}>
                      <FiBookOpen className={progressStyles.statIcon} />
                      {lesson.lessons} lessons
                    </div>
                    <div className={progressStyles.lessonStat}>
                      <FiCode className={progressStyles.statIcon} />
                      {lesson.exercises} exercises
                    </div>
                  </div>
                  
                  <div className={progressStyles.lessonDifficulty}>
                    <span>Difficulty</span>
                    <div className={progressStyles.difficultyDots}>
                      {getDifficultyDots(lesson.difficulty)}
                    </div>
                  </div>
                </div>

                <div className={progressStyles.lessonActions}>
                  {getActionButton(lesson)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}