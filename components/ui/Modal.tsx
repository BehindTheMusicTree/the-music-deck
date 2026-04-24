import { Modal as RNModal, View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useGame } from '@/lib/game-state';
import { CARDS } from '@/lib/data/cards';
import CardComponent from '@/components/Card';
import { colors, fonts, fs, rarity as rarityTokens } from '@/lib/tokens';

export default function Modal() {
  const { state, dispatch, showToast } = useGame();
  const router = useRouter();
  const { modalCardId, collection, trackList } = state;

  if (!modalCardId) return null;
  const card = CARDS.find(c => c.id === modalCardId);
  if (!card) return null;

  const rarityColor = rarityTokens[card.rarity as keyof typeof rarityTokens] ?? rarityTokens.Common;
  const owned = collection.includes(card.id);
  const onTrackList = trackList.includes(card.id);

  function close() { dispatch({ type: 'CLOSE_MODAL' }); }
  function toggleTrackList() {
    if (!card) return;
    if (onTrackList) {
      dispatch({ type: 'REMOVE_FROM_TRACK_LIST', id: card.id });
      showToast('Card removed from track list');
    } else if (trackList.length < 10) {
      dispatch({ type: 'ADD_TO_TRACK_LIST', id: card.id });
      showToast('Card added to track list', 'ok');
      dispatch({ type: 'ADVANCE_MISSION', id: 2, amount: 1 });
    } else {
      showToast('Track list full! Max 10 cards.', 'err');
    }
    close();
  }

  const statBars = [
    { lbl: 'Power',      val: card.power, color: '#e08030' },
    { lbl: 'Popularity', val: card.pop,   color: '#c89030' },
    { lbl: 'Expression', val: card.exp,   color: '#986820' },
  ];

  return (
    <RNModal visible transparent animationType="fade" onRequestClose={close}>
      <Pressable style={styles.backdrop} onPress={close}>
        <Pressable style={styles.inner} onPress={e => e.stopPropagation()}>
          <Pressable style={styles.closeBtn} onPress={close}>
            <Text style={styles.closeText}>✕</Text>
          </Pressable>
          <View style={styles.cardCol}>
            <CardComponent card={card} />
          </View>
          <ScrollView style={styles.detail} contentContainerStyle={styles.detailContent}>
            <View>
              <Text style={styles.songTitle}>{card.title}</Text>
              <Text style={styles.artist}>{card.artist}</Text>
            </View>
            <View style={styles.tags}>
              <View style={[styles.badge, { borderColor: `${rarityColor}40`, backgroundColor: `${rarityColor}26` }]}>
                <Text style={[styles.badgeText, { color: rarityColor }]}>{card.rarity}</Text>
              </View>
              <View style={[styles.badge, { borderColor: 'rgba(168,124,40,.3)', backgroundColor: 'rgba(168,124,40,.1)' }]}>
                <Text style={[styles.badgeText, { color: colors.gold }]}>{card.genre}</Text>
              </View>
              <View style={[styles.badge, { borderColor: colors.border }]}>
                <Text style={[styles.badgeText, { color: colors.muted }]}>{card.year}</Text>
              </View>
            </View>
            <View style={styles.sep} />
            <View style={styles.statsSection}>
              {statBars.map(({ lbl, val, color }) => (
                <View key={lbl} style={styles.statRow}>
                  <Text style={styles.statLbl}>{lbl}</Text>
                  <View style={styles.statBar}>
                    <View style={[styles.statFill, { width: `${val}%` as any, backgroundColor: color }]} />
                  </View>
                  <Text style={styles.statVal}>{val}</Text>
                </View>
              ))}
            </View>
            <View style={styles.abilityBox}>
              <Text style={styles.abilityTitle}>✦ {card.ability}</Text>
              <Text style={styles.abilityText}>{card.abilityDesc}</Text>
            </View>
            <View style={styles.actions}>
              {owned
                ? onTrackList
                  ? <Pressable style={styles.btnSecondary} onPress={toggleTrackList}>
                      <Text style={styles.btnSecondaryText}>Remove from track list</Text>
                    </Pressable>
                  : trackList.length < 10
                    ? <Pressable style={styles.btnPrimary} onPress={toggleTrackList}>
                        <Text style={styles.btnPrimaryText}>+ Add to track list</Text>
                      </Pressable>
                    : <Pressable style={[styles.btnSecondary, { opacity: 0.4 }]}>
                        <Text style={styles.btnSecondaryText}>Track list full</Text>
                      </Pressable>
                : <Pressable style={styles.btnPrimary} onPress={() => { close(); router.push('/market'); }}>
                    <Text style={styles.btnPrimaryText}>Buy on Market</Text>
                  </Pressable>
              }
              <Pressable style={styles.btnSecondary} onPress={close}>
                <Text style={styles.btnSecondaryText}>Close</Text>
              </Pressable>
            </View>
          </ScrollView>
        </Pressable>
      </Pressable>
    </RNModal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(9,8,13,.92)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  inner: {
    flexDirection: 'row',
    gap: 24,
    maxWidth: 820,
    width: '100%',
    alignItems: 'flex-start',
  },
  closeBtn: {
    position: 'absolute',
    top: -10,
    right: -10,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  closeText: { color: colors.white, fontSize: fs(18) },
  cardCol: {
    alignItems: 'center',
  },
  detail: {
    flex: 1,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 6,
    maxHeight: '82%' as any,
  },
  detailContent: {
    padding: 20,
    gap: 16,
  },
  songTitle: {
    fontFamily: fonts.cinzelBold,
    fontSize: fs(22),
    color: colors.white,
    letterSpacing: 2,
    lineHeight: fs(28),
  },
  artist: {
    fontFamily: fonts.cormorantItalic,
    fontSize: fs(16),
    color: colors.muted,
    marginTop: 2,
  },
  tags: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  badge: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 2,
    borderWidth: 1,
  },
  badgeText: {
    fontFamily: fonts.spaceMono,
    fontSize: fs(9),
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  sep: { height: 1, backgroundColor: colors.border },
  statsSection: { gap: 10 },
  statRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  statLbl: {
    fontFamily: fonts.spaceMono,
    fontSize: fs(9),
    color: colors.muted,
    width: 80,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  statBar: {
    flex: 1,
    height: 7,
    backgroundColor: 'rgba(0,0,0,.3)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  statFill: { height: '100%', borderRadius: 4 },
  statVal: {
    fontFamily: fonts.spaceMono,
    fontSize: fs(11),
    fontWeight: '700',
    color: colors.white,
    width: 28,
    textAlign: 'right',
  },
  abilityBox: {
    backgroundColor: 'rgba(168,124,40,.06)',
    borderWidth: 1,
    borderColor: 'rgba(168,124,40,.2)',
    borderRadius: 4,
    padding: 16,
  },
  abilityTitle: {
    fontFamily: fonts.cinzelBold,
    fontSize: fs(12),
    color: colors.gold,
    letterSpacing: 1,
    marginBottom: 6,
  },
  abilityText: {
    fontFamily: fonts.cormorantItalic,
    fontSize: fs(15),
    color: colors.muted,
    lineHeight: fs(24),
  },
  actions: { flexDirection: 'row', gap: 10 },
  btnPrimary: {
    paddingVertical: 13,
    paddingHorizontal: 24,
    backgroundColor: colors.gold,
    borderRadius: 3,
  },
  btnPrimaryText: {
    fontFamily: fonts.cinzelBold,
    fontSize: fs(11),
    letterSpacing: 2,
    textTransform: 'uppercase',
    color: '#0a0600',
  },
  btnSecondary: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.gold,
    borderRadius: 3,
  },
  btnSecondaryText: {
    fontFamily: fonts.cinzelBold,
    fontSize: fs(11),
    letterSpacing: 2,
    textTransform: 'uppercase',
    color: colors.gold,
  },
});
