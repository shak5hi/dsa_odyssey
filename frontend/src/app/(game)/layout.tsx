import { Sidebar } from '@/components/Sidebar';
import { ParticlesCanvas } from '@/components/Particles';
import { AchievementPopup } from '@/components/AchievementPopup';
import { NotesModal } from '@/components/NotesModal';
import { CodexModal } from '@/components/CodexModal';
import { RealmCeremony } from '@/components/RealmCeremony';

export default function GameLayout({ children }: { children: React.ReactNode }) {
  return (
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
    </div>
  );
}
