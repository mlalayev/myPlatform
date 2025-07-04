"use client"

import React from "react";
import styles from "./TutorialsPage.module.css";
import {
  FiCode,
  FiCoffee,
  FiTerminal,
  FiFeather,
  FiDatabase,
  FiSettings,
  FiBarChart2,
  FiLayers,
  FiZap,
  FiGrid,
  FiPieChart,
  FiCpu,
  FiBookOpen,
  FiGitBranch,
  FiPlay,
  FiHash,
  FiChevronRight,
} from "react-icons/fi";
import {
  SiJavascript,
  SiPython,
  SiC,
  SiCplusplus,
  SiGo,
  SiRust,
  SiTypescript,
  SiPhp,
  SiSwift,
  SiKotlin,
  SiRuby,
  SiR,
  SiMysql,
  SiGnubash,
  SiScala,
  SiDart,
  SiHaskell,
  SiOpenjdk,
  SiReact,
  SiVuedotjs,
  SiAngular,
  SiSvelte,
  SiNextdotjs,
  SiNodedotjs,
} from "react-icons/si";
import Link from "next/link";
import Header from "../components/header/Header";
import Footer from "../components/footer/Footer";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";

// Type for language cards
interface LanguageAvailable {
  name: string;
  icon: React.ReactElement;
  available: true;
  href: string;
  description: string;
}
interface LanguageUnavailable {
  name: string;
  icon: React.ReactElement;
  available: false;
  description: string;
}
type Language = LanguageAvailable | LanguageUnavailable;

const mainCategories = [
  {
    key: "algorithms",
    name: "Alqoritmlər",
    icon: <FiSettings size={44} color="#6c3fc5" />,
    description: "Əsas metodlar və alqoritmlər.",
  },
  {
    key: "data-structures",
    name: "Məlumat Strukturları",
    icon: <FiLayers size={44} color="#6c3fc5" />,
    description: "Massiv, ağac, qraf və s.",
  },
  {
    key: "frameworks",
    name: "Frameworklər",
    icon: <SiReact size={44} color="#61dafb" />,
    description: "React, Vue, Angular, Svelte və s.",
  },
  {
    key: "languages",
    name: "Proqramlaşdırma Dilləri",
    icon: <FiCode size={44} color="#23242a" />,
    description: "JavaScript, Python, Java və s.",
  },
];

// Tutorial stats data
const tutorialStats = {
  total: 156,
  algorithms: 42,
  dataStructures: 38,
  frameworks: 28,
  languages: 48,
};

export default function TutorialsPage() {
  const pathname = usePathname();
  const currentLang = pathname.split("/")[1] || "en";

  return (
    <>
      <Header />
      
      {/* Hero Section */}
      <section className={styles.heroSection}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>Tutoriallar</h1>
          <p className={styles.heroSubtitle}>
            Proqramlaşdırma dillərini, frameworkləri və alqoritmləri interaktiv dərslərlə öyrənin
          </p>
          
          {/* Stats Cards */}
          <div className={styles.statsContainer}>
            <div className={styles.statCard}>
              <div className={styles.statIcon}>📚</div>
              <div className={styles.statInfo}>
                <div className={styles.statNumber}>{tutorialStats.total}</div>
                <div className={styles.statLabel}>Ümumi Tutorial</div>
              </div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statIcon}>⚙️</div>
              <div className={styles.statInfo}>
                <div className={styles.statNumber}>{tutorialStats.algorithms}</div>
                <div className={styles.statLabel}>Alqoritmlər</div>
              </div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statIcon}>🏗️</div>
              <div className={styles.statInfo}>
                <div className={styles.statNumber}>{tutorialStats.dataStructures}</div>
                <div className={styles.statLabel}>Məlumat Strukturları</div>
              </div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statIcon}>⚛️</div>
              <div className={styles.statInfo}>
                <div className={styles.statNumber}>{tutorialStats.frameworks}</div>
                <div className={styles.statLabel}>Frameworklər</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className={styles.tutorialsWrapper}>
        <div className={styles.mainCategoriesGrid}>
          {mainCategories.map((cat) => (
            <Link
              href={`/${currentLang}/tutorials/${cat.key}`}
              className={styles.mainCategoryCard}
              key={cat.key}
            >
              <div className={styles.mainCategoryIcon}>{cat.icon}</div>
              <div className={styles.mainCategoryName}>{cat.name}</div>
              <div className={styles.mainCategoryDesc}>{cat.description}</div>
              <span className={styles.languageArrow}>
                <FiChevronRight size={22} />
              </span>
            </Link>
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
}