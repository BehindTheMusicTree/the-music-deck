import { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  Modal,
  Animated,
  useWindowDimensions,
  Platform,
  Image,
  Switch,
} from "react-native";
import { useRouter } from "expo-router";
import { useGame } from "@/lib/game-state";
import type { Card, Genre } from "@/lib/data/cards";
import { CARDS } from "@/lib/data/cards";
import {
  albumSlotsForGenre,
  totalCardsInGenre,
} from "@/lib/data/collection-album-slots";
import { collectionHubLabel } from "@/lib/data/collection-hub";
import { useCardSizeMultiplier } from "@/lib/card-layout";
import CardComponent from "@/components/Card";
import { colors, fonts, fs } from "@/lib/tokens";

/** Match `screensWeb.maxWidth` in `app/_layout.tsx` / HomeScreen. */
const WEB_MAX_CONTENT_W = 1024;

type Props = { genre: Genre };

const GRID_H_PAD = 16;
const GRID_GAP = 10;
const CARD_SM_BASE_W = 149;
const CARD_SM_BASE_H = 220;

type AlbumEntry = { slot: number; card: Card | null; owned: boolean };

function chunkRows<T>(items: T[], rowSize: number): T[][] {
  const rows: T[][] = [];
  for (let i = 0; i < items.length; i += rowSize) {
    rows.push(items.slice(i, i + rowSize));
  }
  return rows;
}

function albumEntriesForGenre(
  genre: Genre,
  ownedIds: Set<number>,
): AlbumEntry[] {
  return albumSlotsForGenre(genre).map(({ slot, card }) => ({
    slot,
    card,
    owned: card != null && ownedIds.has(card.id),
  }));
}

export default function CollectionGenreScreen({ genre }: Props) {
  const { state, dispatch } = useGame();
  const router = useRouter();
  const { width: winW } = useWindowDimensions();
  const cardM = useCardSizeMultiplier();
  const { collection } = state;
  const label = collectionHubLabel(genre);

  const [onlyOwned, setOnlyOwned] = useState(true);
  const [focused, setFocused] = useState<Card | null>(null);
  const zoomScale = useRef(new Animated.Value(1)).current;
  const dimOpacity = useRef(new Animated.Value(0)).current;

  const ownedIds = new Set(collection);
  const cardsOwned = CARDS.filter(
    (c) => c.genre === genre && ownedIds.has(c.id),
  );
  const totalInGenre = totalCardsInGenre(genre);
  const ownedCount = cardsOwned.length;

  const layoutW =
    Platform.OS === "web" ? Math.min(winW, WEB_MAX_CONTENT_W) : winW;
  const innerW = layoutW - GRID_H_PAD * 2;
  const colW = Math.max(72, (innerW - GRID_GAP * 2) / 3);
  const cardSmW = CARD_SM_BASE_W * cardM;
  const cardSmH = CARD_SM_BASE_H * cardM;
  const tileScale = Math.min(1, colW / cardSmW);

  useEffect(() => {
    if (!focused) {
      zoomScale.setValue(0.7);
      dimOpacity.setValue(0);
      return;
    }
    zoomScale.setValue(0.7);
    dimOpacity.setValue(0);
    Animated.parallel([
      Animated.spring(zoomScale, {
        toValue: 1,
        useNativeDriver: true,
        friction: 8,
        tension: 70,
      }),
      Animated.timing(dimOpacity, {
        toValue: 0.9,
        duration: 240,
        useNativeDriver: true,
      }),
    ]).start();
  }, [focused?.id, zoomScale, dimOpacity]);

  function back() {
    if (router.canGoBack()) router.back();
    else router.replace("/collection");
  }

  function clearFocus() {
    setFocused(null);
  }

  function openCardModal(card: Card) {
    dispatch({ type: "OPEN_MODAL", cardId: card.id });
    clearFocus();
  }

  const tileH = cardSmH * tileScale;

  const showEmpty = onlyOwned && ownedCount === 0 && totalInGenre > 0;

  const albumRows = chunkRows(albumEntriesForGenre(genre, ownedIds), 3);

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Pressable onPress={back} style={styles.back} hitSlop={12}>
          <Text style={styles.backText}>←</Text>
        </Pressable>
        <View style={styles.headerTitles}>
          <Text style={styles.title} numberOfLines={1}>
            {label}
          </Text>
          <Text style={styles.count}>
            {onlyOwned
              ? `${ownedCount} card${ownedCount === 1 ? "" : "s"}`
              : `${ownedCount} / ${totalInGenre} collected`}
          </Text>
        </View>
        <View style={styles.backSpacer} />
      </View>

      <View style={styles.optionRow}>
        <Text style={styles.optionLabel}>Only cards I own</Text>
        <Switch
          value={onlyOwned}
          onValueChange={setOnlyOwned}
          trackColor={{ false: "#3a3848", true: "rgba(168,124,40,.45)" }}
          thumbColor={onlyOwned ? colors.gold : "#8a8894"}
          ios_backgroundColor="#3a3848"
        />
      </View>

      {showEmpty ? (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>
            No {label} cards yet.{"\n"}Open packs to grow this stack — or turn
            off “Only cards I own” to preview the full set.
          </Text>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={[
            styles.gridScroll,
            { paddingHorizontal: GRID_H_PAD },
          ]}
          showsVerticalScrollIndicator={false}
        >
          {onlyOwned
            ? chunkRows(cardsOwned, 3).map((row, rowIdx) => (
                <View key={rowIdx} style={[styles.row, { gap: GRID_GAP }]}>
                  {row.map((card) => (
                    <View
                      key={card.id}
                      style={[styles.cell, { width: colW, height: tileH }]}
                    >
                      <View
                        style={[
                          styles.tileInner,
                          {
                            width: cardSmW,
                            height: cardSmH,
                            left: (colW - cardSmW * tileScale) / 2,
                            transform: [{ scale: tileScale }],
                          },
                        ]}
                      >
                        <CardComponent
                          card={card}
                          wrapClass="csm"
                          onClick={() => setFocused(card)}
                        />
                      </View>
                    </View>
                  ))}
                  {row.length < 3
                    ? Array.from({ length: 3 - row.length }).map((_, i) => (
                        <View
                          key={`pad-${rowIdx}-${i}`}
                          style={{ width: colW, height: tileH }}
                        />
                      ))
                    : null}
                </View>
              ))
            : albumRows.map((row, rowIdx) => (
                <View key={rowIdx} style={[styles.row, { gap: GRID_GAP }]}>
                  {row.map((entry) => (
                    <View
                      key={entry.slot}
                      style={[styles.cell, { width: colW, height: tileH }]}
                    >
                      <View
                        style={[
                          styles.tileInner,
                          {
                            width: cardSmW,
                            height: cardSmH,
                            left: (colW - cardSmW * tileScale) / 2,
                            transform: [{ scale: tileScale }],
                          },
                        ]}
                      >
                        {entry.card && entry.owned ? (
                          <CardComponent
                            card={entry.card}
                            wrapClass="csm"
                            onClick={() => setFocused(entry.card!)}
                          />
                        ) : (
                          <View
                            style={[
                              styles.backShell,
                              styles.backShellUndiscovered,
                              {
                                width: cardSmW,
                                height: cardSmH,
                                borderRadius: 10 * cardM,
                              },
                            ]}
                          >
                            <View style={styles.backMutedStack}>
                              <Image
                                source={require("@/assets/ui/card-back-v1.png")}
                                style={[
                                  styles.backImage,
                                  styles.backImageTernie,
                                ]}
                                resizeMode="cover"
                              />
                              <View
                                style={styles.backTarnishWash}
                                pointerEvents="none"
                              />
                            </View>
                            <View style={styles.slotBadgeWrap}>
                              <Text style={styles.slotBadge}>{entry.slot}</Text>
                            </View>
                          </View>
                        )}
                      </View>
                    </View>
                  ))}
                  {row.length < 3
                    ? Array.from({ length: 3 - row.length }).map((_, i) => (
                        <View
                          key={`apad-${rowIdx}-${i}`}
                          style={{ width: colW, height: tileH }}
                        />
                      ))
                    : null}
                </View>
              ))}
        </ScrollView>
      )}

      <Modal
        visible={focused != null}
        transparent
        animationType="fade"
        onRequestClose={clearFocus}
      >
        <View style={styles.modalRoot}>
          <Pressable style={styles.modalBackdrop} onPress={clearFocus}>
            <Animated.View style={[styles.modalDim, { opacity: dimOpacity }]} />
          </Pressable>
          <View style={styles.modalCenter} pointerEvents="box-none">
            {focused ? (
              <Animated.View style={{ transform: [{ scale: zoomScale }] }}>
                <CardComponent
                  card={focused}
                  wrapClass="clg"
                  onClick={() => openCardModal(focused)}
                />
              </Animated.View>
            ) : null}
          </View>
        </View>
      </Modal>
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
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    gap: 10,
  },
  optionLabel: {
    fontFamily: fonts.cinzelBold,
    fontSize: fs(11),
    letterSpacing: 1.5,
    color: colors.white,
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
  gridScroll: {
    paddingTop: 16,
    paddingBottom: 32,
    gap: GRID_GAP,
  },
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "flex-start",
  },
  cell: {
    overflow: "hidden",
    alignItems: "center",
  },
  tileInner: {
    position: "absolute",
    top: 0,
  },
  backShell: {
    borderWidth: 1,
    borderColor: colors.border,
    overflow: "hidden",
    backgroundColor: colors.surface,
  },
  /** Undiscovered backs: duller frame + muted art. */
  backShellUndiscovered: {
    borderColor: "rgba(120,110,100,0.35)",
    backgroundColor: "rgba(12,10,8,0.9)",
  },
  backMutedStack: {
    ...StyleSheet.absoluteFill,
    overflow: "hidden",
  },
  backImage: {
    width: "100%",
    height: "100%",
  },
  backImageTernie: {
    opacity: 1,
  },
  backTarnishWash: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "rgba(34, 27, 21, 0.48)",
  },
  slotBadgeWrap: {
    position: "absolute",
    bottom: 6,
    left: 0,
    right: 0,
    alignItems: "center",
    zIndex: 2,
  },
  slotBadge: {
    fontFamily: fonts.spaceMono,
    fontSize: fs(8),
    letterSpacing: 1,
    color: "rgba(255,255,255,.55)",
    backgroundColor: "rgba(0,0,0,.45)",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 2,
    overflow: "hidden",
  },
  modalRoot: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFill,
  },
  modalDim: {
    flex: 1,
    backgroundColor: "#000",
  },
  modalCenter: {
    ...StyleSheet.absoluteFill,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
});
