import { cn } from "heroui-native";
import { useMemo } from "react";
import type { PropsWithChildren } from "react";
import { ScrollView, View } from "react-native";
import type { ScrollViewProps, ViewProps } from "react-native";
import Animated from "react-native-reanimated";
import type { AnimatedProps } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const AnimatedView = Animated.createAnimatedComponent(View);
// Let short screens still stretch to fill the viewport when scrolling is enabled.
const scrollViewContentContainerStyle = { flexGrow: 1 } as const;

type Props = AnimatedProps<ViewProps> & {
  className?: string;
  isScrollable?: boolean;
  scrollViewProps?: Omit<ScrollViewProps, "contentContainerStyle">;
};

/**
 * Wraps screen content in a safe-area aware container with optional scrolling.
 *
 * @param props Container styling, scroll behavior, and children.
 * @returns Animated screen wrapper for full-screen layouts.
 */
export function Container({
  children,
  className,
  isScrollable = true,
  scrollViewProps,
  ...props
}: PropsWithChildren<Props>) {
  const insets = useSafeAreaInsets();
  const containerStyle = useMemo(
    () => ({
      paddingBottom: insets.bottom,
    }),
    [insets.bottom],
  );

  return (
    <AnimatedView
      className={cn("flex-1 bg-background", className)}
      style={containerStyle}
      {...props}
    >
      {isScrollable ? (
        <ScrollView
          contentContainerStyle={scrollViewContentContainerStyle}
          keyboardShouldPersistTaps="handled"
          contentInsetAdjustmentBehavior="automatic"
          {...scrollViewProps}
        >
          {children}
        </ScrollView>
      ) : (
        <View className="flex-1">{children}</View>
      )}
    </AnimatedView>
  );
}
