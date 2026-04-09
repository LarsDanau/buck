import { useCallback, useMemo } from "react";
import type { GestureResponderEvent } from "react-native";
import { PressableFeedback, useThemeColor } from "heroui-native";
import { tabPressableHitSlop } from "./tab-button-animation";

import { IconSymbol, iconSizes } from "@/components/primitives/symbol";

const TAB_BAR_ACTION_ICON_SIZE = iconSizes.xl;
const ACTION_BUTTON_PRESS_SCALE = 0.95;
const ACTION_BUTTON_HIGHLIGHT_OPACITY_RANGE: [number, number] = [0, 1];

const actionButtonPressAnimation = {
  scale: {
    value: ACTION_BUTTON_PRESS_SCALE,
    ignoreScaleCoefficient: true,
  },
} as const;

interface TabBarActionProps extends Omit<
  React.ComponentProps<typeof PressableFeedback>,
  "children"
> {
  accessibilityLabel?: string;
}

/**
 * Renders the primary tab bar action with HeroUI-style press feedback.
 *
 * @param props Accessibility and pressable props for the action button.
 * @returns Accent-styled tab action button.
 */
export function TabBarAction({
  accessibilityLabel = "Create",
  onPressIn,
  onPressOut,
  testID = "tab-bar-create-action",
  ...props
}: TabBarActionProps) {
  const [accentHover] = useThemeColor(["accent-hover"]);

  const highlightAnimation = useMemo(
    () => ({
      backgroundColor: {
        value: accentHover,
      },
      opacity: {
        value: ACTION_BUTTON_HIGHLIGHT_OPACITY_RANGE,
      },
    }),
    [accentHover],
  );

  const handlePressIn = useCallback(
    (event: GestureResponderEvent) => {
      if (typeof onPressIn === "function") {
        onPressIn(event);
      }
    },
    [onPressIn],
  );

  const handlePressOut = useCallback(
    (event: GestureResponderEvent) => {
      if (typeof onPressOut === "function") {
        onPressOut(event);
      }
    },
    [onPressOut],
  );

  return (
    <PressableFeedback
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
      animation={actionButtonPressAnimation}
      className="flex-row items-center justify-center rounded-xl bg-accent px-5 py-1.5"
      hitSlop={tabPressableHitSlop}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      testID={testID}
      {...props}
    >
      <PressableFeedback.Highlight animation={highlightAnimation} />
      <IconSymbol className="text-accent-foreground" name="plus" size={TAB_BAR_ACTION_ICON_SIZE} />
    </PressableFeedback>
  );
}
