"use client"

import React, { useState } from "react";
import styles from "./ProfilePage.module.css";
import {
  FiAward,
  FiBarChart2,
  FiTarget,
  FiCalendar,
  FiUsers,
  FiMessageSquare,
  FiChevronLeft,
  FiChevronRight,
  FiUser,
  FiStar,
  FiCheckCircle,
  FiTrendingUp,
  FiBookOpen,
  FiCode,
  FiZap,
} from "react-icons/fi";
import Header from "../components/header/Header";
import Footer from "../components/footer/Footer";

// Profile data
const profileData = {
  user: {
    name: "Əli Məmmədov",
    email: "ali.mammadov@example.com",
    avatar: "https://via.placeholder.com/80",
    joinDate: "2024 Yanvar",
    level: "Orta",
    totalPoints: 2840,
  },
  badges: [
    { name: "100% JavaScript", icon: "🏆", description: "JavaScript dərslərini tamamladı", earned: "2024 Fevral" },
    { name: "Quiz Master", icon: "🎯", description: "10 testdən 10-u düzgün cavabladı", earned: "2024 Mart" },
    { name: "Early Bird", icon: "🌅", description: "7 gün ardıcıl səhər girişi", earned: "2024 Yanvar" },
    { name: "Code Warrior", icon: "⚔️", description: "50 məsələ həll etdi", earned: "2024 Aprel" },
  ],
  progress: [
    { subject: "JavaScript", completed: 85, total: 100, color: "#f7df1e" },
    { subject: "React", completed: 60, total: 80, color: "#61dafb" },
    { subject: "Algorithms", completed: 45, total: 70, color: "#6c3fc5" },
    { subject: "Data Structures", completed: 30, total: 50, color: "#1a7f6b" },
  ],
  achievements: [
    { name: "30 gün giriş", icon: "🔥", description: "30 gün ardıcıl giriş", earned: "2024 Mart" },
    { name: "10/10 Test", icon: "⭐", description: "Testdə mükəmməl nəticə", earned: "2024 Fevral" },
    { name: "Speed Learner", icon: "⚡", description: "Həftədə 5 dərs tamamladı", earned: "2024 Yanvar" },
  ],
  activity: [
    { type: "Dərs", title: "JavaScript - Arrow Functions", date: "Bugün", status: "Tamamlandı" },
    { type: "Test", title: "React Hooks Quiz", date: "Dünən", status: "90%" },
    { type: "Məsələ", title: "Array Methods", date: "2 gün əvvəl", status: "Həll edildi" },
    { type: "Dərs", title: "Algorithms - Sorting", date: "3 gün əvvəl", status: "Davam edir" },
  ],
  mockInterviews: [
    { company: "Google", role: "Frontend Developer", date: "2024 Mart", result: "Keçdi", score: "85%" },
    { company: "Microsoft", role: "React Developer", date: "2024 Fevral", result: "Keçdi", score: "78%" },
    { company: "Amazon", role: "JavaScript Developer", date: "2024 Yanvar", result: "Uğursuz", score: "65%" },
  ],
  mentorFeedback: [
    { mentor: "Aysu Həsənova", feedback: "Kod yazma bacarığın çox yaxşıdır. Clean code prinsiplərinə daha çox diqqət et.", date: "2024 Mart" },
    { mentor: "Elçin Əliyev", feedback: "Algoritm düşüncə tərzin inkişaf edir. Daha çox praktika et.", date: "2024 Fevral" },
  ],
  followers: [
    { name: "Aysu Həsənova", avatar: "https://via.placeholder.com/40", status: "Online" },
    { name: "Elçin Əliyev", avatar: "https://via.placeholder.com/40", status: "Offline" },
    { name: "Leyla Məmmədova", avatar: "https://via.placeholder.com/40", status: "Online" },
  ],
  following: [
    { name: "Tech Mentor", avatar: "https://via.placeholder.com/40", status: "Online" },
    { name: "Code Master", avatar: "https://via.placeholder.com/40", status: "Offline" },
  ],
};

const profileTabs = [
  {
    key: "badges",
    name: "🏆 Badges",
    description: "Qazandığı nişanlar",
    icon: <FiAward size={20} />,
  },
  {
    key: "progress",
    name: "📊 Progress",
    description: "Dərs və mövzular üzrə tamamlama",
    icon: <FiBarChart2 size={20} />,
  },
  {
    key: "achievements",
    name: "🎯 Achievements",
    description: "Xüsusi nailiyyətlər",
    icon: <FiTarget size={20} />,
  },
  {
    key: "activity",
    name: "📅 Activity",
    description: "Son dərslər və testlər",
    icon: <FiCalendar size={20} />,
  },
  {
    key: "interviews",
    name: "🧠 Mock Interviews",
    description: "Texniki görüşlər",
    icon: <FiUsers size={20} />,
  },
  {
    key: "feedback",
    name: "🧾 Mentor Feedback",
    description: "Mentor rəyləri",
    icon: <FiMessageSquare size={20} />,
  },
  {
    key: "followers",
    name: "👥 Followers",
    description: "İzləyənlər və izlədikləri",
    icon: <FiUsers size={20} />,
  },
];

export default function ProfilePage() {
  const [selectedTab, setSelectedTab] = useState("badges");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const renderTabContent = () => {
    switch (selectedTab) {
      case "badges":
        return (
          <div className={styles.tabContent}>
            <h2 className={styles.tabTitle}>Qazandığınız Nişanlar</h2>
            <div className={styles.badgesGrid}>
              {profileData.badges.map((badge, index) => (
                <div key={index} className={styles.badgeCard}>
                  <div className={styles.badgeIcon}>{badge.icon}</div>
                  <div className={styles.badgeInfo}>
                    <h3 className={styles.badgeName}>{badge.name}</h3>
                    <p className={styles.badgeDescription}>{badge.description}</p>
                    <span className={styles.badgeDate}>Qazanıldı: {badge.earned}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case "progress":
        return (
          <div className={styles.tabContent}>
            <h2 className={styles.tabTitle}>Təhsil Proqresi</h2>
            <div className={styles.progressGrid}>
              {profileData.progress.map((item, index) => (
                <div key={index} className={styles.progressCard}>
                  <div className={styles.progressHeader}>
                    <h3 className={styles.progressSubject}>{item.subject}</h3>
                    <span className={styles.progressPercentage}>
                      {Math.round((item.completed / item.total) * 100)}%
                    </span>
                  </div>
                  <div className={styles.progressBar}>
                    <div 
                      className={styles.progressFill} 
                      style={{ 
                        width: `${(item.completed / item.total) * 100}%`,
                        backgroundColor: item.color 
                      }}
                    />
                  </div>
                  <div className={styles.progressStats}>
                    <span>{item.completed}/{item.total} dərs</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case "achievements":
        return (
          <div className={styles.tabContent}>
            <h2 className={styles.tabTitle}>Nailiyyətlər</h2>
            <div className={styles.achievementsGrid}>
              {profileData.achievements.map((achievement, index) => (
                <div key={index} className={styles.achievementCard}>
                  <div className={styles.achievementIcon}>{achievement.icon}</div>
                  <div className={styles.achievementInfo}>
                    <h3 className={styles.achievementName}>{achievement.name}</h3>
                    <p className={styles.achievementDescription}>{achievement.description}</p>
                    <span className={styles.achievementDate}>Qazanıldı: {achievement.earned}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case "activity":
        return (
          <div className={styles.tabContent}>
            <h2 className={styles.tabTitle}>Son Fəaliyyətlər</h2>
            <div className={styles.activityList}>
              {profileData.activity.map((activity, index) => (
                <div key={index} className={styles.activityItem}>
                  <div className={styles.activityIcon}>
                    {activity.type === "Dərs" && <FiBookOpen />}
                    {activity.type === "Test" && <FiCheckCircle />}
                    {activity.type === "Məsələ" && <FiCode />}
                  </div>
                  <div className={styles.activityInfo}>
                    <h3 className={styles.activityTitle}>{activity.title}</h3>
                    <span className={styles.activityDate}>{activity.date}</span>
                  </div>
                  <div className={styles.activityStatus}>{activity.status}</div>
                </div>
              ))}
            </div>
          </div>
        );

      case "interviews":
        return (
          <div className={styles.tabContent}>
            <h2 className={styles.tabTitle}>Mock Görüşlər</h2>
            <div className={styles.interviewsList}>
              {profileData.mockInterviews.map((interview, index) => (
                <div key={index} className={styles.interviewCard}>
                  <div className={styles.interviewHeader}>
                    <h3 className={styles.interviewCompany}>{interview.company}</h3>
                    <span className={`${styles.interviewResult} ${styles[interview.result.toLowerCase()]}`}>
                      {interview.result}
                    </span>
                  </div>
                  <p className={styles.interviewRole}>{interview.role}</p>
                  <div className={styles.interviewStats}>
                    <span className={styles.interviewDate}>{interview.date}</span>
                    <span className={styles.interviewScore}>Nəticə: {interview.score}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case "feedback":
        return (
          <div className={styles.tabContent}>
            <h2 className={styles.tabTitle}>Mentor Rəyləri</h2>
            <div className={styles.feedbackList}>
              {profileData.mentorFeedback.map((feedback, index) => (
                <div key={index} className={styles.feedbackCard}>
                  <div className={styles.feedbackHeader}>
                    <h3 className={styles.feedbackMentor}>{feedback.mentor}</h3>
                    <span className={styles.feedbackDate}>{feedback.date}</span>
                  </div>
                  <p className={styles.feedbackText}>{feedback.feedback}</p>
                </div>
              ))}
            </div>
          </div>
        );

      case "followers":
        return (
          <div className={styles.tabContent}>
            <h2 className={styles.tabTitle}>Sosial Şəbəkə</h2>
            <div className={styles.socialGrid}>
              <div className={styles.socialSection}>
                <h3 className={styles.socialTitle}>İzləyənlər ({profileData.followers.length})</h3>
                <div className={styles.followersList}>
                  {profileData.followers.map((follower, index) => (
                    <div key={index} className={styles.followerItem}>
                      <img src={follower.avatar} alt={follower.name} className={styles.followerAvatar} />
                      <div className={styles.followerInfo}>
                        <span className={styles.followerName}>{follower.name}</span>
                        <span className={`${styles.followerStatus} ${styles[follower.status.toLowerCase()]}`}>
                          {follower.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className={styles.socialSection}>
                <h3 className={styles.socialTitle}>İzlədikləri ({profileData.following.length})</h3>
                <div className={styles.followingList}>
                  {profileData.following.map((following, index) => (
                    <div key={index} className={styles.followingItem}>
                      <img src={following.avatar} alt={following.name} className={styles.followingAvatar} />
                      <div className={styles.followingInfo}>
                        <span className={styles.followingName}>{following.name}</span>
                        <span className={`${styles.followingStatus} ${styles[following.status.toLowerCase()]}`}>
                          {following.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

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
            <div className={styles.userInfo}>
              <img src={profileData.user.avatar} alt={profileData.user.name} className={styles.userAvatar} />
              {!sidebarCollapsed && (
                <div className={styles.userDetails}>
                  <h3 className={styles.userName}>{profileData.user.name}</h3>
                  <span className={styles.userLevel}>{profileData.user.level}</span>
                </div>
              )}
            </div>
            <button
              className={styles.collapseBtn}
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
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

        <div className={styles.content}>
          <div className={styles.contentHeader}>
            <h1 className={styles.contentTitle}>
              {profileTabs.find(tab => tab.key === selectedTab)?.name}
            </h1>
            <div className={styles.userStats}>
              <div className={styles.statItem}>
                <FiStar />
                <span>{profileData.user.totalPoints} xal</span>
              </div>
              <div className={styles.statItem}>
                <FiUser />
                <span>{profileData.user.joinDate}</span>
              </div>
            </div>
          </div>
          
          <div className={styles.contentBody}>
            {renderTabContent()}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
} 