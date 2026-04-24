import {
  View,
  Text,
  ScrollView,
  Pressable,
  Image,
  StyleSheet,
  useWindowDimensions,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { useGame } from "@/lib/game-state";
import { CARDS } from "@/lib/data/cards";
import CardComponent from "@/components/Card";
import { colors, fonts, fs } from "@/lib/tokens";

const HERO_H_PAD = 24;
const ACTION_ROW_GAP = 16;
/** Must match `screensWeb.maxWidth` in `app/_layout.tsx` so hero CTAs size to the real column. */
const WEB_MAX_CONTENT_W = 1024;
const MAX_ACTION_ICON = 300;

export default function HomeScreen() {
  const { state, dispatch } = useGame();
  const router = useRouter();
  const { width: winW } = useWindowDimensions();
  const { collection, trackList } = state;
  const contentW =
    Platform.OS === "web" ? Math.min(winW, WEB_MAX_CONTENT_W) : winW;
  const colW =
    (contentW - HERO_H_PAD * 2 - ACTION_ROW_GAP * 2) / 3;
  const actionIconSize = Math.max(
    96,
    Math.min(MAX_ACTION_ICON, Math.floor(colW * 0.88)),
  );

  const picks: typeof CARDS = [];
  for (const rarity of ["Legendary", "Epic", "Rare", "Common"] as const) {
    if (picks.length >= 4) break;
    const c = collection
      .map((id) => CARDS.find((x) => x.id === id)!)
      .find((c) => c && c.rarity === rarity && !picks.includes(c));
    if (c) picks.push(c);
  }
  while (picks.length < 4 && picks.length < collection.length) {
    const c = CARDS.find(
      (x) => collection.includes(x.id) && !picks.includes(x),
    );
    if (c) picks.push(c);
    else break;
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <View style={styles.hero}>
        <Text style={styles.eyebrow}>TRADING CARD GAME · SEASON 1</Text>
        <View style={styles.titleRow}>
          <Text style={styles.titleThe}>THE{"\n"}</Text>
          <Text style={styles.title}>
            MUSIC{"\n"}
            <Text style={styles.titleGold}>TRACK LIST</Text>
          </Text>
        </View>
        <View style={styles.bar} />
        <View style={styles.actions}>
          <View style={[styles.actionRow, { gap: ACTION_ROW_GAP }]}>
            <Pressable
              style={styles.btnPrimary}
              onPress={() => router.push("/pack")}
            >
              <Image
                source={require("@/assets/ui/booster-pack-season1-v1.png")}
                style={{ width: actionIconSize, height: actionIconSize }}
                resizeMode="contain"
              />
              <Text style={styles.btnPrimaryText}>Open a Pack</Text>
            </Pressable>
            <Pressable
              style={styles.btnDigCrate}
              onPress={() => router.push("/digcrate")}
            >
              <Image
                source={require("@/assets/ui/dig-crate-chest-v1.png")}
                style={{ width: actionIconSize, height: actionIconSize }}
                resizeMode="contain"
              />
              <Text style={styles.btnDigCrateText}>Crate Dig</Text>
            </Pressable>
            <Pressable
              style={styles.btnCollection}
              onPress={() => router.push("/collection")}
            >
              <Image
                source={require("@/assets/ui/collection-wall-v1.png")}
                style={{ width: actionIconSize, height: actionIconSize }}
                resizeMode="cover"
              />
              <Text style={styles.btnCollectionText}>My Collection</Text>
            </Pressable>
          </View>
        </View>
      </View>

      <View style={styles.stats}>
        {[
          { num: collection.length, unit: "Cards" },
          { num: trackList.length, unit: "On track list" },
          { num: "S1", unit: "Season" },
        ].map(({ num, unit }) => (
          <View key={unit} style={styles.stat}>
            <Text style={styles.statNum}>{num}</Text>
            <Text style={styles.statUnit}>{unit}</Text>
          </View>
        ))}
      </View>

      {picks.length > 0 && (
        <View style={styles.preview}>
          <View style={styles.previewCards}>
            {picks.map((card) => (
              <CardComponent
                key={card.id}
                card={card}
                wrapClass="csm"
                onClick={() =>
                  dispatch({ type: "OPEN_MODAL", cardId: card.id })
                }
              />
            ))}
          </View>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  content: { paddingBottom: 32 },
  hero: {
    alignItems: "center",
    paddingTop: 48,
    paddingHorizontal: 24,
    gap: 16,
  },
  eyebrow: {
    fontFamily: fonts.spaceMono,
    fontSize: fs(9),
    letterSpacing: 2,
    color: colors.muted,
  },
  titleRow: { alignItems: "center" },
  titleThe: {
    fontFamily: fonts.cinzel,
    fontSize: fs(13),
    letterSpacing: 6,
    color: colors.muted,
  },
  title: {
    fontFamily: fonts.cinzelBold,
    fontSize: fs(32),
    letterSpacing: 6,
    color: colors.white,
    textAlign: "center",
  },
  titleGold: { color: colors.gold },
  bar: {
    width: 40,
    height: 2,
    backgroundColor: colors.gold,
    marginVertical: 4,
  },
  tagline: {
    fontFamily: fonts.cormorantItalic,
    fontSize: fs(16),
    color: colors.muted,
    textAlign: "center",
    lineHeight: 26,
  },
  actions: { gap: 14, width: "100%", alignItems: "center", marginTop: 8 },
  actionRow: {
    flexDirection: "row",
    alignSelf: "stretch",
    width: "100%",
    justifyContent: "center",
  },
  btnPrimary: {
    flex: 1,
    minWidth: 0,
    paddingVertical: Platform.OS === "web" ? 24 : 20,
    paddingHorizontal: 8,
    borderRadius: 3,
    alignItems: "center",
    gap: 14,
  },
  btnPrimaryText: {
    fontFamily: fonts.cinzelBold,
    fontSize: Platform.OS === "web" ? fs(20) : fs(16),
    letterSpacing: 2.5,
    color: colors.gold,
    textAlign: "center",
  },
  btnCollection: {
    flex: 1,
    minWidth: 0,
    paddingVertical: Platform.OS === "web" ? 24 : 20,
    paddingHorizontal: 8,
    borderRadius: 3,
    alignItems: "center",
    gap: 14,
  },
  btnCollectionText: {
    fontFamily: fonts.cinzelBold,
    fontSize: Platform.OS === "web" ? fs(20) : fs(16),
    letterSpacing: 2.5,
    color: colors.white,
    textAlign: "center",
  },
  btnDigCrate: {
    flex: 1,
    minWidth: 0,
    paddingVertical: Platform.OS === "web" ? 24 : 20,
    paddingHorizontal: 8,
    borderRadius: 3,
    alignItems: "center",
    gap: 14,
  },
  btnDigCrateText: {
    fontFamily: fonts.cinzelBold,
    fontSize: Platform.OS === "web" ? fs(20) : fs(16),
    letterSpacing: 2.5,
    color: colors.rust,
    textAlign: "center",
  },
  stats: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 32,
    paddingVertical: 32,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.border,
    marginHorizontal: 24,
    marginTop: 32,
  },
  stat: { alignItems: "center", gap: 4 },
  statNum: {
    fontFamily: fonts.cinzelBold,
    fontSize: fs(28),
    color: colors.gold,
  },
  statUnit: {
    fontFamily: fonts.spaceMono,
    fontSize: fs(8),
    letterSpacing: 1,
    color: colors.muted,
    textTransform: "uppercase",
  },
  preview: { marginTop: 24, paddingHorizontal: 24 },
  previewCards: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    justifyContent: "center",
  },
});
