'use client';
import { useGame } from '@/store/GameContext';

export function AchievementPopup() {
  const { state } = useGame();
  const popup = state.achievementPopup;
  return (
    <div className={`achieve-popup${popup ? ' show' : ''}`}>
      <span className="achieve-popup-icon">{popup?.icon || '🏆'}</span>
      <div className="achieve-popup-label">Achievement Unlocked</div>
      <div className="achieve-popup-name">{popup?.name || ''}</div>
      <div className="achieve-popup-desc">{popup?.desc || ''}</div>
    </div>
  );
}
