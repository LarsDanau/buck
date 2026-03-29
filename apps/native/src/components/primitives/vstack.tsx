import { View } from "./view";
import type { ViewProps } from "./view";
import { cn } from "heroui-native";
import type { VariantProps } from "tailwind-variants";
import { tv } from "tailwind-variants";

const vStackStyles = tv({
  base: "flex-col",
  variants: {
    gap: {
      "1": "gap-1",
      "2": "gap-2",
      "3": "gap-3",
      "4": "gap-4",
      "5": "gap-5",
      "6": "gap-6",
      "7": "gap-7",
      "8": "gap-8",
      "9": "gap-9",
      "10": "gap-10",
    },
    reversed: {
      true: "flex-col-reverse",
    },
  },
});

type VStackVariantProps = VariantProps<typeof vStackStyles>;

interface VStackProps extends VStackVariantProps, ViewProps {
  className?: string;
}

/**
 * Renders a vertical stack with optional reversed direction and gap spacing.
 *
 * @param props Stack props, spacing, and children.
 * @returns A column-oriented layout primitive.
 */
export function VStack({ gap, reversed, className, children, ...props }: VStackProps) {
  return (
    <View
      className={cn(
        vStackStyles({
          gap: gap ? `${gap}` : undefined,
          reversed,
        }),
        className,
      )}
      {...props}
    >
      {children}
    </View>
  );
}
