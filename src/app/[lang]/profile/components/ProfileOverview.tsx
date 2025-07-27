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
import { useI18n } from "../../../../contexts/I18nContext";

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
  const { t } = useI18n();
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
            <span style={{ color: '#718096' }}>{t("profile.overview.loading")}</span>
          </div>
        </div>
      </div>
    );
  }

  if (!userStats) {
    return (
      <div className={overviewStyles.overviewContainer}>
        <div style={{ textAlign: 'center', padding: '60px 20px', color: '#718096' }}>
          {t("profile.overview.error")}
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
                t("profile.overview.anonymousUser")}
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
              <span className={overviewStyles.coinTitle}>{t("profile.overview.stats.coins")}</span>
            </div>
            <div className={overviewStyles.coinAmount}>
              <span className={overviewStyles.totalCoins}>
                {userStats.dailyLoginPoints}
              </span>
              <span className={overviewStyles.coinLabel}>{t("profile.overview.stats.earned")}</span>
            </div>
            <div className={overviewStyles.coinToday}>
              <FiGift className={overviewStyles.todayIcon} />
              <span>+{userStats.todayCoins} {t("profile.overview.stats.today")}</span>
            </div>
          </div>

          <div className={overviewStyles.streakCard}>
            <div className={overviewStyles.streakHeader}>
              <FiTrendingUp className={overviewStyles.streakIcon} />
              <span className={overviewStyles.streakTitle}>{t("profile.overview.stats.learningStreak")}</span>
            </div>
            <div className={overviewStyles.streakAmount}>
              <span className={overviewStyles.streakNumber}>
                {userStats.loginStreak}
              </span>
              <span className={overviewStyles.streakLabel}>{t("profile.overview.stats.days")}</span>
            </div>
            <div className={overviewStyles.streakMessage}>{t("profile.overview.stats.keepItUp")}</div>
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
            <div className={overviewStyles.statLabel}>{t("profile.overview.stats.totalLessons")}</div>
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
            <div className={overviewStyles.statLabel}>{t("profile.overview.stats.totalExercises")}</div>
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
            <div className={overviewStyles.statLabel}>{t("profile.overview.stats.completion")}</div>
            <div className={overviewStyles.statTrend}>
              <FiTrendingUp className={overviewStyles.trendIcon} />
              <span>
                +{userStats.weeklyProgress.lessonsThisWeek} {t("profile.overview.stats.thisWeek")}
              </span>
            </div>
          </div>
        </div>

        <div className={overviewStyles.statCard}>
          <div className={overviewStyles.statIcon}>
            <FiAward />
          </div>
          <div className={overviewStyles.statContent}>
            <div className={overviewStyles.statNumber}>
              {userStats.unlockedAchievements}/{userStats.totalAchievements}
            </div>
            <div className={overviewStyles.statLabel}>{t("profile.overview.stats.totalAchievements")}</div>
            <div className={overviewStyles.statProgress}>
              <div
                className={overviewStyles.statProgressBar}
                style={{
                  width: `${
                    (userStats.unlockedAchievements / userStats.totalAchievements) *
                      100 || 0
                  }%`,
                }}
              ></div>
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
            <div className={overviewStyles.statLabel}>{t("profile.overview.stats.studyTime")}</div>
            <div className={overviewStyles.statTrend}>
              <FiTrendingUp className={overviewStyles.trendIcon} />
                              <span>
                  {userStats.weeklyProgress.studyTimeThisWeek}h {t("profile.overview.stats.thisWeek")}
                </span>
            </div>
          </div>
        </div>
      </div>

      {/* Calendar Section */}
      <div className={overviewStyles.calendarSection}>
        <h3>📅 {t("profile.overview.calendar.title")}</h3>
        <div className={overviewStyles.calendarGrid}>
          {userStats.calendarData?.dailyActivities?.map((day: any, i: number) => {
            const date = new Date(day.date);
            const dayName = date.toLocaleDateString('az-AZ', { weekday: 'short' });
            const dayNumber = date.getDate();
            const isToday = i === 6;
            const hasActivity = day.hasActivity;
            
            return (
              <div 
                key={i} 
                className={`${overviewStyles.calendarDay} ${isToday ? overviewStyles.today : ''} ${hasActivity ? overviewStyles.hasActivity : ''}`}
                title={`${dayName} ${dayNumber}${hasActivity ? ` - Aktiv gün (${day.lessonsViewed} dərs, ${day.exercisesSolved} məşq)` : ' - Aktivlik yoxdur'}`}
              >
                <div className={overviewStyles.dayName}>{dayName}</div>
                <div className={overviewStyles.dayNumber}>{dayNumber}</div>
                {hasActivity && <div className={overviewStyles.activityDot}></div>}
              </div>
            );
          }) || Array.from({ length: 7 }, (_, i) => {
            const date = new Date();
            date.setDate(date.getDate() - 6 + i);
            const dayName = date.toLocaleDateString('az-AZ', { weekday: 'short' });
            const dayNumber = date.getDate();
            const isToday = i === 6;
            
            return (
              <div 
                key={i} 
                className={`${overviewStyles.calendarDay} ${isToday ? overviewStyles.today : ''}`}
                title={`${dayName} ${dayNumber} - Məlumat yoxdur`}
              >
                <div className={overviewStyles.dayName}>{dayName}</div>
                <div className={overviewStyles.dayNumber}>{dayNumber}</div>
              </div>
            );
          })}
        </div>
        <div className={overviewStyles.calendarStats}>
          <div className={overviewStyles.calendarStat}>
            <span className={overviewStyles.statNumber}>{userStats.calendarData?.activeDays || userStats.learningStreak || 0}</span>
            <span className={overviewStyles.statLabel}>{t("profile.overview.calendar.activeDays")}</span>
          </div>
          <div className={overviewStyles.calendarStat}>
            <span className={overviewStyles.statNumber}>{userStats.calendarData?.thisWeekStudyTime || userStats.weeklyProgress?.studyTimeThisWeek || 0}h</span>
            <span className={overviewStyles.statLabel}>{t("profile.overview.calendar.thisWeek")}</span>
          </div>
        </div>
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
            {t("profile.overview.recentActivity.title")}
          </h3>
          <button
            className={calendarStyles.viewAllBtn}
            onClick={() => setSelectedTab("recent-activities")}
          >
            {t("profile.overview.recentActivity.viewAll")}
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
        <h3 className={overviewStyles.sectionTitle}>{t("profile.overview.quickActions.title")}</h3>
        <div className={overviewStyles.actionGrid}>
          <button
            className={overviewStyles.actionCard}
            onClick={() => setSelectedTab("lessons")}
          >
            <FiBookOpen className={overviewStyles.actionIcon} />
            <span>{t("profile.overview.quickActions.continueLearning")}</span>
          </button>
          <button
            className={overviewStyles.actionCard}
            onClick={() => setSelectedTab("exercises")}
          >
            <FiCode className={overviewStyles.actionIcon} />
            <span>{t("profile.overview.quickActions.practiceCoding")}</span>
          </button>
          <button
            className={overviewStyles.actionCard}
            onClick={() => setSelectedTab("achievements")}
          >
            <FiAward className={overviewStyles.actionIcon} />
            <span>{t("profile.overview.quickActions.viewAchievements")}</span>
          </button>
          <button
            className={overviewStyles.actionCard}
            onClick={() => (window.location.href = `/en/settings`)}
          >
            <FiUser className={overviewStyles.actionIcon} />
            <span>{t("profile.overview.quickActions.accountSettings")}</span>
          </button>
        </div>
      </div>
    </div>
  );
} 