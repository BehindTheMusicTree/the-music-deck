import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  Image,
} from "react-native";
import { useRouter } from "expo-router";
import {
  COLLECTION_GENRE_HUB,
  type CollectionHubCell,
} from "@/lib/data/collection-hub";
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
        bounces={false}
      >
        <View style={styles.gridWrap}>
          <View style={styles.squareFrame}>
            <Image
              source={require("@/assets/ui/collection-genre-grid-v1.png")}
              style={styles.gridImage}
              resizeMode="cover"
            />
            <View style={styles.overlay} pointerEvents="box-none">
              {COLLECTION_GENRE_HUB.map((row, rowIdx) => (
                <View key={rowIdx} style={styles.overlayRow}>
                  {row.map((cell) => (
                    <Pressable
                      key={cell.genre}
                      style={styles.hitCell}
                      onPress={() => go(cell)}
                      accessibilityRole="button"
                      accessibilityLabel={cell.label}
                    />
                  ))}
                </View>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

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
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 32,
    alignItems: "stretch",
  },
  gridWrap: {
    width: "100%",
    alignItems: "center",
  },
  /** Square matches artwork (1024×1024); overlay rows/cells split it 3×3. */
  squareFrame: {
    width: "100%",
    maxWidth: 520,
    aspectRatio: 1,
    borderRadius: 4,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  gridImage: {
    ...StyleSheet.absoluteFill,
    width: "100%",
    height: "100%",
  },
  overlay: {
    ...StyleSheet.absoluteFill,
    flexDirection: "column",
  },
  overlayRow: {
    flex: 1,
    flexDirection: "row",
  },
  hitCell: {
    flex: 1,
  },
});
