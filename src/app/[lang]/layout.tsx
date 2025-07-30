import React from "react";
import I18nProvider from "@/contexts/I18nProvider";
import { AppProvider } from "@/contexts/AppContext";
import GlobalAchievementPopupWrapper from "./GlobalAchievementPopupWrapper";
import TutorialTracking from "./components/TutorialTracking";

interface LangLayoutProps {
  children: React.ReactNode;
  params: { lang: string };
}

export default async function LangLayout({ children, params }: LangLayoutProps) {
  const { lang } = await params;
  return (
    <I18nProvider lang={lang}>
      <AppProvider>
        <GlobalAchievementPopupWrapper />
        <TutorialTracking />
        {children}
      </AppProvider>
    </I18nProvider>
  );
} 