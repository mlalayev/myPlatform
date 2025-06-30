import styles from "./MainPageContent.module.css";
import { FiArrowUpRight } from "react-icons/fi";
import Image from "next/image";
import heroImg from "@/../public/svg/bookLogo.svg";
import { useI18n } from "@/contexts/I18nContext";

const HeroSection = () => {
  const { t } = useI18n();
  return (
    <section className={styles.heroSection}>
      <div className={styles.heroContent}>
        <h1 className={styles.heroTitle}>
          {t("hero.title").split("\n").map((line, i) => (
            <span key={i}>
              {line}
              <br />
            </span>
          ))}
        </h1>
        <p className={styles.heroSubtitle}>
          {t("hero.subtitle")}
        </p>
        <button className={styles.heroButton}>
          {t("hero.cta")} <span className={styles.heroButtonIcon}><FiArrowUpRight /></span>
        </button>
      </div>
      <div className={styles.heroLogoWrapper}>
        <Image src={heroImg} alt="Hero Logo" className={styles.heroImage} />
      </div>
    </section>
  );
};

export default HeroSection; 