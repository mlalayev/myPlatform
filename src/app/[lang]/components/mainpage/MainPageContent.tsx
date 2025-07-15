import React from "react";
import styles from "./MainPageContent.module.css";
import HeroSection from "../heroSection/HeroSection";
import LanguagesSection from "../languagesSection/LanguagesSection";
import MainPageTryEditor from "../mainpageTryEditor/MainPageTryEditor";
import { useI18n } from "@/contexts/I18nContext";

export default function MainPageContent() {
  const { lang } = useI18n();

  return (
    <main className={styles.main}>
      <HeroSection boxes={[]} />
      <LanguagesSection />
      <MainPageTryEditor key={lang} />
    </main>
  );
}
