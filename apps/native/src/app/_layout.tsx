import "@/global.css";
import "@/src/lib/i18n/i18n";

import { Stack } from "expo-router";
import { HeroUINativeProvider } from "heroui-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";

import { AppThemeProvider } from "@/contexts/app-theme-context";
import { DatabaseProvider } from "@/db/provider";

export const unstable_settings = {
  initialRouteName: "(tabs)",
};

const rootViewStyle = { flex: 1 } as const;
const tabScreenOptions = { headerShown: false } as const;
const modalScreenOptions = { title: "Modal", presentation: "modal" } as const;

function StackLayout() {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={tabScreenOptions} />
      <Stack.Screen name="modal" options={modalScreenOptions} />
    </Stack>
  );
}

export default function Layout() {
  return (
    <GestureHandlerRootView style={rootViewStyle}>
      <KeyboardProvider>
        <AppThemeProvider>
          <HeroUINativeProvider>
            <DatabaseProvider>
              <StackLayout />
            </DatabaseProvider>
          </HeroUINativeProvider>
        </AppThemeProvider>
      </KeyboardProvider>
    </GestureHandlerRootView>
  );
}
