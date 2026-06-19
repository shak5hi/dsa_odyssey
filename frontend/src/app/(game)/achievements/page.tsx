'use client';
import { useGame } from '@/store/GameContext';
import { ACHIEVEMENTS } from '@/constants/achievements';

export default function AchievementsPage() {
  const { state } = useGame();
  const unlocked = Object.keys(state.achievements).length;
  return (
    <div className="page-view">
      <div className="view-header">
        <div className="view-eyebrow">Hall of Records</div>
        <div className="view-title">Your <span>Achievements</span></div>
        <div className="view-subtitle">{unlocked} / {ACHIEVEMENTS.length} Achievements Unlocked</div>
      </div>
      <div className="achievements-grid">
        {ACHIEVEMENTS.map(a => {
          const date = state.achievements[a.id];
          return (
            <div key={a.id} className={`achieve-card${date ? ' unlocked' : ' locked'}`}>
              <span className="achieve-icon">{a.icon}</span>
              <div className="achieve-name">{a.name}</div>
              <div className="achieve-desc">{a.desc}</div>
              {date && <div className="achieve-date">Unlocked {date}</div>}
            </div>
          );
        })}
      </div>
    </div>
  );
}
