"use client"

import React from "react";
import styles from "./TutorialsPage.module.css";
import {
  FiCode,
  FiSettings,
  FiLayers,
  FiChevronRight,
  FiBook,
  FiCpu as FiCpuIcon,
  FiBox,
  FiPackage,
} from "react-icons/fi";
import Link from "next/link";
import Header from "../components/header/Header";
import Footer from "../components/footer/Footer";
import HeroSection from "../components/heroSection/HeroSection";
import { usePathname } from "next/navigation";

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
    icon: <FiCode size={44} color="#61dafb" />,
    description: "React, Vue, Angular, Svelte və s.",
  },
  {
    key: "languages",
    name: "Proqramlaşdırma Dilləri",
    icon: <FiCode size={44} color="#23242a" />,
    description: "JavaScript, Python, Java və s.",
  },
  {
    key: "topics",
    name: "Proqramlaşdırma Mövzuları",
    icon: <FiBook size={44} color="#e67e22" />,
    description: "OOP, Rekursiya, Polimorfizm və s.",
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
          {mainCategories.map((cat, idx) => (
            <Link
              href={`/${currentLang}/tutorials/${cat.key}`}
              className={
                idx === mainCategories.length - 1
                  ? `${styles.mainCategoryCard} ${styles.mainCategoryCardFull}`
                  : styles.mainCategoryCard
              }
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