'use client';
import React from 'react';
import I18nContext from './I18nContext';
import { getTranslations } from '../lib/i18n';

type Props = {
  lang: string;
  children: React.ReactNode;
};

export default function I18nProvider({ lang, children }: Props) {
  const translations = getTranslations(lang) as Record<string, any>;

  // Support nested keys like 'header.home'
  const t = (key: string) => {
    const value = key.split('.').reduce((obj, k) => (obj && (obj as Record<string, any>)[k] !== undefined ? (obj as Record<string, any>)[k] : key), translations);
    return typeof value === 'string' ? value : key;
  };

  return (
    <I18nContext.Provider value={{ t, lang }}>
      {children}
    </I18nContext.Provider>
  );
} 