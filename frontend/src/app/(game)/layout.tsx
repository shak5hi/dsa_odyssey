import { Sidebar } from '@/components/Sidebar';
import { ParticlesCanvas } from '@/components/Particles';
import { AchievementPopup } from '@/components/AchievementPopup';
import { NotesModal } from '@/components/NotesModal';
import { CodexModal } from '@/components/CodexModal';
import { RealmCeremony } from '@/components/RealmCeremony';
import { GameProvider } from '@/lib/gameStore';
import { ToastContainer } from '@/components/Toast';

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
