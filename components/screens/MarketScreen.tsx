'use client';

import { useState } from 'react';
import { useGame } from '@/lib/game-state';
import { CARDS } from '@/lib/data/cards';
import { GENRES_ALL, MARKET_PRICES } from '@/lib/data/genres';
import CardComponent from '@/components/Card';

export default function MarketScreen() {
  const { state, dispatch, showToast } = useGame();
  const { collection, coins } = state;
  const [filter, setFilter] = useState<string>('All');

  const forSale = CARDS.filter(c => filter === 'All' || c.genre === filter);

  function buyCard(id: number, price: number) {
    if (coins < price) { showToast('Not enough coins!', 'err'); return; }
    dispatch({ type: 'SPEND_COINS', amount: price });
    dispatch({ type: 'ADD_TO_COLLECTION', ids: [id] });
    showToast(`Card purchased! Balance: ⬡ ${coins - price}`, 'ok');
  }

  return (
    <section id="screen-market" className="screen active">
      <div className="screen-header">
        <span className="screen-title">Marketplace</span>
        <span className="screen-count">⬡ {coins}</span>
      </div>
      <div className="filters">
        {GENRES_ALL.map(g => (
          <button key={g} className={`filter-pill${filter === g ? ' active' : ''}`} onClick={() => setFilter(g)}>{g}</button>
        ))}
      </div>
      <div className="market-grid">
        {forSale.map(card => {
          const price = MARKET_PRICES[card.rarity];
          const owned = collection.includes(card.id);
          const canBuy = !owned && coins >= price;
          return (
            <div className="market-item" key={card.id}>
              <div className="market-thumb"><CardComponent card={card} wrapClass="csm" onClick={() => dispatch({ type: 'OPEN_MODAL', cardId: card.id })} /></div>
              <div className="market-info">
                <div className="market-song">{card.title}</div>
                <div className="market-artist">{card.artist}</div>
                <div className="market-tags">
                  <span className="mtag mtag-genre">{card.genre}</span>
                  <span className={`mtag mtag-${card.rarity}`}>{card.rarity}</span>
                </div>
              </div>
              <div className="market-price-col">
                <div className="market-price">⬡ {price}</div>
                <div className="market-pwr">Power: {card.power}</div>
                {owned
                  ? <div className="btn-owned">Owned</div>
                  : <button className="btn-buy" disabled={!canBuy} onClick={() => buyCard(card.id, price)}>
                      {coins < price ? 'Not enough' : 'Buy'}
                    </button>
                }
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
