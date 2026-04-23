'use client';

import { useState } from 'react';
import { useGame } from '@/lib/game-state';
import { CARDS } from '@/lib/data/cards';
import CardComponent from '@/components/Card';
import type { Card } from '@/lib/data/cards';

export default function PackScreen() {
  const { dispatch, showToast, advanceMission } = useGame();
  const [phase, setPhase] = useState<'idle' | 'reveal'>('idle');
  const [packCards, setPackCards] = useState<Card[]>([]);
  const [flipped, setFlipped] = useState<boolean[]>([]);
  const [shaking, setShaking] = useState(false);

  function startOpen() {
    setShaking(true);
    setTimeout(() => {
      setShaking(false);
      const shuffled = [...CARDS].sort(() => Math.random() - 0.5).slice(0, 5);
      setPackCards(shuffled);
      setFlipped(Array(5).fill(false));
      setPhase('reveal');
      advanceMission(1, 1);
    }, 600);
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
    <section id="screen-pack" className="screen active">
      <div className="pack-header">
        <h1>Booster Pack</h1>
        <p>SEASON ONE · 5 CARDS</p>
      </div>

      {phase === 'idle' && (
        <>
          <div className={`pack-visual${shaking ? ' shaking' : ''}`} id="pack-visual" onClick={startOpen}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/ui/booster-pack-season1-v1.png" alt="Season One booster pack" />
          </div>
          <p className="pack-tap-hint">TAP TO OPEN</p>
        </>
      )}

      {phase === 'reveal' && (
        <>
          <div className="pack-reveal">
            {packCards.map((card, i) => (
              <div className="pack-slot" key={card.id}>
                <div className={`pack-flip${flipped[i] ? ' flipped' : ''}`} onClick={() => flip(i)}>
                  <div className="pack-flip-back">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/assets/ui/card-back-v1.png" alt="Card back" />
                  </div>
                  <div className="pack-flip-front">
                    <CardComponent card={card} wrapClass="csm" />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <p className="pack-hint">{allFlipped ? 'All cards revealed!' : 'Tap cards to reveal'}</p>
          {allFlipped && (
            <div className="pack-cta">
              <button className="btn-primary" onClick={addToCollection}>Add to Collection</button>
              <button className="btn-secondary" onClick={() => { setPhase('idle'); setPackCards([]); setFlipped([]); }}>Discard</button>
            </div>
          )}
        </>
      )}
    </section>
  );
}
