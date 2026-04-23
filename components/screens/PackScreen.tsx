import { useState } from 'react';
import { View, Text, ScrollView, Pressable, Image, StyleSheet } from 'react-native';
import { useGame } from '@/lib/game-state';
import { CARDS } from '@/lib/data/cards';
import CardComponent from '@/components/Card';
import { colors, fonts } from '@/lib/tokens';
import type { Card } from '@/lib/data/cards';

export default function PackScreen() {
  const { dispatch, showToast, advanceMission } = useGame();
  const [phase, setPhase] = useState<'idle' | 'reveal'>('idle');
  const [packCards, setPackCards] = useState<Card[]>([]);
  const [flipped, setFlipped] = useState<boolean[]>([]);

  function startOpen() {
    const shuffled = [...CARDS].sort(() => Math.random() - 0.5).slice(0, 5);
    setPackCards(shuffled);
    setFlipped(Array(5).fill(false));
    setPhase('reveal');
    advanceMission(1, 1);
  }

  function flip(i: number) {
    setFlipped(prev => prev.map((v, idx) => idx === i ? true : v));
  }

  const allFlipped = flipped.length > 0 && flipped.every(Boolean);

  function addToCollection() {
    dispatch({ type: 'ADD_TO_COLLECTION', ids: packCards.map(c => c.id) });
    showToast('5 cards added to your collection!', 'ok');
    setPhase('idle');
    setPackCards([]);
    setFlipped([]);
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>Booster Pack</Text>
        <Text style={styles.subtitle}>SEASON ONE · 5 CARDS</Text>
      </View>

      {phase === 'idle' && (
        <View style={styles.idleWrap}>
          <Pressable onPress={startOpen} style={styles.packVisual}>
            <Image
              source={require('@/assets/ui/booster-pack-season1-v1.png')}
              style={styles.packImage}
              resizeMode="contain"
            />
          </Pressable>
          <Text style={styles.tapHint}>TAP TO OPEN</Text>
        </View>
      )}

      {phase === 'reveal' && (
        <View style={styles.revealWrap}>
          <View style={styles.revealGrid}>
            {packCards.map((card, i) => (
              <Pressable key={card.id} style={styles.slot} onPress={() => flip(i)}>
                {flipped[i]
                  ? <CardComponent card={card} wrapClass="csm" />
                  : (
                    <Image
                      source={require('@/assets/ui/card-back-v1.png')}
                      style={styles.cardBack}
                      resizeMode="contain"
                    />
                  )
                }
              </Pressable>
            ))}
          </View>
          <Text style={styles.hint}>
            {allFlipped ? 'All cards revealed!' : 'Tap cards to reveal'}
          </Text>
          {allFlipped && (
            <View style={styles.cta}>
              <Pressable style={styles.btnPrimary} onPress={addToCollection}>
                <Text style={styles.btnPrimaryText}>Add to Collection</Text>
              </Pressable>
              <Pressable style={styles.btnSecondary} onPress={() => { setPhase('idle'); setPackCards([]); setFlipped([]); }}>
                <Text style={styles.btnSecondaryText}>Discard</Text>
              </Pressable>
            </View>
          )}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  content: { alignItems: 'center', paddingBottom: 32 },
  header: { alignItems: 'center', paddingTop: 28, paddingBottom: 20, gap: 6 },
  title: {
    fontFamily: fonts.cinzelBold,
    fontSize: 22,
    letterSpacing: 3,
    color: colors.white,
  },
  subtitle: {
    fontFamily: fonts.spaceMono,
    fontSize: 9,
    letterSpacing: 2,
    color: colors.muted,
  },
  idleWrap: { alignItems: 'center', gap: 20, marginTop: 20 },
  packVisual: { width: 220, height: 300 },
  packImage: { width: '100%', height: '100%' },
  tapHint: {
    fontFamily: fonts.spaceMono,
    fontSize: 10,
    letterSpacing: 3,
    color: colors.muted,
  },
  revealWrap: { alignItems: 'center', gap: 16, width: '100%', paddingHorizontal: 16 },
  revealGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10,
    marginTop: 8,
  },
  slot: { width: 149, height: 220 },
  cardBack: { width: 149, height: 220, borderRadius: 10 },
  hint: {
    fontFamily: fonts.spaceMono,
    fontSize: 9,
    letterSpacing: 2,
    color: colors.muted,
  },
  cta: { flexDirection: 'row', gap: 12, marginTop: 8 },
  btnPrimary: {
    backgroundColor: colors.gold,
    paddingVertical: 13,
    paddingHorizontal: 24,
    borderRadius: 3,
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
    paddingHorizontal: 24,
    borderRadius: 3,
    alignItems: 'center',
  },
  btnSecondaryText: {
    fontFamily: fonts.cinzelBold,
    fontSize: 11,
    letterSpacing: 2,
    color: colors.white,
  },
});
