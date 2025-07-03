import styles from "./MainPageContent.module.css";
import {
  FiArrowUpRight,
  FiZap,
  FiBookOpen,
  FiUsers,
  FiAward,
} from "react-icons/fi";
import { useI18n } from "@/contexts/I18nContext";

const features = [
  {
    icon: <FiZap />,
    label: "Fast Learning",
    description: "Learn at your own pace with interactive lessons.",
  },
  {
    icon: <FiBookOpen />,
    label: "Rich Content",
    description: "Access a wide range of tutorials and exercises.",
  },
  {
    icon: <FiUsers />,
    label: "Community Support",
    description: "Join a vibrant community of learners.",
  },
  {
    icon: <FiAward />,
    label: "Achievements",
    description: "Earn badges and track your progress.",
  },
];

const HeroSection = () => {
  // const { t } = useI18n(); // Not using translations for new text
  return (
    <section className={styles.heroSection}>
      <div className={styles.heroFullText}>
        <h1 className={styles.heroTitleGradient}>
          Unlock Your Coding Potential with Interactive Learning
        </h1>
        <p className={styles.heroSubtitleAccent}>
          Master programming with hands-on tutorials, real challenges, and a
          supportive community. Start your journey to becoming a confident
          developer today!
        </p>
        <button className={styles.heroButton}>
          Get Started
          <span className={styles.heroButtonIcon}>
            <FiArrowUpRight />
          </span>
        </button>
      </div>
      {/* Features Section Combined */}
      <div className={styles.featuresSection}>
        <div className={styles.features}>
          {features.map((f) => (
            <div className={styles.featureCard} key={f.label}>
              <span className={styles.featureIcon}>{f.icon}</span>
              <span className={styles.featureLabel}>{f.label}</span>
              <span className={styles.featureDescription}>{f.description}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
