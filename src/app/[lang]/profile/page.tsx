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
import ProfileSecurity from "./components/ProfileSecurity";
import ProfileNotifications from "./components/ProfileNotifications";
import ProfileFavourites from "./components/ProfileFavourites";
import ProfileRecentActivities from "./components/ProfileRecentActivities";
import { useI18n } from "../../../contexts/I18nContext";

export default function ProfilePage() {
  const { t } = useI18n();

const profileTabs = [
  {
    key: "overview",
      name: t("profile.tabs.overview.name"),
    icon: <FiUser size={24} />,
      description: t("profile.tabs.overview.description"),
  },
  {
    key: "achievements",
      name: t("profile.tabs.achievements.name"),
    icon: <FiAward size={24} />,
      description: t("profile.tabs.achievements.description"),
  },
  {
    key: "progress",
      name: t("profile.tabs.progress.name"),
    icon: <FiTrendingUp size={24} />,
      description: t("profile.tabs.progress.description"),
  },
  {
    key: "lessons",
      name: t("profile.tabs.lessons.name"),
    icon: <FiBookOpen size={24} />,
      description: t("profile.tabs.lessons.description"),
  },
  {
    key: "exercises",
      name: t("profile.tabs.exercises.name"),
    icon: <FiActivity size={24} />,
      description: t("profile.tabs.exercises.description"),
  },
  {
    key: "goals",
      name: t("profile.tabs.goals.name"),
    icon: <FiTarget size={24} />,
      description: t("profile.tabs.goals.description"),
  },
  {
    key: "analytics",
      name: t("profile.tabs.analytics.name"),
    icon: <FiBarChart2 size={24} />,
      description: t("profile.tabs.analytics.description"),
  },
  /* Temporarily disabled until activity tracking is ready
  {
    key: "calendar",
      name: t("profile.tabs.calendar.name"),
    icon: <FiCalendar size={24} />,
      description: t("profile.tabs.calendar.description"),
  },
  */
  {
    key: "security",
      name: t("profile.tabs.security.name"),
    icon: <FiShield size={24} />,
      description: t("profile.tabs.security.description"),
  },
  {
    key: "notifications",
      name: t("profile.tabs.notifications.name"),
    icon: <FiBell size={24} />,
      description: t("profile.tabs.notifications.description"),
  },
  {
    key: "favorites",
      name: t("profile.tabs.favorites.name"),
    icon: <FiHeart size={24} />,
      description: t("profile.tabs.favorites.description"),
  },
  {
    key: "recent-activities",
      name: t("profile.tabs.recentActivities.name"),
    icon: <FiActivity size={24} />,
      description: t("profile.tabs.recentActivities.description"),
  },
];

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
          console.log('User stats fetched:', data);
          setUserStats(data);
        } else {
          const errorData = await response.json().catch(() => null);
          console.error(
            "Failed to fetch user stats:",
            response.status,
            response.statusText,
            errorData
          );
          
          // Set default stats if API is not available
          setUserStats({
            user: {
              name: session?.user?.name || "User",
              surname: "",
              username: session?.user?.email?.split('@')[0] || "user",
              email: session?.user?.email || "",
              avatarUrl: session?.user?.image || "",
              role: "user",
              premiumStatus: false,
              joinDate: new Date(),
              lastActive: new Date(),
            },
            dailyLoginPoints: 0,
            todayCoins: 0,
            loginStreak: 0,
            totalLessons: 150,
            completedLessons: 0,
            totalExercises: 300,
            solvedExercises: 0,
            completionRate: 0,
            studyTimeHours: 0,
            rank: "Beginner",
            totalAchievements: 0,
            unlockedAchievements: 0,
            learningStreak: 0,
            recentActivities: [
              {
                type: "login",
                text: "Welcome to the platform!",
                time: "Just now",
                metadata: {}
              }
            ],
            weeklyProgress: {
              lessonsThisWeek: 0,
              exercisesThisWeek: 0,
              studyTimeThisWeek: 0,
              pointsThisWeek: 0,
            },
            calendarData: {
              activeDays: 0,
              thisWeekStudyTime: 0,
              dailyActivities: []
            }
          });
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user stats:", error);
        
        // Set default stats on network error
        setUserStats({
          user: {
            name: session?.user?.name || "User",
            surname: "",
            username: session?.user?.email?.split('@')[0] || "user",
            email: session?.user?.email || "",
            avatarUrl: session?.user?.image || "",
            role: "user",
            premiumStatus: false,
            joinDate: new Date(),
            lastActive: new Date(),
          },
          dailyLoginPoints: 0,
          todayCoins: 0,
          loginStreak: 0,
          totalLessons: 150,
          completedLessons: 0,
          totalExercises: 300,
          solvedExercises: 0,
          completionRate: 0,
          studyTimeHours: 0,
          rank: "Beginner",
          totalAchievements: 0,
          unlockedAchievements: 0,
          learningStreak: 0,
          recentActivities: [
            {
              type: "login",
              text: "Welcome to the platform!",
              time: "Just now",
              metadata: {}
            }
          ],
          weeklyProgress: {
            lessonsThisWeek: 0,
            exercisesThisWeek: 0,
            studyTimeThisWeek: 0,
            pointsThisWeek: 0,
          },
          calendarData: {
            activeDays: 0,
            thisWeekStudyTime: 0,
            dailyActivities: []
          }
        });
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
        } else {
          console.error("Failed to fetch calendar data:", response.status, response.statusText);
          // Set default calendar data if API is not available
          setCalendarData({
            days: [],
            totalStudyTime: 0,
            totalLessons: 0,
            totalExercises: 0
          });
        }
      } catch (error) {
        console.error("Error fetching calendar data:", error);
        // Set default calendar data on network error
        setCalendarData({
          days: [],
          totalStudyTime: 0,
          totalLessons: 0,
          totalExercises: 0
        });
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
            <p>{t("profile.calendar.noActivities")}</p>
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
        return (
          <ProfileSecurity 
            userStats={userStats}
            loading={loading}
          />
        );
      case "notifications":
        return (
          <ProfileNotifications 
            userStats={userStats}
            loading={loading}
          />
        );
      case "favorites":
        return (
          <ProfileFavourites 
            userStats={userStats}
            loading={loading}
          />
        );
      case "recent-activities":
        return (
          <ProfileRecentActivities 
            userStats={userStats}
            loading={loading}
          />
        );
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
              <span className={layoutStyles.sidebarTitle}>{t("profile.sidebar.title")}</span>
            )}
            <button
              className={layoutStyles.collapseBtn}
              onClick={() => setSidebarCollapsed((v) => !v)}
              aria-label={
                sidebarCollapsed ? t("profile.sidebar.expand") : t("profile.sidebar.collapse")
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
