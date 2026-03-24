"use client";

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
import { useI18n } from "@/contexts/I18nContext";
import PageStyle from "../../Page.module.css";

const tutorialStats = {
  languages: 5,
  algorithms: 23,
  dataStructures: 32,
  frameworks: 8,
};

const categoryOrder: {
  routeKey: string;
  i18nKey: string;
  Icon: typeof FiCode;
  featured?: boolean;
}[] = [
  { routeKey: "languages", i18nKey: "languages", Icon: FiCode, featured: true },
  { routeKey: "algorithms", i18nKey: "algorithms", Icon: FiSettings },
  { routeKey: "data-structures", i18nKey: "dataStructures", Icon: FiLayers },
  { routeKey: "frameworks", i18nKey: "frameworks", Icon: FiPackage },
  { routeKey: "topics", i18nKey: "topics", Icon: FiBook },
];

export default function TutorialsPage() {
  const { t, lang } = useI18n();

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
      <div className={PageStyle.layout}>
        <div className={PageStyle.contentOpen}>
          <HeroSection
            titleKey="tutorials.hero.title"
            subtitleKey="tutorials.hero.subtitle"
            boxes={tutorialHeroBoxes}
          />

          <div className={styles.tutorialsWrapper}>
            <section className={styles.categoriesSection} aria-labelledby="tutorial-categories-heading">
              <header className={styles.categoriesHeader}>
                <h2 id="tutorial-categories-heading" className={styles.categoriesTitle}>
                  {t("tutorials.categories.title")}
                </h2>
                <p className={styles.categoriesSubtitle}>{t("tutorials.categories.subtitle")}</p>
              </header>

              <ul className={styles.categoriesList}>
                {categoryOrder.map((cat) => (
                  <li key={cat.routeKey} className={styles.categoryListItem}>
                    <Link
                      href={`/${lang}/tutorials/${cat.routeKey}`}
                      className={`${styles.categoryItem} ${cat.featured ? styles.featuredItem : ""}`}
                    >
                      <div className={styles.itemContent}>
                        <div className={styles.itemLeft}>
                          <div className={styles.itemIcon} aria-hidden>
                            <cat.Icon className={styles.itemIconSvg} />
                          </div>
                          <div className={styles.itemInfo}>
                            <h3 className={styles.itemTitle}>
                              {t(`tutorials.categoryCards.${cat.i18nKey}.title`)}
                            </h3>
                            <p className={styles.itemDescription}>
                              {t(`tutorials.categoryCards.${cat.i18nKey}.description`)}
                            </p>
                          </div>
                        </div>
                        <div className={styles.itemRight}>
                          {cat.featured && (
                            <span className={styles.featuredBadge}>{t("tutorials.categories.featured")}</span>
                          )}
                          <span className={styles.itemStats}>
                            {t(`tutorials.categoryCards.${cat.i18nKey}.stats`)}
                          </span>
                          <span className={styles.itemArrow} aria-hidden>
                            <FiChevronRight className={styles.chevron} />
                          </span>
                        </div>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
