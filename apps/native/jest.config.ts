import type { Config } from "jest";

const config: Config = {
  preset: "jest-expo",
  projects: [{ preset: "jest-expo/ios" }, { preset: "jest-expo/android" }], // Run tests on iOS and Android runners
  testMatch: [
    "<rootDir>/**/*.unit.test.ts",
    "<rootDir>/**/*.unit.test.tsx",
    "<rootDir>/**/*.integration.test.ts",
    "<rootDir>/**/*.integration.test.tsx",
  ],
  testPathIgnorePatterns: ["/.expo/", "<rootDir>/src/app/"],
  moduleNameMapper: {
    "^@/components/(.*)$": "<rootDir>/src/components/$1",
    "^@/src/(.*)$": "<rootDir>/src/$1",
    "^@/(.*)$": "<rootDir>/$1",
    "\\.(css|less|sass|scss)$": "<rootDir>/src/test/style-mock.ts",
    "\\.(png|jpg|jpeg|gif|svg|ttf)$": "<rootDir>/src/test/file-mock.ts",
  },
  transformIgnorePatterns: [
    "node_modules/(?!(?:\\.bun/.*?/node_modules/)?((jest-)?react-native|@react-native(-community)?|expo(nent)?|expo-modules-core|@expo(nent)?/.*|@expo/.*|expo-router|@react-navigation/.*|react-native-gesture-handler|react-native-reanimated|react-native-worklets|react-native-safe-area-context|react-native-svg|heroui-native|uniwind|tailwind-variants|tailwind-merge))",
  ],
};

export default config;
