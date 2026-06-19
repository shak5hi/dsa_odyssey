'use client';
import { useGame } from '@/store/GameContext';
import { REALMS } from '@/constants/realms';

const TIERS = [
  { icon: '🌱', name: 'Foundation\nPhase', desc: 'Learn arrays, hashing, two pointers, binary search. Build your base.', solve: 0, xp: 0 },
  { icon: '🗺️', name: 'Data Structure\nExplorer', desc: 'Master linked lists, stacks, heaps, and backtracking.', solve: 50, xp: 500 },
  { icon: '🌳', name: 'Tree & Graph\nConqueror', desc: 'Conquer trees, BSTs, DFS, BFS, and union-find.', solve: 100, xp: 1200 },
  { icon: '⏳', name: 'DP Warrior', desc: 'Unlock the final power — 1D and 2D dynamic programming.', solve: 140, xp: 2000 },
  { icon: '👑', name: 'Interview Ready\nChampion', desc: 'You have solved everything. Offer day is yours.', solve: 180, xp: 3000 },
];

export default function ForecastPage() {
  const { state } = useGame();
  const solved = Object.keys(state.completed).length;
  const lvl = getLevelInfo(state.xp);

  let currentTier = 0;
  for (let i = TIERS.length - 1; i >= 0; i--) {
    if (solved >= TIERS[i].solve) { currentTier = i; break; }
  }

  // Days to offer
  const daysLeft = Math.max(0, 180 - solved) * 1;
  const quests = REALMS.reduce((a, r) => a + r.questions.length, 0);
  const remaining = quests - solved;

  return (
    <div className="page-view">
      <div className="view-header">
        <div className="view-eyebrow">Journey Map</div>
        <div className="view-title">Offer Day <span>Forecast</span></div>
        <div className="view-subtitle">Your path to interview readiness, mapped out.</div>
      </div>

      {/* Current Tier */}
      <div className="glass-card" style={{ textAlign: 'center', marginBottom: 24 }}>
        <div style={{ fontSize: 56, marginBottom: 8 }}>{TIERS[currentTier].icon}</div>
        <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 7, color: 'var(--text-faint)', textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: 6 }}>Current Tier</div>
        <div style={{ fontFamily: "'Cinzel', serif", fontSize: 20, fontWeight: 700, color: 'var(--gold)', marginBottom: 6, whiteSpace: 'pre-line' }}>{TIERS[currentTier].name}</div>
        <p style={{ fontSize: 12, color: 'var(--text-dim)', maxWidth: 380, margin: '0 auto 16px' }}>{TIERS[currentTier].desc}</p>
        <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
          {[
            { label: 'Solved', val: solved },
            { label: 'XP', val: state.xp },
            { label: 'Level', val: lvl.title },
            { label: 'Remaining', val: remaining },
          ].map(s => (
            <div key={s.label} style={{ background: 'var(--surface)', border: '2px solid var(--border)', padding: '10px 18px', textAlign: 'center' }}>
              <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 14, color: 'var(--gold)' }}>{s.val}</div>
              <div style={{ fontSize: 9, color: 'var(--text-faint)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Tier Progression */}
      <div className="section-title">📈 Progression Path</div>
      <div className="forecast-tiers">
        {TIERS.map((t, i) => {
          const isCurrent = i === currentTier;
          const isNext = i === currentTier + 1;
          const isLocked = i > currentTier + 1;
          const isDone = i < currentTier;
          return (
            <div key={i} className={`forecast-tier${isCurrent ? ' current-tier' : isNext ? ' next-tier' : isLocked ? ' locked-tier' : ''}`}>
              <span className="forecast-tier-icon">{isDone ? '✅' : t.icon}</span>
              <div>
                <div className="forecast-tier-name" style={{ whiteSpace: 'pre-line' }}>{t.name}</div>
                <div className="forecast-tier-desc">{t.desc}</div>
                {i > 0 && <div style={{ fontSize: 10, color: 'var(--text-faint)', marginTop: 3, fontFamily: 'JetBrains Mono, monospace' }}>Req: {t.solve} solved · {t.xp} XP</div>}
              </div>
              <div className={`forecast-tier-badge${isCurrent ? ' badge-current' : isNext ? ' badge-next' : ''}`}>
                {isDone ? '✓ Done' : isCurrent ? 'You Are Here' : isNext ? 'Next Tier' : `${t.solve - solved} to unlock`}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
