import { useUser } from '@/hooks/useUser';
import { useQuests } from '@/hooks/useQuests';

export function StatsBar() {
  const { xp, streak } = useUser();
  const { completedCount } = useQuests();
  const patterns = 0; // Wait, original code was: const patterns = state.inventory.length;
  // Let's get it from useUser.
  const { inventory } = useUser();
  const patternCount = inventory.length;

  return (
    <div className="stats-bar">
      <div className="stat-card">
        <div className="stat-num">{completedCount}</div>
        <div className="stat-lbl">Quests Solved</div>
      </div>
      <div className="stat-card">
        <div className="stat-num">{xp}</div>
        <div className="stat-lbl">Total XP</div>
      </div>
      <div className="stat-card">
        <div className="stat-num">{streak}</div>
        <div className="stat-lbl">Day Streak</div>
      </div>
      <div className="stat-card">
        <div className="stat-num">{patternCount}</div>
        <div className="stat-lbl">Patterns Mastered</div>
      </div>
    </div>
  );
}
