import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useGame } from '@/lib/game-state';
import { CARDS } from '@/lib/data/cards';
import CardComponent from '@/components/Card';
import { colors, fonts } from '@/lib/tokens';

export default function HomeScreen() {
  const { state, dispatch } = useGame();
  const router = useRouter();
  const { collection, deck } = state;

  const picks: typeof CARDS = [];
  for (const rarity of ['Legendary', 'Epic', 'Rare', 'Common'] as const) {
    if (picks.length >= 4) break;
    const c = collection.map(id => CARDS.find(x => x.id === id)!).find(c => c && c.rarity === rarity && !picks.includes(c));
    if (c) picks.push(c);
  }
  while (picks.length < 4 && picks.length < collection.length) {
    const c = CARDS.find(x => collection.includes(x.id) && !picks.includes(x));
    if (c) picks.push(c); else break;
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <View style={styles.hero}>
        <Text style={styles.eyebrow}>TRADING CARD GAME · SEASON 1</Text>
        <View style={styles.titleRow}>
          <Text style={styles.titleThe}>THE{'\n'}</Text>
          <Text style={styles.title}>MUSIC <Text style={styles.titleGold}>DECK</Text></Text>
        </View>
        <View style={styles.bar} />
        <Text style={styles.tagline}>Collect iconic songs.{'\n'}Build your deck.{'\n'}Let the music decide the winner.</Text>
        <View style={styles.actions}>
          <Pressable style={styles.btnPrimary} onPress={() => router.push('/pack')}>
            <Text style={styles.btnPrimaryText}>Open a Pack</Text>
          </Pressable>
          <Pressable style={styles.btnSecondary} onPress={() => router.push('/collection')}>
            <Text style={styles.btnSecondaryText}>My Collection</Text>
          </Pressable>
          <Pressable style={styles.btnDefi} onPress={() => router.push('/challenge')}>
            <Text style={styles.btnDefiText}>Challenge</Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.stats}>
        {[
          { num: collection.length, unit: 'Cards' },
          { num: deck.length,       unit: 'In Deck' },
          { num: 'S1',              unit: 'Season' },
        ].map(({ num, unit }) => (
          <View key={unit} style={styles.stat}>
            <Text style={styles.statNum}>{num}</Text>
            <Text style={styles.statUnit}>{unit}</Text>
          </View>
        ))}
      </View>

      {picks.length > 0 && (
        <View style={styles.preview}>
          <View style={styles.previewCards}>
            {picks.map(card => (
              <CardComponent
                key={card.id}
                card={card}
                wrapClass="csm"
                onClick={() => dispatch({ type: 'OPEN_MODAL', cardId: card.id })}
              />
            ))}
          </View>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen:  { flex: 1, backgroundColor: colors.bg },
  content: { paddingBottom: 32 },
  hero: {
    alignItems: 'center',
    paddingTop: 48,
    paddingHorizontal: 24,
    gap: 16,
  },
  eyebrow: {
    fontFamily: fonts.spaceMono,
    fontSize: 9,
    letterSpacing: 2,
    color: colors.muted,
  },
  titleRow: { alignItems: 'center' },
  titleThe: {
    fontFamily: fonts.cinzel,
    fontSize: 13,
    letterSpacing: 6,
    color: colors.muted,
  },
  title: {
    fontFamily: fonts.cinzelBold,
    fontSize: 32,
    letterSpacing: 6,
    color: colors.white,
    textAlign: 'center',
  },
  titleGold: { color: colors.gold },
  bar: {
    width: 40,
    height: 2,
    backgroundColor: colors.gold,
    marginVertical: 4,
  },
  tagline: {
    fontFamily: fonts.cormorant,
    fontStyle: 'italic',
    fontSize: 16,
    color: colors.muted,
    textAlign: 'center',
    lineHeight: 26,
  },
  actions: { gap: 10, width: '100%', alignItems: 'center', marginTop: 8 },
  btnPrimary: {
    backgroundColor: colors.gold,
    paddingVertical: 13,
    paddingHorizontal: 32,
    borderRadius: 3,
    width: 240,
    alignItems: 'center',
  },
  btnPrimaryText: {
    fontFamily: fonts.cinzelBold,
    fontSize: 11,
    letterSpacing: 2,
    color: '#0a0600',
  },
  btnSecondary: {
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: 13,
    paddingHorizontal: 32,
    borderRadius: 3,
    width: 240,
    alignItems: 'center',
  },
  btnSecondaryText: {
    fontFamily: fonts.cinzelBold,
    fontSize: 11,
    letterSpacing: 2,
    color: colors.white,
  },
  btnDefi: {
    borderWidth: 1,
    borderColor: colors.rust,
    paddingVertical: 13,
    paddingHorizontal: 32,
    borderRadius: 3,
    width: 240,
    alignItems: 'center',
  },
  btnDefiText: {
    fontFamily: fonts.cinzelBold,
    fontSize: 11,
    letterSpacing: 2,
    color: colors.rust,
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 32,
    paddingVertical: 32,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.border,
    marginHorizontal: 24,
    marginTop: 32,
  },
  stat: { alignItems: 'center', gap: 4 },
  statNum: {
    fontFamily: fonts.cinzelBold,
    fontSize: 28,
    color: colors.gold,
  },
  statUnit: {
    fontFamily: fonts.spaceMono,
    fontSize: 8,
    letterSpacing: 1,
    color: colors.muted,
    textTransform: 'uppercase',
  },
  preview: { marginTop: 24, paddingHorizontal: 24 },
  previewCards: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'center',
  },
});
