import { EaseView } from "react-native-ease";
import type { Transition } from "react-native-ease";
import { Pressable } from "react-native";
import type { TabTriggerSlotProps } from "expo-router/ui";
import { IconSymbol, iconSizes } from "@/src/components/primitives/symbol";
import {
  getScaleAnimation,
  tabPressTransition,
  tabPressableHitSlop,
} from "./tab-button-animation";

// Constants
const TAB_ICON_SIZE = iconSizes.xl;
const PRESSED_ICON_SCALE = 0.86;
const FOCUSED_ICON_OPACITY = 1;
const UNFOCUSED_ICON_OPACITY = 0.88;
const TAB_ICON_OPACITY_DURATION_MS = 180;

const tabIconTransition: Transition = {
  ...tabPressTransition,
  opacity: {
    type: "timing",
    duration: TAB_ICON_OPACITY_DURATION_MS,
    easing: "easeOut",
  },
};

function getIconAnimation(isFocused: boolean, isPressed: boolean) {
  return {
    opacity: isFocused ? FOCUSED_ICON_OPACITY : UNFOCUSED_ICON_OPACITY,
    ...getScaleAnimation(isPressed, PRESSED_ICON_SCALE),
  };
}

interface TabBarButtonProps extends TabTriggerSlotProps {
  accessibilityLabel: string;
  icon: React.ComponentProps<typeof IconSymbol>["name"];
  testID: string;
}

/**
 * Renders an icon-only tab trigger that reflects the current focus state.
 */
export function TabBarButton({
  accessibilityLabel,
  icon,
  isFocused,
  testID,
  ...props
}: TabBarButtonProps) {
  const focused = !!isFocused;

  return (
    <Pressable
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="tab"
      testID={testID}
      hitSlop={tabPressableHitSlop}
      {...props}
    >
      {({ pressed }) => (
        <EaseView
          animate={getIconAnimation(focused, !!pressed)}
          transition={tabIconTransition}
        >
          <IconSymbol
            className={focused ? "text-accent-foreground" : "text-muted"}
            name={icon}
            size={TAB_ICON_SIZE}
          />
        </EaseView>
      )}
    </Pressable>
  );
}
