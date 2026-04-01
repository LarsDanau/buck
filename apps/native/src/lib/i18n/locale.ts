import { getLocales } from "expo-localization";
import type { Locale } from "expo-localization";

/**
 * Supported app language codes.
 */
export const appLanguages = ["en", "nl"] as const;
const DEFAULT_APP_LANGUAGE = "en";

/**
 * Supported app language code.
 */
export type AppLanguage = (typeof appLanguages)[number];

/**
 * Narrows locale candidates to non-empty strings before using them as fallbacks.
 *
 * @param value Candidate locale value.
 * @returns True when the candidate is a usable locale string.
 */
function isDefinedLocale(value: string | null | undefined): value is string {
  return Boolean(value);
}

/**
 * Returns whether a locale language code is supported by the app.
 *
 * @param value Device language code to validate.
 * @returns True when the code matches one of the supported app languages.
 */
function isAppLanguage(value: string | null): value is AppLanguage {
  return appLanguages.some((language) => language === value);
}

/**
 * Resolves the first supported app language from the user's locale preferences.
 *
 * @param locales Ordered device locales returned by Expo Localization.
 * @returns First supported app language or the default fallback.
 */
function resolvePreferredAppLanguage(
  locales: ReadonlyArray<Pick<Locale, "languageCode">>,
): AppLanguage {
  const supportedLanguage = locales.map((locale) => locale.languageCode).find(isAppLanguage);

  return supportedLanguage ?? DEFAULT_APP_LANGUAGE;
}

/**
 * Resolves the preferred Buck language from the current device locale.
 *
 * @returns Supported app language code for i18n initialisation.
 */
export function getPreferredAppLanguage(): AppLanguage {
  return resolvePreferredAppLanguage(getLocales());
}

/**
 * Resolves the most specific locale available for Intl formatting.
 *
 * @param fallbackLocales Ordered fallback locales, usually from i18next.
 * @returns Device locale tag when available, otherwise the first defined fallback.
 */
export function getAppLocale(...fallbackLocales: ReadonlyArray<string | null | undefined>): string {
  const deviceLocale = getLocales()[0]?.languageTag;

  return deviceLocale || fallbackLocales.find(isDefinedLocale) || getPreferredAppLanguage();
}
