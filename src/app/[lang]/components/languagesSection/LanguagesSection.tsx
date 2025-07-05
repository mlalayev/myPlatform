import React from "react";
import { useI18n } from "@/contexts/I18nContext";
import {
  SiJavascript,
  SiCss3,
  SiNodedotjs,
  SiOpenjdk,
  SiSharp,
  SiKotlin,
  SiSwift,
  SiCplusplus,
} from "react-icons/si";
import styles from "./LanguagesSection.module.css";

interface Language {
  name: string;
  icon: React.ReactElement;
  description: string;
}

const LanguagesSection: React.FC = () => {
  const { t } = useI18n();

  const languages: Language[] = [
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
  );
};

export default LanguagesSection; 