'use client';

import { createContext, useContext, useReducer, useCallback, useRef, ReactNode } from 'react';
import type { Card } from './data/cards';

export interface Mission {
  id: number;
  name: string;
  reward: number;
  prog: number;
  total: number;
  done: boolean;
}

export interface BattleState {
  phase: 'pick' | 'fighting' | 'done';
  pickedCardId: number | null;
  enemyCard: Card | null;
  playerHP: number;
  playerMaxHP: number;
  enemyHP: number;
  enemyMaxHP: number;
  playerTurn: boolean;
  specialUsed: boolean;
  stunned: boolean;
  debuff: number;
  playerDebuff: number;
  log: { type: string; msg: string }[];
}

/** Saved lineup for battles (same shape as a track list, max 10 cards). */
export interface BattleDeck {
  id: string;
  name: string;
  cardIds: number[];
}

export interface GameState {
  collection: number[];
  trackList: number[];
  /** Saved track lists for the arena; at least one starter entry is seeded. */
  decks: BattleDeck[];
  coins: number;
  missions: Mission[];
  battle: BattleState;
  toast: { msg: string; type: string } | null;
  modalCardId: number | null;
}

type Action =
  | { type: 'ADD_TO_COLLECTION'; ids: number[] }
  | { type: 'ADD_TO_TRACK_LIST'; id: number }
  | { type: 'REMOVE_FROM_TRACK_LIST'; id: number }
  | { type: 'EARN_COINS'; amount: number }
  | { type: 'SPEND_COINS'; amount: number }
  | { type: 'ADVANCE_MISSION'; id: number; amount: number }
  | { type: 'SET_TOAST'; msg: string; toastType: string }
  | { type: 'CLEAR_TOAST' }
  | { type: 'OPEN_MODAL'; cardId: number }
  | { type: 'CLOSE_MODAL' }
  | { type: 'BATTLE_SET'; updates: Partial<BattleState> }
  | { type: 'BATTLE_LOG'; entry: { type: string; msg: string } }
  | { type: 'BATTLE_RESET' };

const defaultBattle: BattleState = {
  phase: 'pick',
  pickedCardId: null,
  enemyCard: null,
  playerHP: 100, playerMaxHP: 100,
  enemyHP: 100, enemyMaxHP: 100,
  playerTurn: true,
  specialUsed: false,
  stunned: false,
  debuff: 0,
  playerDebuff: 0,
  log: [],
};

const INITIAL_TRACK_LIST = [1, 25, 30, 3, 12] as const;

const initialDecks: BattleDeck[] = [
  {
    id: 'starter',
    name: 'Track List Starter',
    cardIds: [...INITIAL_TRACK_LIST],
  },
];

const initialState: GameState = {
  collection: [1,2,3,4,5,6,7,8,9,10,11,12,25,27,29,30,31,32,33,34,35,36,37],
  trackList: [...INITIAL_TRACK_LIST],
  decks: initialDecks,
  coins: 750,
  missions: [
    { id:1, name:'Open 1 Pack',               reward:50,  prog:0, total:1, done:false },
    { id:2, name:'Add a card to your track list',   reward:30,  prog:1, total:1, done:true  },
    { id:3, name:'Win 1 Battle',              reward:100, prog:0, total:1, done:false },
    { id:4, name:'View 5 card details',       reward:25,  prog:3, total:5, done:false },
    { id:5, name:'Collect 4 different genres',reward:75,  prog:3, total:4, done:false },
  ],
  battle: defaultBattle,
  toast: null,
  modalCardId: null,
};

function reducer(state: GameState, action: Action): GameState {
  switch (action.type) {
    case 'ADD_TO_COLLECTION': {
      const newIds = action.ids.filter(id => !state.collection.includes(id));
      return { ...state, collection: [...state.collection, ...newIds] };
    }
    case 'ADD_TO_TRACK_LIST':
      if (state.trackList.includes(action.id) || state.trackList.length >= 10) return state;
      return { ...state, trackList: [...state.trackList, action.id] };
    case 'REMOVE_FROM_TRACK_LIST':
      return { ...state, trackList: state.trackList.filter(id => id !== action.id) };
    case 'EARN_COINS':
      return { ...state, coins: state.coins + action.amount };
    case 'SPEND_COINS':
      return { ...state, coins: Math.max(0, state.coins - action.amount) };
    case 'ADVANCE_MISSION': {
      const missions = state.missions.map(m => {
        if (m.id !== action.id || m.done) return m;
        const prog = Math.min(m.total, m.prog + action.amount);
        return { ...m, prog, done: prog >= m.total };
      });
      return { ...state, missions };
    }
    case 'SET_TOAST':
      return { ...state, toast: { msg: action.msg, type: action.toastType } };
    case 'CLEAR_TOAST':
      return { ...state, toast: null };
    case 'OPEN_MODAL':
      return { ...state, modalCardId: action.cardId };
    case 'CLOSE_MODAL':
      return { ...state, modalCardId: null };
    case 'BATTLE_SET':
      return { ...state, battle: { ...state.battle, ...action.updates } };
    case 'BATTLE_LOG':
      return { ...state, battle: { ...state.battle, log: [...state.battle.log, action.entry] } };
    case 'BATTLE_RESET':
      return { ...state, battle: defaultBattle };
    default:
      return state;
  }
}

interface GameContextValue {
  state: GameState;
  dispatch: React.Dispatch<Action>;
  showToast: (msg: string, type?: string) => void;
  earnCoins: (amount: number) => void;
  advanceMission: (id: number, amount: number) => void;
}

const GameContext = createContext<GameContextValue | null>(null);

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = useCallback((msg: string, type = '') => {
    dispatch({ type: 'SET_TOAST', msg, toastType: type });
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => dispatch({ type: 'CLEAR_TOAST' }), 2600);
  }, []);

  const earnCoins = useCallback((amount: number) => {
    dispatch({ type: 'EARN_COINS', amount });
  }, []);

  const advanceMission = useCallback((id: number, amount: number) => {
    const m = state.missions.find(x => x.id === id);
    if (!m || m.done) return;
    const newProg = Math.min(m.total, m.prog + amount);
    dispatch({ type: 'ADVANCE_MISSION', id, amount });
    if (newProg >= m.total && !m.done) {
      dispatch({ type: 'EARN_COINS', amount: m.reward });
      showToast(`Mission complete! +${m.reward} coins ⬡`, 'ok');
    }
  }, [state.missions, showToast]);

  return (
    <GameContext.Provider value={{ state, dispatch, showToast, earnCoins, advanceMission }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame must be used within GameProvider');
  return ctx;
}
