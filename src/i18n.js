import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './langs/eng.json';
import ru from './langs/rus.json';
import ky from './langs/kyrg.json';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      ru: { translation: ru },
      ky: { translation: ky }
    },
    lng: 'ru',
    fallbackLng: 'ru',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;