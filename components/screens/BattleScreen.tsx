import { useState, useRef, useCallback, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  Modal,
} from "react-native";
import { useRouter } from "expo-router";
import { useGame, type BattleDeck } from "@/lib/game-state";
import { CARDS } from "@/lib/data/cards";
import { useCardSizeMultiplier } from "@/lib/card-layout";
import CardComponent from "@/components/Card";
import { colors, fonts, fs } from "@/lib/tokens";
import type { Card } from "@/lib/data/cards";

interface BattleLog {
  type: string;
  msg: string;
}

interface FightState {
  playerCard: Card;
  /** Second engaged slot from track list slot 2, if any. */
  playerCard2: Card | null;
  enemyCard: Card;
  /** Second enemy engagement slot (rival bench). */
  enemyCard2: Card | null;
  /** Shared crowd mood: -100 (you’re losing the room) … +100 (encore). */
  mood: number;
  log: BattleLog[];
  phase: "fighting" | "done";
  specialUsed: boolean;
  stunned: boolean;
  debuff: number;
  playerDebuff: number;
  result?: "win" | "lose";
  buttonsDisabled: boolean;
}

function calcDmg(card: Card, base?: number): number {
  const dmg =
    base !== undefined
      ? base
      : Math.floor(card.power * 0.1) + Math.floor(Math.random() * 6) + 4;
  return Math.max(1, dmg);
}

function moodDeltaFromHit(dmg: number): number {
  return Math.max(3, Math.min(30, Math.round(dmg * 0.95)));
}

function moodValueColor(mood: number) {
  if (mood <= -40) return "#b04050";
  if (mood >= 40) return colors.gold;
  return colors.muted;
}

/** Match `cxs` wrap in `Card.tsx` (battle slots). */
const BATTLE_CARD_W = 112;
const BATTLE_CARD_H = 165;

export default function BattleScreen() {
  const router = useRouter();
  const cardM = useCardSizeMultiplier();
  const { state, showToast, advanceMission, earnCoins } = useGame();
  const { collection, decks } = state;
  const [selectedDeckId, setSelectedDeckId] = useState(
    () => state.decks[0]?.id ?? "",
  );
  const [expandedDeckId, setExpandedDeckId] = useState<string | null>(null);
  const [fight, setFight] = useState<FightState | null>(null);
  const [zoomCard, setZoomCard] = useState<Card | null>(null);
  const [attackPrimed, setAttackPrimed] = useState(false);
  const prevButtonsDisabled = useRef<boolean | null>(null);
  const logRef = useRef<ScrollView>(null);

  useEffect(() => {
    if (!fight) {
      setZoomCard(null);
      setAttackPrimed(false);
      prevButtonsDisabled.current = null;
      return;
    }
    if (fight.phase === "fighting") {
      const d = fight.buttonsDisabled;
      if (prevButtonsDisabled.current === true && d === false) {
        setAttackPrimed(false);
      }
      prevButtonsDisabled.current = d;
    }
  }, [fight]);

  useEffect(() => {
    if (!state.decks.some((d) => d.id === selectedDeckId)) {
      setSelectedDeckId(state.decks[0]?.id ?? "");
    }
  }, [state.decks, selectedDeckId]);

  const lineupCards = (
    state.decks.find((d) => d.id === selectedDeckId)?.cardIds ?? []
  )
    .map((id) => CARDS.find((c) => c.id === id))
    .filter(
      (c): c is Card => c != null && collection.includes(c.id),
    );
  const canStart = lineupCards.length > 0;
  const hasDecks = state.decks.length > 0;

  function resolvedCardsForDeck(deck: BattleDeck) {
    return deck.cardIds
      .map((id) => CARDS.find((c) => c.id === id))
      .filter(
        (c): c is Card => c != null && collection.includes(c.id),
      );
  }

  const addLog = useCallback(
    (fs: FightState, type: string, msg: string): FightState => ({
      ...fs,
      log: [...fs.log, { type, msg }],
    }),
    [],
  );

  function startBattle() {
    const deck = state.decks.find((d) => d.id === selectedDeckId);
    if (!deck || deck.cardIds.length === 0) return;
    const resolved = deck.cardIds
      .map((id) => CARDS.find((c) => c.id === id))
      .filter(
        (c): c is Card => c != null && collection.includes(c.id),
      );
    if (resolved.length === 0) return;
    const playerCard = resolved[0];
    const sid = resolved[1]?.id;
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
    const fs: FightState = {
      playerCard,
      playerCard2,
      enemyCard,
      enemyCard2,
      playerHP: 100,
      playerMaxHP: 100,
      enemyHP: 100,
      enemyMaxHP: 100,
      log: [],
      phase: "fighting",
      specialUsed: false,
      stunned: false,
      debuff: 0,
      playerDebuff: 0,
      buttonsDisabled: false,
    };
    setFight(fs);
  }

  function doAttack() {
    if (
      !fight ||
      fight.phase !== "fighting" ||
      fight.buttonsDisabled ||
      !attackPrimed
    )
      return;
    setAttackPrimed(false);
    setFight((prev) => {
      if (!prev) return prev;
      let fs = { ...prev, buttonsDisabled: true };
      if (fs.stunned) {
        fs = addLog(
          fs,
          "dmg",
          `${fs.playerCard.title} is stunned and loses their turn!`,
        );
        fs = { ...fs, stunned: false };
        setTimeout(
          () => setFight((curr) => (curr ? enemyTurn(curr) : curr)),
          800,
        );
        return fs;
      }
      let dmg = calcDmg(fs.playerCard);
      if (fs.playerDebuff > 0) {
        dmg = Math.max(1, dmg - fs.playerDebuff);
        fs = { ...fs, playerDebuff: 0 };
      }
      if (fs.debuff > 0) {
        dmg = Math.floor(dmg * (1 - fs.debuff));
        fs = { ...fs, debuff: Math.max(0, fs.debuff - 0.5) };
      }
      return hitEnemy(fs, dmg);
    });
  }

  function doSpecial() {
    if (
      !fight ||
      fight.phase !== "fighting" ||
      fight.specialUsed ||
      fight.buttonsDisabled
    )
      return;
    setFight((prev) => {
      if (!prev) return prev;
      let fs = { ...prev, specialUsed: true, buttonsDisabled: true };
      fs = addLog(
        fs,
        "special",
        `✦ ${fs.playerCard.title} uses "${fs.playerCard.ability}"!`,
      );
      setTimeout(
        () => setFight((curr) => (curr ? applySpecial(curr) : curr)),
        10,
      );
      return fs;
    });
  }

  function applySpecial(fs: FightState): FightState {
    const card = fs.playerCard;
    const genre = card.genre;
    if (genre === "Rock") {
      return hitEnemy(fs, calcDmg(card) * 2);
    }
    if (genre === "Pop") {
      fs = heal(fs, 15, true);
      fs = { ...fs, debuff: 0.2 };
      fs = addLog(fs, "heal", `${card.ability}: +15 HP`);
      return enemyTurn(fs);
    }
    if (genre === "Vintage") {
      const m = 1 + Math.random() * 2;
      return hitEnemy(fs, Math.floor(calcDmg(card) * m));
    }
    if (genre === "Electro") {
      fs = addLog(fs, "special", `${card.ability}: stun!`);
      fs = { ...fs, stunned: true };
      return hitEnemy(fs, calcDmg(card) + 12);
    }
    if (genre === "HipHop") {
      fs = { ...fs, debuff: 0.5 };
      fs = addLog(fs, "special", `${card.ability}: -50% enemy atk`);
      return enemyTurn(fs);
    }
    if (genre === "Reggae") {
      fs = heal(fs, 20, true);
      fs = addLog(fs, "heal", `${card.ability}: +20 HP`);
      return enemyTurn(fs);
    }
    if (genre === "Funk") {
      fs = heal(fs, 12, true);
      return hitEnemy(fs, calcDmg(card));
    }
    if (genre === "Classic") {
      for (let i = 0; i < 3; i++) {
        const dmg = Math.floor(calcDmg(card) * 0.6);
        fs = addLog(fs, "dmg", `Hit ${i + 1}/3: ${dmg}`);
        fs = { ...fs, enemyHP: Math.max(0, fs.enemyHP - dmg) };
        if (fs.enemyHP <= 0) return endBattle(fs, true);
      }
      return enemyTurn(fs);
    }
    return hitEnemy(fs, calcDmg(card) + 3);
  }

  function hitEnemy(fs: FightState, dmg: number): FightState {
    fs = addLog(fs, "dmg", `${fs.playerCard.title} deals ${dmg} dmg`);
    fs = { ...fs, enemyHP: Math.max(0, fs.enemyHP - dmg) };
    if (fs.enemyHP <= 0) return endBattle(fs, true);
    setTimeout(() => setFight((curr) => (curr ? enemyTurn(curr) : curr)), 900);
    return fs;
  }

  function enemyTurn(fs: FightState): FightState {
    if (fs.phase !== "fighting") return fs;
    let dmg = calcDmg(fs.enemyCard);
    if (fs.debuff > 0) dmg = Math.floor(dmg * (1 - fs.debuff));
    if (Math.random() < 0.22)
      dmg = Math.floor(dmg * (1.4 + Math.random() * 0.6));
    fs = addLog(fs, "dmg", `${fs.enemyCard.title} deals ${dmg} dmg`);
    fs = { ...fs, playerHP: Math.max(0, fs.playerHP - dmg) };
    if (fs.playerHP <= 0) return endBattle(fs, false);
    setTimeout(
      () =>
        setFight((curr) => (curr ? { ...curr, buttonsDisabled: false } : curr)),
      600,
    );
    return fs;
  }

  function heal(fs: FightState, amount: number, isPlayer: boolean): FightState {
    if (isPlayer)
      return {
        ...fs,
        playerHP: Math.min(fs.playerMaxHP, fs.playerHP + amount),
      };
    return { ...fs, enemyHP: Math.min(fs.enemyMaxHP, fs.enemyHP + amount) };
  }

  function endBattle(fs: FightState, won: boolean): FightState {
    fs = {
      ...fs,
      phase: "done",
      result: won ? "win" : "lose",
      buttonsDisabled: true,
    };
    if (won) {
      earnCoins(80);
      advanceMission(3, 1);
      showToast("Victory! +80 coins", "ok");
    } else {
      showToast("Defeat. Better luck next time…", "err");
    }
    return addLog(fs, "sys", won ? "⬡ Victory! +80 coins." : "✕ Defeat.");
  }

  if (!fight) {
    return (
      <View style={styles.screen}>
        <View style={styles.sHdr}>
          <Text style={styles.lbl}>BATTLE ARENA</Text>
          <Text style={styles.h2}>Track lists</Text>
        </View>
        {!hasDecks ? (
          <View style={styles.emptyLineup}>
            <Text style={styles.emptyTitle}>Aucune track list</Text>
            <Text style={styles.emptyBody}>
              Ajoute des lineups sauvegardées pour l’arène — ou réinitialise
              l’app avec les données de démo.
            </Text>
            <Pressable
              style={styles.btnPrimary}
              onPress={() => router.push("/tracklist")}
            >
              <Text style={styles.btnPrimaryText}>Track lists</Text>
            </Pressable>
          </View>
        ) : (
          <>
            <Text style={styles.pickLabel}>
              Une track list par défaut est déjà là. Touche une ligne pour la
              déplier et voir les cartes ; dans la zone ouverte, appuie sur
              « Utiliser pour ce duel » pour l’engager. Slot 1 = combattant.
            </Text>
            <View style={styles.tlList}>
              {decks.map((deck) => {
                const expanded = expandedDeckId === deck.id;
                const forDuel = deck.id === selectedDeckId;
                const resolved = resolvedCardsForDeck(deck);
                return (
                  <View key={deck.id} style={styles.tlItem}>
                    <Pressable
                      onPress={() =>
                        setExpandedDeckId((prev) =>
                          prev === deck.id ? null : deck.id,
                        )
                      }
                      style={[
                        styles.tlHeader,
                        forDuel && styles.tlHeaderForDuel,
                      ]}
                    >
                      <Text style={styles.tlChevron}>
                        {expanded ? "▼" : "▶"}
                      </Text>
                      <View style={styles.tlHeaderMain}>
                        <Text style={styles.tlName}>{deck.name}</Text>
                        {forDuel ? (
                          <Text style={styles.tlForDuelLbl}>
                            Sélectionnée pour ce duel
                          </Text>
                        ) : null}
                      </View>
                      <Text style={styles.tlCount}>
                        {deck.cardIds.length}
                      </Text>
                    </Pressable>
                    {expanded ? (
                      <View style={styles.tlBody}>
                        {resolved.length > 0 ? (
                          <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={styles.tlCardsRow}
                          >
                            {resolved.map((card, i) => (
                              <View key={card.id} style={styles.pickCardWrap}>
                                <Text style={styles.pickSlotNum}>{i + 1}</Text>
                                <CardComponent card={card} wrapClass="cxs" />
                              </View>
                            ))}
                          </ScrollView>
                        ) : (
                          <Text style={styles.tlEmptyResolved}>
                            Aucune carte de cette liste n’est dans ta collection.
                          </Text>
                        )}
                        <Pressable
                          style={styles.tlUseBtn}
                          onPress={() => setSelectedDeckId(deck.id)}
                        >
                          <Text style={styles.tlUseBtnText}>
                            Utiliser pour ce duel
                          </Text>
                        </Pressable>
                      </View>
                    ) : null}
                  </View>
                );
              })}
            </View>
            {canStart ? (
              <Text style={styles.leadHint}>
                Lineup active : {lineupCards[0]?.title}
                {lineupCards.length > 1
                  ? ` · ${lineupCards.length} cartes`
                  : ""}
              </Text>
            ) : (
              <Text style={styles.warnHint}>
                Déplie une track list puis choisis « Utiliser pour ce duel »
                pour une lineup avec au moins une carte dans ta collection.
              </Text>
            )}
          </>
        )}
        <View style={styles.startRow}>
          <Pressable
            style={[styles.btnAttack, !canStart && styles.btnDisabled]}
            disabled={!canStart}
            onPress={startBattle}
          >
            <Text style={styles.btnAttackText}>Lancer le combat</Text>
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

  function openBattleZoom(card: Card) {
    if (fight?.buttonsDisabled) return;
    setZoomCard(card);
    setAttackPrimed(false);
  }

  function renderEngageSlot(
    card: Card | null,
    side: "enemy" | "player",
    index: number,
  ) {
    const key = `${side}-slot-${index}-${card?.id ?? "empty"}`;
    if (card) {
      return (
        <View key={key} style={styles.engageSlot}>
          <CardComponent
            card={card}
            wrapClass="cxs"
            onClick={
              side === "player" && !buttonsDisabled
                ? () => openBattleZoom(card)
                : undefined
            }
          />
        </View>
      );
    }
    return (
      <View
        key={key}
        style={[
          styles.engageSlot,
          styles.engageSlotEmpty,
          {
            width: BATTLE_CARD_W * cardM,
            height: BATTLE_CARD_H * cardM,
            borderRadius: 8 * cardM,
          },
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
                    {
                      width: `${epct}%` as any,
                      backgroundColor: hpColor(epct),
                    },
                  ]}
                />
              </View>
              <Text style={styles.hpTxt}>
                {enemyHP} / {enemyMaxHP}
              </Text>
            </View>
            <View style={styles.engageRow}>
              {renderEngageSlot(enemyCard, "enemy", 0)}
              {renderEngageSlot(enemyCard2, "enemy", 1)}
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
                    {
                      width: `${ppct}%` as any,
                      backgroundColor: hpColor(ppct),
                    },
                  ]}
                />
              </View>
              <Text style={styles.hpTxt}>
                {playerHP} / {playerMaxHP}
              </Text>
            </View>
            <View style={styles.engageRow}>
              {renderEngageSlot(playerCard, "player", 0)}
              {renderEngageSlot(playerCard2, "player", 1)}
            </View>

            {phase === "fighting" && (
              <View style={styles.controlsColumn}>
                {!buttonsDisabled && !attackPrimed ? (
                  <Text style={styles.controlsHint}>
                    Tap one of your cards to zoom, then confirm to unlock
                    Attack.
                  </Text>
                ) : null}
                <View style={styles.controlsRow}>
                  {attackPrimed && !buttonsDisabled ? (
                    <Pressable style={styles.btnAttack} onPress={doAttack}>
                      <Text style={styles.btnAttackText}>Attack</Text>
                    </Pressable>
                  ) : (
                    <View style={styles.controlsAttackSpacer} />
                  )}
                  <Pressable
                    style={[
                      styles.btnSpecial,
                      (buttonsDisabled || specialUsed) && styles.btnDisabled,
                    ]}
                    disabled={buttonsDisabled || specialUsed}
                    onPress={doSpecial}
                  >
                    <Text style={styles.btnSpecialText} numberOfLines={2}>
                      ✦ {playerCard.ability}
                    </Text>
                  </Pressable>
                </View>
              </View>
            )}
          </View>
        </View>

        {phase === "done" && (
          <View style={styles.resultWrap}>
            <Text
              style={[
                styles.resultTitle,
                { color: result === "win" ? colors.gold : "#c03030" },
              ]}
            >
              {result === "win" ? "VICTORY" : "DEFEAT"}
            </Text>
            <Text style={styles.resultSub}>
              {result === "win" ? "The music triumphs." : "The beat goes on…"}
            </Text>
            <Pressable style={styles.btnPrimary} onPress={() => setFight(null)}>
              <Text style={styles.btnPrimaryText}>Play Again</Text>
            </Pressable>
          </View>
        )}

        <ScrollView
          style={styles.log}
          ref={logRef}
          onContentSizeChange={() => logRef.current?.scrollToEnd()}
        >
          {log.map((entry, i) => (
            <Text
              key={i}
              style={[
                styles.logLine,
                entry.type === "dmg" && styles.logDmg,
                entry.type === "heal" && styles.logHeal,
                entry.type === "special" && styles.logSpecial,
              ]}
            >
              {entry.msg}
            </Text>
          ))}
        </ScrollView>
      </View>

      <Modal
        visible={zoomCard != null}
        transparent
        animationType="fade"
        onRequestClose={() => setZoomCard(null)}
      >
        <View style={styles.zoomRoot}>
          <Pressable
            style={styles.zoomBackdropPress}
            onPress={() => setZoomCard(null)}
          />
          <View style={styles.zoomForeground} pointerEvents="box-none">
            {zoomCard ? (
              <>
                <CardComponent card={zoomCard} wrapClass="clg" />
                <Pressable
                  style={[styles.btnPrimary, styles.zoomConfirmBtn]}
                  onPress={() => {
                    setAttackPrimed(true);
                    setZoomCard(null);
                  }}
                >
                  <Text style={styles.btnPrimaryText}>
                    Confirm — ready to attack
                  </Text>
                </Pressable>
              </>
            ) : null}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  sHdr: { padding: 20, gap: 4 },
  lbl: {
    fontFamily: fonts.spaceMono,
    fontSize: fs(9),
    letterSpacing: 3,
    color: colors.muted,
    textTransform: "uppercase",
  },
  h2: {
    fontFamily: fonts.cinzelBold,
    fontSize: fs(22),
    letterSpacing: 3,
    color: colors.white,
  },
  pickLabel: {
    fontFamily: fonts.spaceMono,
    fontSize: fs(8),
    letterSpacing: 0.4,
    color: colors.muted,
    paddingHorizontal: 20,
    marginBottom: 12,
    textAlign: "center",
    lineHeight: fs(16),
  },
  tlList: {
    paddingHorizontal: 16,
    gap: 10,
    marginBottom: 8,
  },
  tlItem: {
    borderRadius: 4,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: "rgba(0,0,0,.22)",
    overflow: "hidden",
  },
  tlHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 12,
    paddingHorizontal: 12,
  },
  tlHeaderForDuel: {
    borderLeftWidth: 3,
    borderLeftColor: colors.gold,
    backgroundColor: "rgba(168,124,40,.08)",
  },
  tlChevron: {
    fontFamily: fonts.spaceMono,
    fontSize: fs(10),
    color: colors.muted,
    width: 20,
  },
  tlHeaderMain: { flex: 1, gap: 2 },
  tlName: {
    fontFamily: fonts.cinzelBold,
    fontSize: fs(12),
    letterSpacing: 0.8,
    color: colors.white,
  },
  tlForDuelLbl: {
    fontFamily: fonts.spaceMono,
    fontSize: fs(7),
    letterSpacing: 0.6,
    color: colors.gold,
    textTransform: "uppercase",
  },
  tlCount: {
    fontFamily: fonts.spaceMono,
    fontSize: fs(9),
    color: colors.muted,
  },
  tlBody: {
    paddingHorizontal: 12,
    paddingBottom: 12,
    paddingTop: 4,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: "rgba(0,0,0,.18)",
  },
  tlCardsRow: {
    flexDirection: "row",
    gap: 10,
    paddingVertical: 8,
    alignItems: "flex-end",
  },
  tlEmptyResolved: {
    fontFamily: fonts.cormorantItalic,
    fontSize: fs(13),
    color: colors.muted,
    paddingVertical: 8,
  },
  tlUseBtn: {
    alignSelf: "flex-start",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: colors.gold,
  },
  tlUseBtnText: {
    fontFamily: fonts.cinzelBold,
    fontSize: fs(10),
    letterSpacing: 1,
    color: colors.gold,
  },
  warnHint: {
    fontFamily: fonts.cormorantItalic,
    fontSize: fs(13),
    color: colors.muted,
    textAlign: "center",
    paddingHorizontal: 24,
    marginTop: 8,
    lineHeight: fs(20),
  },
  pickGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    padding: 20,
    justifyContent: "center",
  },
  pickCardWrap: { alignItems: "center", gap: 6 },
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
    textAlign: "center",
    paddingHorizontal: 24,
    marginBottom: 8,
  },
  emptyLineup: {
    paddingHorizontal: 28,
    paddingVertical: 24,
    gap: 14,
    alignItems: "center",
  },
  emptyTitle: {
    fontFamily: fonts.cinzelBold,
    fontSize: fs(16),
    letterSpacing: 2,
    color: colors.white,
    textAlign: "center",
  },
  emptyBody: {
    fontFamily: fonts.cormorantItalic,
    fontSize: fs(15),
    color: colors.muted,
    textAlign: "center",
    lineHeight: fs(22),
  },
  startRow: { padding: 20, alignItems: "center" },
  arena: { flex: 1, padding: 12, gap: 12 },
  battleColumn: {
    flexShrink: 0,
    flexDirection: "column",
    justifyContent: "flex-start",
    gap: 12,
  },
  enemyBand: { alignItems: "center", gap: 8, width: "100%" },
  playerBand: { alignItems: "center", gap: 8, width: "100%" },
  bandLabel: {
    fontFamily: fonts.spaceMono,
    fontSize: fs(9),
    letterSpacing: 2,
    color: colors.muted,
    textTransform: "uppercase",
  },
  engageMid: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 4,
  },
  engageRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "flex-end",
    gap: 12,
    flexWrap: "wrap",
  },
  engageSlot: { alignItems: "center" },
  engageSlotEmpty: {
    borderWidth: 1.5,
    borderColor: colors.border,
    borderStyle: "dashed",
    backgroundColor: "rgba(0,0,0,.25)",
    justifyContent: "center",
    alignItems: "center",
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
    textTransform: "uppercase",
  },
  hpWrap: {
    width: "100%",
    maxWidth: 320,
    gap: 4,
    alignItems: "center",
    alignSelf: "center",
  },
  hpBar: {
    width: "100%",
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(0,0,0,.5)",
    overflow: "hidden",
  },
  hpFill: { height: "100%", borderRadius: 4 },
  hpTxt: { fontFamily: fonts.spaceMono, fontSize: fs(8), color: colors.muted },
  vsText: {
    fontFamily: fonts.cinzelBold,
    fontSize: fs(16),
    letterSpacing: 3,
    color: colors.muted,
  },
  controlsColumn: {
    width: "100%",
    maxWidth: 400,
    alignSelf: "center",
    marginTop: 10,
    gap: 10,
    alignItems: "stretch",
  },
  controlsRow: {
    flexDirection: "row",
    gap: 10,
    justifyContent: "center",
    alignItems: "center",
    flexWrap: "wrap",
  },
  controlsHint: {
    width: "100%",
    fontFamily: fonts.spaceMono,
    fontSize: fs(7),
    letterSpacing: 0.5,
    color: colors.muted,
    textAlign: "center",
    lineHeight: fs(14),
    paddingHorizontal: 4,
  },
  controlsAttackSpacer: { width: 100, height: 44 },
  zoomRoot: {
    flex: 1,
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(9,8,13,.88)",
    padding: 20,
  },
  zoomBackdropPress: { ...StyleSheet.absoluteFill },
  zoomForeground: { alignItems: "center", gap: 20, zIndex: 1 },
  zoomConfirmBtn: { marginTop: 4 },
  btnAttack: {
    backgroundColor: "#8a1a1a",
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 3,
  },
  btnAttackText: {
    fontFamily: fonts.cinzelBold,
    fontSize: fs(12),
    letterSpacing: 2,
    color: colors.white,
  },
  btnSpecial: {
    maxWidth: 200,
    borderWidth: 1,
    borderColor: colors.gold,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 3,
  },
  btnSpecialText: {
    fontFamily: fonts.cinzelBold,
    fontSize: fs(10),
    letterSpacing: 1,
    color: colors.gold,
    textAlign: "center",
  },
  btnDisabled: { opacity: 0.35 },
  resultWrap: { alignItems: "center", gap: 12 },
  resultTitle: {
    fontFamily: fonts.cinzelBold,
    fontSize: fs(28),
    letterSpacing: 4,
  },
  resultSub: {
    fontFamily: fonts.cormorantItalic,
    fontSize: fs(18),
    color: colors.muted,
  },
  btnPrimary: {
    backgroundColor: colors.gold,
    paddingVertical: 13,
    paddingHorizontal: 32,
    borderRadius: 3,
    marginTop: 8,
  },
  btnPrimaryText: {
    fontFamily: fonts.cinzelBold,
    fontSize: fs(11),
    letterSpacing: 2,
    color: "#0a0600",
  },
  log: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,.3)",
    borderRadius: 4,
    padding: 10,
    maxHeight: 160,
  },
  logLine: {
    fontFamily: fonts.spaceMono,
    fontSize: fs(8),
    color: colors.muted,
    lineHeight: fs(16),
  },
  logDmg: { color: "#d05040" },
  logHeal: { color: "#50a840" },
  logSpecial: { color: colors.gold },
});
