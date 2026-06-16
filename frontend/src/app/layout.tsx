import type { Metadata } from 'next';
import './globals.css';
import { GameProvider } from '@/lib/gameStore';
import { ToastContainer } from '@/components/Toast';

export const metadata: Metadata = {
  title: 'DSA Odyssey — Reclaim the Kingdom of Algorithms',
  description: 'A pixel-art RPG for mastering Data Structures & Algorithms. Track your progress, earn XP, and conquer coding interviews.',
  keywords: ['DSA', 'LeetCode', 'algorithms', 'data structures', 'interview prep'],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
          {children}
      </body>
    </html>
  );
}
