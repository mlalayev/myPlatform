"use client";

import React, { useState, useEffect } from "react";
import styles from "./ProfilePage.module.css";
import {
  FiUser,
  FiSettings,
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
  FiTrendingDown,
  FiEdit3,
  FiCamera,
} from "react-icons/fi";
import { useSession } from "next-auth/react";
import Header from "../components/header/Header";
import Footer from "../components/footer/Footer";

const profileTabs = [
  {
    key: "overview",
    name: "Profile Overview",
    icon: <FiUser size={24} />,
    description: "View your profile information and basic stats.",
  },
  {
    key: "settings",
    name: "Account Settings",
    icon: <FiSettings size={24} />,
    description: "Manage your account details and preferences.",
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
  {
    key: "calendar",
    name: "Study Calendar",
    icon: <FiCalendar size={24} />,
    description: "Plan and view your study schedule.",
  },
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
  const [loading, setLoading] = useState(true);
  const { data: session } = useSession();

  // Fetch user stats including coins
  useEffect(() => {
    const fetchUserStats = async () => {
      try {
        // Simulate API call - replace with actual API
        setUserStats({
          dailyLoginPoints: 2850,
          todayCoins: 50,
          streak: 7,
          totalLessons: 45,
          completedLessons: 32,
          totalExercises: 128,
          solvedExercises: 89,
          rank: "Advanced",
          joinDate: "2024-01-15",
          lastActive: "2024-07-25T20:46:40.492Z"
        });
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user stats:", error);
        setLoading(false);
      }
    };

    fetchUserStats();
  }, []);

  // Render Profile Overview with coin system
  const renderProfileOverview = () => {
    if (loading) {
      return (
        <div className={styles.loadingContainer}>
          <div className={styles.spinner}></div>
          <span className={styles.loadingText}>Loading your profile...</span>
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
                {session?.user?.image ? (
                  <img src={session.user.image} alt="Profile" className={styles.avatarImage} />
                ) : (
                  <span className={styles.avatarInitial}>
                    {session?.user?.name?.charAt(0).toUpperCase() || 'U'}
                  </span>
                )}
              </div>
              <button className={styles.avatarEditBtn}>
                <FiCamera size={14} />
              </button>
            </div>
            <div className={styles.userInfo}>
              <h1 className={styles.userName}>
                {session?.user?.name || 'Anonymous User'}
                <button className={styles.editNameBtn}>
                  <FiEdit3 size={16} />
                </button>
              </h1>
              <p className={styles.userEmail}>{session?.user?.email}</p>
              <div className={styles.userBadge}>
                <FiStar className={styles.badgeIcon} />
                <span>{userStats?.rank || 'Beginner'}</span>
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
                <span className={styles.totalCoins}>{userStats?.dailyLoginPoints || 0}</span>
                <span className={styles.coinLabel}>Total Coins</span>
              </div>
              <div className={styles.coinToday}>
                <FiGift className={styles.todayIcon} />
                <span>+{userStats?.todayCoins || 0} today</span>
              </div>
            </div>

            <div className={styles.streakCard}>
              <div className={styles.streakHeader}>
                <FiTrendingUp className={styles.streakIcon} />
                <span className={styles.streakTitle}>Login Streak</span>
              </div>
              <div className={styles.streakAmount}>
                <span className={styles.streakNumber}>{userStats?.streak || 0}</span>
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
              <div className={styles.statNumber}>{userStats?.completedLessons || 0}/{userStats?.totalLessons || 0}</div>
              <div className={styles.statLabel}>Lessons</div>
              <div className={styles.statProgress}>
                <div 
                  className={styles.statProgressBar}
                  style={{ width: `${(userStats?.completedLessons / userStats?.totalLessons * 100) || 0}%` }}
                ></div>
              </div>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon}>
              <FiCode />
            </div>
            <div className={styles.statContent}>
              <div className={styles.statNumber}>{userStats?.solvedExercises || 0}/{userStats?.totalExercises || 0}</div>
              <div className={styles.statLabel}>Exercises</div>
              <div className={styles.statProgress}>
                <div 
                  className={styles.statProgressBar}
                  style={{ width: `${(userStats?.solvedExercises / userStats?.totalExercises * 100) || 0}%` }}
                ></div>
              </div>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon}>
              <FiCheckCircle />
            </div>
            <div className={styles.statContent}>
              <div className={styles.statNumber}>{Math.round((userStats?.completedLessons / userStats?.totalLessons * 100) || 0)}%</div>
              <div className={styles.statLabel}>Completion</div>
              <div className={styles.statTrend}>
                <FiTrendingUp className={styles.trendIcon} />
                <span>+12% this week</span>
              </div>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon}>
              <FiClock />
            </div>
            <div className={styles.statContent}>
              <div className={styles.statNumber}>127h</div>
              <div className={styles.statLabel}>Study Time</div>
              <div className={styles.statTrend}>
                <FiTrendingUp className={styles.trendIcon} />
                <span>8h this week</span>
              </div>
            </div>
          </div>
        </div>

        {/* Activity Summary */}
        <div className={styles.activitySection}>
          <h3 className={styles.sectionTitle}>Recent Activity</h3>
          <div className={styles.activityList}>
            <div className={styles.activityItem}>
              <div className={styles.activityIcon}>
                <FiDollarSign />
              </div>
              <div className={styles.activityContent}>
                <span className={styles.activityText}>Earned 50 coins for daily login</span>
                <span className={styles.activityTime}>2 hours ago</span>
              </div>
            </div>
            <div className={styles.activityItem}>
              <div className={styles.activityIcon}>
                <FiCheckCircle />
              </div>
              <div className={styles.activityContent}>
                <span className={styles.activityText}>Completed "JavaScript Arrays" lesson</span>
                <span className={styles.activityTime}>1 day ago</span>
              </div>
            </div>
            <div className={styles.activityItem}>
              <div className={styles.activityIcon}>
                <FiCode />
              </div>
              <div className={styles.activityContent}>
                <span className={styles.activityText}>Solved "Two Sum" exercise</span>
                <span className={styles.activityTime}>2 days ago</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className={styles.quickActions}>
          <h3 className={styles.sectionTitle}>Quick Actions</h3>
          <div className={styles.actionGrid}>
            <button className={styles.actionCard} onClick={() => setSelectedTab('lessons')}>
              <FiBookOpen className={styles.actionIcon} />
              <span>Continue Learning</span>
            </button>
            <button className={styles.actionCard} onClick={() => setSelectedTab('exercises')}>
              <FiCode className={styles.actionIcon} />
              <span>Practice Coding</span>
            </button>
            <button className={styles.actionCard} onClick={() => setSelectedTab('achievements')}>
              <FiAward className={styles.actionIcon} />
              <span>View Achievements</span>
            </button>
            <button className={styles.actionCard} onClick={() => setSelectedTab('settings')}>
              <FiSettings className={styles.actionIcon} />
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
      case "settings":
        return <div className={styles.tabContent}>Settings content (link to settings page or embed form)</div>;
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
      case "calendar":
        return <div className={styles.tabContent}>Study Calendar content</div>;
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