'use client';

import { useGame } from '@/lib/game-state';
import { CARDS } from '@/lib/data/cards';
import CardComponent from '@/components/Card';
import { useRouter } from 'next/navigation';

const RARITY_COLOR: Record<string, string> = {
  Legendary: '#c8a040', Epic: '#b070e0', Rare: '#6090e0', Common: '#7878a0',
};

export default function Modal() {
  const { state, dispatch, showToast } = useGame();
  const router = useRouter();
  const { modalCardId, collection, deck } = state;

  if (!modalCardId) return null;
  const card = CARDS.find(c => c.id === modalCardId);
  if (!card) return null;

  const rarityColor = RARITY_COLOR[card.rarity] ?? '#888';
  const owned = collection.includes(card.id);
  const inDeck = deck.includes(card.id);

  function close() { dispatch({ type: 'CLOSE_MODAL' }); }
  function toggleDeck() {
    if (!card) return;
    if (inDeck) {
      dispatch({ type: 'REMOVE_FROM_DECK', id: card.id });
      showToast('Card removed from deck');
    } else if (deck.length < 10) {
      dispatch({ type: 'ADD_TO_DECK', id: card.id });
      showToast('Card added to deck', 'ok');
      dispatch({ type: 'ADVANCE_MISSION', id: 2, amount: 1 });
    } else {
      showToast('Deck full! Max 10 cards.', 'err');
    }
    close();
  }

  return (
    <div id="card-modal" className="open" onClick={e => { if (e.target === e.currentTarget) close(); }}>
      <button className="modal-close" onClick={close}>✕</button>
      <div className="modal-inner">
        <div className="modal-card-col">
          <CardComponent card={card} />
        </div>
        <div className="modal-detail">
          <div>
            <div className="modal-song">{card.title}</div>
            <div className="modal-artist">{card.artist}</div>
          </div>
          <div className="modal-tags">
            <span className="modal-badge" style={{ color: rarityColor, borderColor: `${rarityColor}40`, background: `${rarityColor}15` }}>{card.rarity}</span>
            <span className="modal-badge" style={{ color: 'var(--gold)', borderColor: 'rgba(168,124,40,.3)', background: 'rgba(168,124,40,.1)' }}>{card.genre}</span>
            <span className="modal-badge" style={{ color: 'var(--muted)', borderColor: 'var(--border)' }}>{card.year}</span>
          </div>
          <hr className="modal-sep" />
          <div className="modal-stats">
            {[
              { lbl: 'Power', val: card.power, cls: 'pow' },
              { lbl: 'Popularity', val: card.pop, cls: 'pop' },
              { lbl: 'Expression', val: card.exp, cls: 'exp' },
            ].map(({ lbl, val, cls }) => (
              <div className="modal-stat-row" key={lbl}>
                <div className="modal-stat-lbl">{lbl}</div>
                <div className="modal-stat-bar"><div className={`modal-stat-fill ${cls}`} style={{ width: `${val}%` }} /></div>
                <div className="modal-stat-val">{val}</div>
              </div>
            ))}
          </div>
          <div className="modal-ability">
            <div className="ability-title">✦ {card.ability}</div>
            <div className="ability-text">{card.abilityDesc}</div>
          </div>
          <div className="modal-actions">
            {owned
              ? inDeck
                ? <button className="btn-secondary" onClick={toggleDeck}>Remove from Deck</button>
                : deck.length < 10
                  ? <button className="btn-primary" onClick={toggleDeck}>+ Add to Deck</button>
                  : <button className="btn-secondary" disabled style={{ opacity: .4 }}>Deck full</button>
              : <button className="btn-primary" onClick={() => { close(); router.push('/market'); }}>Buy on Market</button>
            }
            <button className="btn-secondary" onClick={close}>Close</button>
          </div>
        </div>
      </div>
    </div>
  );
}
