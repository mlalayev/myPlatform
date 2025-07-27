"use client";

import React, { useState } from "react";
import {
  FiBell,
  FiCheck,
  FiX,
  FiSettings,
  FiMail,
  FiSmartphone,
  FiAward,
  FiTrendingUp,
  FiAlertTriangle,
  FiInfo,
  FiStar,
  FiClock,
  FiEye,
  FiEyeOff,
  FiDownload,
  FiRefreshCw,
  FiFilter,
  FiSearch,
  FiBookOpen,
  FiCode,
  FiTarget,
  FiUsers,
  FiGift,
  FiZap,
} from "react-icons/fi";
import { useI18n } from "../../../../contexts/I18nContext";
import notificationStyles from "../ProfileNotifications.module.css";

interface ProfileNotificationsProps {
  userStats: any;
  loading: boolean;
}

export default function ProfileNotifications({
  userStats,
  loading,
}: ProfileNotificationsProps) {
  const { t } = useI18n();
  const [activeFilter, setActiveFilter] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");

  if (loading) {
    return (
      <div className={notificationStyles.notificationsContainer}>
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
            <span style={{ color: '#718096' }}>{t("notifications.loading")}</span>
          </div>
        </div>
      </div>
    );
  }

  // Notification statistics
  const notificationStats = {
    total: 24,
    unread: 8,
    today: 5,
    thisWeek: 12
  };

  // Notification categories
  const notificationCategories = [
    {
      id: "learning",
      name: t("notifications.categories.learning.name"),
      description: t("notifications.categories.learning.description"),
      icon: <FiBookOpen />,
      enabled: true,
      count: 12
    },
    {
      id: "achievements",
      name: t("notifications.categories.achievements.name"),
      description: t("notifications.categories.achievements.description"),
      icon: <FiAward />,
      enabled: true,
      count: 8
    },
    {
      id: "progress",
      name: t("notifications.categories.progress.name"),
      description: t("notifications.categories.progress.description"),
      icon: <FiTrendingUp />,
      enabled: false,
      count: 4
    },
    {
      id: "community",
      name: t("notifications.categories.community.name"),
      description: t("notifications.categories.community.description"),
      icon: <FiUsers />,
      enabled: true,
      count: 6
    }
  ];

  // Sample notifications data
  const notifications = [
    {
      id: 1,
      type: "achievement",
      title: t("notifications.items.achievement.title"),
      message: t("notifications.items.achievement.message"),
      time: "2 saat əvvəl",
      category: "achievements",
      unread: true,
      icon: <FiAward />
    },
    {
      id: 2,
      type: "success",
      title: t("notifications.items.lessonCompleted.title"),
      message: t("notifications.items.lessonCompleted.message"),
      time: "4 saat əvvəl",
      category: "learning",
      unread: true,
      icon: <FiCheck />
    },
    {
      id: 3,
      type: "info",
      title: t("notifications.items.newExercise.title"),
      message: t("notifications.items.newExercise.message"),
      time: "1 gün əvvəl",
      category: "learning",
      unread: false,
      icon: <FiCode />
    },
    {
      id: 4,
      type: "warning",
      title: t("notifications.items.streakWarning.title"),
      message: t("notifications.items.streakWarning.message"),
      time: "2 gün əvvəl",
      category: "progress",
      unread: false,
      icon: <FiAlertTriangle />
    },
    {
      id: 5,
      type: "success",
      title: t("notifications.items.levelUp.title"),
      message: t("notifications.items.levelUp.message"),
      time: "3 gün əvvəl",
      category: "progress",
      unread: false,
      icon: <FiTrendingUp />
    },
    {
      id: 6,
      type: "info",
      title: t("notifications.items.communityChallenge.title"),
      message: t("notifications.items.communityChallenge.message"),
      time: "1 həftə əvvəl",
      category: "community",
      unread: false,
      icon: <FiUsers />
    }
  ];

  // Notification settings
  const notificationSettings = [
    {
      id: "email_notifications",
      title: t("notifications.settings.email.title"),
      description: t("notifications.settings.email.description"),
      enabled: true
    },
    {
      id: "push_notifications",
      title: t("notifications.settings.push.title"),
      description: t("notifications.settings.push.description"),
      enabled: true
    },
    {
      id: "sound_notifications",
      title: t("notifications.settings.sound.title"),
      description: t("notifications.settings.sound.description"),
      enabled: false
    },
    {
      id: "daily_digest",
      title: t("notifications.settings.digest.title"),
      description: t("notifications.settings.digest.description"),
      enabled: true
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'enabled':
        return <FiCheck />;
      case 'disabled':
        return <FiX />;
      default:
        return <FiSettings />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'enabled':
        return notificationStyles.enabled;
      case 'disabled':
        return notificationStyles.disabled;
      default:
        return notificationStyles.disabled;
    }
  };

  const filteredNotifications = notifications.filter(notification => {
    if (activeFilter === "unread" && !notification.unread) return false;
    if (selectedCategory !== "all" && notification.category !== selectedCategory) return false;
    return true;
  });

  return (
    <div className={notificationStyles.notificationsContainer}>
      {/* Hero Section */}
      <div className={notificationStyles.notificationsHero}>
        <div className={notificationStyles.heroContent}>
          <div className={notificationStyles.heroLeft}>
            <h1 className={notificationStyles.heroTitle}>{t("notifications.hero.title")}</h1>
            <p className={notificationStyles.heroSubtitle}>
              {t("notifications.hero.subtitle")}
            </p>
            <div className={notificationStyles.heroActions}>
              <button className={`${notificationStyles.heroButton} ${notificationStyles.primary}`}>
                <FiBell />
                {t("notifications.hero.actions.markAllRead")}
              </button>
              <button className={notificationStyles.heroButton}>
                <FiDownload />
                {t("notifications.hero.actions.exportHistory")}
              </button>
              <button className={notificationStyles.heroButton}>
                <FiRefreshCw />
                {t("notifications.hero.actions.refresh")}
              </button>
            </div>
          </div>
          <div className={notificationStyles.heroRight}>
            <div className={notificationStyles.notificationStats}>
              <div className={notificationStyles.statItem}>
                <span className={notificationStyles.statNumber}>
                  {notificationStats.total}
                </span>
                <span className={notificationStyles.statLabel}>
                  {t("notifications.stats.total")}
                </span>
              </div>
              <div className={notificationStyles.statItem}>
                <span className={notificationStyles.statNumber}>
                  {notificationStats.unread}
                </span>
                <span className={notificationStyles.statLabel}>
                  {t("notifications.stats.unread")}
                </span>
              </div>
              <div className={notificationStyles.statItem}>
                <span className={notificationStyles.statNumber}>
                  {notificationStats.today}
                </span>
                <span className={notificationStyles.statLabel}>
                  {t("notifications.stats.today")}
                </span>
              </div>
              <div className={notificationStyles.statItem}>
                <span className={notificationStyles.statNumber}>
                  {notificationStats.thisWeek}
                </span>
                <span className={notificationStyles.statLabel}>
                  {t("notifications.stats.thisWeek")}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Notifications Overview */}
      <div className={notificationStyles.notificationsOverview}>
        <div className={notificationStyles.overviewHeader}>
          <h3 className={notificationStyles.overviewTitle}>{t("notifications.overview.title")}</h3>
        </div>

        {/* Filters */}
        <div className={notificationStyles.notificationFilters}>
          <button 
            className={`${notificationStyles.filterButton} ${activeFilter === "all" ? notificationStyles.active : ""}`}
            onClick={() => setActiveFilter("all")}
          >
            {t("notifications.filters.all")}
          </button>
          <button 
            className={`${notificationStyles.filterButton} ${activeFilter === "unread" ? notificationStyles.active : ""}`}
            onClick={() => setActiveFilter("unread")}
          >
            {t("notifications.filters.unread")}
          </button>
          <button 
            className={`${notificationStyles.filterButton} ${activeFilter === "today" ? notificationStyles.active : ""}`}
            onClick={() => setActiveFilter("today")}
          >
            {t("notifications.filters.today")}
          </button>
          <button 
            className={`${notificationStyles.filterButton} ${activeFilter === "thisWeek" ? notificationStyles.active : ""}`}
            onClick={() => setActiveFilter("thisWeek")}
          >
            {t("notifications.filters.thisWeek")}
          </button>
        </div>

        {/* Notification Categories */}
        <div className={notificationStyles.notificationCategories}>
          {notificationCategories.map((category) => (
            <div key={category.id} className={notificationStyles.notificationCategory}>
              <div className={notificationStyles.categoryHeader}>
                <h4 className={notificationStyles.categoryTitle}>
                  <div className={notificationStyles.categoryIcon}>
                    {category.icon}
                  </div>
                  {category.name}
                </h4>
                <div className={`${notificationStyles.categoryStatus} ${getStatusColor(category.enabled ? 'enabled' : 'disabled')}`}>
                  {getStatusIcon(category.enabled ? 'enabled' : 'disabled')}
                  {category.enabled ? t("notifications.status.enabled") : t("notifications.status.disabled")}
                </div>
              </div>
              <p style={{ margin: "0 0 16px 0", color: "#718096", fontSize: "0.9rem" }}>
                {category.description}
              </p>
              <div className={notificationStyles.categoryToggle}></div>
            </div>
          ))}
        </div>

        {/* Notifications List */}
        <div className={notificationStyles.notificationList}>
          {filteredNotifications.map((notification) => (
            <div 
              key={notification.id} 
              className={`${notificationStyles.notificationItem} ${notification.unread ? notificationStyles.unread : ""}`}
            >
              <div className={`${notificationStyles.notificationIcon} ${notificationStyles[notification.type]}`}>
                {notification.icon}
              </div>
              <div className={notificationStyles.notificationContent}>
                <h5 className={notificationStyles.notificationTitle}>
                  {notification.title}
                </h5>
                <p className={notificationStyles.notificationMessage}>
                  {notification.message}
                </p>
                <div className={notificationStyles.notificationMeta}>
                  <span className={notificationStyles.notificationTime}>
                    {notification.time}
                  </span>
                  <span className={notificationStyles.notificationCategory}>
                    {notificationCategories.find(cat => cat.id === notification.category)?.name}
                  </span>
                </div>
                <div className={notificationStyles.notificationActions}>
                  {notification.unread && (
                    <button className={`${notificationStyles.notificationAction} ${notificationStyles.primary}`}>
                      {t("notifications.actions.markRead")}
                    </button>
                  )}
                  <button className={`${notificationStyles.notificationAction} ${notificationStyles.secondary}`}>
                    {t("notifications.actions.view")}
                  </button>
                  <button className={`${notificationStyles.notificationAction} ${notificationStyles.secondary}`}>
                    {t("notifications.actions.dismiss")}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Notification Settings */}
      <div className={notificationStyles.notificationsOverview}>
        <div className={notificationStyles.overviewHeader}>
          <h3 className={notificationStyles.overviewTitle}>{t("notifications.settings.title")}</h3>
        </div>
        
        <div className={notificationStyles.notificationSettings}>
          {notificationSettings.map((setting) => (
            <div key={setting.id} className={notificationStyles.settingItem}>
              <div className={notificationStyles.settingInfo}>
                <div className={notificationStyles.settingTitle}>
                  {setting.title}
                </div>
                <div className={notificationStyles.settingDescription}>
                  {setting.description}
                </div>
              </div>
              <div 
                className={`${notificationStyles.settingToggle} ${setting.enabled ? notificationStyles.enabled : ""}`}
              ></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 