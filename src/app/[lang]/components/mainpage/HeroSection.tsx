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
    color: "#6c3fc5",
    bg: "linear-gradient(135deg, #e9e3ff 0%, #b6e388 100%)",
  },
  {
    icon: <FiBookOpen />,
    label: "Rich Content",
    description: "Access a wide range of tutorials and exercises.",
    color: "#1a7f6b",
    bg: "linear-gradient(135deg, #eafdff 0%, #b6e388 100%)",
  },
  {
    icon: <FiUsers />,
    label: "Community Support",
    description: "Join a vibrant community of learners.",
    color: "#e6b800",
    bg: "linear-gradient(135deg, #fffbe7 0%, #e9e3ff 100%)",
  },
  {
    icon: <FiAward />,
    label: "Achievements",
    description: "Earn badges and track your progress.",
    color: "#6c3fc5",
    bg: "linear-gradient(135deg, #eafff6 0%, #b6e388 100%)",
  },
];

const HeroSection = () => {
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
      {/* Redesigned Features Section */}
      <div className={styles.featuresSectionModern}>
        <div className={styles.featuresModernGrid}>
          {features.map((f) => (
            <div
              className={styles.featureModernCard}
              key={f.label}
              style={{ background: "rgba(255,255,255,0.7)", backdropFilter: "blur(8px)" }}
            >
              <span
                className={styles.featureModernIconBg}
                style={{ background: f.bg }}
              >
                <span style={{ color: f.color, fontSize: "2.1rem" }}>{f.icon}</span>
              </span>
              <span className={styles.featureModernLabel}>{f.label}</span>
              <span className={styles.featureModernDescription}>{f.description}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
