import React from "react";
import I18nProvider from "@/contexts/I18nProvider";
import { AppProvider } from "@/contexts/AppContext";
import GlobalAchievementPopupWrapper from "./GlobalAchievementPopupWrapper";

interface LangLayoutProps {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}

export default async function LangLayout({ children, params }: LangLayoutProps) {
  const { lang } = await params;
  return (
    <I18nProvider lang={lang}>
      <AppProvider>
        <GlobalAchievementPopupWrapper />
        {/* TutorialTracking removed - tracking moved to actual tutorial pages only */}
        {children}
      </AppProvider>
    </I18nProvider>
  );
} 