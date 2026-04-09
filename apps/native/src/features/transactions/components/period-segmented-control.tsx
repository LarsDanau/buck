import { useCallback } from "react";
import { Tabs } from "heroui-native";
import { useTranslation } from "react-i18next";
import type { TransactionPeriod } from "../utils/transactions-filters";

import { isTransactionPeriod, transactionPeriods } from "../utils/transactions-filters";

interface PeriodSegmentedControlProps {
  readonly value: TransactionPeriod;
  readonly onValueChange: (value: TransactionPeriod) => void;
  readonly options?: readonly TransactionPeriod[];
}

/**
 * Segmented single-select control for switching the transactions date grouping.
 *
 * Uses HeroUI Tabs for the pill-style indicator while keeping the component
 * fully controlled by the parent screen state.
 */
export function PeriodSegmentedControl({
  value,
  onValueChange,
  options = transactionPeriods,
}: PeriodSegmentedControlProps) {
  const { t } = useTranslation("transactions");

  const handleValueChange = useCallback(
    (nextValue: string) => {
      if (isTransactionPeriod(nextValue)) {
        onValueChange(nextValue);
      }
    },
    [onValueChange],
  );

  return (
    <Tabs
      value={value}
      onValueChange={handleValueChange}
      variant="primary"
      className="flex-row justify-center"
    >
      <Tabs.List className="bg-surface">
        <Tabs.Indicator />
        {options.map((optionValue) => (
          <Tabs.Trigger key={optionValue} value={optionValue} className="rounded-full px-4 py-1">
            <Tabs.Label className="text-sm">{t(($) => $.filters.periods[optionValue])}</Tabs.Label>
          </Tabs.Trigger>
        ))}
      </Tabs.List>
    </Tabs>
  );
}
