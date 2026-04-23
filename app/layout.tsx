import type { Metadata } from 'next';
import './globals.css';
import { GameProvider } from '@/lib/game-state';
import TopBar from '@/components/ui/TopBar';
import BottomNav from '@/components/ui/BottomNav';
import Modal from '@/components/ui/Modal';
import Toast from '@/components/ui/Toast';

export const metadata: Metadata = {
  title: 'The Music Deck',
  description: 'Collect. Battle. Master the Music.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Cormorant+Garamond:ital,wght@0,400;0,500;1,400;1,500&family=Space+Mono:ital,wght@0,400;0,700;1,400&display=swap" rel="stylesheet" />
      </head>
      <body>
        <GameProvider>
          <div id="app">
            <TopBar />
            <div id="screens">
              {children}
            </div>
            <BottomNav />
            <Modal />
            <Toast />
          </div>
        </GameProvider>
      </body>
    </html>
  );
}
