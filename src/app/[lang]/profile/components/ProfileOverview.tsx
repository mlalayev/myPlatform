"use client";

import React, { useState } from "react";
import {
  FiStar,
  FiDollarSign,
  FiGift,
  FiTrendingUp,
  FiBookOpen,
  FiCode,
  FiCheckCircle,
  FiCheckSquare,
  FiClock,
  FiActivity,
  FiUser,
  FiAward,
  FiX,
} from "react-icons/fi";
import overviewStyles from "../ProfileOverview.module.css";
import calendarStyles from "../ProfileCalendar.module.css";
import { useI18n } from "../../../../contexts/I18nContext";

// Helper function to format study time
function formatStudyTime(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const parts = [];
  if (hours > 0) {
    parts.push(`${hours}s`);
  }
  if (minutes > 0) {
    parts.push(`${minutes}dəq`);
  }
  if (seconds > 0 && hours === 0 && minutes === 0) {
    parts.push(`${seconds}san`);
  }

  return parts.length > 0 ? parts.join(" ") : "0dəq";
}

// Helper function to format language names for display
function formatLanguageDisplay(language: string): string {
  const languageMap: any = {
    'c': 'C',
    'java': 'Java',
    'c++': 'C++',
    'c%2B%2B': 'C++',
    'cpp': 'C++',
    'algorithms': 'Algorithms',
    'javascript': 'JavaScript',
    'python': 'Python',
    'csharp': 'C#',
    'data-structures': 'Data Structures',
    'typescript': 'TypeScript',
    'php': 'PHP',
    'go': 'Go',
    'rust': 'Rust',
    'swift': 'Swift',
    'kotlin': 'Kotlin',
    'ruby': 'Ruby',
    'r': 'R',
    'sql': 'SQL',
    'dart': 'Dart',
    'haskell': 'Haskell',
    'scala': 'Scala',
    'bash': 'Bash',
    'matlab': 'MATLAB'
  };
  
  return languageMap[language] || language;
}

interface ProfileOverviewProps {
  userStats: any;
  loading: boolean;
  setSelectedTab: (tab: string) => void;
  filterNavigationActivities: (activities: any[]) => any[];
  getActivityIcon: (type: string) => React.ReactNode;
  getLanguageIcon: (language: string) => React.ReactNode;
}

export default function ProfileOverview({
  userStats,
  loading,
  setSelectedTab,
  filterNavigationActivities,
  getActivityIcon,
  getLanguageIcon,
}: ProfileOverviewProps) {
  const { t } = useI18n();
  const [showExercisesModal, setShowExercisesModal] = useState(false);
  const [solvedExercisesData, setSolvedExercisesData] = useState<any[]>([]);

  // Use solved exercises data from userStats
  React.useEffect(() => {
    if (userStats?.solvedExercisesData) {
      setSolvedExercisesData(userStats.solvedExercisesData);
    } else {
      setSolvedExercisesData([]);
    }
  }, [userStats?.solvedExercisesData?.length]); // Only depend on length, not the entire array

  if (loading) {
    return (
      <div className={overviewStyles.overviewContainer}>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "400px",
          }}
        >
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                width: "40px",
                height: "40px",
                border: "4px solid #f3f3f3",
                borderTop: "4px solid #667eea",
                borderRadius: "50%",
                animation: "spin 1s linear infinite",
                margin: "0 auto 16px",
              }}
            ></div>
            <span style={{ color: "#718096" }}>
              {t("profile.overview.loading")}
            </span>
          </div>
        </div>
      </div>
    );
  }

  if (!userStats) {
    return (
      <div className={overviewStyles.overviewContainer}>
        <div
          style={{
            textAlign: "center",
            padding: "60px 20px",
            color: "#718096",
          }}
        >
          {t("profile.overview.error")}
        </div>
      </div>
    );
  }

  return (
    <>
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
                <span className={overviewStyles.coinTitle}>
                  {t("profile.overview.stats.coins")}
                </span>
              </div>
              <div className={overviewStyles.coinAmount}>
                <span className={overviewStyles.totalCoins}>
                  {userStats.dailyLoginPoints}
                </span>
                <span className={overviewStyles.coinLabel}>
                  {t("profile.overview.stats.earned")}
                </span>
              </div>
              <div className={overviewStyles.coinToday}>
                <FiGift className={overviewStyles.todayIcon} />
                <span>
                  +{userStats.todayCoins} {t("profile.overview.stats.today")}
                </span>
              </div>
            </div>

            <div className={overviewStyles.streakCard}>
              <div className={overviewStyles.streakHeader}>
                <FiTrendingUp className={overviewStyles.streakIcon} />
                <span className={overviewStyles.streakTitle}>
                  {t("profile.overview.stats.learningStreak")}
                </span>
              </div>
              <div className={overviewStyles.streakAmount}>
                <span className={overviewStyles.streakNumber}>
                  {userStats.loginStreak}
                </span>
                <span className={overviewStyles.streakLabel}>
                  {t("profile.overview.stats.days")}
                </span>
              </div>
              <div className={overviewStyles.streakMessage}>
                {t("profile.overview.stats.keepItUp")}
              </div>
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
              <div className={overviewStyles.statLabel}>
                {t("profile.overview.stats.totalLessons")}
              </div>
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

          <div
            className={overviewStyles.statCard}
            onClick={() => setShowExercisesModal(true)}
            style={{ cursor: "pointer" }}
          >
            <div className={overviewStyles.statIcon}>
              <FiCode />
            </div>
            <div className={overviewStyles.statContent}>
              <div className={overviewStyles.statNumber}>
                {userStats.solvedExercises || 0}/{userStats.totalExercises}
              </div>
              <div className={overviewStyles.statLabel}>
                {t("profile.overview.stats.totalExercises")}
              </div>
              <div className={overviewStyles.statProgress}>
                <div
                  className={overviewStyles.statProgressBar}
                  style={{
                    width: `${
                      ((userStats.solvedExercises || 0) /
                        userStats.totalExercises) *
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
              <div className={overviewStyles.statLabel}>
                {t("profile.overview.stats.completion")}
              </div>
              <div className={overviewStyles.statTrend}>
                <FiTrendingUp className={overviewStyles.trendIcon} />
                <span>
                  +{userStats.weeklyProgress.lessonsThisWeek || 0}{" "}
                  {t("profile.overview.stats.thisWeek")}
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
                {userStats.unlockedAchievements || 0}/{userStats.totalAchievements || 0}
              </div>
              <div className={overviewStyles.statLabel}>
                {t("profile.overview.stats.totalAchievements")}
              </div>
              <div className={overviewStyles.statProgress}>
                <div
                  className={overviewStyles.statProgressBar}
                  style={{
                    width: `${
                      userStats.totalAchievements > 0
                        ? ((userStats.unlockedAchievements || 0) / userStats.totalAchievements) * 100
                        : 0
                    }%`,
                  }}
                ></div>
              </div>
            </div>
          </div>

          <div className={overviewStyles.statCard}>
            <div className={overviewStyles.statIcon}>
              <FiCheckSquare />
            </div>
            <div className={overviewStyles.statContent}>
              <div className={overviewStyles.statNumber}>
                {userStats.completedLanguages || 0}
              </div>
              <div className={overviewStyles.statLabel}>
                100% Bitirilmiş Dillər
              </div>
              <div className={overviewStyles.statTrend}>
                <FiStar className={overviewStyles.trendIcon} />
                <span>
                  {userStats.completedLanguagesList?.length > 0 
                    ? userStats.completedLanguagesList.join(', ')
                    : 'Hələ yox'
                  }
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
                {userStats.formattedStudyTime ||
                  `${userStats.studyTimeHours || 0}h`}
              </div>
              <div className={overviewStyles.statLabel}>
                {t("profile.overview.stats.studyTime")}
              </div>
              <div className={overviewStyles.statTrend}>
                <FiTrendingUp className={overviewStyles.trendIcon} />
                <span>
                  {userStats.weeklyProgress.studyTimeThisWeekFormatted ||
                    `${userStats.weeklyProgress.studyTimeThisWeek || 0}h`}{" "}
                  {t("profile.overview.stats.thisWeek")}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Calendar Section */}
        <div className={overviewStyles.calendarSection}>
          <h3>📅 {t("profile.overview.calendar.title")}</h3>
          <div className={overviewStyles.calendarGrid}>
            {userStats.calendarData?.dailyActivities?.map(
              (day: any, i: number) => {
                const date = new Date(day.date);
                const dayName = date.toLocaleDateString("az-AZ", {
                  weekday: "short",
                });
                const dayNumber = date.getDate();

                // Azərbaycan vaxtı ilə bugünkü gün
                const now = new Date();
                const azerbaijanTime = new Date(
                  now.getTime() + 4 * 60 * 60 * 1000
                );
                const todayStr = `${azerbaijanTime.getFullYear()}-${String(
                  azerbaijanTime.getMonth() + 1
                ).padStart(2, "0")}-${String(azerbaijanTime.getDate()).padStart(
                  2,
                  "0"
                )}`;
                const dayStr = `${date.getFullYear()}-${String(
                  date.getMonth() + 1
                ).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
                const isToday = dayStr === todayStr;

                const hasActivity = day.hasActivity;

                return (
                  <div
                    key={i}
                    className={`${overviewStyles.calendarDay} ${
                      isToday ? overviewStyles.today : ""
                    } ${hasActivity ? overviewStyles.hasActivity : ""}`}
                    title={`${dayName} ${dayNumber}${
                      hasActivity
                        ? ` - Aktiv gün (${day.lessonsViewed} dərs, ${day.exercisesSolved} məşq)`
                        : " - Aktivlik yoxdur"
                    }`}
                  >
                    <div
                      className={`${overviewStyles.dayName} ${
                        hasActivity ? overviewStyles.hasActivity : ""
                      }`}
                    >
                      {dayName}
                    </div>
                    <div className={overviewStyles.dayNumber}>{dayNumber}</div>
                    {hasActivity && (
                      <div className={overviewStyles.activityDot}></div>
                    )}
                  </div>
                );
              }
            ) ||
              Array.from({ length: 7 }, (_, i) => {
                const date = new Date();
                date.setDate(date.getDate() - 6 + i);
                const dayName = date.toLocaleDateString("az-AZ", {
                  weekday: "short",
                });
                const dayNumber = date.getDate();

                // Azərbaycan vaxtı ilə bugünkü gün
                const now = new Date();
                const azerbaijanTime = new Date(
                  now.getTime() + 4 * 60 * 60 * 1000
                );
                const todayStr = `${azerbaijanTime.getFullYear()}-${String(
                  azerbaijanTime.getMonth() + 1
                ).padStart(2, "0")}-${String(azerbaijanTime.getDate()).padStart(
                  2,
                  "0"
                )}`;
                const dayStr = `${date.getFullYear()}-${String(
                  date.getMonth() + 1
                ).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
                const isToday = dayStr === todayStr;

                return (
                  <div
                    key={i}
                    className={`${overviewStyles.calendarDay} ${
                      isToday ? overviewStyles.today : ""
                    }`}
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
              <span className={overviewStyles.statNumber}>
                {userStats.calendarData?.activeDays ||
                  userStats.learningStreak ||
                  0}
              </span>
              <span className={overviewStyles.statLabel}>
                {t("profile.overview.calendar.activeDays")}
              </span>
            </div>
            <div className={overviewStyles.calendarStat}>
              <span className={overviewStyles.statNumber}>
                {userStats.calendarData?.thisWeekStudyTimeFormatted ||
                  formatStudyTime(
                    userStats.calendarData?.thisWeekStudyTime || 0
                  )}
              </span>
              <span className={overviewStyles.statLabel}>
                {t("profile.overview.calendar.thisWeek")}
              </span>
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
            {userStats.recentActivities
              .filter((activity: any) => {
                // Filter navigation activities
                const hasNavigationText =
                  activity.text?.includes("Navigated to") ||
                  activity.text?.includes("navigated to") ||
                  activity.text?.includes("Navigated from") ||
                  activity.text?.includes("navigated from") ||
                  activity.description?.includes("Navigated to") ||
                  activity.description?.includes("navigated to") ||
                  activity.description?.includes("Navigated from") ||
                  activity.description?.includes("navigated from");

                return !hasNavigationText;
              })
              .slice(0, 5)
              .map((activity: any, index: number) => {
                // Language is already available in activity.language from backend
                const language = activity.language;

                return (
                  <div key={index} className={overviewStyles.activityItem}>
                    <div className={overviewStyles.activityIcon}>
                      {activity.type === "lesson_view" ? (
                        <div
                          style={{
                            width: "40px",
                            height: "40px",
                            backgroundColor: "#667eea",
                            borderRadius: "8px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "white",
                          }}
                        >
                          <FiBookOpen size={20} />
                        </div>
                      ) : (
                        getActivityIcon(activity.type)
                      )}
                    </div>
                    <div className={overviewStyles.activityContent}>
                      <span className={overviewStyles.activityText}>
                        {activity.text}
                      </span>
                      <span className={overviewStyles.activityTime}>
                        {activity.time}
                      </span>
                    </div>
                                         {activity.type === "lesson_view" && language && (
                       <div style={{ marginLeft: "auto", marginRight: "8px" }}>
                         {getLanguageIcon(formatLanguageDisplay(language))}
                       </div>
                     )}
                    {(activity.type === "daily_login_bonus" ||
                      activity.type === "DAILY_LOGIN_BONUS") && (
                      <div style={{ marginLeft: "auto", marginRight: "8px" }}>
                        <div className={overviewStyles.coinSpinSlow}>
                          <svg
                            width="24"
                            height="24"
                            viewBox="0 0 38 38"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <defs>
                              <radialGradient
                                id="coinGradient"
                                cx="50%"
                                cy="50%"
                                r="50%"
                              >
                                <stop offset="0%" stopColor="#fff7c1" />
                                <stop offset="100%" stopColor="#ffd700" />
                              </radialGradient>
                            </defs>
                            <circle
                              cx="19"
                              cy="19"
                              r="18"
                              fill="url(#coinGradient)"
                              stroke="#e6c200"
                              strokeWidth="2"
                            />
                            <text
                              x="50%"
                              y="54%"
                              textAnchor="middle"
                              fontSize="18"
                              fontWeight="bold"
                              fill="#e6c200"
                              fontFamily="Helvetica Neue, Arial, sans-serif"
                            >
                              ₵
                            </text>
                          </svg>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
          </div>
        </div>

        {/* Quick Actions */}
        <div className={overviewStyles.quickActions}>
          <h3 className={overviewStyles.sectionTitle}>
            {t("profile.overview.quickActions.title")}
          </h3>
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

      {/* Solved Exercises Modal */}
      {showExercisesModal && (
        <div
          className={overviewStyles.modalOverlay}
          onClick={() => setShowExercisesModal(false)}
        >
          <div
            className={overviewStyles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={overviewStyles.modalHeader}>
              <h2>Həll Edilmiş Məşqlər</h2>
              <button
                className={overviewStyles.modalCloseBtn}
                onClick={() => setShowExercisesModal(false)}
              >
                <FiX />
              </button>
            </div>
            <div className={overviewStyles.modalBody}>
              {solvedExercisesData && solvedExercisesData.length > 0 ? (
                <div className={overviewStyles.exercisesList}>
                  {solvedExercisesData.map((exercise: any, index: number) => (
                    <div
                      key={exercise.id || index}
                      className={overviewStyles.exerciseItem}
                    >
                      <div className={overviewStyles.exerciseHeader}>
                        <h3 className={overviewStyles.exerciseTitle}>
                          {exercise.title}
                        </h3>
                        <span
                          className={`${overviewStyles.difficultyBadge} ${
                            overviewStyles[exercise.difficulty?.toLowerCase()]
                          }`}
                        >
                          {exercise.difficulty}
                        </span>
                      </div>
                      <div className={overviewStyles.exerciseStats}>
                        <span className={overviewStyles.exerciseStat}>
                          <FiClock />{" "}
                          {exercise.content?.timeComplexity || "O(1)"}
                        </span>
                        <span className={overviewStyles.exerciseStat}>
                          <FiActivity />{" "}
                          {exercise.content?.spaceComplexity || "O(1)"}
                        </span>
                        <span className={overviewStyles.exerciseStat}>
                          <FiCheckCircle /> {exercise.content?.acceptance || 0}%
                          qəbul
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className={overviewStyles.noExercises}>
                  <FiCode className={overviewStyles.noExercisesIcon} />
                  <p>Hələ heç bir məşq həll etməmisiniz</p>
                  <button
                    className={overviewStyles.startExercisesBtn}
                    onClick={() => {
                      setShowExercisesModal(false);
                      setSelectedTab("exercises");
                    }}
                  >
                    Məşqlərə başla
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
