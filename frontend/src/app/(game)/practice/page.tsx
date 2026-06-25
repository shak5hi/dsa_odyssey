'use client';
import { useGame } from '@/store/GameContext';
import { REALMS } from '@/constants/realms';
import { getWeakRealms } from '@/constants/insights';
import { PracticeInsightsPanel } from '@/features/dashboard/components/PracticeInsightsPanel';

export default function PracticePage() {
  const { state, completeQuest } = useGame();
  const { insights, completed, felt } = state;

  const weakRealms = getWeakRealms(insights, 0.3);
  const totalRated = Object.keys(felt).length;
  const totalHard = Object.values(felt).filter(f => f === 'hard').length;
  const totalDone = Object.keys(completed).length;

  return (
    <div className="page-view">
      <div className="view-header">
        <div className="view-eyebrow">Personalized for You</div>
        <div className="view-title">Smart <span>Practice</span></div>
        <div className="view-subtitle">
          Your pattern strengths and weak spots — updated after every quest you rate.
        </div>
      </div>

      {/* Stats Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: 28 }}>
        {[
          { val: totalDone, lbl: 'Questions Solved', icon: '⚔️', color: 'var(--gold)' },
          { val: totalRated, lbl: 'Ratings Given', icon: '⭐', color: 'var(--violet)' },
          { val: totalHard, lbl: 'Felt Hard', icon: '🔥', color: 'var(--hard)' },
          { val: weakRealms.length, lbl: 'Focus Zones', icon: '🎯', color: 'var(--crystal)' },
        ].map(s => (
          <div key={s.lbl} className="stat-card">
            <div style={{ fontSize: 22, marginBottom: 6 }}>{s.icon}</div>
            <div className="stat-num" style={{ color: s.color }}>{s.val}</div>
            <div className="stat-lbl">{s.lbl}</div>
          </div>
        ))}
      </div>

      <PracticeInsightsPanel />

      {/* All Realms Quick Nav */}
      <div style={{ marginTop: 32 }}>
        <div className="section-title">📚 All Patterns</div>
        <div className="realms-grid">
          {REALMS.map(realm => {
            const ins = insights[realm.id];
            const doneCount = realm.questions.filter(q => completed[q.id]).length;
            const isWeak = weakRealms.includes(realm.id);
            const hasRatings = ins && ins.total > 0;
            return (
              <a
                key={realm.id}
                href={`/realm/${realm.id}`}
                className={`realm-card${doneCount === realm.questions.length ? ' mastered' : ''}`}
                style={{ '--realm-color': realm.color } as React.CSSProperties}
                id={`practice-realm-${realm.id}`}
              >
                {isWeak && (
                  <span className="focus-zone-badge" style={{ position: 'absolute', top: 10, right: 10, zIndex: 2 }}>
                    🔥 Focus
                  </span>
                )}
                <span className="realm-icon">{realm.icon}</span>
                <div className="realm-name">{realm.name}</div>
                <div className="realm-sub">{realm.pattern}</div>
                <div className="realm-stats">
                  <span className="xp-chip" style={{ fontSize: 10 }}>{doneCount}/{realm.questions.length}</span>
                  {hasRatings && ins.struggleScore > 0.35 && (
                    <span style={{ fontSize: 10, color: 'var(--hard)', fontFamily: 'JetBrains Mono, monospace' }}>
                      {Math.round(ins.struggleScore * 100)}% hard
                    </span>
                  )}
                </div>
                <div className="prog-bar-bg" style={{ height: 4, marginTop: 8 }}>
                  <div
                    className="prog-bar-fill"
                    style={{
                      width: `${(doneCount / realm.questions.length) * 100}%`,
                      background: doneCount === realm.questions.length
                        ? 'linear-gradient(90deg, var(--gold), #ff9f43)'
                        : `linear-gradient(90deg, ${realm.color}88, ${realm.color})`,
                    }}
                  />
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
}
