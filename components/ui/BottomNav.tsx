'use client';

import { usePathname, useRouter } from 'next/navigation';

const NAV = [
  { screen: '',            label: 'Home',       icon: '🏠' },
  { screen: 'pack',        label: 'Pack',        icon: '📦' },
  { screen: 'collection',  label: 'Collection',  icon: '🎴' },
  { screen: 'deckbuilder', label: 'Deck',        icon: '⚔️' },
  { screen: 'battle',      label: 'Battle',      icon: '🎯' },
  { screen: 'market',      label: 'Market',      icon: '🛒' },
  { screen: 'challenge',   label: 'Challenge',   icon: '🎲' },
];

export default function BottomNav() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <nav className="bottom-nav">
      {NAV.map(({ screen, label, icon }) => {
        const href = screen ? `/${screen}` : '/';
        const active = pathname === href;
        return (
          <button
            key={screen}
            className={`nav-item${active ? ' active' : ''}`}
            onClick={() => router.push(href)}
          >
            <span className="nav-icon">{icon}</span>
            <span className="nav-label">{label}</span>
          </button>
        );
      })}
    </nav>
  );
}
