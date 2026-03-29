import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { Drawer } from "expo-router/drawer";
import { useThemeColor } from "heroui-native";
import React, { useCallback, useMemo } from "react";
import { Pressable } from "react-native";

import { ThemeToggle } from "@/src/components/theme-toggle";

const homeDrawerOptions = {
  headerTitle: "Home",
  drawerLabel: "Home",
} as const;
const tabsDrawerOptions = {
  headerTitle: "Tabs",
  drawerLabel: "Tabs",
} as const;

function DrawerLayout() {
  const themeColorForeground = useThemeColor("foreground");
  const themeColorBackground = useThemeColor("background");

  const renderThemeToggle = useCallback(() => <ThemeToggle />, []);
  const renderHomeIcon = useCallback(
    ({ size, color }: { size: number; color: string }) => (
      <Ionicons name="home-outline" size={size} color={color} />
    ),
    [],
  );
  const renderTabsIcon = useCallback(
    ({ size, color }: { size: number; color: string }) => (
      <MaterialIcons name="border-bottom" size={size} color={color} />
    ),
    [],
  );
  const renderModalLink = useCallback(
    () => (
      <Link href="/modal" asChild>
        <Pressable className="mr-4">
          <Ionicons name="add-outline" size={24} color={themeColorForeground} />
        </Pressable>
      </Link>
    ),
    [themeColorForeground],
  );
  const screenOptions = useMemo(
    () => ({
      headerTintColor: themeColorForeground,
      headerStyle: { backgroundColor: themeColorBackground },
      headerTitleStyle: {
        fontWeight: "600" as const,
        color: themeColorForeground,
      },
      headerRight: renderThemeToggle,
      drawerStyle: { backgroundColor: themeColorBackground },
      drawerActiveTintColor: themeColorForeground,
      drawerInactiveTintColor: themeColorForeground,
    }),
    [renderThemeToggle, themeColorBackground, themeColorForeground],
  );
  const homeScreenOptions = useMemo(
    () => ({
      ...homeDrawerOptions,
      drawerIcon: renderHomeIcon,
    }),
    [renderHomeIcon],
  );
  const tabsScreenOptions = useMemo(
    () => ({
      ...tabsDrawerOptions,
      drawerIcon: renderTabsIcon,
      headerRight: renderModalLink,
    }),
    [renderModalLink, renderTabsIcon],
  );

  return (
    <Drawer screenOptions={screenOptions}>
      <Drawer.Screen name="index" options={homeScreenOptions} />
      <Drawer.Screen name="(tabs)" options={tabsScreenOptions} />
    </Drawer>
  );
}

export default DrawerLayout;
