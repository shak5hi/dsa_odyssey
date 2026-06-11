'use client';
import { useGame } from '@/lib/gameStore';
import { REALMS } from '@/lib/data';

const RELICS = [
  { id: 'iron_blade', icon: '🗡️', name: 'Iron Blade', unlockAt: 5, condition: (solved: number) => solved >= 5, desc: 'Forged after 5 quests conquered' },
  { id: 'crystal', icon: '💎', name: 'Memory Crystal', unlockAt: 15, condition: (solved: number) => solved >= 15, desc: 'Crystallized after mastering 15 quests' },
  { id: 'compass', icon: '🧭', name: 'Explorer Compass', unlockAt: 30, condition: (solved: number) => solved >= 30, desc: 'The compass of a true explorer — 30 quests' },
  { id: 'shield', icon: '🛡️', name: 'Iron Shield', unlockAt: 50, condition: (solved: number) => solved >= 50, desc: 'Shield earned by the brave at 50 quests' },
  { id: 'bell', icon: '🔔', name: 'Priority Bell', unlockAt: 75, condition: (solved: number) => solved >= 75, desc: 'Rings for those who master 75 quests' },
  { id: 'key', icon: '🗝️', name: 'Maze Key', unlockAt: 100, condition: (solved: number) => solved >= 100, desc: 'Unlocks every hidden path — 100 quests' },
  { id: 'branch', icon: '🍃', name: 'Living Branch', unlockAt: 125, condition: (solved: number) => solved >= 125, desc: 'Grows recursively at 125 quests' },
  { id: 'hourglass', icon: '⌛', name: 'Temporal Hourglass', unlockAt: 150, condition: (solved: number) => solved >= 150, desc: 'DP mastery at 150 quests' },
  { id: 'crown', icon: '👑', name: 'Crown of Offer', unlockAt: 180, condition: (solved: number) => solved >= 180, desc: 'Worn only by those who collected all offers' },
];

export default function RelicsPage() {
  const { state } = useGame();
  const solved = Object.keys(state.completed).length;

  return (
    <div className="page-view">
      <div className="view-header">
        <div className="view-eyebrow">Treasury</div>
        <div className="view-title">Realm <span>Relics</span></div>
        <div className="view-subtitle">Powerful artifacts earned through sheer persistence.</div>
      </div>
      <div className="relics-grid">
        {RELICS.map(r => {
          const earned = r.condition(solved);
          return (
            <div key={r.id} className={`relic-slot${earned ? ' earned' : ' locked-relic'}`}>
              <span className="relic-icon">{r.icon}</span>
              <div className="relic-name">{r.name}</div>
              {earned ? (
                <div className="relic-earned-label">✓ Earned</div>
              ) : (
                <div className="relic-unlock-at">Unlock at {r.unlockAt} quests</div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
