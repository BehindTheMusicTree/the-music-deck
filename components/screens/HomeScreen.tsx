'use client';

import { useRouter } from 'next/navigation';
import { useGame } from '@/lib/game-state';
import { CARDS } from '@/lib/data/cards';
import CardComponent from '@/components/Card';

export default function HomeScreen() {
  const { state, dispatch } = useGame();
  const router = useRouter();
  const { collection, deck } = state;

  const picks: typeof CARDS = [];
  for (const rarity of ['Legendary', 'Epic', 'Rare', 'Common'] as const) {
    if (picks.length >= 4) break;
    const c = collection.map(id => CARDS.find(x => x.id === id)!).find(c => c && c.rarity === rarity && !picks.includes(c));
    if (c) picks.push(c);
  }
  while (picks.length < 4 && picks.length < collection.length) {
    const c = CARDS.find(x => collection.includes(x.id) && !picks.includes(x));
    if (c) picks.push(c); else break;
  }

  return (
    <section id="screen-home" className="screen active">
      <div className="home-hero">
        <div className="home-eyebrow">TRADING CARD GAME · SEASON 1</div>
        <h1 className="home-title">
          <span className="the">THE</span>
          MUSIC <span className="gold">DECK</span>
        </h1>
        <div className="home-bar" />
        <p className="home-tagline">
          Collect iconic songs.<br />Build your deck.<br />Let the music decide the winner.
        </p>
        <div className="home-actions">
          <button className="btn-primary" onClick={() => router.push('/pack')}>Open a Pack</button>
          <button className="btn-secondary" onClick={() => router.push('/collection')}>My Collection</button>
          <button className="btn-defi" onClick={() => router.push('/challenge')}>Challenge</button>
        </div>
      </div>
      <div className="home-stats">
        <div className="home-stat">
          <div className="stat-num">{collection.length}</div>
          <div className="stat-unit">Cards</div>
        </div>
        <div className="home-stat">
          <div className="stat-num">{deck.length}</div>
          <div className="stat-unit">In Deck</div>
        </div>
        <div className="home-stat">
          <div className="stat-num">S1</div>
          <div className="stat-unit">Season</div>
        </div>
      </div>
      <div className="home-preview">
        <div className="home-preview-cards">
          {picks.map(card => (
            <CardComponent
              key={card.id}
              card={card}
              wrapClass="csm"
              onClick={() => dispatch({ type: 'OPEN_MODAL', cardId: card.id })}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
