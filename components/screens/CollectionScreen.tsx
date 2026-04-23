'use client';

import { useState } from 'react';
import { useGame } from '@/lib/game-state';
import { CARDS } from '@/lib/data/cards';
import { GENRES_ALL } from '@/lib/data/genres';
import CardComponent from '@/components/Card';

export default function CollectionScreen() {
  const { state, dispatch } = useGame();
  const { collection } = state;
  const [filter, setFilter] = useState<string>('All');

  const cards = collection
    .map(id => CARDS.find(c => c.id === id)!)
    .filter(Boolean)
    .filter(c => filter === 'All' || c.genre === filter);

  return (
    <section id="screen-collection" className="screen active">
      <div className="screen-header">
        <span className="screen-title">Collection</span>
        <span className="screen-count">{collection.length} cards</span>
      </div>
      <div className="filters">
        {GENRES_ALL.map(g => (
          <button
            key={g}
            className={`filter-pill${filter === g ? ' active' : ''}`}
            onClick={() => setFilter(g)}
          >{g}</button>
        ))}
      </div>
      {cards.length === 0
        ? <div className="empty-state">No cards in this category.<br />Open packs to get some!</div>
        : <div className="cards-grid">
            {cards.map(card => (
              <CardComponent
                key={card.id}
                card={card}
                onClick={() => dispatch({ type: 'OPEN_MODAL', cardId: card.id })}
              />
            ))}
          </div>
      }
    </section>
  );
}
