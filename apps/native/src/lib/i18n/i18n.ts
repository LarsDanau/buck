import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import { getPreferredAppLanguage } from "./locale";
import enCategories from "./locales/en/categories";
import enCommon from "./locales/en/common";
import enSettings from "./locales/en/settings";
import enTransactions from "./locales/en/transactions";
import nlCategories from "./locales/nl/categories";
import nlCommon from "./locales/nl/common";
import nlSettings from "./locales/nl/settings";
import nlTransactions from "./locales/nl/transactions";

export const defaultNS = "common";
export const namespaces = ["common", "categories", "settings", "transactions"] as const;

export const resources = {
  en: {
    categories: enCategories,
    common: enCommon,
    settings: enSettings,
    transactions: enTransactions,
  },
  nl: {
    categories: nlCategories,
    common: nlCommon,
    settings: nlSettings,
    transactions: nlTransactions,
  },
} as const;

i18n.use(initReactI18next).init({
  resources,
  defaultNS,
  fallbackNS: defaultNS,
  ns: namespaces,
  lng: getPreferredAppLanguage(),
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
