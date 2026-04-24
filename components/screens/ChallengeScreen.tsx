import { useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, Modal } from 'react-native';
import { useGame } from '@/lib/game-state';
import { CARDS } from '@/lib/data/cards';
import { GENRE_CFG, DEFI_GENRES } from '@/lib/data/genres';
import CardComponent from '@/components/Card';
import { colors, fonts, genreColors, genreKey } from '@/lib/tokens';
import type { Card, Genre } from '@/lib/data/cards';

type Phase = 'pick' | 'guess';
type ChoiceResult = 'correct' | 'wrong' | null;

interface GuessState {
  card: Card;
  choices: Card[];
  chosenId: number | null;
  result: ChoiceResult;
}

export default function ChallengeScreen() {
  const { dispatch, showToast } = useGame();
  const [phase, setPhase] = useState<Phase>('pick');
  const [guess, setGuess] = useState<GuessState | null>(null);
  const [fullscreen, setFullscreen] = useState(false);

  function startDefi(genre: Genre) {
    const pool = CARDS.filter(c => c.genre === genre);
    if (!pool.length) return;
    const card = pool[Math.floor(Math.random() * pool.length)];
    let decoyPool = CARDS.filter(c => c.id !== card.id && c.genre === genre);
    if (decoyPool.length < 3) decoyPool = CARDS.filter(c => c.id !== card.id);
    const decoys = decoyPool.sort(() => Math.random() - 0.5).slice(0, 3);
    const choices = [card, ...decoys].sort(() => Math.random() - 0.5);
    setGuess({ card, choices, chosenId: null, result: null });
    setPhase('guess');
  }

  function checkDefi(chosenId: number) {
    if (!guess || guess.result !== null) return;
    const correct = chosenId === guess.card.id;
    setGuess(prev => prev ? { ...prev, chosenId, result: correct ? 'correct' : 'wrong' } : prev);
    if (correct) {
      dispatch({ type: 'ADD_TO_COLLECTION', ids: [guess.card.id] });
      showToast(`Correct! "${guess.card.title}" added to collection`, 'ok');
    } else {
      showToast('Wrong! Try another genre.', 'err');
    }
  }

  function reset() {
    setPhase('pick');
    setGuess(null);
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      {phase === 'pick' && (
        <View style={styles.pickWrap}>
          <View style={styles.sHdr}>
            <Text style={styles.lbl}>DAILY</Text>
            <Text style={styles.h2}>CHALLENGE</Text>
          </View>
          <Text style={styles.intro}>Pick a genre and identify the mystery card to win it!</Text>
          <View style={styles.genreGrid}>
            {DEFI_GENRES.map(g => {
              const cfg = GENRE_CFG[g];
              const gk = genreKey[g] ?? 'pop';
              const gc = genreColors[gk];
              return (
                <Pressable
                  key={g}
                  style={[styles.genreBtn, { borderColor: gc?.border ?? colors.border }]}
                  onPress={() => startDefi(g)}
                >
                  <Text style={styles.genreIcon}>{cfg.sym}</Text>
                  <Text style={[styles.genreLabel, { color: gc?.textMain ?? colors.white }]}>{cfg.genreLabel}</Text>
                </Pressable>
              );
            })}
          </View>
        </View>
      )}

      {phase === 'guess' && guess && (
        <>
        <Modal visible={fullscreen} transparent animationType="fade" onRequestClose={() => setFullscreen(false)}>
          <Pressable style={styles.modalBg} onPress={() => setFullscreen(false)}>
            <CardComponent card={guess.card} maskTitle />
          </Pressable>
        </Modal>
        <View style={styles.guessWrap}>
          <View style={styles.cardWrap}>
            <CardComponent card={guess.card} maskTitle wrapClass="csm" onClick={() => setFullscreen(true)} />
          </View>
          <View style={styles.form}>
            <Text style={styles.question}>What is the title of this card?</Text>
            <View style={styles.choices}>
              {guess.choices.map(c => {
                const isCorrect = guess.result !== null && c.id === guess.card.id;
                const isWrong   = guess.result !== null && c.id === guess.chosenId && c.id !== guess.card.id;
                return (
                  <Pressable
                    key={c.id}
                    style={[styles.choice, isCorrect && styles.choiceCorrect, isWrong && styles.choiceWrong]}
                    disabled={guess.result !== null}
                    onPress={() => checkDefi(c.id)}
                  >
                    <Text style={[styles.choiceText, isCorrect && styles.choiceTextCorrect, isWrong && styles.choiceTextWrong]}>
                      {c.title}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
            {guess.result && (
              <View style={[styles.feedback, guess.result === 'correct' ? styles.feedbackOk : styles.feedbackErr]}>
                <Text style={styles.feedbackText}>
                  {guess.result === 'correct'
                    ? `🎉 Correct! "${guess.card.title}" added to your collection.`
                    : `✗ Wrong! The answer was "${guess.card.title}".`}
                </Text>
              </View>
            )}
            {guess.result && (
              <Pressable style={styles.btnPrimary} onPress={reset}>
                <Text style={styles.btnPrimaryText}>Play Again</Text>
              </Pressable>
            )}
          </View>
        </View>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  content: { padding: 24, gap: 20 },
  pickWrap: { gap: 20 },
  sHdr: { gap: 4 },
  lbl: { fontFamily: fonts.spaceMono, fontSize: 9, letterSpacing: 3, color: colors.muted, textTransform: 'uppercase' },
  h2: { fontFamily: fonts.cinzelBold, fontSize: 22, letterSpacing: 3, color: colors.white },
  intro: { fontFamily: fonts.cormorantItalic, fontSize: 15, color: colors.muted, lineHeight: 24 },
  genreGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  genreBtn: {
    borderWidth: 1,
    borderRadius: 6,
    padding: 16,
    width: '47%',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.surface,
  },
  genreIcon: { fontSize: 28 },
  genreLabel: { fontFamily: fonts.cinzel, fontSize: 10, letterSpacing: 1 },
  modalBg: { flex: 1, backgroundColor: 'rgba(0,0,0,0.85)', alignItems: 'center', justifyContent: 'center' },
  guessWrap: { flexDirection: 'column', gap: 20, alignItems: 'stretch' },
  cardWrap: { alignItems: 'center' },
  form: { gap: 16 },
  question: { fontFamily: fonts.cinzelBold, fontSize: 14, letterSpacing: 1, color: colors.white },
  choices: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  choice: { borderWidth: 1, borderColor: colors.border, borderRadius: 4, padding: 14, backgroundColor: colors.surface, width: '48%' },
  choiceCorrect: { borderColor: '#50a840', backgroundColor: 'rgba(80,168,64,.12)' },
  choiceWrong:   { borderColor: '#c03030', backgroundColor: 'rgba(192,48,48,.12)' },
  choiceText: { fontFamily: fonts.cinzel, fontSize: 11, letterSpacing: 0.5, color: colors.white },
  choiceTextCorrect: { color: '#50a840' },
  choiceTextWrong:   { color: '#c03030' },
  feedback: { borderRadius: 4, padding: 14, borderWidth: 1 },
  feedbackOk:  { borderColor: 'rgba(80,168,64,.4)',  backgroundColor: 'rgba(80,168,64,.1)' },
  feedbackErr: { borderColor: 'rgba(192,48,48,.4)',  backgroundColor: 'rgba(192,48,48,.1)' },
  feedbackText: { fontFamily: fonts.cormorantItalic, fontSize: 14, color: colors.white, lineHeight: 22 },
  btnPrimary: { backgroundColor: colors.gold, paddingVertical: 13, paddingHorizontal: 32, borderRadius: 3, alignItems: 'center', marginTop: 8 },
  btnPrimaryText: { fontFamily: fonts.cinzelBold, fontSize: 11, letterSpacing: 2, color: '#0a0600' },
});
