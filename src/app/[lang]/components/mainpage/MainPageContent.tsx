import React, { useState } from "react";
import styles from "./MainPageContent.module.css";
import HeroSection from "../heroSection/HeroSection";
import LanguagesSection from "../languagesSection/LanguagesSection";
import MainPageTryEditor from "../mainpageTryEditor/MainPageTryEditor";
import { FiLayers, FiRefreshCw, FiGitBranch, FiShare2 } from "react-icons/fi";
import { useI18n } from "@/contexts/I18nContext";

export default function MainPageContent() {
  const { t, lang } = useI18n();

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

  return (
    <main className={styles.main}>
      <HeroSection boxes={[]} />
      <LanguagesSection />
      <MainPageTryEditor key={lang} />
    </main>
  );
}
