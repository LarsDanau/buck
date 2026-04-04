import type { ExpoConfig, ConfigContext } from "expo/config";
import { z } from "zod";
import packageJson from "./package.json";

// You can find them at https://expo.dev/accounts/[account]/projects/[project].
const EAS_PROJECT_ID = "7c114624-a082-4837-9d17-abe8ead8a14f";
const EAS_PROJECT_SLUG = "buck";
const EAS_PROJECT_OWNER = "tekhnyx";

const appVariantSchema = z.enum(["ci", "development", "preview", "production"]);

type AppVariant = z.infer<typeof appVariantSchema>;

/**
 * Creates a config getter for a specific app variant.
 *
 * @param configMap Map of variant names to config values.
 * @returns Function that returns the config for the given variant.
 */
function createConfigPerAppVariant<T>(
  configMap: Record<AppVariant, T>,
): (appVariant: AppVariant) => T {
  return (appVariant: AppVariant) => configMap[appVariant];
}

/**
 * Validates the build number from package.json.
 *
 * @param buildNumber Raw build number value.
 * @returns Parsed build number as a number.
 */
function parseBuildNumber(buildNumber: unknown): number {
  if (
    typeof buildNumber !== "number" ||
    !Number.isInteger(buildNumber) ||
    buildNumber < 0 ||
    buildNumber >= 100
  ) {
    throw new Error("buildNumber must be an integer between 0 and 99.");
  }

  return buildNumber;
}

/**
 * Converts semver and build number into an Android version code.
 *
 * @param version App version in major.minor.patch format.
 * @param buildNumber Two-digit local build number.
 * @returns Android versionCode.
 */
function convertVersionToVersionCode(version: string, buildNumber: number): number {
  const parts = version.split(".");
  if (parts.length !== 3) {
    throw new Error('Version must be in semantic format "major.minor.patch".');
  }

  const [majorRaw, minorRaw, patchRaw] = parts as [string, string, string];
  const major = Number.parseInt(majorRaw, 10);
  const minor = Number.parseInt(minorRaw, 10);
  const patch = Number.parseInt(patchRaw, 10);

  if (Number.isNaN(major) || Number.isNaN(minor) || Number.isNaN(patch)) {
    throw new Error('Version must be in semantic format "major.minor.patch".');
  }

  if (major < 0 || minor < 0 || patch < 0) {
    throw new Error("Version parts must be non-negative integers.");
  }

  if (minor >= 100 || patch >= 100) {
    throw new Error("Minor and patch versions must be between 0 and 99.");
  }

  const versionCode = major * 1_000_000 + minor * 10_000 + patch * 100 + buildNumber;
  if (versionCode > 2_147_483_647) {
    throw new Error("Calculated versionCode exceeds Android's maximum allowed value.");
  }

  return versionCode;
}

/**
 * Reads and validates build-time env values for Expo config.
 *
 * @returns Build-time env values used by app.config.ts.
 */
function getBuildEnv() {
  const isCiBuild = process.env.CI === "true" || process.env.EAS_BUILD === "true";
  const appEnv = process.env.APP_ENV ?? (isCiBuild ? undefined : "development");

  return {
    APP_ENV: appVariantSchema.parse(appEnv),
  };
}

export const getAppName = createConfigPerAppVariant({
  ci: "Buck (CI)",
  development: "Buck (DEV)",
  preview: "Buck (PRV)",
  production: "Buck",
});

export const getAppIdentifier = createConfigPerAppVariant({
  ci: "com.tekhnyx.buck",
  development: "com.tekhnyx.buck.development",
  preview: "com.tekhnyx.buck.preview",
  production: "com.tekhnyx.buck",
});

export const getAppScheme = createConfigPerAppVariant({
  ci: "buck-ci",
  development: "buck-dev",
  preview: "buck-preview",
  production: "buck",
});

/**
 * Builds the Expo app config for the selected app variant.
 *
 * @param config Base Expo config passed by Expo.
 * @returns Fully resolved Expo config.
 */
export default ({ config }: ConfigContext): ExpoConfig => {
  // Keep build-only config logic in this file.
  // Expo does not reliably resolve TS config helper imports here.
  const buildEnv = getBuildEnv();

  // oxlint-disable-next-line no-console
  console.log("⚙️ Building app for environment:", buildEnv.APP_ENV);

  const appVariant = buildEnv.APP_ENV;
  const name = getAppName(appVariant);
  const identifier = getAppIdentifier(appVariant);
  const scheme = getAppScheme(appVariant);
  const buildNumber = parseBuildNumber(packageJson.buildNumber);

  return {
    ...config,
    name,
    slug: EAS_PROJECT_SLUG,
    scheme,
    version: packageJson.version,
    orientation: "portrait",
    userInterfaceStyle: "automatic",
    owner: EAS_PROJECT_OWNER, // Expo account name (case-sensitive), NOT the display name
    icon: `./src/assets/icons/app/${appVariant}/ios.png`,
    extra: {
      eas: {
        projectId: EAS_PROJECT_ID,
      },
      // Values in `extra` are available at runtime.
      appVariant,
    },
    ios: {
      bundleIdentifier: identifier,
      supportsTablet: true,
      buildNumber: String(buildNumber),
      icon: {
        light: `./src/assets/icons/app/${appVariant}/ios-light.png`,
        dark: `./src/assets/icons/app/${appVariant}/ios-dark.png`,
        tinted: `./src/assets/icons/app/${appVariant}/ios-tinted.png`,
      },
    },
    android: {
      package: identifier,
      versionCode: convertVersionToVersionCode(packageJson.version, buildNumber),
      adaptiveIcon: {
        foregroundImage: `./src/assets/icons/app/${appVariant}/android-adaptive.png`,
        backgroundColor: "#000000",
      },
      predictiveBackGestureEnabled: false,
    },
    web: {
      output: "static",
      favicon: "./assets/images/favicon.png",
    },
    plugins: [
      "expo-router",
      "expo-localization",
      [
        "expo-font",
        {
          fonts: [
            "./src/assets/fonts/Geist-SemiBold.ttf",
            "./src/assets/fonts/Geist-Medium.ttf",
            "./src/assets/fonts/Geist-Regular.ttf",
          ],
          android: {
            fonts: [
              {
                fontFamily: "Geist",
                fontDefinitions: [
                  {
                    path: "./src/assets/fonts/Geist-SemiBold.ttf",
                    weight: 600,
                  },
                  { path: "./src/assets/fonts/Geist-Medium.ttf", weight: 500 },
                  { path: "./src/assets/fonts/Geist-Regular.ttf", weight: 400 },
                ],
              },
            ],
          },
        },
      ],
      [
        "expo-sqlite",
        {
          enableFTS: false,
          useSQLCipher: true,
        },
      ],
      [
        "expo-secure-store",
        {
          configureAndroidBackup: true,
          faceIDPermission: "Allow $(PRODUCT_NAME) to access your Face ID biometric data.",
        },
      ],
    ],
    experiments: {
      typedRoutes: true,
      reactCompiler: true,
    },
  };
};
