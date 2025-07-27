"use client";

import React, { useState } from "react";
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
} from "react-icons/fi";
import { useI18n } from "../../../../contexts/I18nContext";
import recentActivitiesStyles from "../ProfileRecentActivities.module.css";

interface ProfileRecentActivitiesProps {
  userStats: any;
  loading: boolean;
}

export default function ProfileRecentActivities({
  userStats,
  loading,
}: ProfileRecentActivitiesProps) {
  const { t } = useI18n();
  const [activeFilter, setActiveFilter] = useState("all");

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
            <span style={{ color: '#718096' }}>{t("recentActivities.loading")}</span>
          </div>
        </div>
      </div>
    );
  }

  // Activity statistics
  const activityStats = {
    total: 156,
    today: 12,
    thisWeek: 45,
    thisMonth: 89
  };

  // Sample activities data
  const activities = [
    {
      id: 1,
      type: "lesson",
      title: t("recentActivities.items.advancedAlgorithms.title"),
      description: t("recentActivities.items.advancedAlgorithms.description"),
      category: "algorithms",
      icon: <FiBookOpen />,
      stats: { duration: "45 min", progress: "85%" },
      time: "2 saat əvvəl",
      status: "completed"
    },
    {
      id: 2,
      type: "exercise",
      title: t("recentActivities.items.dynamicProgramming.title"),
      description: t("recentActivities.items.dynamicProgramming.description"),
      category: "algorithms",
      icon: <FiCode />,
      stats: { duration: "30 min", progress: "100%" },
      time: "4 saat əvvəl",
      status: "completed"
    },
    {
      id: 3,
      type: "achievement",
      title: t("recentActivities.items.codeMaster.title"),
      description: t("recentActivities.items.codeMaster.description"),
      category: "achievements",
      icon: <FiAward />,
      stats: { points: "+500", level: "15" },
      time: "1 gün əvvəl",
      status: "earned"
    },
    {
      id: 4,
      type: "login",
      title: t("recentActivities.items.login.title"),
      description: t("recentActivities.items.login.description"),
      category: "account",
      icon: <FiLogIn />,
      stats: { device: "Chrome", location: "Baku" },
      time: "2 gün əvvəl",
      status: "successful"
    },
    {
      id: 5,
      type: "progress",
      title: t("recentActivities.items.streakMilestone.title"),
      description: t("recentActivities.items.streakMilestone.description"),
      category: "progress",
      icon: <FiTrendingUp />,
      stats: { streak: "30 days", points: "+100" },
      time: "3 gün əvvəl",
      status: "achieved"
    },
    {
      id: 6,
      type: "community",
      title: t("recentActivities.items.communityChallenge.title"),
      description: t("recentActivities.items.communityChallenge.description"),
      category: "community",
      icon: <FiUsers />,
      stats: { participants: "1.2k", rank: "#15" },
      time: "1 həftə əvvəl",
      status: "participated"
    },
    {
      id: 7,
      type: "lesson",
      title: t("recentActivities.items.reactHooks.title"),
      description: t("recentActivities.items.reactHooks.description"),
      category: "frontend",
      icon: <FiBookOpen />,
      stats: { duration: "1h 15min", progress: "60%" },
      time: "1 həftə əvvəl",
      status: "in-progress"
    },
    {
      id: 8,
      type: "exercise",
      title: t("recentActivities.items.systemDesign.title"),
      description: t("recentActivities.items.systemDesign.description"),
      category: "architecture",
      icon: <FiCode />,
      stats: { duration: "2h 30min", progress: "75%" },
      time: "2 həftə əvvəl",
      status: "completed"
    }
  ];

  const filteredActivities = activities.filter(activity => {
    return activeFilter === "all" || activity.type === activeFilter;
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

  return (
    <div className={recentActivitiesStyles.recentActivitiesContainer}>
      {/* Hero Section */}
      <div className={recentActivitiesStyles.recentActivitiesHero}>
        <div className={recentActivitiesStyles.heroContent}>
          <div className={recentActivitiesStyles.heroLeft}>
            <h1 className={recentActivitiesStyles.heroTitle}>{t("recentActivities.hero.title")}</h1>
            <p className={recentActivitiesStyles.heroSubtitle}>
              {t("recentActivities.hero.subtitle")}
            </p>
            <div className={recentActivitiesStyles.heroActions}>
              <button className={`${recentActivitiesStyles.heroButton} ${recentActivitiesStyles.primary}`}>
                <FiDownload />
                {t("recentActivities.hero.actions.export")}
              </button>
              <button className={recentActivitiesStyles.heroButton}>
                <FiRefreshCw />
                {t("recentActivities.hero.actions.refresh")}
              </button>
              <button className={recentActivitiesStyles.heroButton}>
                <FiBarChart2 />
                {t("recentActivities.hero.actions.analytics")}
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
                  {t("recentActivities.stats.total")}
                </span>
              </div>
              <div className={recentActivitiesStyles.statItem}>
                <span className={recentActivitiesStyles.statNumber}>
                  {activityStats.today}
                </span>
                <span className={recentActivitiesStyles.statLabel}>
                  {t("recentActivities.stats.today")}
                </span>
              </div>
              <div className={recentActivitiesStyles.statItem}>
                <span className={recentActivitiesStyles.statNumber}>
                  {activityStats.thisWeek}
                </span>
                <span className={recentActivitiesStyles.statLabel}>
                  {t("recentActivities.stats.thisWeek")}
                </span>
              </div>
              <div className={recentActivitiesStyles.statItem}>
                <span className={recentActivitiesStyles.statNumber}>
                  {activityStats.thisMonth}
                </span>
                <span className={recentActivitiesStyles.statLabel}>
                  {t("recentActivities.stats.thisMonth")}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Activity Overview */}
      <div className={recentActivitiesStyles.activityOverview}>
        <div className={recentActivitiesStyles.overviewHeader}>
          <h3 className={recentActivitiesStyles.overviewTitle}>{t("recentActivities.overview.title")}</h3>
        </div>

        {/* Filters */}
        <div className={recentActivitiesStyles.activityFilters}>
          <button 
            className={`${recentActivitiesStyles.filterButton} ${activeFilter === "all" ? recentActivitiesStyles.active : ""}`}
            onClick={() => setActiveFilter("all")}
          >
            {t("recentActivities.filters.all")}
          </button>
          <button 
            className={`${recentActivitiesStyles.filterButton} ${activeFilter === "lesson" ? recentActivitiesStyles.active : ""}`}
            onClick={() => setActiveFilter("lesson")}
          >
            {t("recentActivities.filters.lessons")}
          </button>
          <button 
            className={`${recentActivitiesStyles.filterButton} ${activeFilter === "exercise" ? recentActivitiesStyles.active : ""}`}
            onClick={() => setActiveFilter("exercise")}
          >
            {t("recentActivities.filters.exercises")}
          </button>
          <button 
            className={`${recentActivitiesStyles.filterButton} ${activeFilter === "achievement" ? recentActivitiesStyles.active : ""}`}
            onClick={() => setActiveFilter("achievement")}
          >
            {t("recentActivities.filters.achievements")}
          </button>
          <button 
            className={`${recentActivitiesStyles.filterButton} ${activeFilter === "login" ? recentActivitiesStyles.active : ""}`}
            onClick={() => setActiveFilter("login")}
          >
            {t("recentActivities.filters.login")}
          </button>
          <button 
            className={`${recentActivitiesStyles.filterButton} ${activeFilter === "progress" ? recentActivitiesStyles.active : ""}`}
            onClick={() => setActiveFilter("progress")}
          >
            {t("recentActivities.filters.progress")}
          </button>
        </div>

        {/* Activity Timeline */}
        <div className={recentActivitiesStyles.activityTimeline}>
          {filteredActivities.map((activity) => (
            <div key={activity.id} className={`${recentActivitiesStyles.activityItem} ${recentActivitiesStyles[activity.type]}`}>
              <div className={recentActivitiesStyles.activityHeader}>
                <div className={`${recentActivitiesStyles.activityIcon} ${recentActivitiesStyles[activity.type]}`}>
                  {activity.icon}
                </div>
                <div className={recentActivitiesStyles.activityInfo}>
                  <h4 className={recentActivitiesStyles.activityTitle}>
                    {activity.title}
                  </h4>
                  <div className={recentActivitiesStyles.activityCategory}>
                    {activity.category.toUpperCase()}
                  </div>
                  <p className={recentActivitiesStyles.activityDescription}>
                    {activity.description}
                  </p>
                </div>
              </div>

              <div className={recentActivitiesStyles.activityMeta}>
                <div className={recentActivitiesStyles.activityStats}>
                  {activity.type === "lesson" && (
                    <>
                      <div className={recentActivitiesStyles.activityStat}>
                        <FiClock className={recentActivitiesStyles.activityStatIcon} />
                        {activity.stats.duration}
                      </div>
                      <div className={recentActivitiesStyles.activityStat}>
                        <FiTarget className={recentActivitiesStyles.activityStatIcon} />
                        {activity.stats.progress}
                      </div>
                    </>
                  )}
                  {activity.type === "exercise" && (
                    <>
                      <div className={recentActivitiesStyles.activityStat}>
                        <FiClock className={recentActivitiesStyles.activityStatIcon} />
                        {activity.stats.duration}
                      </div>
                      <div className={recentActivitiesStyles.activityStat}>
                        <FiCheck className={recentActivitiesStyles.activityStatIcon} />
                        {activity.stats.progress}
                      </div>
                    </>
                  )}
                  {activity.type === "achievement" && (
                    <>
                      <div className={recentActivitiesStyles.activityStat}>
                        <FiStar className={recentActivitiesStyles.activityStatIcon} />
                        {activity.stats.points}
                      </div>
                      <div className={recentActivitiesStyles.activityStat}>
                        <FiTrendingUp className={recentActivitiesStyles.activityStatIcon} />
                        Level {activity.stats.level}
                      </div>
                    </>
                  )}
                  {activity.type === "login" && (
                    <>
                      <div className={recentActivitiesStyles.activityStat}>
                        <FiActivity className={recentActivitiesStyles.activityStatIcon} />
                        {activity.stats.device}
                      </div>
                      <div className={recentActivitiesStyles.activityStat}>
                        <FiActivity className={recentActivitiesStyles.activityStatIcon} />
                        {activity.stats.location}
                      </div>
                    </>
                  )}
                  {activity.type === "progress" && (
                    <>
                      <div className={recentActivitiesStyles.activityStat}>
                        <FiZap className={recentActivitiesStyles.activityStatIcon} />
                        {activity.stats.streak}
                      </div>
                      <div className={recentActivitiesStyles.activityStat}>
                        <FiStar className={recentActivitiesStyles.activityStatIcon} />
                        {activity.stats.points}
                      </div>
                    </>
                  )}
                  {activity.type === "community" && (
                    <>
                      <div className={recentActivitiesStyles.activityStat}>
                        <FiUsers className={recentActivitiesStyles.activityStatIcon} />
                        {activity.stats.participants}
                      </div>
                      <div className={recentActivitiesStyles.activityStat}>
                        <FiTrendingUp className={recentActivitiesStyles.activityStatIcon} />
                        {activity.stats.rank}
                      </div>
                    </>
                  )}
                </div>
                <div className={recentActivitiesStyles.activityTime}>
                  {activity.time}
                </div>
              </div>

              <div className={recentActivitiesStyles.activityActions}>
                <button className={`${recentActivitiesStyles.activityAction} ${recentActivitiesStyles.primary}`}>
                  <FiEye />
                  {t("recentActivities.actions.view")}
                </button>
                <button className={`${recentActivitiesStyles.activityAction} ${recentActivitiesStyles.secondary}`}>
                  <FiShare2 />
                  {t("recentActivities.actions.share")}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Activity Summary */}
        <div className={recentActivitiesStyles.activitySummary}>
          <div className={recentActivitiesStyles.summaryCard}>
            <div className={recentActivitiesStyles.summaryHeader}>
              <div className={`${recentActivitiesStyles.summaryIcon} ${recentActivitiesStyles.lessons}`}>
                <FiBookOpen />
              </div>
              <h4 className={recentActivitiesStyles.summaryTitle}>
                {t("recentActivities.summary.lessons.title")}
              </h4>
            </div>
            <div className={recentActivitiesStyles.summaryValue}>24</div>
            <p className={recentActivitiesStyles.summaryDescription}>
              {t("recentActivities.summary.lessons.description")}
            </p>
          </div>

          <div className={recentActivitiesStyles.summaryCard}>
            <div className={recentActivitiesStyles.summaryHeader}>
              <div className={`${recentActivitiesStyles.summaryIcon} ${recentActivitiesStyles.exercises}`}>
                <FiCode />
              </div>
              <h4 className={recentActivitiesStyles.summaryTitle}>
                {t("recentActivities.summary.exercises.title")}
              </h4>
            </div>
            <div className={recentActivitiesStyles.summaryValue}>156</div>
            <p className={recentActivitiesStyles.summaryDescription}>
              {t("recentActivities.summary.exercises.description")}
            </p>
          </div>

          <div className={recentActivitiesStyles.summaryCard}>
            <div className={recentActivitiesStyles.summaryHeader}>
              <div className={`${recentActivitiesStyles.summaryIcon} ${recentActivitiesStyles.achievements}`}>
                <FiAward />
              </div>
              <h4 className={recentActivitiesStyles.summaryTitle}>
                {t("recentActivities.summary.achievements.title")}
              </h4>
            </div>
            <div className={recentActivitiesStyles.summaryValue}>8</div>
            <p className={recentActivitiesStyles.summaryDescription}>
              {t("recentActivities.summary.achievements.description")}
            </p>
          </div>

          <div className={recentActivitiesStyles.summaryCard}>
            <div className={recentActivitiesStyles.summaryHeader}>
              <div className={`${recentActivitiesStyles.summaryIcon} ${recentActivitiesStyles.time}`}>
                <FiClock />
              </div>
              <h4 className={recentActivitiesStyles.summaryTitle}>
                {t("recentActivities.summary.time.title")}
              </h4>
            </div>
            <div className={recentActivitiesStyles.summaryValue}>127h</div>
            <p className={recentActivitiesStyles.summaryDescription}>
              {t("recentActivities.summary.time.description")}
            </p>
          </div>
        </div>

        {/* Activity Chart */}
        <div className={recentActivitiesStyles.activityChart}>
          <div className={recentActivitiesStyles.chartHeader}>
            <h3 className={recentActivitiesStyles.chartTitle}>
              {t("recentActivities.chart.title")}
            </h3>
          </div>
          <div className={recentActivitiesStyles.chartPlaceholder}>
            {t("recentActivities.chart.placeholder")}
          </div>
        </div>
      </div>
    </div>
  );
} 