import { SymbolView } from "expo-symbols";
import type {
  SFSymbol,
  SymbolScale,
  SymbolType,
  SymbolViewProps,
  SymbolWeight,
} from "expo-symbols";
import { withUniwind } from "uniwind";

export const iconSizes = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 20,
  xl: 24,
  "2xl": 28,
  "3xl": 32,
} as const;

export type IconSizeName = keyof typeof iconSizes;
export type IconSize = (typeof iconSizes)[IconSizeName];

const SymbolPrimitive = withUniwind(SymbolView, {
  style: {
    fromClassName: "className",
  },
  tintColor: {
    fromClassName: "className",
    styleProperty: "color",
  },
});

export type SymbolProps = React.ComponentProps<typeof SymbolPrimitive>;

export type { SFSymbol, SymbolScale, SymbolType, SymbolViewProps, SymbolWeight };

/**
 * Uniwind-enabled SF Symbol primitive for app icons.
 */
export const IconSymbol = SymbolPrimitive;
