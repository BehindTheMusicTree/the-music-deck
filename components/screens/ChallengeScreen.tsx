'use client';

import { useState } from 'react';
import { useGame } from '@/lib/game-state';
import { CARDS } from '@/lib/data/cards';
import { GENRE_CFG, DEFI_GENRES } from '@/lib/data/genres';
import CardComponent from '@/components/Card';
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

  // eslint-disable-next-line react-hooks/purity
  function startDefi(genre: Genre) {
    const pool = CARDS.filter(c => c.genre === genre);
    if (!pool.length) return;
    // eslint-disable-next-line react-hooks/purity
    const card = pool[Math.floor(Math.random() * pool.length)];

    let decoyPool = CARDS.filter(c => c.id !== card.id && c.genre === genre);
    if (decoyPool.length < 2) decoyPool = CARDS.filter(c => c.id !== card.id);
    // eslint-disable-next-line react-hooks/purity
    const decoys = decoyPool.sort(() => Math.random() - 0.5).slice(0, 2);
    // eslint-disable-next-line react-hooks/purity
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
    <section id="screen-defi" className="screen active">
      {phase === 'pick' && (
        <div id="defi-genre-pick">
          <div className="s-hdr"><div className="lbl">DAILY</div><h2>CHALLENGE</h2></div>
          <p className="defi-intro">Pick a genre and identify the mystery card to win it!</p>
          <div className="defi-genres">
            {DEFI_GENRES.map(g => {
              const cfg = GENRE_CFG[g];
              return (
                <button key={g} className="defi-genre-btn" style={{ '--accent': cfg.accent } as React.CSSProperties} onClick={() => startDefi(g)}>
                  <span className="defi-genre-icon">{cfg.sym}</span>
                  <span>{cfg.genreLabel}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {phase === 'guess' && guess && (
        <div id="defi-guess" style={{ display: 'flex' }}>
          <div className="defi-card-wrap">
            <CardComponent card={guess.card} maskTitle wrapClass="csm" />
          </div>
          <div className="defi-form">
            <p className="defi-question">What is the title of this card?</p>
            <div className="defi-choices">
              {guess.choices.map(c => {
                let cls = 'defi-choice';
                if (guess.result !== null) {
                  if (c.id === guess.card.id) cls += ' correct';
                  else if (c.id === guess.chosenId) cls += ' wrong';
                }
                return (
                  <button key={c.id} className={cls} disabled={guess.result !== null} onClick={() => checkDefi(c.id)}>
                    {c.title}
                  </button>
                );
              })}
            </div>
            <div className={`defi-feedback ${guess.result === 'correct' ? 'ok won' : guess.result === 'wrong' ? 'err' : ''}`}>
              {guess.result === 'correct' && `🎉 Correct! "${guess.card.title}" added to your collection.`}
              {guess.result === 'wrong' && `✗ Wrong! The answer was "${guess.card.title}".`}
            </div>
            {guess.result !== null && (
              <button className="btn-primary" style={{ marginTop: 16 }} onClick={reset}>Play Again</button>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
