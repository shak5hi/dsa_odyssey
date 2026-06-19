import { Level } from '../types/User';
import { LEVELS } from '../constants/tiers';
import { REALMS, REALM_PROGRESSION } from '../constants/realms';

export function getLevelInfo(xp: number): Level {
  let level = LEVELS[0];
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (xp >= LEVELS[i].xp) { level = LEVELS[i]; break; }
  }
  return level;
}

export function getActiveRealm(completed: Record<string, unknown>): string {
  for (const rid of REALM_PROGRESSION) {
    const r = REALMS.find(x => x.id === rid);
    if (!r) continue;
    const done = r.questions.filter(q => completed[q.id]).length;
    if (done < r.questions.length) return rid;
  }
  return REALM_PROGRESSION[0];
}

export function getMasteryRank(pct: number) {
  if (pct >= 100) return { cls: 'master', icon: '👑', label: 'Master' };
  if (pct >= 75) return { cls: 'expert', icon: '⚔️', label: 'Expert' };
  if (pct >= 50) return { cls: 'adept', icon: '🔮', label: 'Adept' };
  if (pct >= 25) return { cls: 'apprentice', icon: '🗺️', label: 'Apprentice' };
  return { cls: 'novice', icon: '🌱', label: 'Novice' };
}
