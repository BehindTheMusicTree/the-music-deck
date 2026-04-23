import { View, Text, Pressable, Image, StyleSheet } from 'react-native';
import Svg, { Rect, Circle, Text as SvgText, RadialGradient, Defs, Stop } from 'react-native-svg';
import type { Card } from '@/lib/data/cards';
import { GENRE_CFG } from '@/lib/data/genres';
import { genreColors, genreKey, fonts } from '@/lib/tokens';

interface CardProps {
  card: Card;
  /** 'csm' = small (149×220), 'clg' = large (285×420), undefined = full (272×400) */
  wrapClass?: 'csm' | 'clg' | '';
  selected?: boolean;
  maskTitle?: boolean;
  onClick?: () => void;
}

const CARD_W = 272;
const CARD_H = 400;
const SCALE_SM = 149 / CARD_W;
const SCALE_LG = 285 / CARD_W;

function CardArt({ card }: { card: Card }) {
  const cfg = GENRE_CFG[card.genre] ?? GENRE_CFG.Pop;
  const s = card.id * 137 + 42;
  const bars = Array.from({ length: 14 }, (_, i) => {
    const h = 16 + ((s + i * 31) % 52);
    const x = 6 + i * 16;
    const op = parseFloat((0.18 + ((s + i * 7) % 6) * 0.1).toFixed(2));
    return { h, x, op };
  });
  const dots = Array.from({ length: 12 }, (_, i) => ({
    cx: 15 + ((s * i * 3) % 210),
    cy: 10 + ((s * i * 7 + 33) % 160),
    r: 1.5 + ((s + i) % 3),
    op: parseFloat((0.08 + ((s + i * 11) % 5) * 0.05).toFixed(2)),
  }));

  return (
    <Svg viewBox="0 0 234 190" width="100%" height="100%">
      <Defs>
        <RadialGradient id={`rg${card.id}`} cx="50%" cy="42%" r="72%">
          <Stop offset="0%" stopColor={cfg.bg0} />
          <Stop offset="100%" stopColor={cfg.bg1} />
        </RadialGradient>
      </Defs>
      <Rect width={234} height={190} fill={`url(#rg${card.id})`} />
      {dots.map((d, i) => (
        <Circle key={i} cx={d.cx} cy={d.cy} r={d.r} fill={cfg.accent} fillOpacity={d.op} />
      ))}
      {bars.map((b, i) => (
        <Rect key={i} x={b.x} y={105 - b.h / 2} width={10} height={b.h} rx={5} fill={cfg.accent} fillOpacity={b.op} />
      ))}
      <SvgText x={117} y={102} fontSize={80} textAnchor="middle" fill={cfg.accent} fillOpacity={0.07} fontFamily="serif">
        {cfg.sym}
      </SvgText>
      <SvgText x={117} y={99} fontSize={78} textAnchor="middle" fill={cfg.accent} fillOpacity={0.42} fontFamily="serif">
        {cfg.sym}
      </SvgText>
      <Rect x={0} y={160} width={234} height={30} fill={cfg.bg1} fillOpacity={0.65} />
      <Rect x={0} y={0} width={234} height={18} fill={cfg.bg1} fillOpacity={0.45} />
    </Svg>
  );
}

export default function CardComponent({ card, wrapClass = '', selected = false, maskTitle = false, onClick }: CardProps) {
  const cfg = GENRE_CFG[card.genre] ?? GENRE_CFG.Pop;
  const gkey = genreKey[card.genre] ?? 'pop';
  const gc = genreColors[gkey];
  const artSrc = card.artwork ? `/assets/cards/artworks/examples/${card.artwork}` : null;

  // Rarity color
  const rarityColors: Record<string, string> = {
    Legendary: '#c8a040', Epic: '#a060c8', Rare: '#4a7aaa', Common: '#666',
  };
  const rarColor = rarityColors[card.rarity] ?? '#666';

  const cardEl = (
    <Pressable
      onPress={onClick}
      style={[
        styles.card,
        {
          borderColor: gc?.border ?? '#888',
          backgroundColor: gc?.cardBg ?? '#16141f',
        },
        selected && styles.selected,
      ]}
    >
      <View style={[styles.inner, { backgroundColor: gc?.cardBg ?? '#16141f' }]}>
        {/* Header */}
        <View style={[styles.header, { backgroundColor: gc?.headerBg ?? '#100f18', borderBottomColor: (gc?.border ?? '#333') + '44' }]}>
          <View style={styles.headerLeft}>
            <Text style={[styles.headerIcon, { color: gc?.textMain ?? '#fff' }]}>{cfg.sym}</Text>
            <View style={styles.headerTitles}>
              <Text style={[styles.cardTitle, { color: gc?.textMain ?? '#fff' }]} numberOfLines={2}>
                {maskTitle ? '???' : card.title}
              </Text>
              <Text style={[styles.cardArtist, { color: gc?.textBody ?? '#888' }]} numberOfLines={1}>
                {card.artist}
              </Text>
            </View>
          </View>
          <View style={[styles.scoreCircle, { borderColor: gc?.border ?? '#888', backgroundColor: gc?.headerBg ?? '#100f18' }]}>
            <Text style={[styles.scoreText, { color: gc?.textMain ?? '#fff' }]}>{card.power}</Text>
          </View>
        </View>

        {/* Artwork */}
        <View style={styles.artArea}>
          {artSrc
            ? <Image source={{ uri: artSrc }} style={styles.artImage} resizeMode="cover" />
            : <CardArt card={card} />
          }
        </View>

        {/* Bottom: type strip */}
        <View style={[styles.typeStrip, { borderColor: gc?.border ?? '#888' }]}>
          <Text style={styles.typeText}>Song · {card.year}</Text>
          <View style={styles.typeRight}>
            <Text style={styles.typeGenre}>{cfg.genreLabel}</Text>
            <View style={[styles.pip, { backgroundColor: gc?.border ?? '#888' }]} />
          </View>
        </View>

        {/* Ability box */}
        <View style={styles.abilityBox}>
          <Text style={styles.abilityName}>{card.ability}</Text>
          <Text style={styles.abilityDesc} numberOfLines={3}>{card.abilityDesc}</Text>
        </View>

        {/* Stats */}
        <View style={styles.statsBox}>
          {[
            { lbl: 'Popularity', val: card.pop, colors: gc?.barPop },
            { lbl: 'Experimental', val: card.exp, colors: gc?.barExp },
          ].map(({ lbl, val, colors: bc }) => (
            <View key={lbl} style={styles.statRow}>
              <Text style={styles.statLbl}>{lbl}</Text>
              <View style={styles.statBg}>
                <View style={[styles.statFill, {
                  width: `${val}%` as any,
                  backgroundColor: bc ? bc[1] : '#888',
                }]} />
              </View>
              <Text style={styles.statVal}>{val}</Text>
            </View>
          ))}
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.brand}>THE MUSIC DECK</Text>
          <View style={styles.rarityRow}>
            <View style={[styles.rarDot, { backgroundColor: rarColor }]} />
            <Text style={[styles.rarText, { color: rarColor }]}>{card.rarity}</Text>
          </View>
        </View>
      </View>
    </Pressable>
  );

  if (!wrapClass) return cardEl;

  const isSmall = wrapClass === 'csm';
  const scale = isSmall ? SCALE_SM : SCALE_LG;
  const wrapW = isSmall ? 149 : 285;
  const wrapH = isSmall ? 220 : 420;

  return (
    <View style={[styles.wrap, { width: wrapW, height: wrapH }]}>
      <View style={{ transform: [{ scale }], transformOrigin: 'top left' as any }}>
        {cardEl}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    overflow: 'hidden',
    borderRadius: 10,
    flexShrink: 0,
  },
  card: {
    width: CARD_W,
    height: CARD_H,
    borderRadius: 18,
    borderWidth: 1.5,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 24 },
    shadowOpacity: 0.85,
    shadowRadius: 32,
    elevation: 24,
  },
  selected: {
    borderWidth: 2.5,
    shadowColor: '#a87c28',
    shadowOpacity: 0.5,
  },
  inner: {
    flex: 1,
    borderRadius: 8,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 11,
    paddingVertical: 7,
    gap: 8,
    borderBottomWidth: 1,
    minHeight: 44,
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 7, flex: 1, overflow: 'hidden' },
  headerIcon: { fontSize: 16, lineHeight: 18, flexShrink: 0 },
  headerTitles: { flexDirection: 'column', gap: 1, flex: 1, overflow: 'hidden' },
  cardTitle: {
    fontFamily: fonts.cinzelBold,
    fontSize: 12.5,
    letterSpacing: 1,
    lineHeight: 15,
  },
  cardArtist: {
    fontFamily: fonts.cormorant,
    fontStyle: 'italic',
    fontSize: 10,
    letterSpacing: 0.4,
    lineHeight: 12,
    opacity: 0.85,
  },
  scoreCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  scoreText: { fontFamily: fonts.spaceMono, fontSize: 11 },

  artArea: { flex: 1, overflow: 'hidden' },
  artImage: { width: '100%', height: '100%' },

  typeStrip: {
    backgroundColor: '#ede4cc',
    borderWidth: 1.5,
    paddingVertical: 6,
    paddingHorizontal: 14,
    marginHorizontal: 2,
    marginTop: 3,
    marginBottom: -6,
    borderRadius: 3,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 3,
  },
  typeText: { fontFamily: fonts.cinzel, fontSize: 8, letterSpacing: 1.5, color: '#2e2010' },
  typeRight: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  typeGenre: { fontFamily: fonts.cinzel, fontSize: 8, letterSpacing: 1.5, color: '#2e2010' },
  pip: { width: 7, height: 7, borderRadius: 1, transform: [{ rotate: '45deg' }], opacity: 0.9 },

  abilityBox: {
    backgroundColor: '#f4edd8',
    paddingVertical: 8,
    paddingHorizontal: 10,
    marginHorizontal: 4,
    marginBottom: 2,
    borderRadius: 3,
    zIndex: 2,
  },
  abilityName: {
    fontFamily: fonts.cinzelBold,
    fontSize: 9,
    color: '#1a1208',
    letterSpacing: 1,
    marginBottom: 4,
  },
  abilityDesc: {
    fontFamily: fonts.cormorant,
    fontStyle: 'italic',
    fontSize: 11,
    color: '#2e2010',
    lineHeight: 15,
  },

  statsBox: {
    backgroundColor: 'rgba(0,0,0,.25)',
    padding: 8,
    marginHorizontal: 4,
    marginBottom: 2,
    borderRadius: 3,
    gap: 6,
    zIndex: 1,
  },
  statRow: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  statLbl: {
    fontFamily: fonts.spaceMono,
    fontSize: 6.5,
    color: 'rgba(255,255,255,.5)',
    width: 66,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  statBg: {
    flex: 1,
    height: 9,
    borderRadius: 5,
    backgroundColor: 'rgba(0,0,0,.55)',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,.07)',
  },
  statFill: {
    height: '100%',
    borderRadius: 5,
  },
  statVal: {
    fontFamily: fonts.spaceMono,
    fontSize: 8,
    color: 'rgba(255,255,255,.9)',
    width: 20,
    textAlign: 'right',
    fontWeight: '700',
  },

  footer: {
    backgroundColor: 'transparent',
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginHorizontal: 4,
    marginBottom: 4,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  brand: {
    fontFamily: fonts.spaceMono,
    fontSize: 7,
    color: 'rgba(255,255,255,.55)',
    letterSpacing: 1,
  },
  rarityRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  rarDot: { width: 8, height: 8, borderRadius: 4 },
  rarText: {
    fontFamily: fonts.spaceMono,
    fontSize: 7,
    letterSpacing: 1,
  },
});
