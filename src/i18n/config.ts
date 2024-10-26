import { initReactI18next } from "react-i18next";
import i18next from "i18next";

const resources = {
  en: {},
};

i18next.use(initReactI18next).init({
  resources,
  lng: "en",
  interpolation: {
    escapeValue: false,
  },
});

export const i18n = i18next;
