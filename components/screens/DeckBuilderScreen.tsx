'use client';

import { useState } from 'react';
import { useGame } from '@/lib/game-state';
import { CARDS } from '@/lib/data/cards';
import { GENRES_ALL } from '@/lib/data/genres';
import CardComponent from '@/components/Card';

export default function DeckBuilderScreen() {
  const { state, dispatch, showToast, advanceMission } = useGame();
  const { collection, deck } = state;
  const [filter, setFilter] = useState<string>('All');

  const totalPower = deck.reduce((sum, id) => {
    const c = CARDS.find(x => x.id === id);
    return sum + (c?.power ?? 0);
  }, 0);

  const cards = collection
    .map(id => CARDS.find(c => c.id === id)!)
    .filter(Boolean)
    .filter(c => filter === 'All' || c.genre === filter);

  function toggleDeck(id: number) {
    if (deck.includes(id)) {
      dispatch({ type: 'REMOVE_FROM_DECK', id });
      showToast('Card removed from deck');
    } else if (deck.length >= 10) {
      showToast('Deck full! Max 10 cards.', 'err');
    } else {
      dispatch({ type: 'ADD_TO_DECK', id });
      showToast('Card added to deck', 'ok');
      advanceMission(2, 1);
    }
  }

  return (
    <section id="screen-deckbuilder" className="screen active">
      <div className="deck-main">
        <div className="screen-header">
          <span className="screen-title">Deck Builder</span>
        </div>
        <div className="filters">
          {GENRES_ALL.map(g => (
            <button key={g} className={`filter-pill${filter === g ? ' active' : ''}`} onClick={() => setFilter(g)}>{g}</button>
          ))}
        </div>
        <div className="cards-grid">
          {cards.map(card => {
            const inDeck = deck.includes(card.id);
            return (
              <div key={card.id} style={{ display: 'flex', flexDirection: 'column', gap: 6, opacity: inDeck ? 0.5 : 1 }}>
                <CardComponent card={card} onClick={() => dispatch({ type: 'OPEN_MODAL', cardId: card.id })} />
                <button
                  onClick={e => { e.stopPropagation(); toggleDeck(card.id); }}
                  style={{ width: 272, fontFamily: "'Space Mono',monospace", fontSize: 9, letterSpacing: 1, padding: '8px 0', background: inDeck ? 'rgba(200,50,50,.8)' : 'var(--gold)', color: inDeck ? '#fff' : '#0a0600', border: 'none', borderRadius: 2, cursor: 'pointer', fontWeight: 700 }}
                >
                  {inDeck ? '— Remove from Deck' : '+ Add to Deck'}
                </button>
              </div>
            );
          })}
        </div>
      </div>
      <div className="deck-sidebar">
        <div className="deck-power-box">
          <div className="deck-power-lbl">Total Power</div>
          <div className="deck-power-num">{totalPower}</div>
          <div className="deck-power-sub">{deck.length} / 10 cards</div>
        </div>
        <div className="deck-title">Your Deck</div>
        <div className="deck-slots">
          {Array.from({ length: 10 }, (_, i) => {
            const id = deck[i];
            const card = id ? CARDS.find(c => c.id === id) : null;
            return card
              ? (
                <div key={i} className="deck-slot filled">
                  <div className="deck-slot-num">{i + 1}</div>
                  <div className="deck-slot-name">{card.title}</div>
                  <div className="deck-slot-genre">{card.genre}</div>
                  <div className="deck-slot-power">{card.power}</div>
                  <button className="deck-slot-rm" onClick={() => toggleDeck(id)}>✕</button>
                </div>
              )
              : (
                <div key={i} className="deck-slot">
                  <div className="deck-slot-num">{i + 1}</div>
                  <div className="deck-slot-name" style={{ color: 'var(--dim)', fontStyle: 'italic', fontSize: 10 }}>Empty</div>
                </div>
              );
          })}
        </div>
        <button className="btn-primary" onClick={() => showToast(`Deck saved (${deck.length} cards) ✓`, 'ok')}>Save Deck</button>
      </div>
    </section>
  );
}
