'use client';

import { useGame } from '@/lib/game-state';

export default function TopBar() {
  const { state } = useGame();
  return (
    <header className="top-bar">
      <div className="top-logo"><span>THE</span> MUSIC DECK</div>
      <div className="top-right">
        <div className="top-level">Lv. 7 · Collector</div>
        <div className="top-coins">⬡ <span>{state.coins}</span></div>
      </div>
    </header>
  );
}
