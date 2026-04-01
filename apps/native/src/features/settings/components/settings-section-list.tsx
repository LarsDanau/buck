import { HStack, IconSymbol, Text, View, VStack } from "@/components/primitives";
import { ListGroup, PressableFeedback, Switch, useThemeColor } from "heroui-native";
import { useMemo, useState } from "react";
import type { ComponentProps, ReactNode } from "react";

type SettingsIconName = ComponentProps<typeof IconSymbol>["name"];

/**
 * Renders the colored square icon used in each settings row.
 *
 * @param props Icon symbol name and exact background color from the design.
 * @returns Colored icon tile for a settings row prefix.
 */
function SettingsItemIcon({
  icon,
  backgroundColor,
}: {
  icon: SettingsIconName;
  backgroundColor: string;
}) {
  const iconContainerStyle = useMemo(() => ({ backgroundColor }), [backgroundColor]);
  const [foreground] = useThemeColor(["foreground"]);

  return (
    <View className="size-8 items-center justify-center rounded-lg" style={iconContainerStyle}>
      <IconSymbol name={icon} size={18} tintColor={foreground} />
    </View>
  );
}

/**
 * Shared chevron suffix used by navigational settings rows.
 *
 * @returns Theme-aware chevron icon for row suffixes.
 */
function SettingsChevron() {
  const [muted] = useThemeColor(["muted"]);

  return <IconSymbol name="chevron.right" size={16} tintColor={muted} />;
}

/**
 * Base wrapper around `ListGroup.Item` that keeps row layout consistent.
 *
 * @param props Row icon, title, background color, and optional suffix content.
 * @returns Shared settings row layout built on HeroUI `ListGroup.Item`.
 */
function SettingsRow({
  backgroundColor,
  icon,
  title,
  children,
}: {
  backgroundColor: string;
  icon: SettingsIconName;
  title: string;
  children?: ReactNode;
}) {
  return (
    <PressableFeedback animation={false}>
      <PressableFeedback.Scale>
        <ListGroup.Item className="px-4 py-2" disabled>
          <ListGroup.ItemPrefix>
            <SettingsItemIcon backgroundColor={backgroundColor} icon={icon} />
          </ListGroup.ItemPrefix>
          <ListGroup.ItemContent>
            <ListGroup.ItemTitle>{title}</ListGroup.ItemTitle>
          </ListGroup.ItemContent>
          <ListGroup.ItemSuffix>{children}</ListGroup.ItemSuffix>
        </ListGroup.Item>
      </PressableFeedback.Scale>
      <PressableFeedback.Ripple />
    </PressableFeedback>
  );
}

/**
 * Row variant with a muted trailing value and chevron.
 *
 * @param props Row icon, title, trailing value, and icon background color.
 * @returns Settings row with a value label in the suffix area.
 */
function SettingsValueRow({
  backgroundColor,
  icon,
  title,
  value,
}: {
  backgroundColor: string;
  icon: SettingsIconName;
  title: string;
  value: string;
}) {
  return (
    <SettingsRow backgroundColor={backgroundColor} icon={icon} title={title}>
      <HStack gap="2" className="items-center">
        <Text size="sm" tone="muted">
          {value}
        </Text>
        <SettingsChevron />
      </HStack>
    </SettingsRow>
  );
}

/**
 * Simple link-style row with only a chevron suffix.
 *
 * @param props Row icon, title, and icon background color.
 * @returns Navigational settings row with a chevron suffix.
 */
function SettingsLinkRow({
  backgroundColor,
  icon,
  title,
}: {
  backgroundColor: string;
  icon: SettingsIconName;
  title: string;
}) {
  return (
    <SettingsRow backgroundColor={backgroundColor} icon={icon} title={title}>
      <SettingsChevron />
    </SettingsRow>
  );
}

/**
 * Interactive row that owns its own switch state.
 *
 * @param props Row icon, title, background color, and initial switch state.
 * @returns Settings row with a locally controlled switch.
 */
function SettingsToggleRow({
  backgroundColor,
  icon,
  title,
  defaultSelected = false,
}: {
  backgroundColor: string;
  icon: SettingsIconName;
  title: string;
  defaultSelected?: boolean;
}) {
  const [isSelected, setIsSelected] = useState(defaultSelected);

  return (
    <SettingsRow backgroundColor={backgroundColor} icon={icon} title={title}>
      <HStack gap="2" className="items-center">
        <Switch isSelected={isSelected} onSelectedChange={setIsSelected} />
        <SettingsChevron />
      </HStack>
    </SettingsRow>
  );
}

/**
 * Titled group of related settings rendered inside a shared ListGroup shell.
 *
 * @param props Section title and row children.
 * @returns Labeled settings section wrapping grouped rows.
 */
function SettingsSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <VStack gap="2">
      <Text size="sm" tone="muted">
        {title}
      </Text>
      <ListGroup className="rounded-xl">{children}</ListGroup>
    </VStack>
  );
}

/**
 * Feature-related preferences from the design.
 *
 * @returns Features section with appearance, icon, auth, haptics, currency, and experimental rows.
 */
function FeaturesSection() {
  return (
    <SettingsSection title="Features">
      <SettingsValueRow
        backgroundColor="#FF8D53"
        icon="circle.lefthalf.filled"
        title="Appearance"
        value="Dark"
      />
      <SettingsValueRow backgroundColor="#E68CFF" icon="app.grid" title="App Icon" value="Light" />
      <SettingsToggleRow
        backgroundColor="#34C759"
        defaultSelected
        icon="faceid"
        title="Authentication"
      />

      <SettingsValueRow
        backgroundColor="#51C8FF"
        icon="hand.rays.fill"
        title="Haptics"
        value="Moderate"
      />

      <SettingsValueRow backgroundColor="#7CD094" icon="eurosign" title="Currency" value="EUR" />

      <SettingsLinkRow backgroundColor="#787CFF" icon="flag.fill" title="Experimental" />
    </SettingsSection>
  );
}

/**
 * Data import, export, and destructive actions.
 *
 * @returns Data section with import/export and clear-data rows.
 */
function DataSection() {
  return (
    <SettingsSection title="Data">
      <SettingsLinkRow
        backgroundColor="#537BFF"
        icon="square.and.arrow.up.fill"
        title="Export data"
      />
      <SettingsLinkRow
        backgroundColor="#FFA953"
        icon="square.and.arrow.down.fill"
        title="Import data"
      />

      <SettingsLinkRow
        backgroundColor="#FF5353"
        icon="document.on.trash.fill"
        title="Clear all data"
      />
    </SettingsSection>
  );
}

/**
 * Miscellaneous app actions and feedback shortcuts.
 *
 * @returns Other section with rating, feedback, support, and sharing rows.
 */
function OtherSection() {
  return (
    <SettingsSection title="Other">
      <SettingsLinkRow backgroundColor="#F7C43A" icon="star.square.fill" title="Rate Buck" />

      <SettingsLinkRow
        backgroundColor="#537BFF"
        icon="square.and.arrow.up.fill"
        title="Feature Request"
      />
      <SettingsLinkRow backgroundColor="#FF8282" icon="ladybug.fill" title="Report a bug" />
      <SettingsLinkRow backgroundColor="#FF5353" icon="heart.fill" title="Support the app" />
      <SettingsLinkRow backgroundColor="#8CD578" icon="sharedwithyou" title="Share with friends" />
    </SettingsSection>
  );
}

/**
 * Root list component for the settings tab.
 *
 * @returns Full grouped settings list for the settings tab content area.
 */
export function SettingsSectionList() {
  return (
    <VStack gap="8">
      <FeaturesSection />
      <DataSection />
      <OtherSection />
    </VStack>
  );
}
