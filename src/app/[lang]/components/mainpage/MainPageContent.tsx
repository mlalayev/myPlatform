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
import { useI18n } from "@/contexts/I18nContext";

export default function MainPageContent() {
  const { t } = useI18n();

  const features = [
    {
      icon: <FiLayers />,
      label: t("main.featureMassivlerLabel"),
      description: t("main.featureMassivlerDesc"),
    },
    {
      icon: <FiRefreshCw />,
      label: t("main.featureRekursiyaLabel"),
      description: t("main.featureRekursiyaDesc"),
    },
    {
      icon: <FiGitBranch />,
      label: t("main.featureAgaclarLabel"),
      description: t("main.featureAgaclarDesc"),
    },
    {
      icon: <FiShare2 />,
      label: t("main.featureQrafLabel"),
      description: t("main.featureQrafDesc"),
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

  return (
    <main className={styles.main}>
      <HeroSection />
      <section className={styles.featuresSection}>
        <h2 className={styles.featuresTitle}>{t("main.featuresTitle")}</h2>
        <p className={styles.featuresSubtitle}>{t("main.featuresSubtitle")}</p>
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
        <h2 className={styles.languagesTitle}>{t("main.languagesTitle")}</h2>
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
        <h2 className={styles.introTitle}>{t("main.introTitle")}</h2>
        <JsTryEditor showCopyButton={true} showRunButton={true} />
      </section>
    </main>
  );
}
