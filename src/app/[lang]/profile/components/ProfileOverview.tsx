"use client";

import React from "react";
import {
  FiStar,
  FiDollarSign,
  FiGift,
  FiTrendingUp,
  FiBookOpen,
  FiCode,
  FiCheckCircle,
  FiClock,
  FiActivity,
  FiUser,
  FiAward,
} from "react-icons/fi";
import overviewStyles from "../ProfileOverview.module.css";
import calendarStyles from "../ProfileCalendar.module.css";

interface ProfileOverviewProps {
  userStats: any;
  loading: boolean;
  setSelectedTab: (tab: string) => void;
  filterNavigationActivities: (activities: any[]) => any[];
  getActivityIcon: (type: string) => React.ReactNode;
}

export default function ProfileOverview({
  userStats,
  loading,
  setSelectedTab,
  filterNavigationActivities,
  getActivityIcon,
}: ProfileOverviewProps) {
  if (loading) {
    return (
      <div className={overviewStyles.overviewContainer}>
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
            <span style={{ color: '#718096' }}>Loading your profile...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!userStats) {
    return (
      <div className={overviewStyles.overviewContainer}>
        <div style={{ textAlign: 'center', padding: '60px 20px', color: '#718096' }}>
          Failed to load profile data
        </div>
      </div>
    );
  }

  return (
    <div className={overviewStyles.overviewContainer}>
      {/* Header Section with User Info */}
      <div className={overviewStyles.profileHeader}>
        <div className={overviewStyles.userAvatarSection}>
          <div className={overviewStyles.avatarContainer}>
            <div className={overviewStyles.avatar}>
              {userStats.user.avatarUrl ? (
                <img
                  src={userStats.user.avatarUrl}
                  alt="Profile"
                  className={overviewStyles.avatarImage}
                />
              ) : (
                <span className={overviewStyles.avatarInitial}>
                  {userStats.user.name?.charAt(0).toUpperCase() ||
                    userStats.user.username?.charAt(0).toUpperCase() ||
                    "U"}
                </span>
              )}
            </div>
          </div>
          <div className={overviewStyles.userInfo}>
            <h1 className={overviewStyles.userName}>
              {userStats.user.name ||
                userStats.user.username ||
                "Anonymous User"}
            </h1>
            <p className={overviewStyles.userEmail}>{userStats.user.email}</p>
            <div className={overviewStyles.userBadge}>
              <FiStar className={overviewStyles.badgeIcon} />
              <span>{userStats.rank}</span>
            </div>
          </div>
        </div>

        {/* Coin System Section */}
        <div className={overviewStyles.coinSection}>
          <div className={overviewStyles.coinCard}>
            <div className={overviewStyles.coinHeader}>
              <FiDollarSign className={overviewStyles.coinIcon} />
              <span className={overviewStyles.coinTitle}>Daily Coins</span>
            </div>
            <div className={overviewStyles.coinAmount}>
              <span className={overviewStyles.totalCoins}>
                {userStats.dailyLoginPoints}
              </span>
              <span className={overviewStyles.coinLabel}>Total Coins</span>
            </div>
            <div className={overviewStyles.coinToday}>
              <FiGift className={overviewStyles.todayIcon} />
              <span>+{userStats.todayCoins} today</span>
            </div>
          </div>

          <div className={overviewStyles.streakCard}>
            <div className={overviewStyles.streakHeader}>
              <FiTrendingUp className={overviewStyles.streakIcon} />
              <span className={overviewStyles.streakTitle}>Login Streak</span>
            </div>
            <div className={overviewStyles.streakAmount}>
              <span className={overviewStyles.streakNumber}>
                {userStats.loginStreak}
              </span>
              <span className={overviewStyles.streakLabel}>Days</span>
            </div>
            <div className={overviewStyles.streakMessage}>Keep it up! 🔥</div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className={overviewStyles.statsGrid}>
        <div className={overviewStyles.statCard}>
          <div className={overviewStyles.statIcon}>
            <FiBookOpen />
          </div>
          <div className={overviewStyles.statContent}>
            <div className={overviewStyles.statNumber}>
              {userStats.completedLessons}/{userStats.totalLessons}
            </div>
            <div className={overviewStyles.statLabel}>Lessons</div>
            <div className={overviewStyles.statProgress}>
              <div
                className={overviewStyles.statProgressBar}
                style={{
                  width: `${
                    (userStats.completedLessons / userStats.totalLessons) *
                      100 || 0
                  }%`,
                }}
              ></div>
            </div>
          </div>
        </div>

        <div className={overviewStyles.statCard}>
          <div className={overviewStyles.statIcon}>
            <FiCode />
          </div>
          <div className={overviewStyles.statContent}>
            <div className={overviewStyles.statNumber}>
              {userStats.solvedExercises}/{userStats.totalExercises}
            </div>
            <div className={overviewStyles.statLabel}>Exercises</div>
            <div className={overviewStyles.statProgress}>
              <div
                className={overviewStyles.statProgressBar}
                style={{
                  width: `${
                    (userStats.solvedExercises / userStats.totalExercises) *
                      100 || 0
                  }%`,
                }}
              ></div>
            </div>
          </div>
        </div>

        <div className={overviewStyles.statCard}>
          <div className={overviewStyles.statIcon}>
            <FiCheckCircle />
          </div>
          <div className={overviewStyles.statContent}>
            <div className={overviewStyles.statNumber}>
              {userStats.completionRate}%
            </div>
            <div className={overviewStyles.statLabel}>Completion</div>
            <div className={overviewStyles.statTrend}>
              <FiTrendingUp className={overviewStyles.trendIcon} />
              <span>
                +{userStats.weeklyProgress.lessonsThisWeek} this week
              </span>
            </div>
          </div>
        </div>

        <div className={overviewStyles.statCard}>
          <div className={overviewStyles.statIcon}>
            <FiClock />
          </div>
          <div className={overviewStyles.statContent}>
            <div className={overviewStyles.statNumber}>
              {userStats.studyTimeHours}h
            </div>
            <div className={overviewStyles.statLabel}>Study Time</div>
            <div className={overviewStyles.statTrend}>
              <FiTrendingUp className={overviewStyles.trendIcon} />
              <span>
                {userStats.weeklyProgress.studyTimeThisWeek}h this week
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Calendar Section - Temporarily disabled until activity tracking is ready */}
      <div className={overviewStyles.calendarSection}>
        <h3>📅 Study Calendar</h3>
        <p>
          Activity tracking is being set up. Calendar will be available soon!
        </p>
      </div>

      {/* Activity Summary */}
      <div className={overviewStyles.activitySection}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "24px",
          }}
        >
          <h3 className={overviewStyles.sectionTitle} style={{ margin: 0 }}>
            Recent Activity
          </h3>
          <button
            className={calendarStyles.viewAllBtn}
            onClick={() => setSelectedTab("recent-activities")}
          >
            View All Activities
          </button>
        </div>
        <div className={overviewStyles.activityList}>
          {filterNavigationActivities(userStats.recentActivities)
            .slice(0, 5)
            .map((activity, index) => (
              <div key={index} className={overviewStyles.activityItem}>
                <div className={overviewStyles.activityIcon}>
                  {getActivityIcon(activity.type)}
                </div>
                <div className={overviewStyles.activityContent}>
                  <span className={overviewStyles.activityText}>
                    {activity.text}
                  </span>
                  <span className={overviewStyles.activityTime}>
                    {activity.time}
                  </span>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className={overviewStyles.quickActions}>
        <h3 className={overviewStyles.sectionTitle}>Quick Actions</h3>
        <div className={overviewStyles.actionGrid}>
          <button
            className={overviewStyles.actionCard}
            onClick={() => setSelectedTab("lessons")}
          >
            <FiBookOpen className={overviewStyles.actionIcon} />
            <span>Continue Learning</span>
          </button>
          <button
            className={overviewStyles.actionCard}
            onClick={() => setSelectedTab("exercises")}
          >
            <FiCode className={overviewStyles.actionIcon} />
            <span>Practice Coding</span>
          </button>
          <button
            className={overviewStyles.actionCard}
            onClick={() => setSelectedTab("achievements")}
          >
            <FiAward className={overviewStyles.actionIcon} />
            <span>View Achievements</span>
          </button>
          <button
            className={overviewStyles.actionCard}
            onClick={() => (window.location.href = `/en/settings`)}
          >
            <FiUser className={overviewStyles.actionIcon} />
            <span>Account Settings</span>
          </button>
        </div>
      </div>
    </div>
  );
} 