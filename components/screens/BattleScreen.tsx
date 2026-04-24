import { useState, useRef, useCallback } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useGame } from '@/lib/game-state';
import { CARDS } from '@/lib/data/cards';
import { useCardSizeMultiplier } from '@/lib/card-layout';
import CardComponent from '@/components/Card';
import { colors, fonts, fs } from '@/lib/tokens';
import type { Card } from '@/lib/data/cards';

interface BattleLog { type: string; msg: string; }

interface FightState {
  playerCard: Card;
  /** Second engaged slot from track list slot 2, if any. */
  playerCard2: Card | null;
  enemyCard: Card;
  /** Second enemy engagement slot (rival bench). */
  enemyCard2: Card | null;
  playerHP: number; playerMaxHP: number;
  enemyHP: number; enemyMaxHP: number;
  log: BattleLog[];
  phase: 'fighting' | 'done';
  specialUsed: boolean; stunned: boolean; debuff: number; playerDebuff: number;
  result?: 'win' | 'lose';
  buttonsDisabled: boolean;
}

function calcDmg(card: Card, base?: number): number {
  const dmg = base !== undefined ? base : Math.floor(card.power * 0.1) + Math.floor(Math.random() * 6) + 4;
  return Math.max(1, dmg);
}

function hpColor(pct: number) {
  if (pct < 25) return '#c03030';
  if (pct < 50) return '#cca030';
  return '#5aba40';
}

const CSM_W = 149;
const CSM_H = 220;

export default function BattleScreen() {
  const router = useRouter();
  const cardM = useCardSizeMultiplier();
  const { state, showToast, advanceMission, earnCoins } = useGame();
  const { trackList } = state;
  const [fight, setFight] = useState<FightState | null>(null);
  const logRef = useRef<ScrollView>(null);

  const lineupCards = trackList
    .map((id) => CARDS.find((c) => c.id === id))
    .filter((c): c is Card => c != null);
  const canStart = lineupCards.length > 0;

  const addLog = useCallback((fs: FightState, type: string, msg: string): FightState =>
    ({ ...fs, log: [...fs.log, { type, msg }] }), []);

  function startBattle() {
    const leadId = trackList[0];
    if (leadId == null) return;
    const playerCard = CARDS.find((c) => c.id === leadId);
    if (!playerCard) return;
    const sid = trackList[1];
    const playerCard2 =
      sid != null ? (CARDS.find((c) => c.id === sid) ?? null) : null;
    const avoidIds: number[] = [playerCard.id];
    if (playerCard2) avoidIds.push(playerCard2.id);
    const avoid = new Set(avoidIds);
    const enemies = CARDS.filter((c) => !avoid.has(c.id));
    const enemyCard = enemies[Math.floor(Math.random() * enemies.length)];
    const enemies2 = enemies.filter((c) => c.id !== enemyCard.id);
    const enemyCard2 =
      enemies2.length > 0
        ? enemies2[Math.floor(Math.random() * enemies2.length)]
        : null;
    let fs: FightState = {
      playerCard,
      playerCard2,
      enemyCard,
      enemyCard2,
      playerHP: 100, playerMaxHP: 100,
      enemyHP: 100, enemyMaxHP: 100,
      log: [], phase: 'fighting',
      specialUsed: false, stunned: false, debuff: 0, playerDebuff: 0,
      buttonsDisabled: false,
    };
    fs = addLog(fs, 'sys', `${playerCard.title} vs ${enemyCard.title}`);
    fs = addLog(fs, 'sys', 'Let the music decide the winner…');
    setFight(fs);
  }

  function doAttack() {
    if (!fight || fight.phase !== 'fighting' || fight.buttonsDisabled) return;
    setFight(prev => {
      if (!prev) return prev;
      let fs = { ...prev, buttonsDisabled: true };
      if (fs.stunned) {
        fs = addLog(fs, 'dmg', `${fs.playerCard.title} is stunned and loses their turn!`);
        fs = { ...fs, stunned: false };
        setTimeout(() => setFight(curr => curr ? enemyTurn(curr) : curr), 800);
        return fs;
      }
      let dmg = calcDmg(fs.playerCard);
      if (fs.playerDebuff > 0) { dmg = Math.max(1, dmg - fs.playerDebuff); fs = { ...fs, playerDebuff: 0 }; }
      if (fs.debuff > 0) { dmg = Math.floor(dmg * (1 - fs.debuff)); fs = { ...fs, debuff: Math.max(0, fs.debuff - 0.5) }; }
      return hitEnemy(fs, dmg);
    });
  }

  function doSpecial() {
    if (!fight || fight.phase !== 'fighting' || fight.specialUsed || fight.buttonsDisabled) return;
    setFight(prev => {
      if (!prev) return prev;
      let fs = { ...prev, specialUsed: true, buttonsDisabled: true };
      fs = addLog(fs, 'special', `✦ ${fs.playerCard.title} uses "${fs.playerCard.ability}"!`);
      setTimeout(() => setFight(curr => curr ? applySpecial(curr) : curr), 10);
      return fs;
    });
  }

  function applySpecial(fs: FightState): FightState {
    const card = fs.playerCard;
    const genre = card.genre;
    if (genre === 'Rock') { return hitEnemy(fs, calcDmg(card) * 2); }
    if (genre === 'Pop')  { fs = heal(fs, 15, true); fs = { ...fs, debuff: 0.2 }; fs = addLog(fs, 'heal', `${card.ability}: +15 HP`); return enemyTurn(fs); }
    if (genre === 'Vintage') { const m = 1 + Math.random() * 2; return hitEnemy(fs, Math.floor(calcDmg(card) * m)); }
    if (genre === 'Electro') { fs = addLog(fs, 'special', `${card.ability}: stun!`); fs = { ...fs, stunned: true }; return hitEnemy(fs, calcDmg(card) + 12); }
    if (genre === 'HipHop')  { fs = { ...fs, debuff: 0.5 }; fs = addLog(fs, 'special', `${card.ability}: -50% enemy atk`); return enemyTurn(fs); }
    if (genre === 'Reggae')  { fs = heal(fs, 20, true); fs = addLog(fs, 'heal', `${card.ability}: +20 HP`); return enemyTurn(fs); }
    if (genre === 'Funk')    { fs = heal(fs, 12, true); return hitEnemy(fs, calcDmg(card)); }
    if (genre === 'Classic') {
      for (let i = 0; i < 3; i++) {
        const dmg = Math.floor(calcDmg(card) * 0.6);
        fs = addLog(fs, 'dmg', `Hit ${i + 1}/3: ${dmg}`);
        fs = { ...fs, enemyHP: Math.max(0, fs.enemyHP - dmg) };
        if (fs.enemyHP <= 0) return endBattle(fs, true);
      }
      return enemyTurn(fs);
    }
    return hitEnemy(fs, calcDmg(card) + 3);
  }

  function hitEnemy(fs: FightState, dmg: number): FightState {
    fs = addLog(fs, 'dmg', `${fs.playerCard.title} deals ${dmg} dmg`);
    fs = { ...fs, enemyHP: Math.max(0, fs.enemyHP - dmg) };
    if (fs.enemyHP <= 0) return endBattle(fs, true);
    setTimeout(() => setFight(curr => curr ? enemyTurn(curr) : curr), 900);
    return fs;
  }

  function enemyTurn(fs: FightState): FightState {
    if (fs.phase !== 'fighting') return fs;
    let dmg = calcDmg(fs.enemyCard);
    if (fs.debuff > 0) dmg = Math.floor(dmg * (1 - fs.debuff));
    if (Math.random() < 0.22) dmg = Math.floor(dmg * (1.4 + Math.random() * 0.6));
    fs = addLog(fs, 'dmg', `${fs.enemyCard.title} deals ${dmg} dmg`);
    fs = { ...fs, playerHP: Math.max(0, fs.playerHP - dmg) };
    if (fs.playerHP <= 0) return endBattle(fs, false);
    setTimeout(() => setFight(curr => curr ? { ...curr, buttonsDisabled: false } : curr), 600);
    return fs;
  }

  function heal(fs: FightState, amount: number, isPlayer: boolean): FightState {
    if (isPlayer) return { ...fs, playerHP: Math.min(fs.playerMaxHP, fs.playerHP + amount) };
    return { ...fs, enemyHP: Math.min(fs.enemyMaxHP, fs.enemyHP + amount) };
  }

  function endBattle(fs: FightState, won: boolean): FightState {
    fs = { ...fs, phase: 'done', result: won ? 'win' : 'lose', buttonsDisabled: true };
    if (won) { earnCoins(80); advanceMission(3, 1); showToast('Victory! +80 coins', 'ok'); }
    else { showToast('Defeat. Better luck next time…', 'err'); }
    return addLog(fs, 'sys', won ? '⬡ Victory! +80 coins.' : '✕ Defeat.');
  }

  if (!fight) {
    return (
      <View style={styles.screen}>
        <View style={styles.sHdr}>
          <Text style={styles.lbl}>BATTLE ARENA</Text>
          <Text style={styles.h2}>YOUR TRACK LIST</Text>
        </View>
        {canStart ? (
          <>
            <Text style={styles.pickLabel}>
              This duel uses your saved track list. Slot 1 is your fighter for now; the rest of
              the lineup is for future rules.
            </Text>
            <ScrollView contentContainerStyle={styles.pickGrid}>
              {lineupCards.map((card, i) => (
                <View key={card.id} style={styles.pickCardWrap}>
                  <Text style={styles.pickSlotNum}>{i + 1}</Text>
                  <CardComponent card={card} wrapClass="csm" />
                </View>
              ))}
            </ScrollView>
            <Text style={styles.leadHint}>
              Lead fighter: {lineupCards[0]?.title}
              {lineupCards.length > 1
                ? ` · ${lineupCards.length} cards in lineup`
                : ''}
            </Text>
          </>
        ) : (
          <View style={styles.emptyLineup}>
            <Text style={styles.emptyTitle}>No track list yet</Text>
            <Text style={styles.emptyBody}>
              Add at least one card to your track list before you can enter the arena.
            </Text>
            <Pressable
              style={styles.btnPrimary}
              onPress={() => router.push('/tracklist')}
            >
              <Text style={styles.btnPrimaryText}>Build track list</Text>
            </Pressable>
          </View>
        )}
        <View style={styles.startRow}>
          <Pressable
            style={[styles.btnAttack, !canStart && styles.btnDisabled]}
            disabled={!canStart}
            onPress={startBattle}
          >
            <Text style={styles.btnAttackText}>Start Battle</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  const {
    playerCard,
    playerCard2,
    enemyCard,
    enemyCard2,
    playerHP,
    playerMaxHP,
    enemyHP,
    enemyMaxHP,
    log,
    phase,
    result,
    specialUsed,
    buttonsDisabled,
  } = fight;
  const ppct = (playerHP / playerMaxHP) * 100;
  const epct = (enemyHP / enemyMaxHP) * 100;

  function renderEngageSlot(card: Card | null, side: 'enemy' | 'player', index: number) {
    const key = `${side}-slot-${index}-${card?.id ?? 'empty'}`;
    if (card) {
      return (
        <View key={key} style={styles.engageSlot}>
          <CardComponent card={card} wrapClass="csm" />
        </View>
      );
    }
    return (
      <View
        key={key}
        style={[
          styles.engageSlot,
          styles.engageSlotEmpty,
          { width: CSM_W * cardM, height: CSM_H * cardM, borderRadius: 10 * cardM },
        ]}
      >
        <Text style={styles.engageSlotEmptyText}>—</Text>
        <Text style={styles.engageSlotEmptyLbl}>Libre</Text>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <View style={styles.arena}>
        <View style={styles.battleColumn}>
          <View style={styles.enemyBand}>
            <Text style={styles.bandLabel}>Adversaire</Text>
            <View style={styles.hpWrap}>
              <View style={styles.hpBar}>
                <View
                  style={[
                    styles.hpFill,
                    { width: `${epct}%` as any, backgroundColor: hpColor(epct) },
                  ]}
                />
              </View>
              <Text style={styles.hpTxt}>
                {enemyHP} / {enemyMaxHP}
              </Text>
            </View>
            <View style={styles.engageRow}>
              {renderEngageSlot(enemyCard, 'enemy', 0)}
              {renderEngageSlot(enemyCard2, 'enemy', 1)}
            </View>
          </View>

          <View style={styles.engageMid}>
            <Text style={styles.vsText}>VS</Text>
          </View>

          <View style={styles.playerBand}>
            <Text style={styles.bandLabel}>Vous</Text>
            <View style={styles.hpWrap}>
              <View style={styles.hpBar}>
                <View
                  style={[
                    styles.hpFill,
                    { width: `${ppct}%` as any, backgroundColor: hpColor(ppct) },
                  ]}
                />
              </View>
              <Text style={styles.hpTxt}>
                {playerHP} / {playerMaxHP}
              </Text>
            </View>
            <View style={styles.engageRow}>
              {renderEngageSlot(playerCard, 'player', 0)}
              {renderEngageSlot(playerCard2, 'player', 1)}
            </View>
          </View>
        </View>

        {phase === 'fighting' && (
          <View style={styles.controls}>
            <Pressable style={[styles.btnAttack, buttonsDisabled && styles.btnDisabled]} disabled={buttonsDisabled} onPress={doAttack}>
              <Text style={styles.btnAttackText}>Attack</Text>
            </Pressable>
            <Pressable
              style={[styles.btnSpecial, (buttonsDisabled || specialUsed) && styles.btnDisabled]}
              disabled={buttonsDisabled || specialUsed}
              onPress={doSpecial}
            >
              <Text style={styles.btnSpecialText}>✦ {playerCard.ability}</Text>
            </Pressable>
          </View>
        )}

        {phase === 'done' && (
          <View style={styles.resultWrap}>
            <Text style={[styles.resultTitle, { color: result === 'win' ? colors.gold : '#c03030' }]}>
              {result === 'win' ? 'VICTORY' : 'DEFEAT'}
            </Text>
            <Text style={styles.resultSub}>
              {result === 'win' ? 'The music triumphs.' : 'The beat goes on…'}
            </Text>
            <Pressable style={styles.btnPrimary} onPress={() => setFight(null)}>
              <Text style={styles.btnPrimaryText}>Play Again</Text>
            </Pressable>
          </View>
        )}

        <ScrollView style={styles.log} ref={logRef} onContentSizeChange={() => logRef.current?.scrollToEnd()}>
          {log.map((entry, i) => (
            <Text key={i} style={[styles.logLine, entry.type === 'dmg' && styles.logDmg, entry.type === 'heal' && styles.logHeal, entry.type === 'special' && styles.logSpecial]}>
              {entry.msg}
            </Text>
          ))}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  sHdr: { padding: 20, gap: 4 },
  lbl: { fontFamily: fonts.spaceMono, fontSize: fs(9), letterSpacing: 3, color: colors.muted, textTransform: 'uppercase' },
  h2: { fontFamily: fonts.cinzelBold, fontSize: fs(22), letterSpacing: 3, color: colors.white },
  pickLabel: {
    fontFamily: fonts.spaceMono,
    fontSize: fs(8),
    letterSpacing: 0.4,
    color: colors.muted,
    paddingHorizontal: 20,
    marginBottom: 12,
    textAlign: 'center',
    lineHeight: fs(16),
  },
  pickGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, padding: 20, justifyContent: 'center' },
  pickCardWrap: { alignItems: 'center', gap: 6 },
  pickSlotNum: {
    fontFamily: fonts.spaceMono,
    fontSize: fs(8),
    color: colors.muted,
    letterSpacing: 1,
  },
  leadHint: {
    fontFamily: fonts.cormorantItalic,
    fontSize: fs(13),
    color: colors.muted,
    textAlign: 'center',
    paddingHorizontal: 24,
    marginBottom: 8,
  },
  emptyLineup: { paddingHorizontal: 28, paddingVertical: 24, gap: 14, alignItems: 'center' },
  emptyTitle: {
    fontFamily: fonts.cinzelBold,
    fontSize: fs(16),
    letterSpacing: 2,
    color: colors.white,
    textAlign: 'center',
  },
  emptyBody: {
    fontFamily: fonts.cormorantItalic,
    fontSize: fs(15),
    color: colors.muted,
    textAlign: 'center',
    lineHeight: fs(22),
  },
  startRow: { padding: 20, alignItems: 'center' },
  arena: { flex: 1, padding: 12, gap: 12 },
  battleColumn: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    minHeight: 280,
    gap: 8,
  },
  enemyBand: { alignItems: 'center', gap: 8 },
  playerBand: { alignItems: 'center', gap: 8 },
  bandLabel: {
    fontFamily: fonts.spaceMono,
    fontSize: fs(9),
    letterSpacing: 2,
    color: colors.muted,
    textTransform: 'uppercase',
  },
  engageMid: { alignItems: 'center', justifyContent: 'center', paddingVertical: 4 },
  engageRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    gap: 12,
    flexWrap: 'wrap',
  },
  engageSlot: { alignItems: 'center' },
  engageSlotEmpty: {
    borderWidth: 1.5,
    borderColor: colors.border,
    borderStyle: 'dashed',
    backgroundColor: 'rgba(0,0,0,.25)',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },
  engageSlotEmptyText: {
    fontFamily: fonts.spaceMono,
    fontSize: fs(22),
    color: colors.muted,
    opacity: 0.45,
  },
  engageSlotEmptyLbl: {
    fontFamily: fonts.spaceMono,
    fontSize: fs(7),
    letterSpacing: 1,
    color: colors.muted,
    textTransform: 'uppercase',
  },
  hpWrap: { width: '100%', maxWidth: 320, gap: 4, alignItems: 'center', alignSelf: 'center' },
  hpBar: { width: '100%', height: 8, borderRadius: 4, backgroundColor: 'rgba(0,0,0,.5)', overflow: 'hidden' },
  hpFill: { height: '100%', borderRadius: 4 },
  hpTxt: { fontFamily: fonts.spaceMono, fontSize: fs(8), color: colors.muted },
  vsText: { fontFamily: fonts.cinzelBold, fontSize: fs(16), letterSpacing: 3, color: colors.muted },
  controls: { flexDirection: 'row', gap: 12, justifyContent: 'center' },
  btnAttack: {
    backgroundColor: '#8a1a1a',
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 3,
  },
  btnAttackText: { fontFamily: fonts.cinzelBold, fontSize: fs(12), letterSpacing: 2, color: colors.white },
  btnSpecial: {
    borderWidth: 1,
    borderColor: colors.gold,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 3,
  },
  btnSpecialText: { fontFamily: fonts.cinzelBold, fontSize: fs(11), letterSpacing: 1, color: colors.gold },
  btnDisabled: { opacity: 0.35 },
  resultWrap: { alignItems: 'center', gap: 12 },
  resultTitle: { fontFamily: fonts.cinzelBold, fontSize: fs(28), letterSpacing: 4 },
  resultSub: { fontFamily: fonts.cormorantItalic, fontSize: fs(18), color: colors.muted },
  btnPrimary: { backgroundColor: colors.gold, paddingVertical: 13, paddingHorizontal: 32, borderRadius: 3, marginTop: 8 },
  btnPrimaryText: { fontFamily: fonts.cinzelBold, fontSize: fs(11), letterSpacing: 2, color: '#0a0600' },
  log: { flex: 1, backgroundColor: 'rgba(0,0,0,.3)', borderRadius: 4, padding: 10, maxHeight: 160 },
  logLine: { fontFamily: fonts.spaceMono, fontSize: fs(8), color: colors.muted, lineHeight: fs(16) },
  logDmg: { color: '#d05040' },
  logHeal: { color: '#50a840' },
  logSpecial: { color: colors.gold },
});
