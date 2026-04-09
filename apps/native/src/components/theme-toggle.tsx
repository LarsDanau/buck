import { Ionicons } from "@expo/vector-icons";
import { ImpactFeedbackStyle, impactAsync } from "expo-haptics";
import { useCallback } from "react";
import { Platform } from "react-native";
import Animated, { FadeOut, ZoomIn } from "react-native-reanimated";
import { withUniwind } from "uniwind";

import { Button } from "heroui-native";

import { useAppTheme } from "@/contexts/app-theme-context";

const StyledIonicons = withUniwind(Ionicons);

/**
 * Toggles between light and dark theme with a small icon animation.
 *
 * @returns Pressable theme switch for app chrome.
 */
export function ThemeToggle() {
  const { toggleTheme, isLight } = useAppTheme();
  const handlePress = useCallback(() => {
    // Keep haptics limited to iOS so feedback matches platform conventions.
    if (Platform.OS === "ios") {
      impactAsync(ImpactFeedbackStyle.Light);
    }

    toggleTheme();
  }, [toggleTheme]);

  return (
    <Button onPress={handlePress} className="px-2.5">
      {isLight ? (
        <Animated.View key="moon" entering={ZoomIn} exiting={FadeOut}>
          <StyledIonicons name="moon" size={20} className="text-foreground" />
        </Animated.View>
      ) : (
        <Animated.View key="sun" entering={ZoomIn} exiting={FadeOut}>
          <StyledIonicons name="sunny" size={20} className="text-foreground" />
        </Animated.View>
      )}
    </Button>
  );
}
