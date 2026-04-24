import { View, Text, Pressable, Image, ImageSourcePropType, StyleSheet } from 'react-native';
import artworkMap from '@/assets/cards/artworks/examples';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Rect, Circle, Text as SvgText, RadialGradient, Defs, Stop } from 'react-native-svg';
import { SvgXml } from 'react-native-svg';
import type { Card } from '@/lib/data/cards';
import { GENRE_CFG, RAR_SVG } from '@/lib/data/genres';
import { useCardSizeMultiplier } from '@/lib/card-layout';
import { genreColors, genreKey, fonts, fs, colors, rarity as rarityTokens, shadows } from '@/lib/tokens';

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

/** Compute glow shadow for score circle based on power (40–100 scale) */
function scoreGlow(power: number) {
  const t = Math.max(0, Math.min(1, (power - 40) / 60));
  return {
    shadowColor: '#c8a040',
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 4 + t * 14,
    shadowOpacity: 0.25 + t * 0.65,
    elevation: Math.floor(t * 14),
  };
}

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
  const m = useCardSizeMultiplier();
  const cfg = GENRE_CFG[card.genre] ?? GENRE_CFG.Pop;
  const gkey = genreKey[card.genre] ?? 'pop';
  const gc = genreColors[gkey];
  const artSrc: ImageSourcePropType | null = card.artwork ? (artworkMap[card.artwork] ?? null) : null;
  const rarSvg = RAR_SVG[card.rarity];
  const borderColor = gc?.border ?? '#888';
  const cardBgColor = gc?.cardBg ?? '#16141f';
  const glow = scoreGlow(card.power);

  const cardEl = (
    <Pressable
      onPress={onClick}
      style={[styles.card, { borderColor }]}
    >
      {/* Card texture shimmer over genre bg color */}
      <LinearGradient
        colors={['rgba(255,255,255,0.09)', 'rgba(0,0,0,0.20)', 'rgba(255,255,255,0.04)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[StyleSheet.absoluteFill, { backgroundColor: cardBgColor }]}
      />
      {selected && (
        <View style={[StyleSheet.absoluteFill, styles.selectedOverlay]} />
      )}

      <View style={styles.inner}>
        {/* Header */}
        <View style={[styles.header, { backgroundColor: gc?.headerBg ?? '#100f18', borderBottomColor: borderColor + '44' }]}>
          <View style={styles.headerLeft}>
            <View style={styles.headerIcon}>
              <SvgXml xml={cfg.icon} width={16} height={16} color={gc?.textMain ?? '#fff'} />
            </View>
            <View style={styles.headerTitles}>
              <Text style={[styles.cardTitle, { color: gc?.textMain ?? '#fff' }]} numberOfLines={2}>
                {maskTitle ? '???' : card.title}
              </Text>
              <Text style={[styles.cardArtist, { color: gc?.textBody ?? '#888' }]} numberOfLines={1}>
                {card.artist}
              </Text>
            </View>
          </View>
          {/* Score circle with power-based glow */}
          <View style={[styles.scoreCircle, { borderColor }, glow]}>
            <Text style={[styles.scoreText, { color: gc?.textMain ?? '#fff' }]}>{card.power}</Text>
          </View>
        </View>

        {/* Artwork */}
        <View style={styles.artArea}>
          {artSrc
            ? <Image source={artSrc} style={styles.artImage} resizeMode="cover" />
            : <CardArt card={card} />
          }
        </View>

        {/* Type strip — parchment with notched diamond corners */}
        <View style={[styles.typeStrip, { borderColor }]}>
          {/* Rotated squares at each corner mask the border-radius, creating diamond notches */}
          <View style={[styles.corner, styles.cornerTL, { backgroundColor: cardBgColor }]} />
          <View style={[styles.corner, styles.cornerTR, { backgroundColor: cardBgColor }]} />
          <View style={[styles.corner, styles.cornerBL, { backgroundColor: cardBgColor }]} />
          <View style={[styles.corner, styles.cornerBR, { backgroundColor: cardBgColor }]} />
          <Text style={styles.typeText}>Song · {card.year}</Text>
          <View style={styles.typeRight}>
            <Text style={styles.typeGenre}>{cfg.genreLabel}</Text>
            <View style={[styles.pip, { backgroundColor: borderColor }]} />
          </View>
        </View>

        {/* Ability box */}
        <View style={styles.abilityBox}>
          <Text style={styles.abilityName}>{card.ability}</Text>
          <Text style={styles.abilityDesc} numberOfLines={3}>{card.abilityDesc}</Text>
        </View>

        {/* Stats with gradient fills and glow */}
        <View style={styles.statsBox}>
          {[
            { lbl: 'Popularity', val: card.pop, bc: gc?.barPop, bg: gc?.barGlowPop },
            { lbl: 'Experimental', val: card.exp, bc: gc?.barExp, bg: gc?.barGlowExp },
          ].map(({ lbl, val, bc, bg }) => (
            <View key={lbl} style={styles.statRow}>
              <Text style={styles.statLbl}>{lbl}</Text>
              <View style={styles.statBg}>
                <LinearGradient
                  colors={(bc as [string, string]) ?? ['#444', '#888']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={[
                    styles.statFill,
                    { width: `${val}%` as any },
                    bg ? { shadowColor: bg, shadowOffset: { width: 0, height: 0 }, shadowRadius: 8, shadowOpacity: 1, elevation: 4 } : null,
                  ]}
                />
              </View>
              <Text style={styles.statVal}>{val}</Text>
            </View>
          ))}
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.brand}>THE MUSIC DECK</Text>
          <View style={styles.rarityRow}>
            {rarSvg ? <SvgXml xml={rarSvg} width={10} height={10} /> : null}
            <Text style={[styles.rarText, { color: rarityColor(card.rarity) }]}>{card.rarity}</Text>
          </View>
        </View>
      </View>
    </Pressable>
  );

  if (!wrapClass) {
    if (m === 1) return cardEl;
    return (
      <View
        style={[
          styles.wrap,
          { width: CARD_W * m, height: CARD_H * m, borderRadius: 16 * m },
        ]}
      >
        <View style={{ transform: [{ scale: m }], transformOrigin: 'top left' as any }}>
          {cardEl}
        </View>
      </View>
    );
  }

  const isSmall = wrapClass === 'csm';
  const scale = (isSmall ? SCALE_SM : SCALE_LG) * m;
  const wrapW = (isSmall ? 149 : 285) * m;
  const wrapH = (isSmall ? 220 : 420) * m;

  return (
    <View style={[styles.wrap, { width: wrapW, height: wrapH, borderRadius: 10 * m }]}>
      <View style={{ transform: [{ scale }], transformOrigin: 'top left' as any }}>
        {cardEl}
      </View>
    </View>
  );
}

function rarityColor(r: string) {
  return rarityTokens[r as keyof typeof rarityTokens] ?? rarityTokens.Common;
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
    borderRadius: 16,
    borderWidth: 1.5,
    ...shadows.card,
    overflow: 'hidden',
  },
  selectedOverlay: {
    borderRadius: 16,
    borderWidth: 2,
    borderColor: colors.gold,
  },
  inner: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 11,
    paddingVertical: 7,
    gap: 8,
    borderBottomWidth: 1,
    minHeight: 44,
  },
  headerLeft: { flexDirection: 'row', alignItems: 'flex-start', gap: 7, flex: 1, overflow: 'hidden' },
  headerIcon: {
    marginTop: 2,
    width: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitles: { flexDirection: 'column', gap: 1, flex: 1, overflow: 'hidden' },
  cardTitle: {
    fontFamily: fonts.cinzelBold,
    fontSize: fs(12.5),
    letterSpacing: 1,
    lineHeight: fs(15),
  },
  cardArtist: {
    fontFamily: fonts.cormorantItalic,
    fontSize: fs(10),
    letterSpacing: 0.4,
    lineHeight: fs(12),
    opacity: 0.85,
  },
  scoreCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    marginTop: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  scoreText: { fontFamily: fonts.spaceMono, fontSize: fs(11), fontWeight: '700' },

  artArea: { flex: 1, overflow: 'hidden' },
  artImage: { width: '100%', height: '100%' },

  typeStrip: {
    backgroundColor: colors.parch2,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    paddingVertical: 6,
    paddingHorizontal: 14,
    marginHorizontal: 4,
    marginTop: 3,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 3,
    // inset highlight
    shadowColor: '#fff',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.6,
    shadowRadius: 0,
  },
  corner: {
    position: 'absolute',
    width: 11,
    height: 11,
    transform: [{ rotate: '45deg' }],
  },
  cornerTL: { top: -5.5, left: -5.5 },
  cornerTR: { top: -5.5, right: -5.5 },
  cornerBL: { bottom: -5.5, left: -5.5 },
  cornerBR: { bottom: -5.5, right: -5.5 },
  typeText: { fontFamily: fonts.cinzel, fontSize: fs(8), letterSpacing: 1.5, color: colors.ink },
  typeRight: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  typeGenre: { fontFamily: fonts.cinzel, fontSize: fs(8), letterSpacing: 1.5, color: colors.ink },
  pip: { width: 7, height: 7, borderRadius: 1, transform: [{ rotate: '45deg' }], opacity: 0.9 },

  abilityBox: {
    backgroundColor: colors.parch,
    paddingVertical: 8,
    paddingHorizontal: 10,
    marginHorizontal: 4,
    marginBottom: 2,
    zIndex: 2,
    shadowColor: '#fff',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 0,
  },
  abilityName: {
    fontFamily: fonts.cinzelBold,
    fontSize: fs(9),
    color: colors.ink,
    letterSpacing: 1,
    marginBottom: 4,
  },
  abilityDesc: {
    fontFamily: fonts.cormorantItalic,
    fontSize: fs(11),
    color: colors.ink,
    lineHeight: fs(15),
  },

  statsBox: {
    backgroundColor: 'rgba(0,0,0,.28)',
    padding: 8,
    marginHorizontal: 4,
    marginBottom: 2,
    gap: 6,
    zIndex: 1,
  },
  statRow: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  statLbl: {
    fontFamily: fonts.spaceMono,
    fontSize: fs(6.5),
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
    fontSize: fs(8),
    color: 'rgba(255,255,255,.9)',
    width: 20,
    textAlign: 'right',
    fontWeight: '700',
  },

  footer: {
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
    fontSize: fs(7),
    color: 'rgba(255,255,255,.55)',
    letterSpacing: 1,
  },
  rarityRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  rarText: {
    fontFamily: fonts.spaceMono,
    fontSize: fs(7),
    letterSpacing: 1,
  },
});
