import React from "react";
import styles from "./MainPageContent.module.css";
import JsTryEditor from "../tryeditor/JsTryEditor";
import HeroSection from "./HeroSection";
import { FiLayers, FiRefreshCw, FiGitBranch, FiShare2 } from "react-icons/fi";
import {
  SiJavascript,
  SiHtml5,
  SiCss3,
  SiNodedotjs,
  SiOpenjdk,
  SiSharp,
  SiDart,
  SiKotlin,
  SiSwift,
  SiCplusplus,
} from "react-icons/si";

const features = [
  {
    icon: <FiLayers />,
    label: "Massivlər",
    description: "Ən çox istifadə olunan verilənlər strukturlarını öyrən.",
  },
  {
    icon: <FiRefreshCw />,
    label: "Rekursiya",
    description:
      "Rekursiv düşüncə tərzini inkişaf etdir və problemləri həll et.",
  },
  {
    icon: <FiGitBranch />,
    label: "Ağaclar",
    description: "Məlumatların iyerarxik saxlanmasını və idarəsini öyrən.",
  },
  {
    icon: <FiShare2 />,
    label: "Qraf",
    description: "Qraf strukturları və onların tətbiqlərini kəşf et.",
  },
];

const languages = [
  {
    name: "JavaScript",
    icon: <SiJavascript color="#f7df1e" size={32} />,
    description: "Most popular scripting language for web development.",
  },
  {
    name: "CSS",
    icon: <SiCss3 color="#1572b6" size={32} />,
    description: "Style your web pages with modern CSS.",
  },
  {
    name: "Node.js",
    icon: <SiNodedotjs color="#339933" size={32} />,
    description: "JavaScript runtime for server-side development.",
  },
  {
    name: "Java",
    icon: <SiOpenjdk color="#b07219" size={32} />,
    description: "Widely-used object-oriented programming language.",
  },
  {
    name: "C#",
    icon: <SiSharp color="#178600" size={32} />,
    description: "Modern language for building Windows and web apps.",
  },
  {
    name: "Kotlin",
    icon: <SiKotlin color="#7f52ff" size={32} />,
    description: "Modern language for Android and server-side apps.",
  },
  {
    name: "Swift",
    icon: <SiSwift color="#ffac45" size={32} />,
    description: "Powerful language for iOS and macOS development.",
  },
  {
    name: "C++",
    icon: <SiCplusplus color="#00599C" size={32} />,
    description: "High-performance language for system/software development.",
  },
];

export default function MainPageContent() {
  return (
    <main className={styles.main}>
      <HeroSection />
      <section className={styles.featuresSection}>
        <h2 className={styles.featuresTitle}>Əsas Xüsusiyyətlər</h2>
        <p className={styles.featuresSubtitle}>
          Platformamızın əsas imkanları ilə tanış olun və proqramlaşdırma
          bacarıqlarınızı inkişaf etdirin.
        </p>
        <div className={styles.features}>
          {features.map((f) => (
            <div className={styles.featureCard} key={f.label}>
              <span className={styles.featureIcon}>{f.icon}</span>
              <span className={styles.featureLabel}>{f.label}</span>
              <span className={styles.featureDescription}>{f.description}</span>
            </div>
          ))}
        </div>
      </section>
      <section className={styles.languagesSection}>
        <h2 className={styles.languagesTitle}>Languages in Our Courses</h2>
        <div className={styles.languagesGrid}>
          {languages.map((lang) => (
            <div className={styles.languageCard} key={lang.name}>
              <div className={styles.languageIcon}>{lang.icon}</div>
              <div className={styles.languageName}>{lang.name}</div>
              <div className={styles.languageDescription}>
                {lang.description}
              </div>
            </div>
          ))}
        </div>
      </section>
      <section className={styles.introSection}>
        <h2 className={styles.introTitle}>Giriş</h2>
        <JsTryEditor showCopyButton={true} showRunButton={true} />
      </section>
    </main>
  );
}
