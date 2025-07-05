import React from "react";
import { useI18n } from "@/contexts/I18nContext";
import { FiCode, FiActivity, FiUserCheck, FiTrendingUp } from "react-icons/fi";
import { IconType } from "react-icons";
import styles from "./HeroSection.module.css";

// Interface for hero box configuration
interface HeroBox {
  key: string;
  icon: IconType;
  number: number;
  titleKey: string;
  descriptionKey?: string;
}

// Interface for HeroSection props
interface HeroSectionProps {
  titleKey?: string;
  subtitleKey?: string;
  boxes?: HeroBox[];
}

// Default platform stats data (for main page)
const platformStats = {
  languages: 12,
  exercises: 89,
  interviews: 45,
  progress: 2340,
};

// Default hero boxes for main page
const defaultHeroBoxes: HeroBox[] = [
  {
    key: "languages",
    icon: FiCode,
    number: platformStats.languages,
    titleKey: "hero.stats.languages.title",
    descriptionKey: "hero.stats.languages.description",
  },
  {
    key: "exercises",
    icon: FiActivity,
    number: platformStats.exercises,
    titleKey: "hero.stats.exercises.title",
    descriptionKey: "hero.stats.exercises.description",
  },
  {
    key: "interviews",
    icon: FiUserCheck,
    number: platformStats.interviews,
    titleKey: "hero.stats.interviews.title",
    descriptionKey: "hero.stats.interviews.description",
  },
  {
    key: "progress",
    icon: FiTrendingUp,
    number: platformStats.progress,
    titleKey: "hero.stats.progress.title",
    descriptionKey: "hero.stats.progress.description",
  },
];

const HeroSection: React.FC<HeroSectionProps> = ({ 
  titleKey = "hero.title", 
  subtitleKey = "hero.subtitle",
  boxes 
}) => {
  const { t } = useI18n();

  // Use default boxes if boxes is undefined, null, or empty array
  const heroBoxes = !boxes || boxes.length === 0 ? defaultHeroBoxes : boxes;

  return (
    <section className={styles.heroSection}>
      <div className={styles.heroContent}>
        <h1 className={styles.heroTitle}>{t(titleKey)}</h1>
        <p className={styles.heroSubtitle}>
          {t(subtitleKey)}
        </p>
        {/* Stats Cards */}
        <div className={styles.statsContainer}>
          {heroBoxes.map((box) => {
            const IconComponent = box.icon;
            return (
              <div className={styles.statCard} key={box.key}>
                <div className={styles.statIcon}>
                  <IconComponent size={24} />
                </div>
                <div className={styles.statInfo}>
                  <div className={styles.statNumber}>{box.number}</div>
                  <div className={styles.statLabel}>
                    {t(box.titleKey)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HeroSection; 