import { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Pressable,
  StyleSheet,
  Platform,
  useWindowDimensions,
} from "react-native";
import { useRouter } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import { useGame } from "@/lib/game-state";
import { CARDS, type Card } from "@/lib/data/cards";
import { GENRES_ALL } from "@/lib/data/genres";
import { useCardSizeMultiplier } from "@/lib/card-layout";
import CardComponent from "@/components/Card";
import { colors, fonts, fs } from "@/lib/tokens";

/** Match `screensWeb.maxWidth` in `app/_layout.tsx`. */
const WEB_MAX_CONTENT_W = 1024;
const SIDEBAR_W = 200;
const MAIN_H_PAD = 20;
const GRID_GAP = 10;
const CARD_SM_BASE_W = 149;
const CARD_SM_BASE_H = 220;
const TILE_ADD_ROW_H = 36;

function chunkRows<T>(items: T[], rowSize: number): T[][] {
  const rows: T[][] = [];
  for (let i = 0; i < items.length; i += rowSize) {
    rows.push(items.slice(i, i + rowSize));
  }
  return rows;
}

function TrackListGridTile({
  card,
  onList,
  colW,
  tileH,
  cardSmW,
  cardSmH,
  tileScale,
  onOpenCard,
  onToggleTrackList,
  listFull,
}: {
  card: Card;
  onList: boolean;
  colW: number;
  tileH: number;
  cardSmW: number;
  cardSmH: number;
  tileScale: number;
  onOpenCard: () => void;
  onToggleTrackList: () => void;
  listFull: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  const muted = !onList && !hovered;
  const webCellMouse =
    Platform.OS === "web"
      ? {
          onMouseEnter: () => setHovered(true),
          onMouseLeave: () => setHovered(false),
        }
      : null;

  const canAdd = !listFull || onList;
  return (
    <View
      style={[
        styles.gridCell,
        { width: colW, minHeight: tileH + TILE_ADD_ROW_H },
      ]}
      {...(webCellMouse ?? {})}
    >
      <View style={[styles.tileSlot, { height: tileH }]}>
        <View
          style={[
            styles.tileInner,
            {
              width: cardSmW,
              height: cardSmH,
              left: (colW - cardSmW * tileScale) / 2,
              transform: [{ scale: tileScale }],
              transformOrigin: "top left" as any,
            },
          ]}
        >
          <View style={muted ? styles.cardMuted : undefined}>
            <CardComponent
              card={card}
              wrapClass="csm"
              onClick={onOpenCard}
            />
          </View>
        </View>
      </View>
      {onList ? (
        <Pressable
          onPress={onToggleTrackList}
          style={[styles.tileAddBtn, styles.tileAddBtnOnList]}
        >
          <Text style={styles.tileAddBtnTextOnList}>Remove from list</Text>
        </Pressable>
      ) : canAdd ? (
        <Pressable
          onPress={onToggleTrackList}
          style={[styles.tileAddBtn, styles.tileAddBtnPrimary]}
        >
          <Text style={styles.tileAddBtnTextPrimary}>+ Add to list</Text>
        </Pressable>
      ) : (
        <View style={[styles.tileAddBtn, styles.tileAddBtnDisabled]}>
          <Text style={styles.tileAddBtnTextDisabled}>List full</Text>
        </View>
      )}
    </View>
  );
}

type Props = { deckId: string };

export default function TrackListBuilderScreen({ deckId }: Props) {
  const router = useRouter();
  const { state, dispatch, showToast, advanceMission } = useGame();
  const { width: winW } = useWindowDimensions();
  const cardM = useCardSizeMultiplier();
  const { collection, decks } = state;
  const deck = decks.find((d) => d.id === deckId);
  const trackList = deck?.cardIds ?? [];
  const [filter, setFilter] = useState<string>("All");
  const [renaming, setRenaming] = useState(false);
  const [nameDraft, setNameDraft] = useState("");

  useEffect(() => {
    if (!deck) return;
    setNameDraft(deck.name);
    setRenaming(false);
  }, [deckId, deck?.name]);

  useFocusEffect(
    useCallback(() => {
      dispatch({ type: "SET_ACTIVE_DECK", deckId });
    }, [dispatch, deckId]),
  );

  const layoutW =
    Platform.OS === "web" ? Math.min(winW, WEB_MAX_CONTENT_W) : winW;
  const mainInner = Math.max(220, layoutW - SIDEBAR_W - MAIN_H_PAD * 2);
  const colW = Math.max(72, (mainInner - GRID_GAP * 2) / 3);
  const cardSmW = CARD_SM_BASE_W * cardM;
  const cardSmH = CARD_SM_BASE_H * cardM;
  const tileScale = Math.min(1, colW / cardSmW);
  const tileH = cardSmH * tileScale;

  const totalPower = trackList.reduce((sum, id) => {
    const c = CARDS.find((x) => x.id === id);
    return sum + (c?.power ?? 0);
  }, 0);

  const cards = collection
    .map((id) => CARDS.find((c) => c.id === id)!)
    .filter(Boolean)
    .filter((c) => filter === "All" || c.genre === filter);

  function toggleInList(cardId: number) {
    if (trackList.includes(cardId)) {
      dispatch({ type: "REMOVE_FROM_DECK", deckId, cardId });
      showToast("Card removed from this list");
    } else if (trackList.length >= 10) {
      showToast("List full! Max 10 cards.", "err");
    } else {
      dispatch({ type: "ADD_TO_DECK", deckId, cardId });
      showToast("Card added to this list", "ok");
      advanceMission(2, 1);
    }
  }

  const displayName = deck?.name ?? "Track list";

  function startRename() {
    if (deck) setNameDraft(deck.name);
    setRenaming(true);
  }

  function commitRename() {
    if (!deck) return;
    const next = nameDraft.trim();
    if (!next) {
      showToast("Name cannot be empty", "err");
      return;
    }
    if (next === deck.name) {
      setRenaming(false);
      return;
    }
    dispatch({ type: "RENAME_DECK", deckId, name: next });
    showToast("List renamed", "ok");
    setRenaming(false);
  }

  function cancelRename() {
    if (deck) setNameDraft(deck.name);
    setRenaming(false);
  }

  return (
    <View style={styles.screen}>
      <View style={styles.sidebar}>
        <View style={styles.powerBox}>
          <Text style={styles.powerLbl}>Total Power</Text>
          <Text style={styles.powerNum}>{totalPower}</Text>
          <Text style={styles.powerSub}>{trackList.length} / 10 cards</Text>
        </View>
        <Text style={styles.trackListTitle}>This list</Text>
        <ScrollView style={styles.slots}>
          {Array.from({ length: 10 }, (_, i) => {
            const id = trackList[i];
            const c = id ? CARDS.find((c) => c.id === id) : null;
            return c ? (
              <View key={i} style={styles.slotFilled}>
                <Text style={styles.slotNum}>{i + 1}</Text>
                <View style={styles.slotInfo}>
                  <Text style={styles.slotName} numberOfLines={1}>
                    {c.title}
                  </Text>
                  <Text style={styles.slotGenre}>{c.genre}</Text>
                </View>
                <Text style={styles.slotPower}>{c.power}</Text>
                <Pressable
                  onPress={() => toggleInList(id)}
                  style={styles.slotRm}
                >
                  <Text style={styles.slotRmText}>✕</Text>
                </Pressable>
              </View>
            ) : (
              <View key={i} style={styles.slotEmpty}>
                <Text style={styles.slotNum}>{i + 1}</Text>
                <Text style={styles.slotEmptyText}>Empty</Text>
              </View>
            );
          })}
        </ScrollView>
        <Pressable
          style={styles.btnSave}
          onPress={() =>
            showToast(`${displayName} saved (${trackList.length} cards) ✓`, "ok")
          }
        >
          <Text style={styles.btnSaveText}>Save</Text>
        </Pressable>
      </View>

      <View style={styles.main}>
        <View style={styles.headerBar}>
          <Pressable
            onPress={() => router.back()}
            style={styles.backBtn}
            hitSlop={12}
          >
            <Text style={styles.backText}>← Back</Text>
          </Pressable>
          {renaming ? (
            <View style={styles.renameBlock}>
              <TextInput
                value={nameDraft}
                onChangeText={setNameDraft}
                maxLength={48}
                placeholder="Track list name"
                placeholderTextColor={colors.muted}
                style={styles.nameInput}
                autoFocus
                onSubmitEditing={commitRename}
                returnKeyType="done"
                selectTextOnFocus
              />
              <View style={styles.renameRow}>
                <Pressable
                  onPress={commitRename}
                  style={styles.renameBtnSave}
                >
                  <Text style={styles.renameBtnSaveText}>Save</Text>
                </Pressable>
                <Pressable onPress={cancelRename} style={styles.renameBtnCancel}>
                  <Text style={styles.renameBtnCancelText}>Cancel</Text>
                </Pressable>
              </View>
            </View>
          ) : (
            <View style={styles.titleRow}>
              {deck ? (
                <Pressable
                  onPress={startRename}
                  style={styles.renameIconBtn}
                  hitSlop={8}
                >
                  <Text style={styles.renameIcon}>✎</Text>
                </Pressable>
              ) : null}
              <Text style={styles.title} numberOfLines={2}>
                {displayName}
              </Text>
            </View>
          )}
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filters}
          contentContainerStyle={styles.filtersContent}
        >
          {GENRES_ALL.map((g) => (
            <Pressable
              key={g}
              style={[styles.pill, filter === g && styles.pillActive]}
              onPress={() => setFilter(g)}
            >
              <Text
                style={[styles.pillText, filter === g && styles.pillTextActive]}
              >
                {g}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
        <ScrollView
          contentContainerStyle={[
            styles.grid,
            { paddingHorizontal: MAIN_H_PAD, gap: GRID_GAP },
          ]}
          showsVerticalScrollIndicator={false}
        >
          {chunkRows(cards, 3).map((row, rowIdx) => (
            <View key={rowIdx} style={[styles.gridRow, { gap: GRID_GAP }]}>
              {row.map((card) => (
                <TrackListGridTile
                  key={card.id}
                  card={card}
                  onList={trackList.includes(card.id)}
                  colW={colW}
                  tileH={tileH}
                  cardSmW={cardSmW}
                  cardSmH={cardSmH}
                  tileScale={tileScale}
                  onOpenCard={() =>
                    dispatch({ type: "OPEN_MODAL", cardId: card.id })
                  }
                  onToggleTrackList={() => toggleInList(card.id)}
                  listFull={trackList.length >= 10}
                />
              ))}
              {row.length < 3
                ? Array.from({ length: 3 - row.length }).map((_, i) => (
                    <View
                      key={`pad-${rowIdx}-${i}`}
                      style={{
                        width: colW,
                        minHeight: tileH + TILE_ADD_ROW_H,
                      }}
                    />
                  ))
                : null}
            </View>
          ))}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg, flexDirection: "row" },
  sidebar: {
    width: 200,
    borderRightWidth: 1,
    borderRightColor: colors.border,
    padding: 16,
    gap: 12,
    backgroundColor: colors.surface,
  },
  powerBox: {
    backgroundColor: colors.card,
    borderRadius: 4,
    padding: 14,
    alignItems: "center",
    gap: 4,
    borderWidth: 1,
    borderColor: colors.border,
  },
  powerLbl: {
    fontFamily: fonts.spaceMono,
    fontSize: fs(8),
    letterSpacing: 1,
    color: colors.muted,
    textTransform: "uppercase",
  },
  powerNum: {
    fontFamily: fonts.cinzelBold,
    fontSize: fs(28),
    color: colors.gold,
  },
  powerSub: {
    fontFamily: fonts.spaceMono,
    fontSize: fs(8),
    color: colors.muted,
  },
  trackListTitle: {
    fontFamily: fonts.cinzelBold,
    fontSize: fs(11),
    letterSpacing: 2,
    color: colors.white,
    textTransform: "uppercase",
  },
  slots: { flex: 1 },
  slotFilled: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    gap: 6,
  },
  slotEmpty: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    gap: 6,
    opacity: 0.35,
  },
  slotNum: {
    fontFamily: fonts.spaceMono,
    fontSize: fs(8),
    color: colors.muted,
    width: 16,
  },
  slotInfo: { flex: 1, gap: 2 },
  slotName: {
    fontFamily: fonts.cinzel,
    fontSize: fs(9),
    color: colors.white,
    letterSpacing: 0.5,
  },
  slotGenre: {
    fontFamily: fonts.spaceMono,
    fontSize: fs(7),
    color: colors.muted,
  },
  slotPower: {
    fontFamily: fonts.spaceMono,
    fontSize: fs(9),
    color: colors.gold,
  },
  slotRm: { width: 20, alignItems: "center" },
  slotRmText: {
    fontFamily: fonts.spaceMono,
    fontSize: fs(9),
    color: colors.muted,
  },
  slotEmptyText: {
    fontFamily: fonts.spaceMono,
    fontSize: fs(9),
    color: colors.muted,
    fontStyle: "italic",
  },
  btnSave: {
    backgroundColor: colors.gold,
    borderRadius: 3,
    paddingVertical: 10,
    alignItems: "center",
  },
  btnSaveText: {
    fontFamily: fonts.cinzelBold,
    fontSize: fs(10),
    letterSpacing: 2,
    color: "#0a0600",
  },
  main: { flex: 1, minWidth: 0 },
  headerBar: {
    paddingHorizontal: 12,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    gap: 8,
  },
  backBtn: { alignSelf: "flex-start" },
  backText: {
    fontFamily: fonts.spaceMono,
    fontSize: fs(8),
    letterSpacing: 0.5,
    color: colors.gold,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    width: "100%",
  },
  title: {
    flex: 1,
    minWidth: 120,
    fontFamily: fonts.cinzelBold,
    fontSize: fs(14),
    letterSpacing: 1.5,
    color: colors.white,
  },
  renameIconBtn: {
    width: 28,
    height: 28,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.card,
  },
  renameIcon: {
    fontSize: fs(12),
    color: colors.gold,
  },
  renameBlock: { width: "100%", gap: 8 },
  nameInput: {
    width: "100%",
    fontFamily: fonts.cinzelBold,
    fontSize: fs(12),
    letterSpacing: 0.5,
    color: colors.white,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 3,
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  renameRow: { flexDirection: "row", gap: 8 },
  renameBtnSave: {
    backgroundColor: colors.gold,
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 3,
  },
  renameBtnSaveText: {
    fontFamily: fonts.cinzelBold,
    fontSize: fs(8),
    letterSpacing: 1,
    color: "#0a0600",
  },
  renameBtnCancel: {
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 3,
  },
  renameBtnCancelText: {
    fontFamily: fonts.cinzelBold,
    fontSize: fs(8),
    letterSpacing: 1,
    color: colors.muted,
  },
  filters: {
    flexGrow: 0,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  filtersContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 6,
    flexDirection: "row",
  },
  pill: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  pillActive: { backgroundColor: colors.gold, borderColor: colors.gold },
  pillText: {
    fontFamily: fonts.spaceMono,
    fontSize: fs(8),
    letterSpacing: 1,
    color: colors.muted,
  },
  pillTextActive: { color: "#0a0600" },
  grid: {
    paddingTop: 16,
    paddingBottom: 28,
    alignItems: "stretch",
  },
  gridRow: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  gridCell: {
    alignItems: "stretch",
  },
  tileSlot: {
    width: "100%",
    overflow: "visible",
    alignItems: "center",
  },
  tileInner: {
    position: "absolute",
    top: 0,
  },
  cardMuted: { opacity: 0.5 },
  tileAddBtn: {
    marginTop: 4,
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 3,
    alignItems: "center",
    alignSelf: "center",
    maxWidth: "100%",
  },
  tileAddBtnPrimary: {
    backgroundColor: colors.gold,
  },
  tileAddBtnTextPrimary: {
    fontFamily: fonts.cinzelBold,
    fontSize: fs(7),
    letterSpacing: 1,
    color: "#0a0600",
  },
  tileAddBtnOnList: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: colors.gold,
  },
  tileAddBtnTextOnList: {
    fontFamily: fonts.cinzelBold,
    fontSize: fs(7),
    letterSpacing: 1,
    color: colors.gold,
  },
  tileAddBtnDisabled: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: colors.border,
    opacity: 0.5,
  },
  tileAddBtnTextDisabled: {
    fontFamily: fonts.spaceMono,
    fontSize: fs(7),
    letterSpacing: 0.5,
    color: colors.muted,
  },
});
