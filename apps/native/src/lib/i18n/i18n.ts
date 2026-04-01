import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import { getPreferredAppLanguage } from "./locale";
import enCommon from "./locales/en/common";
import nlCommon from "./locales/nl/common";

import enSettings from "./locales/en/settings";
import nlSettings from "./locales/nl/settings";
import enTransactions from "./locales/en/transactions";
import nlTransactions from "./locales/nl/transactions";

export const defaultNS = "common";

export const resources = {
  en: {
    common: enCommon, // Common translations (shared UI such as buttons, generic labels, reusable messages)
    settings: enSettings,
    transactions: enTransactions,
  },
  nl: {
    common: nlCommon,
    settings: nlSettings,
    transactions: nlTransactions,
  },
} as const;

i18n.use(initReactI18next).init({
  resources,
  defaultNS,
  ns: [defaultNS],
  lng: getPreferredAppLanguage(),
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
