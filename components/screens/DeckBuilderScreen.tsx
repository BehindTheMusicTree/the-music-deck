import { useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { useGame } from '@/lib/game-state';
import { CARDS } from '@/lib/data/cards';
import { GENRES_ALL } from '@/lib/data/genres';
import CardComponent from '@/components/Card';
import { colors, fonts } from '@/lib/tokens';

export default function DeckBuilderScreen() {
  const { state, dispatch, showToast, advanceMission } = useGame();
  const { collection, deck } = state;
  const [filter, setFilter] = useState<string>('All');

  const totalPower = deck.reduce((sum, id) => {
    const c = CARDS.find(x => x.id === id);
    return sum + (c?.power ?? 0);
  }, 0);

  const cards = collection
    .map(id => CARDS.find(c => c.id === id)!)
    .filter(Boolean)
    .filter(c => filter === 'All' || c.genre === filter);

  function toggleDeck(id: number) {
    if (deck.includes(id)) {
      dispatch({ type: 'REMOVE_FROM_DECK', id });
      showToast('Card removed from deck');
    } else if (deck.length >= 10) {
      showToast('Deck full! Max 10 cards.', 'err');
    } else {
      dispatch({ type: 'ADD_TO_DECK', id });
      showToast('Card added to deck', 'ok');
      advanceMission(2, 1);
    }
  }

  return (
    <View style={styles.screen}>
      {/* Sidebar */}
      <View style={styles.sidebar}>
        <View style={styles.powerBox}>
          <Text style={styles.powerLbl}>Total Power</Text>
          <Text style={styles.powerNum}>{totalPower}</Text>
          <Text style={styles.powerSub}>{deck.length} / 10 cards</Text>
        </View>
        <Text style={styles.deckTitle}>Your Deck</Text>
        <ScrollView style={styles.slots}>
          {Array.from({ length: 10 }, (_, i) => {
            const id = deck[i];
            const card = id ? CARDS.find(c => c.id === id) : null;
            return card ? (
              <View key={i} style={styles.slotFilled}>
                <Text style={styles.slotNum}>{i + 1}</Text>
                <View style={styles.slotInfo}>
                  <Text style={styles.slotName} numberOfLines={1}>{card.title}</Text>
                  <Text style={styles.slotGenre}>{card.genre}</Text>
                </View>
                <Text style={styles.slotPower}>{card.power}</Text>
                <Pressable onPress={() => toggleDeck(id)} style={styles.slotRm}>
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
        <Pressable style={styles.btnSave} onPress={() => showToast(`Deck saved (${deck.length} cards) ✓`, 'ok')}>
          <Text style={styles.btnSaveText}>Save Deck</Text>
        </Pressable>
      </View>

      {/* Main */}
      <View style={styles.main}>
        <View style={styles.header}>
          <Text style={styles.title}>Deck Builder</Text>
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
            const inDeck = deck.includes(card.id);
            return (
              <View key={card.id} style={[styles.cardWrap, inDeck && styles.cardInDeck]}>
                <CardComponent card={card} onClick={() => dispatch({ type: 'OPEN_MODAL', cardId: card.id })} />
                <Pressable
                  style={[styles.deckBtn, inDeck && styles.deckBtnRemove]}
                  onPress={() => toggleDeck(card.id)}
                >
                  <Text style={[styles.deckBtnText, inDeck && styles.deckBtnTextRemove]}>
                    {inDeck ? '— Remove' : '+ Add to Deck'}
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
  powerLbl: { fontFamily: fonts.spaceMono, fontSize: 8, letterSpacing: 1, color: colors.muted, textTransform: 'uppercase' },
  powerNum: { fontFamily: fonts.cinzelBold, fontSize: 28, color: colors.gold },
  powerSub: { fontFamily: fonts.spaceMono, fontSize: 8, color: colors.muted },
  deckTitle: { fontFamily: fonts.cinzelBold, fontSize: 11, letterSpacing: 2, color: colors.white, textTransform: 'uppercase' },
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
  slotNum: { fontFamily: fonts.spaceMono, fontSize: 8, color: colors.muted, width: 16 },
  slotInfo: { flex: 1, gap: 2 },
  slotName: { fontFamily: fonts.cinzel, fontSize: 9, color: colors.white, letterSpacing: 0.5 },
  slotGenre: { fontFamily: fonts.spaceMono, fontSize: 7, color: colors.muted },
  slotPower: { fontFamily: fonts.spaceMono, fontSize: 9, color: colors.gold },
  slotRm: { width: 20, alignItems: 'center' },
  slotRmText: { fontFamily: fonts.spaceMono, fontSize: 9, color: colors.muted },
  slotEmptyText: { fontFamily: fonts.spaceMono, fontSize: 9, color: colors.muted, fontStyle: 'italic' },
  btnSave: {
    backgroundColor: colors.gold,
    borderRadius: 3,
    paddingVertical: 10,
    alignItems: 'center',
  },
  btnSaveText: { fontFamily: fonts.cinzelBold, fontSize: 10, letterSpacing: 2, color: '#0a0600' },
  main: { flex: 1 },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: { fontFamily: fonts.cinzelBold, fontSize: 16, letterSpacing: 2, color: colors.white },
  filters: { flexGrow: 0, borderBottomWidth: 1, borderBottomColor: colors.border },
  filtersContent: { paddingHorizontal: 16, paddingVertical: 12, gap: 6, flexDirection: 'row' },
  pill: { borderWidth: 1, borderColor: colors.border, borderRadius: 20, paddingHorizontal: 12, paddingVertical: 5 },
  pillActive: { backgroundColor: colors.gold, borderColor: colors.gold },
  pillText: { fontFamily: fonts.spaceMono, fontSize: 8, letterSpacing: 1, color: colors.muted },
  pillTextActive: { color: '#0a0600' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 20, padding: 20, justifyContent: 'center' },
  cardWrap: { alignItems: 'center', gap: 6 },
  cardInDeck: { opacity: 0.5 },
  deckBtn: {
    width: 272,
    backgroundColor: colors.gold,
    borderRadius: 2,
    paddingVertical: 8,
    alignItems: 'center',
  },
  deckBtnRemove: { backgroundColor: 'rgba(200,50,50,.8)' },
  deckBtnText: { fontFamily: fonts.spaceMono, fontSize: 9, letterSpacing: 1, color: '#0a0600', fontWeight: '700' },
  deckBtnTextRemove: { color: '#fff' },
});
