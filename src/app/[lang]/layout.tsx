import React from "react";
import I18nProvider from "@/contexts/I18nProvider";

export default function LangLayout({ children, params }) {
  const { lang } = params;
  return (
    <I18nProvider lang={lang}>
      {children}
    </I18nProvider>
  );
} 