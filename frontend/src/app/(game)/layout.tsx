import { Sidebar } from '@/components/layout/Sidebar';
import { ParticlesCanvas } from '@/components/animations/Particles';
import { AchievementPopup } from '@/features/achievements/components/AchievementPopup';
import { NotesModal } from '@/features/notes/components/NotesModal';
import { CodexModal } from '@/features/notes/components/CodexModal';
import { RealmCeremony } from '@/components/animations/RealmCeremony';
import { GameProvider } from '@/store/GameContext';
import { ToastContainer } from '@/components/ui/Toast';

export default function GameLayout({ children }: { children: React.ReactNode }) {
  return (
    <GameProvider>
      <div className="app-shell">
        <Sidebar />
        <ParticlesCanvas />
        <main className="main-content" style={{ position: 'relative', zIndex: 1 }}>
          {children}
        </main>
        <AchievementPopup />
        <NotesModal />
        <CodexModal />
        <RealmCeremony />
        <ToastContainer />
      </div>
    </GameProvider>
  );
}
