import { Pressable, View } from "react-native";
import type { PressableProps } from "react-native";
import type { TabTriggerSlotProps } from "expo-router/ui";
import { IconSymbol, iconSizes } from "@/src/components/primitives/symbol";

const TAB_ICON_SIZE = iconSizes.xl;

interface TabBarButtonProps extends TabTriggerSlotProps {
  accessibilityLabel: string;
  icon: React.ComponentProps<typeof IconSymbol>["name"];
  testID: string;
}

// Extend the hit target without changing the visual icon size.
const pressableHitslop: PressableProps["hitSlop"] = {
  top: 16,
  bottom: 16,
  left: 20,
  right: 20,
};

/**
 * Renders an icon-only tab trigger that reflects the current focus state.
 *
 * @param props Tab trigger props, icon name, and accessibility labels.
 * @returns Pressable tab bar button for router tabs.
 */
export function TabBarButton({
  accessibilityLabel,
  icon,
  isFocused,
  testID,
  ...props
}: TabBarButtonProps) {
  return (
    <Pressable
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="tab"
      testID={testID}
      hitSlop={pressableHitslop}
      {...props}
    >
      <View className="items-center justify-center">
        <IconSymbol
          className={isFocused ? "text-accent-foreground" : "text-muted"}
          name={icon}
          size={TAB_ICON_SIZE}
        />
      </View>
    </Pressable>
  );
}
