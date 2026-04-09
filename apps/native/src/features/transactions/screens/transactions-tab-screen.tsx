import { Button, useThemeColor } from "heroui-native";
import { useTranslation } from "react-i18next";

import { PageTitle } from "@/components/composites/page-title";
import { HStack, IconSymbol, View, VStack } from "@/components/primitives";
import { ScrollView } from "@/components/primitives/scroll-view";

import { DateFilter } from "../components/date-filter";
import { PeriodSegmentedControl } from "../components/period-segmented-control";
import {
  TransactionsFiltersProvider,
  useTransactionsFilters,
} from "../contexts/transactions-filters-context";

/**
 * Transactions tab content bound to shared transactions filter context.
 *
 * @returns Scrollable transactions tab content.
 */
function TransactionsTabScreenContent() {
  const { t } = useTranslation("transactions");
  const [foreground] = useThemeColor(["foreground"]);
  const { goToNext, goToPrevious, label, period, setPeriod } = useTransactionsFilters();

  return (
    <View className="flex-1 px-8 pt-safe-offset-2" testID="transactions-tab-screen">
      <VStack className="flex-1" gap="6">
        {/* Navigation bar & Title */}
        <VStack gap="2">
          <HStack className="flex-row justify-between">
            <Button isIconOnly variant="ghost" className="size-9">
              <IconSymbol name="magnifyingglass" tintColor={foreground} />
            </Button>
            <Button isIconOnly variant="ghost" className="size-9">
              <IconSymbol name="line.3.horizontal.decrease" tintColor={foreground} />
            </Button>
          </HStack>
          <PageTitle>{t(($) => $.overview.title)}</PageTitle>
        </VStack>

        <ScrollView className="flex-1" contentContainerClassName="pb-safe-offset-2">
          <VStack gap="3">
            <PeriodSegmentedControl value={period} onValueChange={setPeriod} />
            <DateFilter label={label} onNext={goToNext} onPrevious={goToPrevious} />
          </VStack>
        </ScrollView>
      </VStack>
    </View>
  );
}

/**
 * Transactions overview screen with shared period and date filter controls.
 *
 * @returns Transactions tab screen wrapped in the transactions filters provider.
 */
export function TransactionsTabScreen() {
  return (
    <TransactionsFiltersProvider initialPeriod="month">
      <TransactionsTabScreenContent />
    </TransactionsFiltersProvider>
  );
}
