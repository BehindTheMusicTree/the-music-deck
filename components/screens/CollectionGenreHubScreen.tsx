import { View, Text, ScrollView, Pressable, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import {
  COLLECTION_GENRE_HUB,
  type CollectionHubCell,
} from "@/lib/data/collection-hub";
import { GENRE_CFG } from "@/lib/data/genres";
import { colors, fonts, fs } from "@/lib/tokens";

export default function CollectionGenreHubScreen() {
  const router = useRouter();

  function go(cell: CollectionHubCell) {
    router.push(`/collection/${cell.genre}` as const);
  }

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.title}>Collection</Text>
        <Text style={styles.sub}>Choose a genre</Text>
      </View>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {COLLECTION_GENRE_HUB.map((row, rowIdx) => (
          <View key={rowIdx} style={styles.row}>
            {row.map((cell) => {
              const cfg = GENRE_CFG[cell.genre];
              return (
                <Pressable
                  key={cell.genre}
                  style={styles.cellOuter}
                  onPress={() => go(cell)}
                >
                  <LinearGradient
                    colors={[cfg.bg0, cfg.bg1]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.cell}
                  >
                    <Text style={styles.sym}>{cfg.sym}</Text>
                    <Text
                      style={[styles.label, { color: cfg.accent }]}
                      numberOfLines={2}
                    >
                      {cell.label}
                    </Text>
                  </LinearGradient>
                </Pressable>
              );
            })}
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const GAP = 12;

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  header: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 16,
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
    fontSize: fs(14),
    color: colors.muted,
  },
  scroll: {
    padding: 20,
    paddingBottom: 32,
    gap: GAP,
  },
  row: {
    flexDirection: "row",
    gap: GAP,
  },
  cellOuter: {
    flex: 1,
    minWidth: 0,
    aspectRatio: 1,
    borderRadius: 6,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: colors.border,
  },
  cell: {
    flex: 1,
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  sym: {
    fontSize: fs(28),
    lineHeight: fs(32),
  },
  label: {
    fontFamily: fonts.cinzelBold,
    fontSize: fs(10),
    letterSpacing: 1,
    textAlign: "center",
    textTransform: "uppercase",
  },
});
