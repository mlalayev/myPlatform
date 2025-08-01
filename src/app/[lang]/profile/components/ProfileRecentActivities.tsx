"use client";

import React, { useState, useEffect } from "react";
import {
  FiActivity,
  FiBookOpen,
  FiCode,
  FiAward,
  FiLogIn,
  FiTrendingUp,
  FiUsers,
  FiEye,
  FiShare2,
  FiDownload,
  FiRefreshCw,
  FiFilter,
  FiClock,
  FiStar,
  FiTarget,
  FiZap,
  FiBarChart2,
  FiCalendar,
  FiPlay,
  FiCheck,
  FiX,
  FiPlus,
  FiMinus,
  FiDollarSign,
  FiGift,
  FiCheckCircle,
  FiCheckSquare,
  FiUser,
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
import { useI18n } from "../../../../contexts/I18nContext";
import recentActivitiesStyles from "../ProfileRecentActivities.module.css";

interface ProfileRecentActivitiesProps {
  userStats: any;
  loading: boolean;
}

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

export default function ProfileRecentActivities({
  userStats,
  loading,
}: ProfileRecentActivitiesProps) {
  const { t } = useI18n();
  const [activeFilter, setActiveFilter] = useState("all");
  const [activities, setActivities] = useState<any[]>([]);
  const [activityStats, setActivityStats] = useState<any>({
    total: 0,
    today: 0,
    thisWeek: 0,
    thisMonth: 0
  });

  // Process activities from userStats
  useEffect(() => {
    if (userStats?.recentActivities) {
      const filteredActivities = userStats.recentActivities.filter((activity: any) => {
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
      });

      setActivities(filteredActivities);

      // Calculate activity statistics
      const today = new Date();
      const todayStr = today.toDateString();
      const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
      const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

      const todayActivities = filteredActivities.filter((activity: any) => {
        const activityDate = new Date(activity.timestamp || Date.now());
        return activityDate.toDateString() === todayStr;
      });

      const weekActivities = filteredActivities.filter((activity: any) => {
        const activityDate = new Date(activity.timestamp || Date.now());
        return activityDate >= weekAgo;
      });

      const monthActivities = filteredActivities.filter((activity: any) => {
        const activityDate = new Date(activity.timestamp || Date.now());
        return activityDate >= monthAgo;
      });

      setActivityStats({
        total: filteredActivities.length,
        today: todayActivities.length,
        thisWeek: weekActivities.length,
        thisMonth: monthActivities.length
      });
    }
  }, [userStats]);

  // Helper function to get language icon
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

  // Get activity icon based on type
  const getActivityIcon = (type: string) => {
    switch (type) {
      case "login":
      case "daily_login_bonus":
      case "DAILY_LOGIN_BONUS":
        return <FiDollarSign />;
      case "lesson_view":
      case "LESSON_VIEW":
      case "lesson_complete":
        return <FiCheckCircle />;
      case "quiz_submit":
      case "QUIZ_SUBMIT":
      case "quiz_pass":
      case "exercise_submit":
      case "exercise_solve":
      case "EXERCISE_SOLVE":
        return <FiCode />;
      default:
        return <FiActivity />;
    }
  };

  // Get activity type for filtering
  const getActivityType = (activity: any) => {
    if (activity.type === "lesson_view" || activity.type === "LESSON_VIEW") return "lesson";
    if (activity.type === "exercise_solve" || activity.type === "EXERCISE_SOLVE") return "exercise";
    if (activity.type === "daily_login_bonus" || activity.type === "DAILY_LOGIN_BONUS") return "login";
    if (activity.type === "quiz_submit" || activity.type === "QUIZ_SUBMIT") return "quiz";
    return "other";
  };

  // Get activity status
  const getActivityStatus = (activity: any) => {
    const type = getActivityType(activity);
    switch (type) {
      case "lesson":
        return "completed";
      case "exercise":
        return "completed";
      case "login":
        return "successful";
      case "quiz":
        return "completed";
      default:
        return "completed";
    }
  };

  // Get activity stats
  const getActivityStats = (activity: any) => {
    const type = getActivityType(activity);
    switch (type) {
      case "lesson":
        return { duration: "45 dəq", progress: "100%" };
      case "exercise":
        return { duration: "30 dəq", progress: "100%" };
      case "login":
        return { points: "+50", bonus: "Günlük bonus" };
      case "quiz":
        return { duration: "15 dəq", score: "85%" };
      default:
        return { duration: "10 dəq", status: "Tamamlandı" };
    }
  };

  const filteredActivities = activities.filter(activity => {
    const activityType = getActivityType(activity);
    return activeFilter === "all" || activityType === activeFilter;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <FiCheck />;
      case 'in-progress':
        return <FiPlay />;
      case 'earned':
        return <FiAward />;
      case 'successful':
        return <FiCheck />;
      case 'achieved':
        return <FiStar />;
      case 'participated':
        return <FiUsers />;
      default:
        return <FiActivity />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return "#48bb78";
      case 'in-progress':
        return "#ed8936";
      case 'earned':
        return "#ffd700";
      case 'successful':
        return "#48bb78";
      case 'achieved':
        return "#9f7aea";
      case 'participated':
        return "#3182ce";
      default:
        return "#718096";
    }
  };

  if (loading) {
    return (
      <div className={recentActivitiesStyles.recentActivitiesContainer}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ 
              width: '40px', 
              height: '40px', 
              border: '4px solid #f3f3f3', 
              borderTop: '4px solid #4facfe', 
              borderRadius: '50%', 
              animation: 'spin 1s linear infinite',
              margin: '0 auto 16px'
            }}></div>
            <span style={{ color: '#718096' }}>Fəaliyyətlər yüklənir...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={recentActivitiesStyles.recentActivitiesContainer}>
      {/* Hero Section */}
      <div className={recentActivitiesStyles.recentActivitiesHero}>
        <div className={recentActivitiesStyles.heroContent}>
          <div className={recentActivitiesStyles.heroLeft}>
            <h1 className={recentActivitiesStyles.heroTitle}>Son Fəaliyyətlər</h1>
            <p className={recentActivitiesStyles.heroSubtitle}>
              Öyrənmə yolculuğunuzun detallı xronologiyası və nailiyyətləriniz
            </p>
            <div className={recentActivitiesStyles.heroActions}>
              <button className={`${recentActivitiesStyles.heroButton} ${recentActivitiesStyles.primary}`}>
                <FiDownload />
                İxrac et
              </button>
              <button className={recentActivitiesStyles.heroButton}>
                <FiRefreshCw />
                Yenilə
              </button>
              <button className={recentActivitiesStyles.heroButton}>
                <FiBarChart2 />
                Analitika
              </button>
            </div>
          </div>
          <div className={recentActivitiesStyles.heroRight}>
            <div className={recentActivitiesStyles.activityStats}>
              <div className={recentActivitiesStyles.statItem}>
                <span className={recentActivitiesStyles.statNumber}>
                  {activityStats.total}
                </span>
                <span className={recentActivitiesStyles.statLabel}>
                  Ümumi
                </span>
              </div>
              <div className={recentActivitiesStyles.statItem}>
                <span className={recentActivitiesStyles.statNumber}>
                  {activityStats.today}
                </span>
                <span className={recentActivitiesStyles.statLabel}>
                  Bu gün
                </span>
              </div>
              <div className={recentActivitiesStyles.statItem}>
                <span className={recentActivitiesStyles.statNumber}>
                  {activityStats.thisWeek}
                </span>
                <span className={recentActivitiesStyles.statLabel}>
                  Bu həftə
                </span>
              </div>
              <div className={recentActivitiesStyles.statItem}>
                <span className={recentActivitiesStyles.statNumber}>
                  {activityStats.thisMonth}
                </span>
                <span className={recentActivitiesStyles.statLabel}>
                  Bu ay
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Activity Overview */}
      <div className={recentActivitiesStyles.activityOverview}>
        <div className={recentActivitiesStyles.overviewHeader}>
          <h3 className={recentActivitiesStyles.overviewTitle}>Fəaliyyət Xronologiyası</h3>
        </div>

        {/* Filters */}
        <div className={recentActivitiesStyles.activityFilters}>
          <button 
            className={`${recentActivitiesStyles.filterButton} ${activeFilter === "all" ? recentActivitiesStyles.active : ""}`}
            onClick={() => setActiveFilter("all")}
          >
            Hamısı
          </button>
          <button 
            className={`${recentActivitiesStyles.filterButton} ${activeFilter === "lesson" ? recentActivitiesStyles.active : ""}`}
            onClick={() => setActiveFilter("lesson")}
          >
            Dərslər
          </button>
          <button 
            className={`${recentActivitiesStyles.filterButton} ${activeFilter === "exercise" ? recentActivitiesStyles.active : ""}`}
            onClick={() => setActiveFilter("exercise")}
          >
            Məşqlər
          </button>
          <button 
            className={`${recentActivitiesStyles.filterButton} ${activeFilter === "login" ? recentActivitiesStyles.active : ""}`}
            onClick={() => setActiveFilter("login")}
          >
            Girişlər
          </button>
          <button 
            className={`${recentActivitiesStyles.filterButton} ${activeFilter === "quiz" ? recentActivitiesStyles.active : ""}`}
            onClick={() => setActiveFilter("quiz")}
          >
            Testlər
          </button>
        </div>

        {/* Activity Timeline */}
        <div className={recentActivitiesStyles.activityTimeline}>
          {filteredActivities.length > 0 ? (
            filteredActivities.map((activity, index) => {
              const activityType = getActivityType(activity);
              const status = getActivityStatus(activity);
              const stats = getActivityStats(activity);
              const language = activity.language;

              return (
                <div key={index} className={`${recentActivitiesStyles.activityItem} ${recentActivitiesStyles[activityType]}`}>
                  <div className={recentActivitiesStyles.activityHeader}>
                    <div className={`${recentActivitiesStyles.activityIcon} ${recentActivitiesStyles[activityType]}`}>
                      {activityType === 'lesson' && language ? (
                        getLanguageIcon(formatLanguageDisplay(language))
                      ) : (
                        getActivityIcon(activity.type)
                      )}
                    </div>
                    <div className={recentActivitiesStyles.activityInfo}>
                      <h4 className={recentActivitiesStyles.activityTitle}>
                        {activity.text || activity.description}
                      </h4>
                      <div className={recentActivitiesStyles.activityCategory}>
                        {activityType === 'lesson' && language ? 
                          formatLanguageDisplay(language).toUpperCase() :
                          activityType.toUpperCase()
                        }
                      </div>
                      <p className={recentActivitiesStyles.activityDescription}>
                        {activityType === 'lesson' && language ? 
                          `${formatLanguageDisplay(language)} dilində dərs öyrəndiniz` :
                          activityType === 'exercise' ? 
                          'Məşq həll etdiniz' :
                          activityType === 'login' ? 
                          'Günlük giriş bonusu qazandınız' :
                          activityType === 'quiz' ? 
                          'Test verdiniz' :
                          'Fəaliyyət tamamlandı'
                        }
                      </p>
                    </div>
                  </div>

                  <div className={recentActivitiesStyles.activityMeta}>
                    <div className={recentActivitiesStyles.activityStats}>
                      {activityType === "lesson" && (
                        <>
                          <div className={recentActivitiesStyles.activityStat}>
                            <FiClock className={recentActivitiesStyles.activityStatIcon} />
                            {stats.duration}
                          </div>
                          <div className={recentActivitiesStyles.activityStat}>
                            <FiTarget className={recentActivitiesStyles.activityStatIcon} />
                            {stats.progress}
                          </div>
                        </>
                      )}
                      {activityType === "exercise" && (
                        <>
                          <div className={recentActivitiesStyles.activityStat}>
                            <FiClock className={recentActivitiesStyles.activityStatIcon} />
                            {stats.duration}
                          </div>
                          <div className={recentActivitiesStyles.activityStat}>
                            <FiCheck className={recentActivitiesStyles.activityStatIcon} />
                            {stats.progress}
                          </div>
                        </>
                      )}
                      {activityType === "login" && (
                        <>
                          <div className={recentActivitiesStyles.activityStat}>
                            <FiStar className={recentActivitiesStyles.activityStatIcon} />
                            {stats.points}
                          </div>
                          <div className={recentActivitiesStyles.activityStat}>
                            <FiGift className={recentActivitiesStyles.activityStatIcon} />
                            {stats.bonus}
                          </div>
                        </>
                      )}
                      {activityType === "quiz" && (
                        <>
                          <div className={recentActivitiesStyles.activityStat}>
                            <FiClock className={recentActivitiesStyles.activityStatIcon} />
                            {stats.duration}
                          </div>
                          <div className={recentActivitiesStyles.activityStat}>
                            <FiCheckCircle className={recentActivitiesStyles.activityStatIcon} />
                            {stats.score}
                          </div>
                        </>
                      )}
                    </div>
                    <div className={recentActivitiesStyles.activityTime}>
                      {activity.time || 'Yeni'}
                    </div>
                  </div>

                  <div className={recentActivitiesStyles.activityActions}>
                    <button className={`${recentActivitiesStyles.activityAction} ${recentActivitiesStyles.primary}`}>
                      <FiEye />
                      Bax
                    </button>
                    <button className={`${recentActivitiesStyles.activityAction} ${recentActivitiesStyles.secondary}`}>
                      <FiShare2 />
                      Paylaş
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className={recentActivitiesStyles.emptyActivities}>
              <FiActivity size={48} style={{ opacity: 0.3 }} />
              <p>Hələ heç bir fəaliyyət yoxdur</p>
              <p style={{ fontSize: '0.9rem', color: '#718096' }}>
                Dərslərə başlayın və fəaliyyətlərinizi burada görəcəksiniz
              </p>
            </div>
          )}
        </div>

        {/* Activity Summary */}
        <div className={recentActivitiesStyles.activitySummary}>
          <div className={recentActivitiesStyles.summaryCard}>
            <div className={recentActivitiesStyles.summaryHeader}>
              <div className={`${recentActivitiesStyles.summaryIcon} ${recentActivitiesStyles.lessons}`}>
                <FiBookOpen />
              </div>
              <h4 className={recentActivitiesStyles.summaryTitle}>
                Öyrənilmiş Dərslər
              </h4>
            </div>
            <div className={recentActivitiesStyles.summaryValue}>
              {userStats?.completedLessons || 0}
            </div>
            <p className={recentActivitiesStyles.summaryDescription}>
              Ümumi {userStats?.totalLessons || 0} dərsdən
            </p>
          </div>

          <div className={recentActivitiesStyles.summaryCard}>
            <div className={recentActivitiesStyles.summaryHeader}>
              <div className={`${recentActivitiesStyles.summaryIcon} ${recentActivitiesStyles.exercises}`}>
                <FiCode />
              </div>
              <h4 className={recentActivitiesStyles.summaryTitle}>
                Həll Edilmiş Məşqlər
              </h4>
            </div>
            <div className={recentActivitiesStyles.summaryValue}>
              {userStats?.solvedExercises || 0}
            </div>
            <p className={recentActivitiesStyles.summaryDescription}>
              Ümumi {userStats?.totalExercises || 0} məşqdən
            </p>
          </div>

          <div className={recentActivitiesStyles.summaryCard}>
            <div className={recentActivitiesStyles.summaryHeader}>
              <div className={`${recentActivitiesStyles.summaryIcon} ${recentActivitiesStyles.achievements}`}>
                <FiAward />
              </div>
              <h4 className={recentActivitiesStyles.summaryTitle}>
                Qazanılmış Nailiyyətlər
              </h4>
            </div>
            <div className={recentActivitiesStyles.summaryValue}>
              {userStats?.unlockedAchievements || 0}
            </div>
            <p className={recentActivitiesStyles.summaryDescription}>
              Ümumi {userStats?.totalAchievements || 0} nailiyyətdən
            </p>
          </div>

          <div className={recentActivitiesStyles.summaryCard}>
            <div className={recentActivitiesStyles.summaryHeader}>
              <div className={`${recentActivitiesStyles.summaryIcon} ${recentActivitiesStyles.time}`}>
                <FiClock />
              </div>
              <h4 className={recentActivitiesStyles.summaryTitle}>
                Öyrənmə Vaxtı
              </h4>
            </div>
            <div className={recentActivitiesStyles.summaryValue}>
              {userStats?.formattedStudyTime || `${userStats?.studyTimeHours || 0}s`}
            </div>
            <p className={recentActivitiesStyles.summaryDescription}>
              Bu həftə {userStats?.weeklyProgress?.studyTimeThisWeekFormatted || `${userStats?.weeklyProgress?.studyTimeThisWeek || 0}s`}
            </p>
          </div>
        </div>

        {/* Learning Streak */}
        <div className={recentActivitiesStyles.activityChart}>
          <div className={recentActivitiesStyles.chartHeader}>
            <h3 className={recentActivitiesStyles.chartTitle}>
              Öyrənmə Seriyası
            </h3>
          </div>
          <div className={recentActivitiesStyles.streakContainer}>
            <div className={recentActivitiesStyles.streakInfo}>
              <div className={recentActivitiesStyles.streakNumber}>
                {userStats?.loginStreak || 0}
              </div>
              <div className={recentActivitiesStyles.streakLabel}>
                Günlük Seriya
              </div>
            </div>
            <div className={recentActivitiesStyles.streakMessage}>
              {userStats?.loginStreak > 0 ? 
                `Əla! ${userStats.loginStreak} gün davam edirsiniz` :
                'Günlük öyrənmə seriyasına başlayın'
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 