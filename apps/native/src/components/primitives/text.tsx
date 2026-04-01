import type { ComponentProps } from "react";
import { cn } from "heroui-native";
import { Text as RNText } from "react-native";
import type { VariantProps } from "tailwind-variants";
import { tv } from "tailwind-variants";
import { withUniwind } from "uniwind";

const TextPrimitive = withUniwind(RNText);

const textVariants = tv({
  base: "text-foreground",
  variants: {
    size: {
      xs: "text-xs",
      sm: "text-sm",
      md: "text-base",
      lg: "text-lg",
      xl: "text-xl",
      "2xl": "text-2xl",
      "3xl": "text-3xl",
    },
    tone: {
      default: "text-foreground",
      muted: "text-muted",
    },
    weight: {
      regular: "font-regular",
      medium: "font-medium",
      semibold: "font-semibold",
    },
    align: {
      left: "text-left",
      center: "text-center",
      right: "text-right",
    },
  },
  defaultVariants: {
    variant: "md",
    tone: "default",
    weight: "regular",
    align: "left",
  },
});

type TextVariantProps = VariantProps<typeof textVariants>;

export interface TextProps extends ComponentProps<typeof TextPrimitive>, TextVariantProps {
  className?: string;
}

/**
 * Renders theme-aware text with shared typography variants.
 *
 * @param props Text content, typography variants, and native text props.
 * @returns Styled text primitive used across the app.
 */
export function Text({ size, tone, weight, align, className, children, ...props }: TextProps) {
  return (
    <TextPrimitive
      className={cn(textVariants({ size, tone, weight, align }), className)}
      {...props}
    >
      {children}
    </TextPrimitive>
  );
}
