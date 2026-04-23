import { useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { useGame } from '@/lib/game-state';
import { CARDS } from '@/lib/data/cards';
import { GENRES_ALL } from '@/lib/data/genres';
import CardComponent from '@/components/Card';
import { colors, fonts } from '@/lib/tokens';

export default function CollectionScreen() {
  const { state, dispatch } = useGame();
  const { collection } = state;
  const [filter, setFilter] = useState<string>('All');

  const cards = collection
    .map(id => CARDS.find(c => c.id === id)!)
    .filter(Boolean)
    .filter(c => filter === 'All' || c.genre === filter);

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.title}>Collection</Text>
        <Text style={styles.count}>{collection.length} cards</Text>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filters} contentContainerStyle={styles.filtersContent}>
        {GENRES_ALL.map(g => (
          <Pressable key={g} style={[styles.pill, filter === g && styles.pillActive]} onPress={() => setFilter(g)}>
            <Text style={[styles.pillText, filter === g && styles.pillTextActive]}>{g}</Text>
          </Pressable>
        ))}
      </ScrollView>
      {cards.length === 0
        ? (
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No cards in this category.{'\n'}Open packs to get some!</Text>
          </View>
        )
        : (
          <ScrollView contentContainerStyle={styles.grid}>
            {cards.map(card => (
              <CardComponent
                key={card.id}
                card={card}
                onClick={() => dispatch({ type: 'OPEN_MODAL', cardId: card.id })}
              />
            ))}
          </ScrollView>
        )
      }
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: { fontFamily: fonts.cinzelBold, fontSize: 16, letterSpacing: 2, color: colors.white },
  count: { fontFamily: fonts.spaceMono, fontSize: 9, color: colors.muted },
  filters: { flexGrow: 0, borderBottomWidth: 1, borderBottomColor: colors.border },
  filtersContent: { paddingHorizontal: 16, paddingVertical: 12, gap: 6, flexDirection: 'row' },
  pill: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  pillActive: { backgroundColor: colors.gold, borderColor: colors.gold },
  pillText: { fontFamily: fonts.spaceMono, fontSize: 8, letterSpacing: 1, color: colors.muted },
  pillTextActive: { color: '#0a0600' },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  emptyText: {
    fontFamily: fonts.cormorant,
    fontStyle: 'italic',
    fontSize: 16,
    color: colors.muted,
    textAlign: 'center',
    lineHeight: 26,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    padding: 20,
    justifyContent: 'center',
  },
});
