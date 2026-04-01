import type { PressableProps } from "react-native";
import { Pressable } from "react-native";
import { IconSymbol, iconSizes } from "@/components/primitives/symbol";

const TAB_BAR_ACTION_ICON_SIZE = iconSizes.xl;

interface TabBarActionProps extends Omit<React.ComponentProps<typeof Pressable>, "children"> {
  accessibilityLabel?: string;
  label?: string;
}

// Extend the hit target without changing the visual button size.
const pressableHitslop: PressableProps["hitSlop"] = {
  top: 16,
  bottom: 16,
  left: 20,
  right: 20,
};

/**
 * Renders the primary tab bar action with an oversized touch target.
 *
 * @param props Accessibility and pressable props for the action button.
 * @returns Accent-styled tab action button.
 */
export function TabBarAction({
  accessibilityLabel = "Create",
  testID = "tab-bar-create-action",
  ...props
}: TabBarActionProps) {
  return (
    <Pressable
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
      className="flex-row items-center justify-center rounded-xl bg-accent px-5 py-1.5"
      hitSlop={pressableHitslop}
      testID={testID}
      {...props}
    >
      <IconSymbol className="text-accent-foreground" name="plus" size={TAB_BAR_ACTION_ICON_SIZE} />
    </Pressable>
  );
}
