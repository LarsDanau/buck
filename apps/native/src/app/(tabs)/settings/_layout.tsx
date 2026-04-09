import { Stack } from "expo-router";

const screenOptions = { headerShown: false } as const;

export default function SettingsTabStackLayout() {
  return <Stack screenOptions={screenOptions} />;
}
