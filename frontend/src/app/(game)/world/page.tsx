'use client';
import { useGame } from '@/store/GameContext';
import { REALMS } from '@/constants/realms';
import Link from 'next/link';

export default function WorldPage() {
  const { state } = useGame();
  const groups: Record<string, typeof REALMS> = {};
  REALMS.forEach(r => { if (!groups[r.group]) groups[r.group] = []; groups[r.group].push(r); });

  return (
    <div className="page-view">
      <div className="view-header">
        <div className="view-eyebrow">World Map</div>
        <div className="view-title">The <span>Kingdom</span></div>
        <div className="view-subtitle">Choose your realm. Each pattern is a piece of the ancient knowledge.</div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
        {Object.entries(groups).map(([groupName, realms]) => (
          <div key={groupName}>
            <div className="zone-group-label">{groupName}</div>
            <div className="realms-grid">
              {realms.map(r => {
                const total = r.questions.length;
                const done = r.questions.filter(q => state.completed[q.id]).length;
                const pct = total ? Math.round(done / total * 100) : 0;
                const mastered = done === total && total > 0;
                const unlocked = done > 0;
                const status = mastered ? 'mastered' : unlocked ? 'unlocked' : 'locked';
                const barColor = mastered ? 'var(--gold)' : unlocked ? 'var(--green)' : 'var(--muted)';
                const xpLeft = r.questions.reduce((a, q) => a + (state.completed[q.id] ? 0 : q.xp), 0);

                return (
                  <Link key={r.id} href={`/realm/${r.id}`} style={{ textDecoration: 'none' }}>
                    <div className={`realm-card ${status}`} style={{ '--realm-color': r.color } as React.CSSProperties}>
                      <span className={`realm-status-badge ${mastered ? 'mastered' : unlocked ? 'unlocked' : 'locked'}`}>
                        {mastered ? 'Mastered' : unlocked ? 'In Progress' : 'Locked'}
                      </span>
                      <span className="realm-icon">{r.icon}</span>
                      <div className="realm-name">{r.name}</div>
                      <div className="realm-sub">{r.pattern}</div>
                      <div className="realm-stats">
                        <span className="diff-badge" style={{ background: 'rgba(255,255,255,0.04)', color: 'var(--text-dim)', border: '1px solid var(--border)' }}>{done}/{total}</span>
                        <span className="xp-chip">{xpLeft} XP left</span>
                      </div>
                      <div className="prog-bar-bg" style={{ height: 6 }}>
                        <div className="prog-bar-fill" style={{ background: barColor, width: `${pct}%`, height: '100%' }} />
                      </div>
                      <div style={{ fontSize: 9, color: 'var(--text-faint)', marginTop: 4, fontFamily: 'JetBrains Mono, monospace' }}>{pct}% explored</div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
