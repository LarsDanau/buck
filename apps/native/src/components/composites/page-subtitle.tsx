import { Text } from "../primitives";
import type { TextProps } from "../primitives";

export function PageSubtitle({ children }: TextProps) {
  return (
    <Text size="sm" tone="muted">
      {children}
    </Text>
  );
}
