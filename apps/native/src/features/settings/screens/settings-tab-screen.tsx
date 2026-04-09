import { ScrollView, Text, View, VStack } from "@/components/primitives";
import Constants from "expo-constants";
import { LinkButton } from "heroui-native";
import { useTranslation } from "react-i18next";

import { PageSubtitle } from "@/components/composites/page-subtitle";
import { PageTitle } from "@/components/composites/page-title";

import { SettingsSectionList } from "../components/settings-section-list";

/**
 * Footer with app version and author attribution.
 *
 * @param props Current app version from Expo config.
 * @returns Footer block with version text and author attribution link.
 */
function SettingsFooter({ appVersion }: { appVersion?: string }) {
  return (
    <VStack gap="2">
      <Text align="center" size="xs" tone="muted">
        Version {appVersion}
      </Text>
      <View className="flex-row flex-wrap justify-center">
        <Text size="xs" tone="muted">
          Made by{" "}
        </Text>
        <LinkButton>
          <LinkButton.Label className="text-accent text-xs">Lars 🇧🇪 ❤</LinkButton.Label>
        </LinkButton>
      </View>
    </VStack>
  );
}

/**
 * Settings tab screen composed of a header, grouped settings, and a footer.
 *
 * @returns Scrollable settings tab screen content.
 */
export function SettingsTabScreen() {
  const { t } = useTranslation("settings");
  const appVersion = Constants.expoConfig?.version;

  return (
    <ScrollView
      className="flex-1 bg-background px-8"
      contentContainerClassName="py-safe-offset-2"
      testID="settings-tab-screen"
    >
      <VStack gap="8">
        <VStack gap="1">
          <PageTitle>{t(($) => $.overview.title)}</PageTitle>
          <PageSubtitle>App preferences and data tools.</PageSubtitle>
        </VStack>

        <SettingsSectionList />

        <SettingsFooter appVersion={appVersion} />
      </VStack>
    </ScrollView>
  );
}
