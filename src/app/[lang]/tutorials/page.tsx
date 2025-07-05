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
  FiBook,
  FiCpu as FiCpuIcon,
  FiBox,
  FiPackage,
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
import HeroSection from "../components/heroSection/HeroSection";
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
  languages: 5,
  algorithms: 23,
  dataStructures: 32,
  frameworks: 8,
};

export default function TutorialsPage() {
  const pathname = usePathname();
  const currentLang = pathname.split("/")[1] || "en";

  // Tutorial-specific hero boxes
  const tutorialHeroBoxes = [
    {
      key: "languages",
      icon: FiBook,
      number: tutorialStats.languages,
      titleKey: "tutorials.hero.stats.languages",
    },
    {
      key: "algorithms",
      icon: FiCpuIcon,
      number: tutorialStats.algorithms,
      titleKey: "tutorials.hero.stats.algorithms",
    },
    {
      key: "dataStructures",
      icon: FiBox,
      number: tutorialStats.dataStructures,
      titleKey: "tutorials.hero.stats.dataStructures",
    },
    {
      key: "frameworks",
      icon: FiPackage,
      number: tutorialStats.frameworks,
      titleKey: "tutorials.hero.stats.frameworks",
    },
  ];

  return (
    <>
      <Header />
      
      <HeroSection 
        titleKey="tutorials.hero.title"
        subtitleKey="tutorials.hero.subtitle"
        boxes={tutorialHeroBoxes}
      />

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