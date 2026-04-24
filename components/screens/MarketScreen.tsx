import { useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { useGame } from '@/lib/game-state';
import { CARDS } from '@/lib/data/cards';
import { GENRES_ALL, MARKET_PRICES } from '@/lib/data/genres';
import CardComponent from '@/components/Card';
import { colors, fonts } from '@/lib/tokens';

export default function MarketScreen() {
  const { state, dispatch, showToast } = useGame();
  const { collection, coins } = state;
  const [filter, setFilter] = useState<string>('All');

  const forSale = CARDS.filter(c => filter === 'All' || c.genre === filter);

  function buyCard(id: number, price: number) {
    if (coins < price) { showToast('Not enough coins!', 'err'); return; }
    dispatch({ type: 'SPEND_COINS', amount: price });
    dispatch({ type: 'ADD_TO_COLLECTION', ids: [id] });
    showToast(`Card purchased! Balance: ⬡ ${coins - price}`, 'ok');
  }

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.title}>Marketplace</Text>
        <Text style={styles.coins}>⬡ {coins}</Text>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filters} contentContainerStyle={styles.filtersContent}>
        {GENRES_ALL.map(g => (
          <Pressable key={g} style={[styles.pill, filter === g && styles.pillActive]} onPress={() => setFilter(g)}>
            <Text style={[styles.pillText, filter === g && styles.pillTextActive]}>{g}</Text>
          </Pressable>
        ))}
      </ScrollView>
      <ScrollView contentContainerStyle={styles.list}>
        {forSale.map(card => {
          const price = MARKET_PRICES[card.rarity];
          const owned = collection.includes(card.id);
          const canBuy = !owned && coins >= price;
          return (
            <View key={card.id} style={styles.item}>
              <CardComponent card={card} wrapClass="csm" onClick={() => dispatch({ type: 'OPEN_MODAL', cardId: card.id })} />
              <View style={styles.info}>
                <Text style={styles.song} numberOfLines={2}>{card.title}</Text>
                <Text style={styles.artist} numberOfLines={1}>{card.artist}</Text>
                <View style={styles.tags}>
                  <View style={styles.tag}><Text style={styles.tagText}>{card.genre}</Text></View>
                  <View style={[styles.tag, { borderColor: rarityColor(card.rarity) + '66' }]}>
                    <Text style={[styles.tagText, { color: rarityColor(card.rarity) }]}>{card.rarity}</Text>
                  </View>
                </View>
              </View>
              <View style={styles.priceCol}>
                <Text style={styles.price}>⬡ {price}</Text>
                <Text style={styles.power}>Power: {card.power}</Text>
                {owned
                  ? <View style={styles.ownedBadge}><Text style={styles.ownedText}>Owned</Text></View>
                  : (
                    <Pressable style={[styles.btnBuy, !canBuy && styles.btnBuyDisabled]} disabled={!canBuy} onPress={() => buyCard(card.id, price)}>
                      <Text style={styles.btnBuyText}>{coins < price ? 'Not enough' : 'Buy'}</Text>
                    </Pressable>
                  )
                }
              </View>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

function rarityColor(rarity: string) {
  const map: Record<string, string> = { Legendary: '#c8a040', Epic: '#a070e0', Rare: '#6090e0', Common: '#8888a0' };
  return map[rarity] ?? '#8888a0';
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
  coins: { fontFamily: fonts.spaceMono, fontSize: 11, color: colors.gold },
  filters: { flexGrow: 0, borderBottomWidth: 1, borderBottomColor: colors.border },
  filtersContent: { paddingHorizontal: 16, paddingVertical: 12, gap: 6, flexDirection: 'row' },
  pill: { borderWidth: 1, borderColor: colors.border, borderRadius: 20, paddingHorizontal: 12, paddingVertical: 5 },
  pillActive: { backgroundColor: colors.gold, borderColor: colors.gold },
  pillText: { fontFamily: fonts.spaceMono, fontSize: 8, letterSpacing: 1, color: colors.muted },
  pillTextActive: { color: '#0a0600' },
  list: { padding: 16, gap: 12 },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: colors.surface,
    borderRadius: 6,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  info: { flex: 1, gap: 4 },
  song: { fontFamily: fonts.cinzelBold, fontSize: 11, color: colors.white, letterSpacing: 0.5 },
  artist: { fontFamily: fonts.cormorantItalic, fontSize: 12, color: colors.muted },
  tags: { flexDirection: 'row', gap: 6, marginTop: 4, flexWrap: 'wrap' },
  tag: { borderWidth: 1, borderColor: colors.border, borderRadius: 3, paddingHorizontal: 6, paddingVertical: 2 },
  tagText: { fontFamily: fonts.spaceMono, fontSize: 7, color: colors.muted, letterSpacing: 0.5 },
  priceCol: { alignItems: 'center', gap: 6, minWidth: 72 },
  price: { fontFamily: fonts.cinzelBold, fontSize: 13, color: colors.gold },
  power: { fontFamily: fonts.spaceMono, fontSize: 8, color: colors.muted },
  ownedBadge: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 3,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  ownedText: { fontFamily: fonts.spaceMono, fontSize: 8, color: colors.muted },
  btnBuy: {
    backgroundColor: colors.gold,
    borderRadius: 2,
    paddingHorizontal: 14,
    paddingVertical: 7,
  },
  btnBuyDisabled: { opacity: 0.4 },
  btnBuyText: { fontFamily: fonts.spaceMono, fontSize: 8, letterSpacing: 1, color: '#0a0600', fontWeight: '700' },
});
