import React from "react";
import I18nProvider from "@/contexts/I18nProvider";

interface LangLayoutProps {
  children: React.ReactNode;
  params: { lang: string };
}

export default async function LangLayout({ children, params }: LangLayoutProps) {
  const { lang } = await params;
  return (
    <I18nProvider lang={lang}>
      {children}
    </I18nProvider>
  );
} 