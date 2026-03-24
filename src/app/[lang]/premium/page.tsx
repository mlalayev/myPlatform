"use client";

import React from "react";
import Link from "next/link";
import {
  FiStar,
  FiLayers,
  FiBarChart2,
  FiEye,
  FiZap,
} from "react-icons/fi";
import Header from "../components/header/Header";
import Footer from "../components/footer/Footer";
import PageStyle from "../../Page.module.css";
import { useI18n } from "@/contexts/I18nContext";
import styles from "./PremiumPage.module.css";

export default function PremiumPage() {
  const { t, lang } = useI18n();

  const features = [
    { Icon: FiLayers, titleKey: "premiumPage.feature1Title", descKey: "premiumPage.feature1Desc" },
    { Icon: FiBarChart2, titleKey: "premiumPage.feature2Title", descKey: "premiumPage.feature2Desc" },
    { Icon: FiEye, titleKey: "premiumPage.feature3Title", descKey: "premiumPage.feature3Desc" },
    { Icon: FiZap, titleKey: "premiumPage.feature4Title", descKey: "premiumPage.feature4Desc" },
  ] as const;

  return (
    <>
      <Header />
      <div className={PageStyle.layout}>
        <div className={PageStyle.contentOpen}>
          <main className={styles.wrap}>
            <header className={styles.hero}>
              <div className={styles.badge}>
                <FiStar className={styles.badgeIcon} aria-hidden />
                {t("header.premium")}
              </div>
              <h1 className={styles.title}>{t("premiumPage.heroTitle")}</h1>
              <p className={styles.subtitle}>{t("premiumPage.heroSubtitle")}</p>
            </header>

            <ul className={styles.grid}>
              {features.map((f, i) => (
                <li key={i} className={styles.card}>
                  <div className={styles.cardIcon}>
                    <f.Icon className={styles.cardIconSvg} aria-hidden />
                  </div>
                  <h2 className={styles.cardTitle}>{t(f.titleKey)}</h2>
                  <p className={styles.cardDesc}>{t(f.descKey)}</p>
                </li>
              ))}
            </ul>

            <section className={styles.cta} aria-labelledby="premium-cta-heading">
              <h2 id="premium-cta-heading" className={styles.ctaTitle}>
                {t("premiumPage.ctaTitle")}
              </h2>
              <p className={styles.ctaSubtitle}>{t("premiumPage.ctaSubtitle")}</p>
              <div className={styles.ctaRow}>
                <Link href={`/${lang}/signup`} className={styles.btnPrimary}>
                  {t("premiumPage.ctaPrimary")}
                </Link>
                <Link href={`/${lang}/tutorials`} className={styles.btnSecondary}>
                  {t("premiumPage.ctaSecondary")}
                </Link>
              </div>
              <p className={styles.ctaLogin}>
                <Link href={`/${lang}/login`}>{t("premiumPage.ctaLogin")}</Link>
              </p>
            </section>
          </main>
        </div>
      </div>
      <Footer />
    </>
  );
}
