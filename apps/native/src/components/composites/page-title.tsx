import { Text } from "../primitives";
import type { TextProps } from "../primitives";

export function PageTitle({ children }: TextProps) {
  return (
    <Text size="xl" weight="semibold">
      {children}
    </Text>
  );
}
