import styles from "../../tutorials/TutorialsPage.module.css";
import React from "react";
import { useI18n } from "@/contexts/I18nContext";
import { FiCode, FiActivity, FiUserCheck, FiTrendingUp } from "react-icons/fi";

// Platform stats data (mock)
const platformStats = {
  languages: 12,
  exercises: 89,
  interviews: 45,
  progress: 2340,
};

const HeroSection = () => {
  const { t } = useI18n();

  const statsData = [
    {
      key: "languages",
      icon: <FiCode size={24} />,
      number: platformStats.languages,
    },
    {
      key: "exercises", 
      icon: <FiActivity size={24} />,
      number: platformStats.exercises,
    },
    {
      key: "interviews",
      icon: <FiUserCheck size={24} />,
      number: platformStats.interviews,
    },
    {
      key: "progress",
      icon: <FiTrendingUp size={24} />,
      number: platformStats.progress,
    },
  ];

  return (
    <section className={styles.heroSection}>
      <div className={styles.heroContent}>
        <h1 className={styles.heroTitle}>{t("hero.title")}</h1>
        <p className={styles.heroSubtitle}>
          {t("hero.subtitle")}
        </p>
        {/* Stats Cards */}
        <div className={styles.statsContainer}>
          {statsData.map((stat) => (
            <div className={styles.statCard} key={stat.key}>
              <div className={styles.statIcon}>{stat.icon}</div>
              <div className={styles.statInfo}>
                <div className={styles.statNumber}>{stat.number}</div>
                <div className={styles.statLabel}>
                  {t(`hero.stats.${stat.key}.title`)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
