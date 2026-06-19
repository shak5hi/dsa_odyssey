import { useGame } from '../store/GameContext';
import { getLevelInfo } from '../utils/xpCalculator';

export function useUser() {
  const { state } = useGame();
  const level = getLevelInfo(state.xp);
  
  return {
    xp: state.xp,
    streak: state.streak,
    bestStreak: state.bestStreak,
    level,
    inventory: state.inventory,
    achievements: state.achievements,
    astraMsg: state.astraMsg,
    loaded: state.loaded,
  };
}
