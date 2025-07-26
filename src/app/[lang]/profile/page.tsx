"use client";

import React, { useState, useEffect } from "react";
import styles from "./ProfilePage.module.css";
import {
  FiUser,
  FiAward,
  FiTrendingUp,
  FiBookOpen,
  FiActivity,
  FiTarget,
  FiBarChart2,
  FiCalendar,
  FiChevronRight,
  FiChevronLeft,
  FiShield,
  FiBell,
  FiHeart,
  FiDollarSign,
  FiGift,
  FiStar,
  FiClock,
  FiCode,
  FiCheckCircle,
  FiChevronDown,
  FiChevronUp,
} from "react-icons/fi";
import { useSession } from "next-auth/react";
import Header from "../components/header/Header";
import Footer from "../components/footer/Footer";

const profileTabs = [
  {
    key: "overview",
    name: "Profile Overview",
    icon: <FiUser size={24} />,
    description: "View your profile information and learning stats.",
  },
  {
    key: "achievements",
    name: "Achievements",
    icon: <FiAward size={24} />,
    description: "View your earned badges and accomplishments.",
  },
  {
    key: "progress",
    name: "Learning Progress",
    icon: <FiTrendingUp size={24} />,
    description: "Track your learning journey and statistics.",
  },
  {
    key: "lessons",
    name: "My Lessons",
    icon: <FiBookOpen size={24} />,
    description: "Access your saved and completed lessons.",
  },
  {
    key: "exercises",
    name: "Exercise History",
    icon: <FiActivity size={24} />,
    description: "Review your coding exercise submissions.",
  },
  {
    key: "goals",
    name: "Learning Goals",
    icon: <FiTarget size={24} />,
    description: "Set and track your learning objectives.",
  },
  {
    key: "analytics",
    name: "Analytics",
    icon: <FiBarChart2 size={24} />,
    description: "Detailed insights about your learning patterns.",
  },
  /* Temporarily disabled until activity tracking is ready
  {
    key: "calendar",
    name: "Study Calendar",
    icon: <FiCalendar size={24} />,
    description: "Plan and view your study schedule.",
  },
  */
  {
    key: "security",
    name: "Security",
    icon: <FiShield size={24} />,
    description: "Manage your account security settings.",
  },
  {
    key: "notifications",
    name: "Notifications",
    icon: <FiBell size={24} />,
    description: "Configure your notification preferences.",
  },
  {
    key: "favorites",
    name: "Favorites",
    icon: <FiHeart size={24} />,
    description: "Access your bookmarked content.",
  },
];

export default function ProfilePage() {
  const [selectedTab, setSelectedTab] = useState(profileTabs[0].key);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [userStats, setUserStats] = useState(null);
  const [calendarData, setCalendarData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const { data: session } = useSession();

  // Fetch user stats from backend
  useEffect(() => {
    const fetchUserStats = async () => {
      try {
        const response = await fetch('/api/user/profile');
        if (response.ok) {
          const data = await response.json();
          setUserStats(data);
        } else {
          const errorData = await response.json().catch(() => null);
          console.error('Failed to fetch user stats:', response.status, response.statusText);
          console.error('Error details:', errorData);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user stats:", error);
        setLoading(false);
      }
    };

    if (session) {
      fetchUserStats();
    }
  }, [session]);

  // Fetch calendar data
  useEffect(() => {
    const fetchCalendarData = async () => {
      try {
        const response = await fetch(`/api/user/calendar?year=${currentYear}&month=${currentMonth}`);
        if (response.ok) {
          const data = await response.json();
          setCalendarData(data);
        }
      } catch (error) {
        console.error("Error fetching calendar data:", error);
      }
    };

    if (session) {
      fetchCalendarData();
    }
  }, [session, currentMonth, currentYear]);

  // Log activity function
  const logActivity = async (type, description, metadata = {}) => {
    try {
      await fetch('/api/user/activity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, description, metadata })
      });
    } catch (error) {
      console.error("Error logging activity:", error);
    }
  };

  // Get activity icon based on type
  const getActivityIcon = (type) => {
    switch (type) {
      case 'login':
      case 'daily_login_bonus':
        return <FiDollarSign />;
      case 'lesson_view':
      case 'lesson_complete':
        return <FiCheckCircle />;
      case 'quiz_submit':
      case 'quiz_pass':
      case 'exercise_submit':
      case 'exercise_solve':
        return <FiCode />;
      default:
        return <FiActivity />;
    }
  };

  // Calendar component
  const renderCalendar = () => {
    if (!calendarData) return <div>Loading calendar...</div>;

    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const navigateMonth = (direction) => {
      if (direction === 'prev') {
        if (currentMonth === 1) {
          setCurrentMonth(12);
          setCurrentYear(currentYear - 1);
        } else {
          setCurrentMonth(currentMonth - 1);
        }
      } else {
        if (currentMonth === 12) {
          setCurrentMonth(1);
          setCurrentYear(currentYear + 1);
        } else {
          setCurrentMonth(currentMonth + 1);
        }
      }
    };

    return (
      <div className={styles.calendarSection}>
        <div className={styles.calendarHeader}>
          <button onClick={() => navigateMonth('prev')} className={styles.calendarNavBtn}>
            <FiChevronLeft />
          </button>
          <h3 className={styles.calendarTitle}>
            {monthNames[currentMonth - 1]} {currentYear}
          </h3>
          <button onClick={() => navigateMonth('next')} className={styles.calendarNavBtn}>
            <FiChevronRight />
          </button>
        </div>

        <div className={styles.calendarGrid}>
          {daysOfWeek.map(day => (
            <div key={day} className={styles.calendarDayHeader}>{day}</div>
          ))}
          
          {calendarData.calendarData.map((dayData, index) => (
            <div 
              key={index} 
              className={`${styles.calendarDay} ${dayData.hasActivity ? styles.calendarDayActive : ''}`}
              title={dayData.hasActivity ? `${dayData.studyTimeMinutes}min study time, ${dayData.pointsEarned} points` : 'No activity'}
            >
              <span className={styles.calendarDayNumber}>{dayData.day}</span>
              {dayData.hasActivity && <div className={styles.calendarActivityDot}></div>}
            </div>
          ))}
        </div>

        <div className={styles.calendarStats}>
          <div className={styles.calendarStat}>
            <span className={styles.calendarStatLabel}>Active Days</span>
            <span className={styles.calendarStatValue}>{calendarData.monthlyStats.totalLoginDays}</span>
          </div>
          <div className={styles.calendarStat}>
            <span className={styles.calendarStatLabel}>Study Hours</span>
            <span className={styles.calendarStatValue}>{calendarData.monthlyStats.totalStudyTimeHours}h</span>
          </div>
          <div className={styles.calendarStat}>
            <span className={styles.calendarStatLabel}>Current Streak</span>
            <span className={styles.calendarStatValue}>{calendarData.monthlyStats.currentStreak} days</span>
          </div>
        </div>
      </div>
    );
  };

  // Render Profile Overview with real backend data
  const renderProfileOverview = () => {
    if (loading) {
      return (
        <div className={styles.loadingContainer}>
          <div className={styles.spinner}></div>
          <span className={styles.loadingText}>Loading your profile...</span>
        </div>
      );
    }

    if (!userStats) {
      return (
        <div className={styles.loadingContainer}>
          <span className={styles.loadingText}>Failed to load profile data</span>
        </div>
      );
    }

    return (
      <div className={styles.overviewContainer}>
        {/* Header Section with User Info */}
        <div className={styles.profileHeader}>
          <div className={styles.userAvatarSection}>
            <div className={styles.avatarContainer}>
              <div className={styles.avatar}>
                {userStats.user.avatarUrl ? (
                  <img src={userStats.user.avatarUrl} alt="Profile" className={styles.avatarImage} />
                ) : (
                  <span className={styles.avatarInitial}>
                    {userStats.user.name?.charAt(0).toUpperCase() || userStats.user.username?.charAt(0).toUpperCase() || 'U'}
                  </span>
                )}
              </div>
            </div>
            <div className={styles.userInfo}>
              <h1 className={styles.userName}>
                {userStats.user.name || userStats.user.username || 'Anonymous User'}
              </h1>
              <p className={styles.userEmail}>{userStats.user.email}</p>
              <div className={styles.userBadge}>
                <FiStar className={styles.badgeIcon} />
                <span>{userStats.rank}</span>
              </div>
            </div>
          </div>

          {/* Coin System Section */}
          <div className={styles.coinSection}>
            <div className={styles.coinCard}>
              <div className={styles.coinHeader}>
                <FiDollarSign className={styles.coinIcon} />
                <span className={styles.coinTitle}>Daily Coins</span>
              </div>
              <div className={styles.coinAmount}>
                <span className={styles.totalCoins}>{userStats.dailyLoginPoints}</span>
                <span className={styles.coinLabel}>Total Coins</span>
              </div>
              <div className={styles.coinToday}>
                <FiGift className={styles.todayIcon} />
                <span>+{userStats.todayCoins} today</span>
              </div>
            </div>

            <div className={styles.streakCard}>
              <div className={styles.streakHeader}>
                <FiTrendingUp className={styles.streakIcon} />
                <span className={styles.streakTitle}>Login Streak</span>
              </div>
              <div className={styles.streakAmount}>
                <span className={styles.streakNumber}>{userStats.loginStreak}</span>
                <span className={styles.streakLabel}>Days</span>
              </div>
              <div className={styles.streakMessage}>
                Keep it up! 🔥
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statIcon}>
              <FiBookOpen />
            </div>
            <div className={styles.statContent}>
              <div className={styles.statNumber}>{userStats.completedLessons}/{userStats.totalLessons}</div>
              <div className={styles.statLabel}>Lessons</div>
              <div className={styles.statProgress}>
                <div 
                  className={styles.statProgressBar}
                  style={{ width: `${(userStats.completedLessons / userStats.totalLessons * 100) || 0}%` }}
                ></div>
              </div>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon}>
              <FiCode />
            </div>
            <div className={styles.statContent}>
              <div className={styles.statNumber}>{userStats.solvedExercises}/{userStats.totalExercises}</div>
              <div className={styles.statLabel}>Exercises</div>
              <div className={styles.statProgress}>
                <div 
                  className={styles.statProgressBar}
                  style={{ width: `${(userStats.solvedExercises / userStats.totalExercises * 100) || 0}%` }}
                ></div>
              </div>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon}>
              <FiCheckCircle />
            </div>
            <div className={styles.statContent}>
              <div className={styles.statNumber}>{userStats.completionRate}%</div>
              <div className={styles.statLabel}>Completion</div>
              <div className={styles.statTrend}>
                <FiTrendingUp className={styles.trendIcon} />
                <span>+{userStats.weeklyProgress.lessonsThisWeek} this week</span>
              </div>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon}>
              <FiClock />
            </div>
            <div className={styles.statContent}>
              <div className={styles.statNumber}>{userStats.studyTimeHours}h</div>
              <div className={styles.statLabel}>Study Time</div>
              <div className={styles.statTrend}>
                <FiTrendingUp className={styles.trendIcon} />
                <span>{userStats.weeklyProgress.studyTimeThisWeek}h this week</span>
              </div>
            </div>
          </div>
        </div>

        {/* Calendar Section - Temporarily disabled until activity tracking is ready */}
        {/* {renderCalendar()} */}
        <div className={styles.calendarSection}>
          <h3>📅 Study Calendar</h3>
          <p>Activity tracking is being set up. Calendar will be available soon!</p>
        </div>

        {/* Activity Summary */}
        <div className={styles.activitySection}>
          <h3 className={styles.sectionTitle}>Recent Activity</h3>
          <div className={styles.activityList}>
            {userStats.recentActivities.map((activity, index) => (
              <div key={index} className={styles.activityItem}>
                <div className={styles.activityIcon}>
                  {getActivityIcon(activity.type)}
                </div>
                <div className={styles.activityContent}>
                  <span className={styles.activityText}>{activity.text}</span>
                  <span className={styles.activityTime}>{activity.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className={styles.quickActions}>
          <h3 className={styles.sectionTitle}>Quick Actions</h3>
          <div className={styles.actionGrid}>
            <button 
              className={styles.actionCard} 
              onClick={() => {
                logActivity('LESSON_VIEW', 'Navigated to lessons from profile');
                setSelectedTab('lessons');
              }}
            >
              <FiBookOpen className={styles.actionIcon} />
              <span>Continue Learning</span>
            </button>
            <button 
              className={styles.actionCard} 
              onClick={() => {
                logActivity('EXERCISE_START', 'Navigated to exercises from profile');
                setSelectedTab('exercises');
              }}
            >
              <FiCode className={styles.actionIcon} />
              <span>Practice Coding</span>
            </button>
            <button className={styles.actionCard} onClick={() => setSelectedTab('achievements')}>
              <FiAward className={styles.actionIcon} />
              <span>View Achievements</span>
            </button>
            <button 
              className={styles.actionCard} 
              onClick={() => {
                logActivity('PROFILE_UPDATE', 'Navigated to settings from profile');
                window.location.href = `/${session?.user?.language || 'en'}/settings`;
              }}
            >
              <FiUser className={styles.actionIcon} />
              <span>Account Settings</span>
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Render content for each tab
  const renderTabContent = () => {
    switch (selectedTab) {
      case "overview":
        return renderProfileOverview();
      case "achievements":
        return <div className={styles.tabContent}>Achievements content</div>;
      case "progress":
        return <div className={styles.tabContent}>Progress content</div>;
      case "lessons":
        return <div className={styles.tabContent}>My Lessons content</div>;
      case "exercises":
        return <div className={styles.tabContent}>Exercise History content</div>;
      case "goals":
        return <div className={styles.tabContent}>Learning Goals content</div>;
      case "analytics":
        return <div className={styles.tabContent}>Analytics content</div>;
      /* Temporarily disabled until activity tracking is ready
      case "calendar":
        return <div className={styles.tabContent}>{renderCalendar()}</div>;
      */
      case "security":
        return <div className={styles.tabContent}>Security content</div>;
      case "notifications":
        return <div className={styles.tabContent}>Notifications content</div>;
      case "favorites":
        return <div className={styles.tabContent}>Favorites content</div>;
      default:
        return null;
    }
  };

  return (
    <>
      <Header />
      <div className={styles.profileLayout}>
        <div className={`${styles.sidebar} ${sidebarCollapsed ? styles.sidebarCollapsed : ""}`}> 
          <div className={styles.sidebarHeader}>
            {!sidebarCollapsed && (
              <span className={styles.sidebarTitle}>Profile</span>
            )}
            <button
              className={styles.collapseBtn}
              onClick={() => setSidebarCollapsed((v) => !v)}
              aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              style={sidebarCollapsed ? { margin: "0 auto" } : {}}
            >
              {sidebarCollapsed ? <FiChevronRight /> : <FiChevronLeft />}
            </button>
          </div>
          <div className={styles.tabList}>
            {profileTabs.map((tab) => (
              <button
                key={tab.key}
                className={`${styles.tabBtn} ${selectedTab === tab.key ? styles.tabBtnSelected : ""}`}
                onClick={() => setSelectedTab(tab.key)}
                title={tab.name}
              >
                <span className={styles.tabIcon}>{tab.icon}</span>
                {!sidebarCollapsed && (
                  <div className={styles.tabInfo}>
                    <span className={styles.tabName}>{tab.name}</span>
                    <span className={styles.tabDescription}>{tab.description}</span>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
        <div className={styles.content}>{renderTabContent()}</div>
      </div>
      <Footer />
    </>
  );
} 