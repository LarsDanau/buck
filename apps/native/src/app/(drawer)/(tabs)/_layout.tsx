import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { useThemeColor } from "heroui-native";
import { useCallback, useMemo } from "react";

const homeTabOptions = { title: "Home" } as const;
const exploreTabOptions = { title: "Explore" } as const;

export default function TabLayout() {
  const themeColorForeground = useThemeColor("foreground");
  const themeColorBackground = useThemeColor("background");
  const renderHomeIcon = useCallback(
    ({ color, size }: { color: string; size: number }) => (
      <Ionicons name="home" size={size} color={color} />
    ),
    [],
  );
  const renderCompassIcon = useCallback(
    ({ color, size }: { color: string; size: number }) => (
      <Ionicons name="compass" size={size} color={color} />
    ),
    [],
  );
  const screenOptions = useMemo(
    () => ({
      headerShown: false,
      headerStyle: {
        backgroundColor: themeColorBackground,
      },
      headerTintColor: themeColorForeground,
      headerTitleStyle: {
        color: themeColorForeground,
        fontWeight: "600" as const,
      },
      tabBarStyle: {
        backgroundColor: themeColorBackground,
      },
    }),
    [themeColorBackground, themeColorForeground],
  );
  const homeScreenOptions = useMemo(
    () => ({
      ...homeTabOptions,
      tabBarIcon: renderHomeIcon,
    }),
    [renderHomeIcon],
  );
  const exploreScreenOptions = useMemo(
    () => ({
      ...exploreTabOptions,
      tabBarIcon: renderCompassIcon,
    }),
    [renderCompassIcon],
  );

  return (
    <Tabs screenOptions={screenOptions}>
      <Tabs.Screen name="index" options={homeScreenOptions} />
      <Tabs.Screen name="two" options={exploreScreenOptions} />
    </Tabs>
  );
}
