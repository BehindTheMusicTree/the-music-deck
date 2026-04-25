import { View, Text, ScrollView, Pressable, StyleSheet, Platform, useWindowDimensions } from "react-native";
import { useRouter } from "expo-router";
import { useGame } from "@/lib/game-state";
import { CARDS } from "@/lib/data/cards";
import { colors, fonts, fs } from "@/lib/tokens";

const WEB_MAX_CONTENT_W = 1024;
const H_PAD = 20;

function deckPower(cardIds: number[]) {
  return cardIds.reduce((sum, id) => {
    const c = CARDS.find((x) => x.id === id);
    return sum + (c?.power ?? 0);
  }, 0);
}

export default function TrackListsScreen() {
  const { state, dispatch, showToast } = useGame();
  const { decks } = state;
  const router = useRouter();
  const { width: winW } = useWindowDimensions();
  const layoutW = Platform.OS === "web" ? Math.min(winW, WEB_MAX_CONTENT_W) : winW;
  const innerW = Math.max(280, layoutW - H_PAD * 2);

  function onAdd() {
    dispatch({ type: "ADD_DECK" });
    const nextN = decks.length + 1;
    showToast(`Track list ${nextN} created`, "ok");
  }

  function onRemove(deckId: string) {
    if (decks.length <= 1) {
      showToast("You need at least one track list.", "err");
      return;
    }
    dispatch({ type: "REMOVE_DECK", deckId });
    showToast("Track list removed", "ok");
  }

  return (
    <View style={styles.screen}>
      <View style={[styles.header, { paddingHorizontal: H_PAD }]}>
        <Text style={styles.title}>Track lists</Text>
        <Text style={styles.sub}>
          Add or remove lists, then open one to choose cards.
        </Text>
      </View>
      <Pressable style={[styles.addBtn, { width: innerW, alignSelf: "center" }]} onPress={onAdd}>
        <Text style={styles.addBtnText}>+ New track list</Text>
      </Pressable>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.list, { width: innerW, alignSelf: "center", paddingHorizontal: 0 }]}
        showsVerticalScrollIndicator={false}
      >
        {decks.map((d) => {
          const p = deckPower(d.cardIds);
          return (
            <View key={d.id} style={styles.card}>
              <Pressable
                style={styles.cardMain}
                onPress={() =>
                  router.push({ pathname: "/tracklist/[id]", params: { id: d.id } })
                }
              >
                <View style={styles.cardText}>
                  <Text style={styles.name} numberOfLines={1}>
                    {d.name}
                  </Text>
                  <Text style={styles.meta}>
                    {d.cardIds.length} / 60 cards · power {p}
                  </Text>
                </View>
                <Text style={styles.chev}>Open →</Text>
              </Pressable>
              {decks.length > 1 ? (
                <Pressable
                  style={styles.removeBtn}
                  onPress={() => onRemove(d.id)}
                  hitSlop={8}
                >
                  <Text style={styles.removeText}>Remove</Text>
                </Pressable>
              ) : null}
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  header: {
    paddingTop: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    gap: 6,
  },
  title: {
    fontFamily: fonts.cinzelBold,
    fontSize: fs(16),
    letterSpacing: 2,
    color: colors.white,
  },
  sub: {
    fontFamily: fonts.cormorantItalic,
    fontSize: fs(12),
    color: colors.muted,
    lineHeight: fs(18),
  },
  addBtn: {
    marginTop: 16,
    marginBottom: 8,
    paddingVertical: 12,
    backgroundColor: colors.gold,
    borderRadius: 3,
    alignItems: "center",
  },
  addBtnText: {
    fontFamily: fonts.cinzelBold,
    fontSize: fs(10),
    letterSpacing: 2,
    color: "#0a0600",
  },
  scroll: { flex: 1 },
  list: { paddingTop: 8, paddingBottom: 32, gap: 10 },
  card: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 4,
    overflow: "hidden",
  },
  cardMain: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 14,
    gap: 12,
  },
  cardText: { flex: 1, gap: 4 },
  name: {
    fontFamily: fonts.cinzelBold,
    fontSize: fs(12),
    color: colors.white,
    letterSpacing: 1,
  },
  meta: {
    fontFamily: fonts.spaceMono,
    fontSize: fs(7),
    color: colors.muted,
    letterSpacing: 0.5,
  },
  chev: {
    fontFamily: fonts.spaceMono,
    fontSize: fs(7),
    color: colors.gold,
  },
  removeBtn: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingVertical: 8,
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.2)",
  },
  removeText: {
    fontFamily: fonts.cinzelBold,
    fontSize: fs(8),
    letterSpacing: 1,
    color: colors.muted,
  },
});
