import { Stack } from "expo-router";
import { colors } from "@/lib/tokens";

export default function CollectionLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.bg },
      }}
    />
  );
}
