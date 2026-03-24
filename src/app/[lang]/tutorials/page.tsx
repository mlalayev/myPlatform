"use client"

import React from "react";
import styles from "./TutorialsMainPage.module.css";
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
    key: "languages",
    name: "Proqramlaşdırma Dilləri",
    icon: <FiCode size={32} color="#374151" />,
    description: "JavaScript, Python, Java, C++ və s.",
    stats: "12+ Dillər",
    featured: true,
  },
  {
    key: "algorithms",
    name: "Alqoritmlər",
    icon: <FiSettings size={32} color="#374151" />,
    description: "Sorting, searching, dynamic programming",
    stats: "25+ Alqoritm",
  },
  {
    key: "data-structures",
    name: "Məlumat Strukturları",
    icon: <FiLayers size={32} color="#374151" />,
    description: "Arrays, trees, graphs, heaps",
    stats: "15+ Struktur",
  },
  {
    key: "frameworks",
    name: "Frameworklər",
    icon: <FiPackage size={32} color="#374151" />,
    description: "React, Vue, Angular, Svelte",
    stats: "8+ Framework",
  },
  {
    key: "topics",
    name: "Proqramlaşdırma Mövzuları",
    icon: <FiBook size={32} color="#374151" />,
    description: "OOP, Design Patterns, Clean Code",
    stats: "20+ Mövzu",
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
        <div className={styles.categoriesSection}>
          <div className={styles.categoriesHeader}>
            <h2 className={styles.categoriesTitle}>Öyrənmə Kateqoriyaları</h2>
            <p className={styles.categoriesSubtitle}>
              Proqramlaşdırma dünyasını kəşf edin
            </p>
          </div>
          
          <div className={styles.categoriesList}>
            {mainCategories.map((cat, idx) => (
              <Link
                href={`/${currentLang}/tutorials/${cat.key}`}
                className={`${styles.categoryItem} ${cat.featured ? styles.featuredItem : ''}`}
                key={cat.key}
              >
                <div className={styles.itemContent}>
                  <div className={styles.itemLeft}>
                    <div className={styles.itemIcon}>
                      {cat.icon}
                    </div>
                    <div className={styles.itemInfo}>
                      <h3 className={styles.itemTitle}>{cat.name}</h3>
                      <p className={styles.itemDescription}>{cat.description}</p>
                    </div>
                  </div>
                  <div className={styles.itemRight}>
                    <span className={styles.itemStats}>{cat.stats}</span>
                    <div className={styles.itemArrow}>
                      <FiChevronRight size={20} />
                    </div>
                  </div>
                </div>
                {cat.featured && <div className={styles.featuredBadge}>Əsas</div>}
              </Link>
            ))}
          </div>
        </div>
      </div>
      
      <Footer />
    </>
  );
}