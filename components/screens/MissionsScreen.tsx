import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import Svg, { Line } from 'react-native-svg';
import { useGame } from '@/lib/game-state';
import { CARDS } from '@/lib/data/cards';
import { GENRE_CFG, TREE_NODES, TREE_EDGES } from '@/lib/data/genres';
import { colors, fonts } from '@/lib/tokens';

const W = 320, H = 280;

export default function MissionsScreen() {
  const { state, showToast } = useGame();
  const { missions, collection } = state;

  const genreCounts: Record<string, number> = {};
  CARDS.forEach(c => { genreCounts[c.genre] = (genreCounts[c.genre] ?? 0) + 1; });
  const collected: Record<string, number> = {};
  collection.forEach(id => {
    const c = CARDS.find(x => x.id === id);
    if (c) collected[c.genre] = (collected[c.genre] ?? 0) + 1;
  });

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      {/* Missions */}
      <View style={styles.section}>
        <View style={styles.sHdr}>
          <Text style={styles.lbl}>DAILY</Text>
          <Text style={styles.h2}>MISSIONS</Text>
        </View>
        <View style={styles.missionsList}>
          {missions.map(m => {
            const pct = Math.min(100, (m.prog / m.total) * 100);
            return (
              <View key={m.id} style={[styles.missionItem, m.done && styles.missionDone]}>
                <View style={styles.missionRow}>
                  <View style={[styles.check, m.done && styles.checkDone]}>
                    {m.done && <Text style={styles.checkMark}>✓</Text>}
                  </View>
                  <Text style={styles.missionName}>{m.name}</Text>
                  <Text style={styles.missionReward}>⬡ {m.reward}</Text>
                </View>
                {!m.done && (
                  <View style={styles.progWrap}>
                    <View style={styles.progBar}>
                      <View style={[styles.progFill, { width: `${pct}%` as any }]} />
                    </View>
                    <Text style={styles.progTxt}>{m.prog} / {m.total}</Text>
                  </View>
                )}
              </View>
            );
          })}
        </View>
      </View>

      {/* Music Tree */}
      <View style={styles.section}>
        <View style={styles.sHdr}>
          <Text style={styles.lbl}>MUSIC</Text>
          <Text style={styles.h2}>TREE</Text>
        </View>
        <View style={styles.treeWrap}>
          <Svg width={W} height={H} style={styles.treeSvg}>
            {TREE_EDGES.map(([a, b]) => {
              const na = TREE_NODES.find(n => n.genre === a)!;
              const nb = TREE_NODES.find(n => n.genre === b)!;
              const x1 = (na.x / 100) * W, y1 = (na.y / 100) * H;
              const x2 = (nb.x / 100) * W, y2 = (nb.y / 100) * H;
              const bothHave = (collected[a] ?? 0) > 0 && (collected[b] ?? 0) > 0;
              return (
                <Line
                  key={`${a}-${b}`}
                  x1={x1} y1={y1} x2={x2} y2={y2}
                  stroke={bothHave ? 'rgba(168,124,40,.45)' : 'rgba(30,28,44,.8)'}
                  strokeWidth={bothHave ? 2 : 1}
                  strokeDasharray={bothHave ? undefined : '4,4'}
                />
              );
            })}
          </Svg>
          {TREE_NODES.map(n => {
            const cnt = collected[n.genre] ?? 0;
            const tot = genreCounts[n.genre] ?? 1;
            const cfg = GENRE_CFG[n.genre];
            const mastered = cnt >= tot;
            const unlocked = cnt > 0;
            const lx = (n.x / 100) * W - 24;
            const ly = (n.y / 100) * H - 24;
            return (
              <Pressable
                key={n.genre}
                style={[styles.node, { left: lx, top: ly }, mastered && styles.nodeMastered, unlocked && !mastered && styles.nodeUnlocked]}
                onPress={() => showToast(`${n.genre}: ${cnt}/${tot} cards`, cnt > 0 ? 'ok' : '')}
              >
                <Text style={styles.nodeIco}>{cfg?.sym ?? '🎵'}</Text>
                <Text style={styles.nodeCnt}>{cnt}/{tot}</Text>
                <Text style={styles.nodeLbl} numberOfLines={1}>{n.genre}</Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      {/* Weekly */}
      <View style={[styles.section, styles.weeklyBox]}>
        <Text style={styles.weeklyLabel}>WEEKLY CHALLENGE</Text>
        <Text style={styles.weeklyTitle}>Genre Master</Text>
        <Text style={styles.weeklyDesc}>Collect at least 3 cards from 5 different genres.</Text>
        <Text style={styles.weeklyReward}>⬡ 500</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  content: { padding: 20, gap: 28, paddingBottom: 40 },
  section: { gap: 16 },
  sHdr: { gap: 4 },
  lbl: { fontFamily: fonts.spaceMono, fontSize: 9, letterSpacing: 3, color: colors.muted, textTransform: 'uppercase' },
  h2: { fontFamily: fonts.cinzelBold, fontSize: 22, letterSpacing: 3, color: colors.white },
  missionsList: { gap: 10 },
  missionItem: {
    backgroundColor: colors.surface,
    borderRadius: 4,
    padding: 14,
    gap: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  missionDone: { opacity: 0.6 },
  missionRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  check: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkDone: { backgroundColor: colors.gold, borderColor: colors.gold },
  checkMark: { fontFamily: fonts.spaceMono, fontSize: 10, color: '#0a0600' },
  missionName: { flex: 1, fontFamily: fonts.cinzel, fontSize: 11, color: colors.white, letterSpacing: 0.5 },
  missionReward: { fontFamily: fonts.spaceMono, fontSize: 10, color: colors.gold },
  progWrap: { gap: 4 },
  progBar: { height: 6, borderRadius: 3, backgroundColor: 'rgba(0,0,0,.5)', overflow: 'hidden' },
  progFill: { height: '100%', borderRadius: 3, backgroundColor: colors.gold },
  progTxt: { fontFamily: fonts.spaceMono, fontSize: 7, color: colors.muted, textAlign: 'right' },
  treeWrap: { width: W, height: H + 60, position: 'relative', alignSelf: 'center' },
  treeSvg: { position: 'absolute', top: 0, left: 0 },
  node: {
    position: 'absolute',
    width: 48,
    height: 64,
    alignItems: 'center',
    opacity: 0.35,
  },
  nodeMastered: { opacity: 1 },
  nodeUnlocked: { opacity: 0.75 },
  nodeIco: { fontSize: 20 },
  nodeCnt: { fontFamily: fonts.spaceMono, fontSize: 7, color: colors.muted },
  nodeLbl: { fontFamily: fonts.cinzel, fontSize: 7, color: colors.white, letterSpacing: 0.5, textAlign: 'center' },
  weeklyBox: {
    backgroundColor: colors.surface,
    borderRadius: 6,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 8,
  },
  weeklyLabel: { fontFamily: fonts.spaceMono, fontSize: 8, letterSpacing: 2, color: colors.muted, textTransform: 'uppercase' },
  weeklyTitle: { fontFamily: fonts.cinzelBold, fontSize: 16, letterSpacing: 2, color: colors.white },
  weeklyDesc: { fontFamily: fonts.cormorantItalic, fontSize: 14, color: colors.muted, lineHeight: 22 },
  weeklyReward: { fontFamily: fonts.cinzelBold, fontSize: 18, color: colors.gold },
});
