"use client";

import React, { useState, useEffect } from "react";
import layoutStyles from "./ProfileLayout.module.css";
import overviewStyles from "./ProfileOverview.module.css";
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
  FiCheckCircle,
  FiCode,
} from "react-icons/fi";
import { useSession } from "next-auth/react";
import Header from "../components/header/Header";
import Footer from "../components/footer/Footer";
// Import modular components
import ProfileOverview from "./components/ProfileOverview";
import ProfileAchievements from "./components/ProfileAchievements";
import ProfileProgress from "./components/ProfileProgress";
import ProfileLessons from "./components/ProfileLessons";
import ProfileExercises from "./components/ProfileExercises";
import ProfileGoals from "./components/ProfileGoals";
import ProfileAnalytics from "./components/ProfileAnalytics";

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









  // Render content for each tab
  const renderTabContent = () => {
    switch (selectedTab) {
      case "overview":
        return (
          <ProfileOverview 
            userStats={userStats}
            loading={loading}
            setSelectedTab={setSelectedTab}
            filterNavigationActivities={filterNavigationActivities}
            getActivityIcon={getActivityIcon}
          />
        );
      case "achievements":
        return (
          <ProfileAchievements 
            userStats={userStats}
            loading={loading}
          />
        );
      case "progress":
        return (
          <ProfileProgress 
            userStats={userStats}
            loading={loading}
            setSelectedTab={setSelectedTab}
          />
        );
      case "lessons":
        return (
          <ProfileLessons 
            userStats={userStats}
            loading={loading}
          />
        );
      case "exercises":
        return (
          <ProfileExercises 
            userStats={userStats}
            loading={loading}
          />
        );
      case "goals":
        return (
          <ProfileGoals 
            userStats={userStats}
            loading={loading}
          />
        );
      case "analytics":
        return (
          <ProfileAnalytics 
            userStats={userStats}
            loading={loading}
          />
        );
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
