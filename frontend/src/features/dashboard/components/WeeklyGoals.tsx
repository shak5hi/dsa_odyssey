import { useUser } from '@/hooks/useUser';
import { useQuests } from '@/hooks/useQuests';

export function WeeklyGoals() {
  const { xp, streak } = useUser();
  const { completedCount } = useQuests();

  const weeklyGoals = [
    { type: 'solve', target: 10, icon: '⚔️', label: 'Solve 10 Questions', current: completedCount },
    { type: 'xp', target: 150, icon: '✨', label: 'Earn 150 XP', current: xp },
    { type: 'streak', target: 5, icon: '🔥', label: 'Maintain 5-Day Streak', current: streak },
  ];

  return (
    <div style={{ marginBottom: 22 }}>
      <div className="section-title">📅 Weekly Goals</div>
      <div className="weekly-goals-grid">
        {weeklyGoals.map(g => {
          const pct = Math.min(100, (g.current / g.target) * 100);
          const color = pct >= 100 ? 'var(--green)' : pct > 50 ? 'var(--gold)' : 'var(--violet)';
          return (
            <div key={g.type} className="weekly-goal-card">
              <div className="wg-icon">{g.icon}</div>
              <div className="wg-label">{g.label}</div>
              <div className="wg-progress">{Math.round(pct)}%</div>
              <div className="prog-bar-bg" style={{ height: 6 }}>
                <div className="prog-bar-fill" style={{ background: color, width: `${pct}%`, height: '100%' }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
