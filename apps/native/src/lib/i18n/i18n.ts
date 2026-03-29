import { getLocales } from "expo-localization";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import enCommon from "./locales/en/common";
import nlCommon from "./locales/nl/common";

import enSettings from "./locales/en/settings";
import nlSettings from "./locales/nl/settings";

export const defaultNS = "common";
export type AppLanguage = "en" | "nl";

export const resources = {
  en: {
    common: enCommon, // Common translations (shared UI such as buttons, generic labels, reusable messages)
    settings: enSettings,
  },
  nl: {
    common: nlCommon,
    settings: nlSettings,
  },
} as const;

// Get users local preferred language
const preferredLanguage = getLocales()[0]?.languageCode;

// Use preferred language and map it so available
const initialLanguage: AppLanguage = preferredLanguage === "nl" ? "nl" : "en";

i18n.use(initReactI18next).init({
  resources,
  defaultNS,
  ns: [defaultNS],
  lng: initialLanguage,
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
