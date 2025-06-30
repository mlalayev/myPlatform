'use client';
import React from 'react';
import I18nContext from './I18nContext';
import { getTranslations } from '../lib/i18n';

type Props = {
  lang: string;
  children: React.ReactNode;
};

export default function I18nProvider({ lang, children }: Props) {
  const translations = getTranslations(lang);

  // Support nested keys like 'header.home'
  const t = (key: string) => {
    return key.split('.').reduce((obj, k) => (obj && obj[k] !== undefined ? obj[k] : key), translations);
  };

  return (
    <I18nContext.Provider value={{ t, lang }}>
      {children}
    </I18nContext.Provider>
  );
} 