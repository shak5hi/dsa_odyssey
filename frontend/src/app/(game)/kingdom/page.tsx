'use client';
import { useGame } from '@/store/GameContext';
import { REALMS } from '@/constants/realms';
import Link from 'next/link';

export default function HomePage() {
  const { state } = useGame();
  const solved = Object.keys(state.completed).length;
  const patterns = state.inventory.length;

  // Campaign progress
  const month = Math.min(4, Math.ceil((solved + 1) / 60));
  const campaigns = [
    { name: 'Month 1 — Foundation Forest', realms: ['arrays','hashing','twoptr','sliding','prefix','bsearch'] },
    { name: 'Month 2 — Data Structure Valley', realms: ['linked','stack','heap','backtrack'] },
    { name: 'Month 3 — Tree Kingdom & Graph Realm', realms: ['trees','bst','dfs','bfs','dsu'] },
    { name: 'Month 4 — DP Citadel', realms: ['dp1','dp2'] },
  ];
  const camp = campaigns[month - 1] || campaigns[0];
  let campDone = 0, campTotal = 0;
  camp.realms.forEach(rid => {
    const r = REALMS.find(x => x.id === rid);
    if (!r) return;
    campDone += r.questions.filter(q => state.completed[q.id]).length;
    campTotal += r.questions.length;
  });
  const campPct = campTotal ? Math.round(campDone / campTotal * 100) : 0;

  const topRealms = REALMS.slice(0, 5);

  return (
    <div className="page-view">
      {/* Hero */}
      <div className="dashboard-hero">
        <div className="dashboard-hero-title">The Kingdom Awaits</div>
        <p className="dashboard-hero-sub">
          Ancient Patterns lie dormant. You are the one who will reclaim them. Begin your odyssey.
        </p>
        <Link href="/today">
          <button className="btn-gold">⚔️ Begin Today&apos;s Quest</button>
        </Link>
      </div>

      {/* Stats Bar */}
      <div className="stats-bar">
        <div className="stat-card">
          <div className="stat-num">{solved}</div>
          <div className="stat-lbl">Quests Solved</div>
        </div>
        <div className="stat-card">
          <div className="stat-num">{state.xp}</div>
          <div className="stat-lbl">Total XP</div>
        </div>
        <div className="stat-card">
          <div className="stat-num">{state.streak}</div>
          <div className="stat-lbl">Day Streak</div>
        </div>
        <div className="stat-card">
          <div className="stat-num">{patterns}</div>
          <div className="stat-lbl">Patterns Mastered</div>
        </div>
      </div>

      <div className="dashboard-2col">
        {/* Campaign */}
        <div className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 10 }}>
            <div>
              <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 9, color: 'var(--text)', marginBottom: 2 }}>📅 Monthly Campaign</div>
              <div style={{ fontSize: 11, color: 'var(--text-dim)' }}>{camp.name}</div>
            </div>
            <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 14, color: 'var(--gold)' }}>{campPct}%</div>
          </div>
          <div className="prog-bar-bg" style={{ height: 10, marginBottom: 6 }}>
            <div className="prog-bar-fill" style={{ background: 'linear-gradient(90deg,var(--gold-dim),var(--gold))', width: `${campPct}%`, height: '100%' }} />
          </div>
          <div style={{ fontSize: 10, color: 'var(--text-faint)', fontFamily: 'JetBrains Mono, monospace' }}>{campDone} / {campTotal} questions</div>
        </div>

        {/* Realm Progress */}
        <div className="glass-card">
          <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 9, color: 'var(--text)', marginBottom: 14 }}>🗺️ Realm Progress</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {topRealms.map(r => {
              const total = r.questions.length, done = r.questions.filter(q => state.completed[q.id]).length;
              const pct = total ? Math.round(done / total * 100) : 0;
              return (
                <div key={r.id}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'var(--text-dim)', marginBottom: 3 }}>
                    <span>{r.icon} {r.name}</span>
                    <span style={{ color: 'var(--gold)', fontFamily: 'JetBrains Mono, monospace' }}>{pct}%</span>
                  </div>
                  <div className="prog-bar-bg" style={{ height: 5 }}>
                    <div className="prog-bar-fill" style={{ background: `linear-gradient(90deg,${r.color},${r.color}88)`, width: `${pct}%`, height: '100%' }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Astra */}
      <div className="glass-card">
        <div className="section-title">📜 Astra&apos;s Chronicle</div>
        <div className="astra-banner" style={{ marginBottom: 0 }}>
          <span className="astra-avatar">🔮</span>
          <div>
            <div className="astra-name">Astra — Court Wizard</div>
            <div className="astra-text">{state.astraMsg || 'Every great coder started with zero. Your journey begins with a single quest.'}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
