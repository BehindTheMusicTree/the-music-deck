import { useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { useGame } from '@/lib/game-state';
import { CARDS } from '@/lib/data/cards';
import { GENRES_ALL } from '@/lib/data/genres';
import CardComponent from '@/components/Card';
import { colors, fonts, fs } from '@/lib/tokens';

export default function TrackListBuilderScreen() {
  const { state, dispatch, showToast, advanceMission } = useGame();
  const { collection, trackList } = state;
  const [filter, setFilter] = useState<string>('All');

  const totalPower = trackList.reduce((sum, id) => {
    const c = CARDS.find(x => x.id === id);
    return sum + (c?.power ?? 0);
  }, 0);

  const cards = collection
    .map(id => CARDS.find(c => c.id === id)!)
    .filter(Boolean)
    .filter(c => filter === 'All' || c.genre === filter);

  function toggleTrackList(id: number) {
    if (trackList.includes(id)) {
      dispatch({ type: 'REMOVE_FROM_TRACK_LIST', id });
      showToast('Card removed from track list');
    } else if (trackList.length >= 10) {
      showToast('Track list full! Max 10 cards.', 'err');
    } else {
      dispatch({ type: 'ADD_TO_TRACK_LIST', id });
      showToast('Card added to track list', 'ok');
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
            const card = id ? CARDS.find(c => c.id === id) : null;
            return card ? (
              <View key={i} style={styles.slotFilled}>
                <Text style={styles.slotNum}>{i + 1}</Text>
                <View style={styles.slotInfo}>
                  <Text style={styles.slotName} numberOfLines={1}>{card.title}</Text>
                  <Text style={styles.slotGenre}>{card.genre}</Text>
                </View>
                <Text style={styles.slotPower}>{card.power}</Text>
                <Pressable onPress={() => toggleTrackList(id)} style={styles.slotRm}>
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
        <Pressable style={styles.btnSave} onPress={() => showToast(`Track list saved (${trackList.length} cards) ✓`, 'ok')}>
          <Text style={styles.btnSaveText}>Save track list</Text>
        </Pressable>
      </View>

      <View style={styles.main}>
        <View style={styles.header}>
          <Text style={styles.title}>Track list</Text>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filters} contentContainerStyle={styles.filtersContent}>
          {GENRES_ALL.map(g => (
            <Pressable key={g} style={[styles.pill, filter === g && styles.pillActive]} onPress={() => setFilter(g)}>
              <Text style={[styles.pillText, filter === g && styles.pillTextActive]}>{g}</Text>
            </Pressable>
          ))}
        </ScrollView>
        <ScrollView contentContainerStyle={styles.grid}>
          {cards.map(card => {
            const onList = trackList.includes(card.id);
            return (
              <View key={card.id} style={[styles.cardWrap, onList && styles.cardOnList]}>
                <CardComponent card={card} onClick={() => dispatch({ type: 'OPEN_MODAL', cardId: card.id })} />
                <Pressable
                  style={[styles.listBtn, onList && styles.listBtnRemove]}
                  onPress={() => toggleTrackList(card.id)}
                >
                  <Text style={[styles.listBtnText, onList && styles.listBtnTextRemove]}>
                    {onList ? '— Remove' : '+ Add to track list'}
                  </Text>
                </Pressable>
              </View>
            );
          })}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg, flexDirection: 'row' },
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
    alignItems: 'center',
    gap: 4,
    borderWidth: 1,
    borderColor: colors.border,
  },
  powerLbl: { fontFamily: fonts.spaceMono, fontSize: fs(8), letterSpacing: 1, color: colors.muted, textTransform: 'uppercase' },
  powerNum: { fontFamily: fonts.cinzelBold, fontSize: fs(28), color: colors.gold },
  powerSub: { fontFamily: fonts.spaceMono, fontSize: fs(8), color: colors.muted },
  trackListTitle: { fontFamily: fonts.cinzelBold, fontSize: fs(11), letterSpacing: 2, color: colors.white, textTransform: 'uppercase' },
  slots: { flex: 1 },
  slotFilled: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    gap: 6,
  },
  slotEmpty: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    gap: 6,
    opacity: 0.35,
  },
  slotNum: { fontFamily: fonts.spaceMono, fontSize: fs(8), color: colors.muted, width: 16 },
  slotInfo: { flex: 1, gap: 2 },
  slotName: { fontFamily: fonts.cinzel, fontSize: fs(9), color: colors.white, letterSpacing: 0.5 },
  slotGenre: { fontFamily: fonts.spaceMono, fontSize: fs(7), color: colors.muted },
  slotPower: { fontFamily: fonts.spaceMono, fontSize: fs(9), color: colors.gold },
  slotRm: { width: 20, alignItems: 'center' },
  slotRmText: { fontFamily: fonts.spaceMono, fontSize: fs(9), color: colors.muted },
  slotEmptyText: { fontFamily: fonts.spaceMono, fontSize: fs(9), color: colors.muted, fontStyle: 'italic' },
  btnSave: {
    backgroundColor: colors.gold,
    borderRadius: 3,
    paddingVertical: 10,
    alignItems: 'center',
  },
  btnSaveText: { fontFamily: fonts.cinzelBold, fontSize: fs(10), letterSpacing: 2, color: '#0a0600' },
  main: { flex: 1 },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: { fontFamily: fonts.cinzelBold, fontSize: fs(16), letterSpacing: 2, color: colors.white },
  filters: { flexGrow: 0, borderBottomWidth: 1, borderBottomColor: colors.border },
  filtersContent: { paddingHorizontal: 16, paddingVertical: 12, gap: 6, flexDirection: 'row' },
  pill: { borderWidth: 1, borderColor: colors.border, borderRadius: 20, paddingHorizontal: 12, paddingVertical: 5 },
  pillActive: { backgroundColor: colors.gold, borderColor: colors.gold },
  pillText: { fontFamily: fonts.spaceMono, fontSize: fs(8), letterSpacing: 1, color: colors.muted },
  pillTextActive: { color: '#0a0600' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 20, padding: 20, justifyContent: 'center' },
  cardWrap: { alignItems: 'center', gap: 6 },
  cardOnList: { opacity: 0.5 },
  listBtn: {
    width: 272,
    backgroundColor: colors.gold,
    borderRadius: 2,
    paddingVertical: 8,
    alignItems: 'center',
  },
  listBtnRemove: { backgroundColor: 'rgba(200,50,50,.8)' },
  listBtnText: { fontFamily: fonts.spaceMono, fontSize: fs(9), letterSpacing: 1, color: '#0a0600', fontWeight: '700' },
  listBtnTextRemove: { color: '#fff' },
});
