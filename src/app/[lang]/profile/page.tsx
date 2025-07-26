"use client";

import React, { useState, useEffect } from "react";
import styles from "./ProfilePage.module.css";
import layoutStyles from "./ProfileLayout.module.css";
import overviewStyles from "./ProfileOverview.module.css";
import achievementStyles from "./ProfileAchievements.module.css";
import calendarStyles from "./ProfileCalendar.module.css";
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
  FiZap,
  FiLock,
  FiUnlock,
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
  {
    key: "recent-activities",
    name: "Recent Activities",
    icon: <FiActivity size={24} />,
    description: "View all your recent learning activities.",
  },
];

export default function ProfilePage() {
  const [selectedTab, setSelectedTab] = useState(profileTabs[0].key);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [userStats, setUserStats] = useState<any>(null);
  const [calendarData, setCalendarData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const { data: session } = useSession();

  // Fetch user stats from backend
  useEffect(() => {
    const fetchUserStats = async () => {
      try {
        const response = await fetch("/api/user/profile");
        if (response.ok) {
          const data = await response.json();
          setUserStats(data);
        } else {
          const errorData = await response.json().catch(() => null);
          console.error(
            "Failed to fetch user stats:",
            response.status,
            response.statusText
          );
          console.error("Error details:", errorData);
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
        const response = await fetch(
          `/api/user/calendar?year=${currentYear}&month=${currentMonth}`
        );
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
  const logActivity = async (
    type: string,
    description: string,
    metadata: any = {}
  ) => {
    try {
      await fetch("/api/user/activity", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, description, metadata }),
      });
    } catch (error) {
      console.error("Error logging activity:", error);
    }
  };

  // Get activity icon based on type
  const getActivityIcon = (type: string) => {
    switch (type) {
      case "login":
      case "daily_login_bonus":
        return <FiDollarSign />;
      case "lesson_view":
      case "lesson_complete":
        return <FiCheckCircle />;
      case "quiz_submit":
      case "quiz_pass":
      case "exercise_submit":
      case "exercise_solve":
        return <FiCode />;
      default:
        return <FiActivity />;
    }
  };

  // Calendar component
  const renderCalendar = () => {
    if (!calendarData) return <div>Loading calendar...</div>;

    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    const navigateMonth = (direction: "prev" | "next") => {
      if (direction === "prev") {
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
      <div className={calendarStyles.calendarSection}>
        <div className={calendarStyles.calendarHeader}>
          <button
            onClick={() => navigateMonth("prev")}
            className={calendarStyles.calendarNavBtn}
          >
            <FiChevronLeft />
          </button>
          <h3 className={calendarStyles.calendarTitle}>
            {monthNames[currentMonth - 1]} {currentYear}
          </h3>
          <button
            onClick={() => navigateMonth("next")}
            className={calendarStyles.calendarNavBtn}
          >
            <FiChevronRight />
          </button>
        </div>

        <div className={calendarStyles.calendarGrid}>
          {daysOfWeek.map((day) => (
            <div key={day} className={calendarStyles.calendarDayHeader}>
              {day}
            </div>
          ))}

          {calendarData.calendarData.map((dayData: any, index: number) => (
            <div
              key={index}
              className={`${calendarStyles.calendarDay} ${
                dayData.hasActivity ? calendarStyles.calendarDayActive : ""
              }`}
              title={
                dayData.hasActivity
                  ? `${dayData.studyTimeMinutes}min study time, ${dayData.pointsEarned} points`
                  : "No activity"
              }
            >
              <span className={calendarStyles.calendarDayNumber}>
                {dayData.day}
              </span>
              {dayData.hasActivity && (
                <div className={calendarStyles.calendarActivityDot}></div>
              )}
            </div>
          ))}
        </div>

        <div className={calendarStyles.calendarStats}>
          <div className={calendarStyles.calendarStat}>
            <span className={calendarStyles.calendarStatLabel}>
              Active Days
            </span>
            <span className={calendarStyles.calendarStatValue}>
              {calendarData.monthlyStats.totalLoginDays}
            </span>
          </div>
          <div className={calendarStyles.calendarStat}>
            <span className={calendarStyles.calendarStatLabel}>
              Study Hours
            </span>
            <span className={calendarStyles.calendarStatValue}>
              {calendarData.monthlyStats.totalStudyTimeHours}h
            </span>
          </div>
          <div className={calendarStyles.calendarStat}>
            <span className={calendarStyles.calendarStatLabel}>
              Current Streak
            </span>
            <span className={calendarStyles.calendarStatValue}>
              {calendarData.monthlyStats.currentStreak} days
            </span>
          </div>
        </div>
      </div>
    );
  };

  // Filter function to exclude navigation activities
  const filterNavigationActivities = (activities: any[]) => {
    return activities.filter((activity: any) => {
      // Filter by text content that indicates navigation
      const hasNavigationText =
        activity.text?.includes("Navigated to") ||
        activity.text?.includes("navigated to") ||
        activity.text?.includes("Navigated from") ||
        activity.text?.includes("navigated from") ||
        activity.description?.includes("Navigated to") ||
        activity.description?.includes("navigated to") ||
        activity.description?.includes("Navigated from") ||
        activity.description?.includes("navigated from");

      // Return true only if it's not a navigation activity
      return !hasNavigationText;
    });
  };

  // Render All Activities tab
  const renderAllActivities = () => {
    if (loading) {
      return (
        <div className={layoutStyles.loadingContainer}>
          <div className={layoutStyles.spinner}></div>
          <span className={layoutStyles.loadingText}>
            Loading activities...
          </span>
        </div>
      );
    }

    if (!userStats || !userStats.recentActivities) {
      return (
        <div className={layoutStyles.loadingContainer}>
          <span className={layoutStyles.loadingText}>No activities found</span>
        </div>
      );
    }

    const filteredActivities = filterNavigationActivities(
      userStats.recentActivities
    );

    return (
      <div className={calendarStyles.allActivitiesContainer}>
        <div className={calendarStyles.allActivitiesHeader}>
          <h2 className={calendarStyles.allActivitiesTitle}>All Activities</h2>
          <p className={calendarStyles.allActivitiesDesc}>
            Complete history of your learning activities
          </p>
        </div>

        <div className={overviewStyles.activityList}>
          {filteredActivities.map((activity, index) => (
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

        {filteredActivities.length === 0 && (
          <div className={calendarStyles.emptyActivities}>
            <FiActivity size={48} style={{ opacity: 0.3 }} />
            <p>No activities yet. Start learning to see your progress here!</p>
          </div>
        )}
      </div>
    );
  };

  // Render Profile Overview with real backend data
  const renderProfileOverview = () => {
    if (loading) {
      return (
        <div className={layoutStyles.loadingContainer}>
          <div className={layoutStyles.spinner}></div>
          <span className={layoutStyles.loadingText}>
            Loading your profile...
          </span>
        </div>
      );
    }

    if (!userStats) {
      return (
        <div className={layoutStyles.loadingContainer}>
          <span className={layoutStyles.loadingText}>
            Failed to load profile data
          </span>
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
        {/* {renderCalendar()} */}
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
  };

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
          icon: <FiBookOpen />,
          rarity: "bronze",
          progress: userStats?.completedLessons > 0 ? 100 : 0,
          target: 1,
          unlocked: userStats?.completedLessons > 0,
          reward: "50 coins",
        },
        {
          id: "lesson_explorer",
          name: "Knowledge Seeker",
          description: "Complete 10 lessons",
          icon: <FiTarget />,
          rarity: "silver",
          progress: Math.min(
            ((userStats?.completedLessons || 0) / 10) * 100,
            100
          ),
          target: 10,
          unlocked: (userStats?.completedLessons || 0) >= 10,
          reward: "200 coins",
        },
        {
          id: "lesson_master",
          name: "Learning Legend",
          description: "Complete 50 lessons",
          icon: <FiStar />,
          rarity: "gold",
          progress: Math.min(
            ((userStats?.completedLessons || 0) / 50) * 100,
            100
          ),
          target: 50,
          unlocked: (userStats?.completedLessons || 0) >= 50,
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
          icon: <FiCode />,
          rarity: "bronze",
          progress: userStats?.solvedExercises > 0 ? 100 : 0,
          target: 1,
          unlocked: userStats?.solvedExercises > 0,
          reward: "75 coins",
        },
        {
          id: "coding_ninja",
          name: "Code Ninja",
          description: "Solve 25 exercises",
          icon: <FiZap />,
          rarity: "silver",
          progress: Math.min(
            ((userStats?.solvedExercises || 0) / 25) * 100,
            100
          ),
          target: 25,
          unlocked: (userStats?.solvedExercises || 0) >= 25,
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
          unlocked: (userStats?.solvedExercises || 0) >= 100,
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
          icon: <FiActivity />,
          rarity: "bronze",
          progress: Math.min(((userStats?.loginStreak || 0) / 3) * 100, 100),
          target: 3,
          unlocked: (userStats?.loginStreak || 0) >= 3,
          reward: "100 coins",
        },
        {
          id: "week_warrior",
          name: "Week Warrior",
          description: "Login for 7 days in a row",
          icon: <FiShield />,
          rarity: "silver",
          progress: Math.min(((userStats?.loginStreak || 0) / 7) * 100, 100),
          target: 7,
          unlocked: (userStats?.loginStreak || 0) >= 7,
          reward: "300 coins",
        },
        {
          id: "month_master",
          name: "Month Master",
          description: "Login for 30 days in a row",
          icon: <FiShield />,
          rarity: "legendary",
          progress: Math.min(((userStats?.loginStreak || 0) / 30) * 100, 100),
          target: 30,
          unlocked: (userStats?.loginStreak || 0) >= 30,
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
          icon: <FiStar />,
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
          icon: <FiClock />,
          rarity: "gold",
          progress: 0,
          target: 1,
          unlocked: false,
          reward: "Night Badge",
        },
      ],
    },
  ];

  const renderAchievements = () => {
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
  };

  // Render content for each tab
  const renderTabContent = () => {
    switch (selectedTab) {
      case "overview":
        return renderProfileOverview();
      case "achievements":
        return renderAchievements();
      case "progress":
        return <div className={layoutStyles.tabContent}>Progress content</div>;
      case "lessons":
        return (
          <div className={layoutStyles.tabContent}>My Lessons content</div>
        );
      case "exercises":
        return (
          <div className={layoutStyles.tabContent}>
            Exercise History content
          </div>
        );
      case "goals":
        return (
          <div className={layoutStyles.tabContent}>Learning Goals content</div>
        );
      case "analytics":
        return <div className={layoutStyles.tabContent}>Analytics content</div>;
      /* Temporarily disabled until activity tracking is ready
      case "calendar":
        return <div className={layoutStyles.tabContent}>{renderCalendar()}</div>;
      */
      case "security":
        return <div className={layoutStyles.tabContent}>Security content</div>;
      case "notifications":
        return (
          <div className={layoutStyles.tabContent}>Notifications content</div>
        );
      case "favorites":
        return <div className={layoutStyles.tabContent}>Favorites content</div>;
      case "recent-activities":
        return renderAllActivities();
      default:
        return null;
    }
  };

  return (
    <>
      <Header />
      <div className={layoutStyles.profileLayout}>
        <div
          className={`${layoutStyles.sidebar} ${
            sidebarCollapsed ? layoutStyles.sidebarCollapsed : ""
          }`}
        >
          <div className={layoutStyles.sidebarHeader}>
            {!sidebarCollapsed && (
              <span className={layoutStyles.sidebarTitle}>Profile</span>
            )}
            <button
              className={layoutStyles.collapseBtn}
              onClick={() => setSidebarCollapsed((v) => !v)}
              aria-label={
                sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"
              }
              style={sidebarCollapsed ? { margin: "0 auto" } : {}}
            >
              {sidebarCollapsed ? <FiChevronRight /> : <FiChevronLeft />}
            </button>
          </div>
          <div className={layoutStyles.tabList}>
            {profileTabs.map((tab) => (
              <button
                key={tab.key}
                className={`${layoutStyles.tabBtn} ${
                  selectedTab === tab.key ? layoutStyles.tabBtnSelected : ""
                }`}
                onClick={() => setSelectedTab(tab.key)}
                title={tab.name}
              >
                <span className={layoutStyles.tabIcon}>{tab.icon}</span>
                {!sidebarCollapsed && (
                  <div className={layoutStyles.tabInfo}>
                    <span className={layoutStyles.tabName}>{tab.name}</span>
                    <span className={layoutStyles.tabDescription}>
                      {tab.description}
                    </span>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
        <div className={layoutStyles.content}>{renderTabContent()}</div>
      </div>
      <Footer />
    </>
  );
}
