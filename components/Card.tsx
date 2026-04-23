'use client';

import { useEffect, useRef } from 'react';
import type { Card } from '@/lib/data/cards';
import { GENRE_CFG, RAR_SVG } from '@/lib/data/genres';
import { cardArtSvg, applyScoreGlow } from '@/lib/card-art';

interface CardProps {
  card: Card;
  wrapClass?: string;
  selected?: boolean;
  maskTitle?: boolean;
  onClick?: () => void;
}

export default function CardComponent({ card, wrapClass = '', selected = false, maskTitle = false, onClick }: CardProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const cfg = GENRE_CFG[card.genre] ?? GENRE_CFG.Pop;
  const artSrc = card.artwork ? `/assets/cards/artworks/examples/${card.artwork}` : null;

  useEffect(() => {
    if (wrapRef.current) applyScoreGlow(wrapRef.current);
  });

  const cardEl = (
    <div
      className={`card ${cfg.cls}${selected ? ' selected' : ''}`}
      data-id={card.id}
      onClick={onClick}
    >
      <div className="card-inner">
        <div className="ch">
          <div className="ch-left">
            <span className="ch-icon" dangerouslySetInnerHTML={{ __html: cfg.icon }} />
            <div className="ch-titles">
              {maskTitle
                ? <span className="ch-title" style={{ background: 'var(--border)', color: 'transparent', borderRadius: 3, minWidth: 80 }}>▓▓▓▓▓▓▓▓▓</span>
                : <span className="ch-title">{card.title}</span>
              }
              <span className="ch-artist">{card.artist}</span>
            </div>
          </div>
          <span className="ch-score">{card.power}</span>
        </div>
        <div className="ca">
          {artSrc
            ? <img src={artSrc} alt={card.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            : <span dangerouslySetInnerHTML={{ __html: cardArtSvg(card) }} />
          }
        </div>
        <div className="card-bottom">
          <div className="ct">
            <span className="ct-type">Song · {card.year}</span>
            <div className="ct-right">
              <span className="ct-genre">{cfg.genreLabel}</span>
              <div className="ct-pip" />
            </div>
          </div>
          <div className="cb">
            <div className="cb-pname">{card.ability}</div>
            <div className="cb-ptext">{card.abilityDesc}</div>
          </div>
          <div className="cs">
            <div className="cs-row">
              <span className="cs-lbl">Popularity</span>
              <div className="cs-bg"><div className="cs-fill" style={{ width: `${card.pop}%` }} /></div>
              <span className="cs-val">{card.pop}</span>
            </div>
            <div className="cs-row">
              <span className="cs-lbl">Experimental</span>
              <div className="cs-bg"><div className="cs-fill exp" style={{ width: `${card.exp}%` }} /></div>
              <span className="cs-val">{card.exp}</span>
            </div>
          </div>
          <div className="cf">
            <span className="cf-brand">THE MUSIC DECK</span>
            <span className="cf-rar">
              <span className="rar-icon" dangerouslySetInnerHTML={{ __html: RAR_SVG[card.rarity] ?? RAR_SVG.Common }} />
              {card.rarity}
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  if (!wrapClass) return cardEl;
  return (
    <div className={`card-wrap ${wrapClass}`} ref={wrapRef}>
      {cardEl}
    </div>
  );
}
