import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en.json';
import vi from './locales/vi.json';
import es from './locales/es.json';
import fr from './locales/fr.json';
import de from './locales/de.json';
import id from './locales/id.json';
import th from './locales/th.json';
import zh_CN from './locales/zh-CN.json';
import zh_TW from './locales/zh-TW.json';
import ja from './locales/ja.json';
import ko from './locales/ko.json';
import en_US from './locales/en-US.json';
import en_GB from './locales/en-GB.json';

const savedLanguage = localStorage.getItem('webbios_language') || 'vi';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      vi: { translation: vi },
      es: { translation: es },
      fr: { translation: fr },
      de: { translation: de },
      id: { translation: id },
      th: { translation: th },
      'zh-CN': { translation: zh_CN },
      'zh-TW': { translation: zh_TW },
      ja: { translation: ja },
      ko: { translation: ko },
      'en-US': { translation: en_US },
      'en-GB': { translation: en_GB }
    },
    lng: savedLanguage, // Read from localStorage or fallback to 'vi'
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false // React already escapes values
    }
  });

const i18nInstance = (i18n as any).default || i18n;

if (typeof i18nInstance.on === 'function') {
  i18nInstance.on('languageChanged', (lng: string) => {
    localStorage.setItem('webbios_language', lng);
  });
}

export default i18n;
