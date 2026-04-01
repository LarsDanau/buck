import { Tabs, TabSlot, TabList, TabTrigger } from "expo-router/ui";
import { TabBarButton } from "@/src/features/navigation/tabs/components/tab-bar-button";
import { useTranslation } from "react-i18next";
import { TabBarAction } from "@/src/features/navigation/tabs/components/tab-action-button";

export default function TabLayout() {
  const { t } = useTranslation();

  return (
    <Tabs className="flex-1 bg-background">
      <TabSlot className="flex-1" />
      <TabList className="px-10 pt-4 pb-safe-offset-4">
        {/* Transactions tab */}
        <TabTrigger asChild href="/" name="transactions">
          <TabBarButton
            accessibilityLabel={t(($) => $.tabs.transactions.accessibilityLabel)}
            icon="receipt.fill"
            testID="transactions-tab-button"
          />
        </TabTrigger>

        {/* Analytics tab */}
        <TabTrigger asChild href="/analytics" name="analytics">
          <TabBarButton
            accessibilityLabel={t(($) => $.tabs.analytics.accessibilityLabel)}
            icon="chart.pie.fill"
            testID="analytics-tab-button"
          />
        </TabTrigger>

        {/* Add transaction button */}
        <TabBarAction />

        {/* Budgets */}
        <TabTrigger asChild href="/budgets" name="budgets">
          <TabBarButton
            accessibilityLabel={t(($) => $.tabs.budgets.accessibilityLabel)}
            icon="tray.2.fill"
            testID="budgets-tab-button"
          />
        </TabTrigger>

        {/* Settings */}
        <TabTrigger asChild href="/settings" name="settings">
          <TabBarButton
            accessibilityLabel={t(($) => $.tabs.settings.accessibilityLabel)}
            icon="switch.2"
            testID="settings-tab-button"
          />
        </TabTrigger>
      </TabList>
    </Tabs>
  );
}
