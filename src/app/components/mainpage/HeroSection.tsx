import styles from "./MainPageContent.module.css";
import { FiArrowUpRight } from "react-icons/fi";
import Image from "next/image";
import heroImg from "@/../public/svg/bookLogo.svg";

const HeroSection = () => {
  return (
    <section className={styles.heroSection}>
      <div className={styles.heroContent}>
        <h1 className={styles.heroTitle}>
          Control your learning<br />
          future easily
        </h1>
        <p className={styles.heroSubtitle}>
          Streamline your programming journey with our intuitive, scalable platform. Designed for everyone who wants to learn and grow.
        </p>
        <button className={styles.heroButton}>
          Get Started <span className={styles.heroButtonIcon}><FiArrowUpRight /></span>
        </button>
      </div>
      <div className={styles.heroImageWrapper}>
        <Image src={heroImg} alt="Hero Illustration" className={styles.heroImage} />
      </div>
    </section>
  );
};

export default HeroSection; 