'use client';

import { useGame } from '@/lib/game-state';
import { CARDS } from '@/lib/data/cards';
import { GENRE_CFG, TREE_NODES, TREE_EDGES } from '@/lib/data/genres';

export default function MissionsScreen() {
  const { state, showToast } = useGame();
  const { missions, collection } = state;

  const genreCounts: Record<string, number> = {};
  CARDS.forEach(c => { genreCounts[c.genre] = (genreCounts[c.genre] ?? 0) + 1; });
  const collected: Record<string, number> = {};
  collection.forEach(id => {
    const c = CARDS.find(x => x.id === id);
    if (c) collected[c.genre] = (collected[c.genre] ?? 0) + 1;
  });

  const W = 400, H = 340;
  const lines = TREE_EDGES.map(([a, b]) => {
    const na = TREE_NODES.find(n => n.genre === a)!;
    const nb = TREE_NODES.find(n => n.genre === b)!;
    const x1 = (na.x / 100) * W, y1 = (na.y / 100) * H;
    const x2 = (nb.x / 100) * W, y2 = (nb.y / 100) * H;
    const bothHave = (collected[a] ?? 0) > 0 && (collected[b] ?? 0) > 0;
    return (
      <line key={`${a}-${b}`}
        x1={x1} y1={y1} x2={x2} y2={y2}
        stroke={bothHave ? 'rgba(168,124,40,.45)' : 'rgba(30,28,44,.8)'}
        strokeWidth={bothHave ? 2 : 1}
        strokeDasharray={bothHave ? undefined : '4,4'}
      />
    );
  });

  const nodes = TREE_NODES.map(n => {
    const cnt = collected[n.genre] ?? 0;
    const tot = genreCounts[n.genre] ?? 1;
    const cfg = GENRE_CFG[n.genre];
    const stateClass = cnt === 0 ? '' : cnt >= tot ? 'mastered' : 'unlocked';
    const lx = (n.x / 100) * W;
    const ly = (n.y / 100) * H;
    return (
      <div key={n.genre} className={`tree-node ${stateClass}`}
        style={{ left: lx, top: ly }}
        onClick={() => showToast(`${n.genre}: ${cnt}/${tot} cards`, cnt > 0 ? 'ok' : '')}
        title={n.genre}
      >
        <div className="node-circle">
          <div className="node-ico">{cfg?.sym ?? '🎵'}</div>
          <div className="node-cnt">{cnt}/{tot}</div>
        </div>
        <div className="node-lbl">{n.genre}</div>
      </div>
    );
  });

  return (
    <section id="screen-missions" className="screen active">
      <div>
        <div className="s-hdr"><div className="lbl">DAILY</div><h2>MISSIONS</h2></div>
        <div className="missions-list">
          {missions.map(m => {
            const pct = Math.min(100, (m.prog / m.total) * 100);
            return (
              <div key={m.id} className={`mission-item${m.done ? ' done' : ''}`}>
                <div className="mission-row">
                  <div className="mission-check">{m.done ? '✓' : ''}</div>
                  <div className="mission-name">{m.name}</div>
                  <div className="mission-reward">⬡ {m.reward}</div>
                </div>
                {!m.done && (
                  <div>
                    <div className="prog-bar"><div className="prog-fill" style={{ width: `${pct}%` }} /></div>
                    <div className="prog-txt">{m.prog} / {m.total}</div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
      <div>
        <div className="s-hdr"><div className="lbl">MUSIC</div><h2>TREE</h2></div>
        <div className="tree-wrap">
          <div style={{ position: 'relative', width: W, height: H + 60, margin: '0 auto' }}>
            <svg width={W} height={H} style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
              {lines}
            </svg>
            <div style={{ position: 'absolute', inset: 0 }}>
              {nodes}
            </div>
          </div>
        </div>
        <div className="weekly-box" style={{ marginTop: 24 }}>
          <div className="weekly-label">WEEKLY CHALLENGE</div>
          <div className="weekly-title">Genre Master</div>
          <div className="weekly-desc">Collect at least 3 cards from 5 different genres.</div>
          <div className="weekly-reward">⬡ 500</div>
        </div>
      </div>
    </section>
  );
}
