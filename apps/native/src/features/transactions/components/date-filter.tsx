import { Button, useThemeColor } from "heroui-native";
import { useTranslation } from "react-i18next";

import { HStack, iconSizes, IconSymbol, Text, View } from "@/components/primitives";

/**
 * Controlled props for the transactions date filter.
 */
export interface DateFilterProps {
  readonly label: string;
  readonly onPrevious: () => void;
  readonly onNext: () => void;
}

/**
 * Renders a locale-aware date filter with previous and next period navigation.
 *
 * @param props Visible label and previous or next period navigation callbacks.
 * @returns Rounded transactions date filter control.
 */
export function DateFilter({ label, onPrevious, onNext }: DateFilterProps) {
  const { t } = useTranslation("transactions");
  const [foreground] = useThemeColor(["foreground"]);

  return (
    <HStack className="items-center">
      <Button
        accessibilityLabel={t(($) => $.filters.previousPeriod)}
        isIconOnly
        onPress={onPrevious}
        variant="ghost"
      >
        <IconSymbol name="chevron.left" tintColor={foreground} size={iconSizes.md} />
      </Button>

      <View className="min-w-0 flex-1 items-center px-3">
        <Text align="center" numberOfLines={1} size="sm" weight="medium">
          {label}
        </Text>
      </View>

      <Button
        accessibilityLabel={t(($) => $.filters.nextPeriod)}
        isIconOnly
        onPress={onNext}
        variant="ghost"
      >
        <IconSymbol name="chevron.right" tintColor={foreground} size={iconSizes.md} />
      </Button>
    </HStack>
  );
}
