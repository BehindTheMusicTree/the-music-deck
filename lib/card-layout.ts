import { Platform, useWindowDimensions } from "react-native";

/** Viewport min width (web) for 2× card scale — large enough to feel like desktop. */
export const CARD_DESKTOP_MIN_WIDTH = 900;

export function useCardSizeMultiplier(): number {
  const { width } = useWindowDimensions();
  if (Platform.OS !== "web") return 1;
  return width >= CARD_DESKTOP_MIN_WIDTH ? 2 : 1;
}
