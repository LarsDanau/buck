import "@/global.css";
import { Stack } from "expo-router";
import { HeroUINativeProvider } from "heroui-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";

import { AppThemeProvider } from "@/src/contexts/app-theme-context";

export const unstable_settings = {
  initialRouteName: "(drawer)",
};

const rootViewStyle = { flex: 1 } as const;
const drawerScreenOptions = { headerShown: false } as const;
const modalScreenOptions = { title: "Modal", presentation: "modal" } as const;

function StackLayout() {
  return (
    <Stack>
      <Stack.Screen name="(drawer)" options={drawerScreenOptions} />
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
            <StackLayout />
          </HeroUINativeProvider>
        </AppThemeProvider>
      </KeyboardProvider>
    </GestureHandlerRootView>
  );
}
