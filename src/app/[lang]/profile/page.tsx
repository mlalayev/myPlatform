"use client";

import React, { useState } from "react";
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
} from "react-icons/fi";
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

  // Render content for each tab (placeholder for now)
  const renderTabContent = () => {
    switch (selectedTab) {
      case "overview":
        return <div className={styles.tabContent}>Profile Overview content</div>;
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