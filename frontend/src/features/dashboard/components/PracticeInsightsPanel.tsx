'use client';
import Link from 'next/link';
import { useGame } from '@/store/GameContext';
import { REALMS } from '@/constants/realms';
import { getWeakRealms } from '@/constants/insights';

export function PracticeInsightsPanel() {
  const { state } = useGame();
  const { insights, completed, felt } = state;

  const weakRealms = getWeakRealms(insights, 0.3);
  const hasInsights = Object.values(insights).some(ins => ins.total > 0);

  if (!hasInsights) {
    return (
      <div className="glass-card" style={{ textAlign: 'center', padding: 40 }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>🧭</div>
        <div className="view-title" style={{ fontSize: 18, marginBottom: 8 }}>No Insights Yet</div>
        <p style={{ color: 'var(--text-dim)', fontSize: 14, lineHeight: 1.7 }}>
          Complete a few quests and rate your difficulty to unlock your personalized pattern radar.
        </p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Pattern Strength Bars */}
      <div className="glass-card">
        <div className="section-title">🧠 Pattern Strength Radar</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {REALMS.filter(r => insights[r.id]?.total > 0).map(realm => {
            const ins = insights[realm.id];
            const doneInRealm = realm.questions.filter(q => completed[q.id]).length;
            const completionPct = Math.round((doneInRealm / realm.questions.length) * 100);
            const isWeak = weakRealms.includes(realm.id);
            const strengthPct = Math.max(0, Math.round((1 - ins.struggleScore) * 100));
            return (
              <div key={realm.id} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontSize: 18, width: 24, flexShrink: 0 }}>{realm.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>{realm.pattern}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      {isWeak && (
                        <span className="focus-zone-badge">🔥 Focus Zone</span>
                      )}
                      <span style={{ fontSize: 11, color: 'var(--text-faint)', fontFamily: 'JetBrains Mono, monospace' }}>
                        {doneInRealm}/{realm.questions.length} done · {ins.hardCount} hard
                      </span>
                    </div>
                  </div>
                  <div className="prog-bar-bg" style={{ height: 7 }}>
                    <div
                      className="prog-bar-fill"
                      style={{
                        width: `${strengthPct}%`,
                        background: isWeak
                          ? 'linear-gradient(90deg, #f87171, #ef4444)'
                          : strengthPct > 70
                            ? 'linear-gradient(90deg, #4ade80, #22c55e)'
                            : 'linear-gradient(90deg, #a78bfa, #7c3aed)',
                      }}
                    />
                  </div>
                </div>
                <span style={{ fontSize: 11, color: isWeak ? 'var(--hard)' : 'var(--text-dim)', width: 36, textAlign: 'right', fontFamily: 'JetBrains Mono, monospace' }}>
                  {strengthPct}%
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Weak Spots Panel */}
      {weakRealms.length > 0 && (
        <div>
          <div className="section-title">🔥 Focus Zones — Need More Drill</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {weakRealms.slice(0, 3).map(realmId => {
              const realm = REALMS.find(r => r.id === realmId)!;
              const ins = insights[realmId];
              const pending = realm.questions.filter(q => !completed[q.id]);
              const next3 = pending.slice(0, 3);
              return (
                <div key={realmId} className="weak-spot-card">
                  <div className="weak-spot-header">
                    <span style={{ fontSize: 24 }}>{realm.icon}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, color: 'var(--text)', fontSize: 14 }}>{realm.name}</div>
                      <div style={{ fontSize: 11, color: 'var(--hard)', marginTop: 2 }}>
                        {ins.hardCount} questions felt Hard · Struggle score {Math.round(ins.struggleScore * 100)}%
                      </div>
                    </div>
                    <Link href={`/realm/${realmId}`} style={{ fontSize: 11, color: 'var(--crystal)', padding: '6px 12px', border: '1px solid rgba(56,189,248,0.25)', borderRadius: 6 }}>
                      All questions →
                    </Link>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 10 }}>
                    {next3.map(q => (
                      <div key={q.id} className="practice-q-row">
                        <span className={`diff-badge diff-${q.diff.toLowerCase()}`}>{q.diff}</span>
                        <a href={q.url} target="_blank" rel="noreferrer" className="practice-q-name">{q.name}</a>
                        <span style={{ fontSize: 10, color: 'var(--text-faint)', marginLeft: 'auto' }}>+{q.xp} XP</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
