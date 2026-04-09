import { describe, expect, it } from "@jest/globals";
import { getLocales } from "expo-localization";
import type { Locale } from "expo-localization";
import type { MockedFunction } from "jest-mock";

import { getAppLocale, getPreferredAppLanguage } from "./locale";

const mockedGetLocales = getLocales as MockedFunction<typeof getLocales>;

function createMockLocale(overrides: Partial<Locale> = {}): Locale {
  return {
    currencyCode: null,
    currencySymbol: null,
    decimalSeparator: ".",
    digitGroupingSeparator: ",",
    languageCode: "en",
    languageCurrencyCode: null,
    languageCurrencySymbol: null,
    languageRegionCode: "US",
    languageScriptCode: null,
    languageTag: "en-US",
    measurementSystem: "metric",
    regionCode: "US",
    temperatureUnit: "celsius",
    textDirection: "ltr",
    ...overrides,
  };
}

describe("locale", () => {
  describe("getPreferredAppLanguage", () => {
    it("returns the device language when it is supported", () => {
      mockedGetLocales.mockReturnValue([
        createMockLocale({
          languageCode: "nl",
          languageRegionCode: "BE",
          languageTag: "nl-BE",
          regionCode: "BE",
        }),
      ]);

      expect(getPreferredAppLanguage()).toBe("nl");
    });

    it("returns the first supported language from the user's locales", () => {
      mockedGetLocales.mockReturnValue([
        createMockLocale({
          languageCode: "fr",
          languageRegionCode: "BE",
          languageTag: "fr-BE",
          regionCode: "BE",
        }),
        createMockLocale({
          languageCode: "nl",
          languageRegionCode: "NL",
          languageTag: "nl-NL",
          regionCode: "NL",
        }),
      ]);

      expect(getPreferredAppLanguage()).toBe("nl");
    });

    it("falls back to en for unsupported languages", () => {
      mockedGetLocales.mockReturnValue([
        createMockLocale({
          languageCode: "fr",
          languageRegionCode: "BE",
          languageTag: "fr-BE",
          regionCode: "BE",
        }),
      ]);

      expect(getPreferredAppLanguage()).toBe("en");
    });

    it("falls back to en when the device language code is missing", () => {
      mockedGetLocales.mockReturnValue([
        createMockLocale({
          languageCode: null,
          languageRegionCode: "BE",
          languageTag: "fr-BE",
          regionCode: "BE",
        }),
      ]);

      expect(getPreferredAppLanguage()).toBe("en");
    });
  });

  describe("getAppLocale", () => {
    it("prefers the device locale tag when available", () => {
      mockedGetLocales.mockReturnValue([
        createMockLocale({
          languageCode: "nl",
          languageRegionCode: "NL",
          languageTag: "nl-NL",
          regionCode: "NL",
        }),
      ]);

      expect(getAppLocale("en-US")).toBe("nl-NL");
    });

    it("falls back to the first defined fallback locale", () => {
      mockedGetLocales.mockReturnValue([
        createMockLocale({
          languageTag: "",
        }),
      ]);

      expect(getAppLocale(undefined, "nl-BE", "en-US")).toBe("nl-BE");
    });

    it("falls back to the preferred app language when no locale tag exists", () => {
      mockedGetLocales.mockReturnValue([
        createMockLocale({
          languageCode: "nl",
          languageTag: "",
        }),
      ]);

      expect(getAppLocale(undefined, null)).toBe("nl");
    });
  });
});
