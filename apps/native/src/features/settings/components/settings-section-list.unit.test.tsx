/// <reference types="jest" />
import type { PropsWithChildren, ReactElement } from "react";
import { router } from "expo-router";
import { Pressable as mockPressable, Text as mockText, View as mockView } from "react-native";

import { renderWithProviders, screen, userEvent } from "@/test/test-utils";

import { SettingsSectionList } from "./settings-section-list";

const mockReactNative = {
  Pressable: mockPressable,
  Text: mockText,
  View: mockView,
};

function mockPrimitiveText({ children, ...props }: PropsWithChildren<Record<string, unknown>>) {
  return <mockReactNative.Text {...props}>{children}</mockReactNative.Text>;
}

function mockListGroupRoot({ children, ...props }: PropsWithChildren<Record<string, unknown>>) {
  return <mockReactNative.View {...props}>{children}</mockReactNative.View>;
}

function mockListGroupItem({
  children,
  onPress,
  ...props
}: PropsWithChildren<Record<string, unknown> & { onPress?: () => void }>) {
  return (
    <mockReactNative.Pressable onPress={onPress} {...props}>
      {children}
    </mockReactNative.Pressable>
  );
}

function mockPressableFeedbackRoot({
  children,
  onPress,
  ...props
}: PropsWithChildren<Record<string, unknown> & { onPress?: () => void }>) {
  return (
    <mockReactNative.Pressable onPress={onPress} {...props}>
      {children}
    </mockReactNative.Pressable>
  );
}

mockPressableFeedbackRoot.Ripple = function MockPressableFeedbackRipple() {
  return null;
};

function mockSwitch() {
  return null;
}

function mockListGroupPrefix({ children, ...props }: PropsWithChildren<Record<string, unknown>>) {
  return <mockReactNative.View {...props}>{children}</mockReactNative.View>;
}

function mockListGroupTitle({ children, ...props }: PropsWithChildren<Record<string, unknown>>) {
  return <mockReactNative.Text {...props}>{children}</mockReactNative.Text>;
}

type MockCompoundComponent = ((
  props: PropsWithChildren<Record<string, unknown>>,
) => ReactElement) & {
  Item?: typeof mockListGroupItem;
  ItemPrefix?: typeof mockListGroupPrefix;
  ItemContent?: typeof mockListGroupRoot;
  ItemTitle?: typeof mockListGroupTitle;
  ItemSuffix?: typeof mockListGroupPrefix;
};

jest.mock("expo-router", () => ({
  router: {
    push: jest.fn(),
  },
}));

jest.mock("@/components/primitives", () => {
  return {
    HStack: mockListGroupRoot,
    IconSymbol: () => null,
    Text: mockPrimitiveText,
    View: mockListGroupRoot,
    VStack: mockListGroupRoot,
  };
});

jest.mock("heroui-native", () => {
  const mockListGroup = mockListGroupRoot as MockCompoundComponent;

  mockListGroup.Item = mockListGroupItem;
  mockListGroup.ItemPrefix = mockListGroupPrefix;
  mockListGroup.ItemContent = mockListGroupRoot;
  mockListGroup.ItemTitle = mockListGroupTitle;
  mockListGroup.ItemSuffix = mockListGroupPrefix;

  return {
    ListGroup: mockListGroup,
    PressableFeedback: mockPressableFeedbackRoot,
    Switch: mockSwitch,
    useThemeColor: () => ["#000000", "#666666"],
  };
});

describe("SettingsSectionList", () => {
  it("navigates to categories management from the data section", async () => {
    const user = userEvent.setup();

    renderWithProviders(<SettingsSectionList />);

    await user.press(screen.getByText("Manage categories"));

    expect(router.push).toHaveBeenCalledWith("/settings/categories");
  });
});
