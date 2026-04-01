import { Text } from "@/components/primitives/text";
import { View } from "react-native";

export function AnalyticsTabScreen() {
  return (
    <View className="flex-1 py-safe-offset-5 px-8" testID="analytics-tab-screen">
      <Text>Analytics</Text>
    </View>
  );
}
