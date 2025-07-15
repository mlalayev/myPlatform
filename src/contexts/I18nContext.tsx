"use client"

import { createContext, useContext } from 'react';

type I18nContextType = {
  t: (key: string) => string;
  lang: string;
};

const I18nContext = createContext<I18nContextType>({
  t: (key) => key,
  lang: 'en',
});

export const useI18n = () => useContext(I18nContext);

export default I18nContext; 