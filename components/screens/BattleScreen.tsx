'use client';

import { useState, useRef, useCallback } from 'react';
import { useGame } from '@/lib/game-state';
import { CARDS } from '@/lib/data/cards';
import CardComponent from '@/components/Card';
import type { Card } from '@/lib/data/cards';

interface BattleLog { type: string; msg: string; }

interface FightState {
  playerCard: Card;
  enemyCard: Card;
  playerHP: number; playerMaxHP: number;
  enemyHP: number; enemyMaxHP: number;
  log: BattleLog[];
  phase: 'fighting' | 'done';
  specialUsed: boolean;
  stunned: boolean;
  debuff: number;
  playerDebuff: number;
  result?: 'win' | 'lose';
  buttonsDisabled: boolean;
}

function calcDmg(card: Card, base?: number): number {
  const dmg = base !== undefined ? base : Math.floor(card.power * 0.1) + Math.floor(Math.random() * 6) + 4;
  return Math.max(1, dmg);
}

export default function BattleScreen() {
  const { state, showToast, advanceMission, earnCoins } = useGame();
  const { collection } = state;
  const [pickedId, setPickedId] = useState<number | null>(null);
  const [fight, setFight] = useState<FightState | null>(null);
  const logRef = useRef<HTMLDivElement>(null);

  const pool = collection.map(id => CARDS.find(c => c.id === id)!).filter(Boolean);

  const addLog = useCallback((fs: FightState, type: string, msg: string): FightState => {
    const entry = { type, msg };
    return { ...fs, log: [...fs.log, entry] };
  }, []);

  function startBattle() {
    if (!pickedId) return;
    const playerCard = CARDS.find(c => c.id === pickedId)!;
    const enemies = CARDS.filter(c => c.id !== pickedId);
    const enemyCard = enemies[Math.floor(Math.random() * enemies.length)];
    let fs: FightState = {
      playerCard, enemyCard,
      playerHP: 100, playerMaxHP: 100,
      enemyHP: 100, enemyMaxHP: 100,
      log: [], phase: 'fighting',
      specialUsed: false, stunned: false, debuff: 0, playerDebuff: 0,
      buttonsDisabled: false,
    };
    fs = addLog(fs, 'sys', `Battle: <strong>${playerCard.title}</strong> vs <strong>${enemyCard.title}</strong>`);
    fs = addLog(fs, 'sys', 'Let the music decide the winner…');
    setFight(fs);
  }

  function doAttack() {
    if (!fight || fight.phase !== 'fighting' || fight.buttonsDisabled) return;
    setFight(prev => {
      if (!prev) return prev;
      let fs = { ...prev, buttonsDisabled: true };
      if (fs.stunned) {
        fs = addLog(fs, 'dmg', `${fs.playerCard.title} is stunned and loses their turn!`);
        fs = { ...fs, stunned: false };
        setTimeout(() => setFight(curr => curr ? enemyTurn(curr) : curr), 800);
        return fs;
      }
      let dmg = calcDmg(fs.playerCard);
      if (fs.playerDebuff > 0) { dmg = Math.max(1, dmg - fs.playerDebuff); fs = { ...fs, playerDebuff: 0 }; }
      if (fs.debuff > 0) { dmg = Math.floor(dmg * (1 - fs.debuff)); fs = { ...fs, debuff: Math.max(0, fs.debuff - 0.5) }; }
      fs = hitEnemy(fs, dmg);
      return fs;
    });
  }

  function doSpecial() {
    if (!fight || fight.phase !== 'fighting' || fight.specialUsed || fight.buttonsDisabled) return;
    setFight(prev => {
      if (!prev) return prev;
      let fs = { ...prev, specialUsed: true, buttonsDisabled: true };
      fs = addLog(fs, 'special', `✦ ${fs.playerCard.title} uses "${fs.playerCard.ability}"!`);
      const card = fs.playerCard;
      const delay = 400;
      setTimeout(() => {
        setFight(curr => {
          if (!curr) return curr;
          return applySpecial(curr, delay);
        });
      }, 10);
      return fs;
    });
  }

  function applySpecial(fs: FightState, _delay: number): FightState {
    const card = fs.playerCard;
    const genre = card.genre;
    if (genre === 'Rock') {
      const dmg = calcDmg(card) * 2;
      fs = addLog(fs, 'special', `${card.ability}: double damage!`);
      return hitEnemy(fs, dmg);
    } else if (genre === 'Pop') {
      fs = heal(fs, 15, true);
      fs = { ...fs, debuff: 0.2 };
      fs = addLog(fs, 'heal', `${card.ability}: +15 HP, opponent attack reduced`);
      return enemyTurn(fs);
    } else if (genre === 'Vintage') {
      const mult = 1 + Math.random() * 2;
      const dmg = Math.floor(calcDmg(card) * mult);
      fs = addLog(fs, 'special', `${card.ability}: ×${mult.toFixed(1)} → ${dmg} damage!`);
      return hitEnemy(fs, dmg);
    } else if (genre === 'Electro') {
      const dmg = calcDmg(card) + 12;
      fs = addLog(fs, 'special', `${card.ability}: ${dmg} damage! (skip next turn)`);
      fs = { ...fs, stunned: true };
      return hitEnemy(fs, dmg);
    } else if (genre === 'HipHop') {
      fs = { ...fs, debuff: 0.5 };
      fs = addLog(fs, 'special', `${card.ability}: opponent attack halved for 2 turns`);
      return enemyTurn(fs);
    } else if (genre === 'Reggae') {
      fs = heal(fs, 20, true);
      fs = addLog(fs, 'heal', `${card.ability}: +20 HP restored`);
      return enemyTurn(fs);
    } else if (genre === 'Classic') {
      // Triple hit - simplified synchronous version
      let total = 0;
      for (let i = 0; i < 3; i++) {
        const dmg = Math.floor(calcDmg(card) * 0.6);
        total += dmg;
        fs = addLog(fs, 'dmg', `${card.ability} hits ${i + 1}/3: ${dmg} damage`);
        fs = { ...fs, enemyHP: Math.max(0, fs.enemyHP - dmg) };
        if (fs.enemyHP <= 0) return endBattle(fs, true);
      }
      return enemyTurn(fs);
    } else if (genre === 'Funk') {
      fs = heal(fs, 12, true);
      const dmg = calcDmg(card);
      fs = addLog(fs, 'special', `${card.ability}: +12 HP and ${dmg} damage`);
      return hitEnemy(fs, dmg);
    } else if (genre === 'World') {
      fs = heal(fs, 8, true);
      const dmg = calcDmg(card) + 4;
      fs = addLog(fs, 'special', `${card.ability}: convergence! +8 HP and ${dmg} damage`);
      return hitEnemy(fs, dmg);
    } else {
      const dmg = calcDmg(card) + 3;
      return hitEnemy(fs, dmg);
    }
  }

  function hitEnemy(fs: FightState, dmg: number): FightState {
    fs = addLog(fs, 'dmg', `${fs.playerCard.title} deals ${dmg} damage to ${fs.enemyCard.title}`);
    fs = { ...fs, enemyHP: Math.max(0, fs.enemyHP - dmg) };
    if (fs.enemyHP <= 0) return endBattle(fs, true);
    setTimeout(() => setFight(curr => curr ? enemyTurn(curr) : curr), 900);
    return fs;
  }

  function enemyTurn(fs: FightState): FightState {
    if (fs.phase !== 'fighting') return fs;
    const enemy = fs.enemyCard;
    let dmg = calcDmg(enemy);
    if (fs.debuff > 0) dmg = Math.floor(dmg * (1 - fs.debuff));
    if (Math.random() < 0.22) {
      fs = addLog(fs, 'special', `★ ${enemy.title} uses "${enemy.ability}"!`);
      dmg = Math.floor(dmg * (1.4 + Math.random() * 0.6));
    }
    fs = addLog(fs, 'dmg', `${enemy.title} deals ${dmg} damage to ${fs.playerCard.title}`);
    fs = { ...fs, playerHP: Math.max(0, fs.playerHP - dmg) };
    if (fs.playerHP <= 0) return endBattle(fs, false);
    setTimeout(() => setFight(curr => curr ? { ...curr, buttonsDisabled: false } : curr), 600);
    return fs;
  }

  function heal(fs: FightState, amount: number, isPlayer: boolean): FightState {
    if (isPlayer) return { ...fs, playerHP: Math.min(fs.playerMaxHP, fs.playerHP + amount) };
    return { ...fs, enemyHP: Math.min(fs.enemyMaxHP, fs.enemyHP + amount) };
  }

  function endBattle(fs: FightState, playerWon: boolean): FightState {
    fs = { ...fs, phase: 'done', result: playerWon ? 'win' : 'lose', buttonsDisabled: true };
    if (playerWon) {
      earnCoins(80);
      advanceMission(3, 1);
      showToast('Victory! +80 coins earned', 'ok');
      fs = addLog(fs, 'sys', '⬡ Victory! Reward: 80 coins.');
    } else {
      showToast('Defeat. Better luck next time…', 'err');
      fs = addLog(fs, 'sys', '✕ Defeat. Your opponent was too strong.');
    }
    return fs;
  }

  const hpClass = (pct: number) => pct < 25 ? ' critical' : pct < 50 ? ' warning' : '';

  if (!fight) {
    return (
      <section id="screen-battle" className="screen active">
        <div className="battle-pick-phase">
          <div className="s-hdr"><div className="lbl">BATTLE ARENA</div><h2>CHOOSE YOUR CARD</h2></div>
          <div className="battle-pick-label">SELECT A CARD FROM YOUR COLLECTION</div>
          <div className="battle-pick-cards">
            {pool.map(card => (
              <CardComponent
                key={card.id}
                card={card}
                wrapClass="csm"
                selected={pickedId === card.id}
                onClick={() => setPickedId(card.id)}
              />
            ))}
          </div>
          <div className="battle-start-row">
            <button className="btn-primary btn-attack" disabled={!pickedId} onClick={startBattle}>Start Battle</button>
          </div>
        </div>
      </section>
    );
  }

  const { playerCard, enemyCard, playerHP, playerMaxHP, enemyHP, enemyMaxHP, log, phase, result, specialUsed, buttonsDisabled } = fight;
  const ppct = (playerHP / playerMaxHP) * 100;
  const epct = (enemyHP / enemyMaxHP) * 100;

  return (
    <section id="screen-battle" className="screen active">
      <div className="battle-arena">
        <div className="battle-fighters">
          <div className="battle-side">
            <div className="battle-lbl">YOU</div>
            <div className="battle-hp-wrap">
              <div className="battle-hp-bar"><div className={`battle-hp-fill${hpClass(ppct)}`} style={{ width: `${ppct}%` }} /></div>
              <div className="battle-hp-txt">{playerHP} / {playerMaxHP}</div>
            </div>
            <CardComponent card={playerCard} wrapClass="csm" />
          </div>
          <div className="battle-vs"><div className="vs-label">VS</div></div>
          <div className="battle-side">
            <div className="battle-lbl">ENEMY</div>
            <div className="battle-hp-wrap">
              <div className="battle-hp-bar"><div className={`battle-hp-fill${hpClass(epct)}`} style={{ width: `${epct}%` }} /></div>
              <div className="battle-hp-txt">{enemyHP} / {enemyMaxHP}</div>
            </div>
            <CardComponent card={enemyCard} wrapClass="csm" />
          </div>
        </div>

        {phase === 'fighting' && (
          <div className="battle-controls">
            <button className="btn-attack" disabled={buttonsDisabled} onClick={doAttack}>Attack</button>
            <button className="btn-special" disabled={buttonsDisabled || specialUsed} onClick={doSpecial}>
              ✦ {playerCard.ability}
            </button>
          </div>
        )}

        {phase === 'done' && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, marginTop: 16 }}>
            <div className={`battle-result-title ${result}`}>{result === 'win' ? 'VICTORY' : 'DEFEAT'}</div>
            <div style={{ fontFamily: "'Cormorant Garamond',serif", fontStyle: 'italic', fontSize: 18, color: 'var(--muted)' }}>
              {result === 'win' ? 'The music triumphs.' : 'The beat goes on…'}
            </div>
            <button className="btn-primary" onClick={() => { setFight(null); setPickedId(null); }}>Play Again</button>
          </div>
        )}

        <div className="battle-log" ref={logRef}>
          {log.map((entry, i) => (
            <div key={i} className={`log-line ${entry.type}`} dangerouslySetInnerHTML={{ __html: entry.msg }} />
          ))}
        </div>
      </div>
    </section>
  );
}
