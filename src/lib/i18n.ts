import en from '../locales/en.json';
import az from '../locales/az.json';
import ru from '../locales/ru.json';

const locales: Record<string, unknown> = { en, az, ru };

export function getTranslations(lang: string) {
  return locales[lang] || locales['en'];
} 