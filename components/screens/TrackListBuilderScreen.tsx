import { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  Platform,
  useWindowDimensions,
} from "react-native";
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
            <CardComponent card={card} wrapClass="csm" onClick={onOpenCard} />
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
          <Text style={styles.tileAddBtnTextPrimary}>+ Add to track list</Text>
        </Pressable>
      ) : (
        <View style={[styles.tileAddBtn, styles.tileAddBtnDisabled]}>
          <Text style={styles.tileAddBtnTextDisabled}>Track list full</Text>
        </View>
      )}
    </View>
  );
}

export default function TrackListBuilderScreen() {
  const { state, dispatch, showToast, advanceMission } = useGame();
  const { width: winW } = useWindowDimensions();
  const cardM = useCardSizeMultiplier();
  const { collection, trackList, decks } = state;
  const [filter, setFilter] = useState<string>("All");

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

  function toggleTrackList(id: number) {
    if (trackList.includes(id)) {
      dispatch({ type: "REMOVE_FROM_TRACK_LIST", id });
      showToast("Card removed from track list");
    } else if (trackList.length >= 10) {
      showToast("Track list full! Max 10 cards.", "err");
    } else {
      dispatch({ type: "ADD_TO_TRACK_LIST", id });
      showToast("Card added to track list", "ok");
      advanceMission(2, 1);
    }
  }

  return (
    <View style={styles.screen}>
      <View style={styles.sidebar}>
        <View style={styles.powerBox}>
          <Text style={styles.powerLbl}>Total Power</Text>
          <Text style={styles.powerNum}>{totalPower}</Text>
          <Text style={styles.powerSub}>{trackList.length} / 10 cards</Text>
        </View>
        <Text style={styles.trackListTitle}>Your track list</Text>
        <ScrollView style={styles.slots}>
          {Array.from({ length: 10 }, (_, i) => {
            const id = trackList[i];
            const card = id ? CARDS.find((c) => c.id === id) : null;
            return card ? (
              <View key={i} style={styles.slotFilled}>
                <Text style={styles.slotNum}>{i + 1}</Text>
                <View style={styles.slotInfo}>
                  <Text style={styles.slotName} numberOfLines={1}>
                    {card.title}
                  </Text>
                  <Text style={styles.slotGenre}>{card.genre}</Text>
                </View>
                <Text style={styles.slotPower}>{card.power}</Text>
                <Pressable
                  onPress={() => toggleTrackList(id)}
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
          style={styles.btnAddList}
          onPress={() => {
            if (trackList.length === 0) {
              showToast("Add at least one card to your list first.", "err");
              return;
            }
            const nextN = decks.length + 1;
            dispatch({ type: "ADD_TRACK_LIST" });
            showToast(`Track list ${nextN} added to your arena decks ✓`, "ok");
          }}
        >
          <Text style={styles.btnAddListText}>+ Add track list</Text>
        </Pressable>
        <Pressable
          style={styles.btnSave}
          onPress={() =>
            showToast(`Track list saved (${trackList.length} cards) ✓`, "ok")
          }
        >
          <Text style={styles.btnSaveText}>Save track list</Text>
        </Pressable>
      </View>

      <View style={styles.main}>
        <View style={styles.header}>
          <Text style={styles.title}>Track list</Text>
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
                  onToggleTrackList={() => toggleTrackList(card.id)}
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
  btnAddList: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: colors.gold,
    borderRadius: 3,
    paddingVertical: 10,
    alignItems: "center",
  },
  btnAddListText: {
    fontFamily: fonts.cinzelBold,
    fontSize: fs(9),
    letterSpacing: 1.5,
    color: colors.gold,
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
  header: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    fontFamily: fonts.cinzelBold,
    fontSize: fs(16),
    letterSpacing: 2,
    color: colors.white,
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
