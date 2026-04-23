'use client';

import { useGame } from '@/lib/game-state';

export default function Toast() {
  const { state } = useGame();
  const { toast } = state;
  return (
    <div id="toast" className={toast ? `show ${toast.type}` : ''}>
      {toast?.msg}
    </div>
  );
}
