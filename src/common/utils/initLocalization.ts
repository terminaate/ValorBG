import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import I18NextHttpBackend from 'i18next-http-backend';
import { DEFAULT_LANGUAGE } from '@/common/constants/language';

export const initLocalization = async () => {
  const storedLanguage =
    JSON.parse(localStorage.getItem('ConfigStore')!)?.language ??
    DEFAULT_LANGUAGE;

  return i18n
    .use(I18NextHttpBackend)
    .use(initReactI18next)
    .init({
      debug: import.meta.env.DEV,
      fallbackLng: DEFAULT_LANGUAGE,
      lng: storedLanguage,
      interpolation: {
        escapeValue: false,
      },
      backend: {
        loadPath: '/locales/{{lng}}/{{ns}}.json',
      },
    });
};
