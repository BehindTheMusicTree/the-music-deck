import { View, Text, ScrollView, Pressable, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useGame } from "@/lib/game-state";
import type { Genre } from "@/lib/data/cards";
import { CARDS } from "@/lib/data/cards";
import { collectionHubLabel } from "@/lib/data/collection-hub";
import CardComponent from "@/components/Card";
import { colors, fonts, fs } from "@/lib/tokens";

type Props = { genre: Genre };

export default function CollectionGenreScreen({ genre }: Props) {
  const { state, dispatch } = useGame();
  const router = useRouter();
  const { collection } = state;
  const label = collectionHubLabel(genre);

  const cards = collection
    .map((id) => CARDS.find((c) => c.id === id)!)
    .filter(Boolean)
    .filter((c) => c.genre === genre);

  function back() {
    if (router.canGoBack()) router.back();
    else router.replace("/collection");
  }

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Pressable
          onPress={back}
          style={styles.back}
          hitSlop={12}
        >
          <Text style={styles.backText}>←</Text>
        </Pressable>
        <View style={styles.headerTitles}>
          <Text style={styles.title} numberOfLines={1}>
            {label}
          </Text>
          <Text style={styles.count}>
            {cards.length} card{cards.length === 1 ? "" : "s"}
          </Text>
        </View>
        <View style={styles.backSpacer} />
      </View>
      {cards.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>
            No {label} cards yet.{"\n"}Open packs to grow this stack.
          </Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.grid}>
          {cards.map((card) => (
            <CardComponent
              key={card.id}
              card={card}
              onClick={() => dispatch({ type: "OPEN_MODAL", cardId: card.id })}
            />
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    gap: 8,
  },
  back: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  backSpacer: { width: 44 },
  backText: {
    fontFamily: fonts.spaceMono,
    fontSize: fs(20),
    color: colors.gold,
  },
  headerTitles: { flex: 1, minWidth: 0, gap: 4 },
  title: {
    fontFamily: fonts.cinzelBold,
    fontSize: fs(15),
    letterSpacing: 2,
    color: colors.white,
  },
  count: {
    fontFamily: fonts.spaceMono,
    fontSize: fs(8),
    color: colors.muted,
  },
  empty: { flex: 1, alignItems: "center", justifyContent: "center" },
  emptyText: {
    fontFamily: fonts.cormorantItalic,
    fontSize: fs(16),
    color: colors.muted,
    textAlign: "center",
    lineHeight: fs(26),
    paddingHorizontal: 32,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
    padding: 20,
    justifyContent: "center",
  },
});
