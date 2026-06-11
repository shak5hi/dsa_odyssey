'use client';
import { useState } from 'react';
import { useGame } from '@/lib/gameStore';
import { REALMS, REALM_PROGRESSION, getMasteryRank } from '@/lib/data';

export default function TodayPage() {
  const { state, completeQuest, dispatch } = useGame();
  const [focusOpen, setFocusOpen] = useState(false);
  const [focusIdx, setFocusIdx] = useState(0);

  const now = new Date();
  const dateStr = now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  const activeRid = state.activeRealm;
  const activeRealm = REALMS.find(r => r.id === activeRid);
  const dailyQuestObjects = state.dailyQuests
    .map(qid => {
      for (const realm of REALMS) {
        const q = realm.questions.find(x => x.id === qid);
        if (q) return { ...q, realmId: realm.id, realmName: realm.name, pattern: realm.pattern };
      }
      return null;
    })
    .filter(Boolean) as Array<{ id: string; name: string; diff: string; xp: number; url: string; realmId: string; realmName: string; pattern: string }>;

  // Training arc
  const arcDone = activeRealm ? activeRealm.questions.filter(q => state.completed[q.id]).length : 0;
  const arcTotal = activeRealm ? activeRealm.questions.length : 0;
  const arcPct = arcTotal ? Math.round(arcDone / arcTotal * 100) : 0;
  const rank = getMasteryRank(arcPct);
  const activeIdx = REALM_PROGRESSION.indexOf(activeRid);
  const nextRid = activeIdx < REALM_PROGRESSION.length - 1 ? REALM_PROGRESSION[activeIdx + 1] : null;
  const nextRealm = nextRid ? REALMS.find(r => r.id === nextRid) : null;

  // Weekly goals
  const weekNum = Math.floor(now.getTime() / (7 * 24 * 3600 * 1000));
  const weeklyGoals = [
    { type: 'solve', target: 10, icon: '⚔️', label: 'Solve 10 Questions' },
    { type: 'xp', target: 150, icon: '✨', label: 'Earn 150 XP' },
    { type: 'streak', target: 5, icon: '🔥', label: 'Maintain 5-Day Streak' },
  ];

  // Bonus quest
  const dailyIds = new Set(state.dailyQuests);
  const allDailyDone = dailyQuestObjects.length > 0 && dailyQuestObjects.every(q => state.completed[q.id]);
  const bonusQ = allDailyDone && activeRealm
    ? activeRealm.questions.find(q => !state.completed[q.id] && !dailyIds.has(q.id))
    : null;
  const today = now.toISOString().slice(0, 10);
  const bonusDone = state.bonusDone?.[today];

  // Focus mode
  const focusQuests = dailyQuestObjects;
  const currentFocusQ = focusQuests[focusIdx];

  return (
    <div className="page-view">
      <div className="view-header">
        <div className="view-eyebrow">Daily Adventure</div>
        <div className="view-title">Current <span>Training Arc</span></div>
        <div className="view-subtitle">{dateStr}</div>
      </div>

      {/* Training Arc */}
      {activeRealm && (
        <div className="training-arc-card">
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 20, flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: 200 }}>
              <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 7, color: 'var(--text-faint)', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 4 }}>Current Training Arc</div>
              <div style={{ fontFamily: "'Cinzel', serif", fontSize: 20, fontWeight: 700, color: 'var(--text)', marginBottom: 2 }}>{activeRealm.name}</div>
              <div style={{ fontSize: 11, color: 'var(--gold)', marginBottom: 14, fontFamily: 'JetBrains Mono, monospace' }}>Pattern: {activeRealm.pattern}</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12 }}>
                {[
                  { label: 'Progress', val: `${arcDone} / ${arcTotal}`, color: 'var(--gold)' },
                  { label: 'Remaining', val: `${arcTotal - arcDone} left`, color: 'var(--crystal)' },
                ].map(s => (
                  <div key={s.label} style={{ background: 'var(--surface)', border: '2px solid var(--border)', padding: '10px 12px' }}>
                    <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 7, color: 'var(--text-faint)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 2 }}>{s.label}</div>
                    <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 14, color: s.color }}>{s.val}</div>
                  </div>
                ))}
              </div>
              <div className="prog-bar-bg" style={{ height: 8, marginBottom: 10 }}>
                <div className="prog-bar-fill" style={{ background: 'linear-gradient(90deg,var(--violet),var(--crystal))', width: `${arcPct}%`, height: '100%' }} />
              </div>
              <div className={`mastery-rank-badge rank-${rank.cls}`}>{rank.icon} {rank.label}</div>
            </div>
            <div style={{ minWidth: 160, maxWidth: 200 }}>
              <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 7, color: 'var(--text-faint)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>Next Realm</div>
              {nextRealm ? (
                <>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', marginBottom: 4 }}>{nextRealm.icon} {nextRealm.name}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-faint)', lineHeight: 1.5 }}>
                    {arcPct >= 100 ? '🔓 Unlocked! Head to World Map.' : `Complete ${arcTotal - arcDone} more quest${arcTotal - arcDone === 1 ? '' : 's'} to unlock`}
                  </div>
                  {arcPct >= 80 && arcPct < 100 && (
                    <div style={{ marginTop: 10, padding: '8px 12px', background: 'rgba(74,222,128,0.06)', border: '1px solid rgba(74,222,128,0.2)', fontSize: 11, color: 'var(--green)' }}>
                      🔓 Almost there!
                    </div>
                  )}
                </>
              ) : (
                <div style={{ fontSize: 13, color: 'var(--gold)' }}>🏆 Final Realm</div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Astra */}
      <div className="astra-banner">
        <span className="astra-avatar">✨</span>
        <div>
          <div className="astra-name">Astra — Court Wizard</div>
          <div className="astra-text">{state.astraMsg || 'Your quest awaits, champion.'}</div>
        </div>
      </div>

      {/* Daily Quests */}
      <div className="quest-grid">
        {dailyQuestObjects.length === 0 ? (
          <div className="glass-card" style={{ textAlign: 'center', padding: 40 }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🎉</div>
            <div className="view-title">All daily quests complete!</div>
            <p style={{ color: 'var(--text-dim)', marginTop: 8 }}>Return tomorrow for new challenges, champion.</p>
          </div>
        ) : dailyQuestObjects.map((q, i) => (
          <div key={q.id} className={`quest-card${state.completed[q.id] ? ' completed' : ''}`} id={`qcard-${q.id}`}>
            <div className="quest-num">Quest {i + 1}</div>
            <div className="quest-info">
              <div className="quest-name">{q.name}</div>
              <div className="quest-meta">
                <span className={`diff-badge diff-${q.diff.toLowerCase()}`}>{q.diff}</span>
                <span className="xp-chip">+{q.xp} XP</span>
                <span className="quest-pattern">{q.pattern}</span>
              </div>
            </div>
            <div className="quest-actions">
              <a href={q.url} target="_blank" rel="noreferrer" className="quest-lc-link" onClick={e => e.stopPropagation()}>LC →</a>
              <button
                className="quest-check"
                onClick={e => { e.stopPropagation(); completeQuest(q.id); }}
              >
                {state.completed[q.id] ? '✓' : ''}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Weekly Goals */}
      <div style={{ marginBottom: 22 }}>
        <div className="section-title">📅 Weekly Goals</div>
        <div className="weekly-goals-grid">
          {weeklyGoals.map(g => {
            const cur = g.type === 'solve' ? Object.keys(state.completed).length
              : g.type === 'xp' ? state.xp
              : state.streak;
            const pct = Math.min(100, cur / g.target * 100);
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

      {/* Deep Focus */}
      <div style={{ marginBottom: 20, display: 'flex', gap: 10, alignItems: 'center' }}>
        <button className="btn-primary" onClick={() => { setFocusIdx(0); setFocusOpen(true); }}>
          🧘 Enter Deep Focus
        </button>
        <span style={{ fontSize: 11, color: 'var(--text-faint)' }}>Distraction-free quest mode</span>
      </div>

      {/* Bonus Quest */}
      {bonusQ && (
        <div style={{ marginTop: 16 }}>
          <div className="section-title">✨ Bonus Quest</div>
          <div className={`bonus-quest-card${bonusDone === bonusQ.id ? ' bonus-done' : ''}`} style={{ opacity: bonusDone === bonusQ.id ? 0.5 : 1 }}>
            <div style={{ flex: 1 }}>
              <div className="bonus-quest-label">✨ Bonus Quest — One More</div>
              <div className="bonus-quest-name">{bonusQ.name}</div>
              <div className="bonus-quest-hint">{activeRealm?.pattern} · {bonusQ.diff}</div>
            </div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexShrink: 0 }}>
              <a href={bonusQ.url} target="_blank" rel="noreferrer"
                style={{ fontSize: 11, color: 'var(--crystal)', padding: '6px 12px', border: '1px solid rgba(79,195,247,0.2)' }}>
                Open →
              </a>
              <button className="btn-gold btn-sm"
                onClick={() => completeQuest(bonusQ.id)}>
                {bonusDone === bonusQ.id ? '✓ Done' : 'Mark Done'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Deep Focus Overlay */}
      {focusOpen && (
        <div className="deep-focus-overlay open">
          <button className="focus-exit" onClick={() => setFocusOpen(false)}>✕ Exit Focus</button>
          {currentFocusQ && (
            <>
              <div className="focus-realm-label">Realm</div>
              <div className="focus-realm-name">{activeRealm?.name}</div>
              <div className="focus-q-num">Quest {focusIdx + 1} of {focusQuests.length}</div>
              <div className="focus-q-name">{currentFocusQ.name}</div>
              <div className="focus-q-meta">
                <span className={`diff-badge diff-${currentFocusQ.diff.toLowerCase()}`}>{currentFocusQ.diff}</span>
                <span className="xp-chip">+{currentFocusQ.xp} XP</span>
              </div>
              <div className="focus-actions">
                <a href={currentFocusQ.url} target="_blank" rel="noreferrer" className="btn-primary" style={{ textDecoration: 'none' }}>
                  Open on LeetCode →
                </a>
                <button
                  className="btn-gold"
                  disabled={!!state.completed[currentFocusQ.id]}
                  onClick={() => {
                    completeQuest(currentFocusQ.id);
                    const next = focusQuests.findIndex((fq, i) => i > focusIdx && !state.completed[fq.id]);
                    if (next !== -1) setTimeout(() => setFocusIdx(next), 600);
                  }}
                >
                  {state.completed[currentFocusQ.id] ? '✓ Completed' : '✓ Mark Complete'}
                </button>
              </div>
              <div className="focus-nav">
                <button className="focus-nav-btn" onClick={() => setFocusIdx(Math.max(0, focusIdx - 1))}>← Prev</button>
                <button className="focus-nav-btn" onClick={() => setFocusIdx(Math.min(focusQuests.length - 1, focusIdx + 1))}>Next →</button>
              </div>
            </>
          )}
          <div className="focus-progress">
            {focusQuests.map((fq, i) => (
              <div key={fq.id} className={`focus-pip${state.completed[fq.id] ? ' done' : i === focusIdx ? ' current' : ''}`} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
