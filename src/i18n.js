import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import translationEN from "./locales/en.json";
import translationHI from "./locales/hi.json";
import translationMR from "./locales/mr.json";

i18n
  .use(initReactI18next) // Connects i18next with React
  .init({
    resources: {
      en: { translation: translationEN },
      hi: { translation: translationHI },
      mr: { translation: translationMR },
    },
    lng: localStorage.getItem("selectedLanguage") || "en", // Default language
    fallbackLng: "en",
    interpolation: { escapeValue: false },
  });

export default i18n;
