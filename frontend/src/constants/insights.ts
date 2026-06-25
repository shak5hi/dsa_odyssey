import { REALMS } from './realms';
import { RealmInsight } from '../types/GameState';

/** Given per-qid felt ratings, compute per-realm struggle insights */
export function computeInsights(felt: Record<string, 'easy' | 'medium' | 'hard'>): Record<string, RealmInsight> {
  const insights: Record<string, RealmInsight> = {};

  for (const realm of REALMS) {
    let hardCount = 0, easyCount = 0, mediumCount = 0, total = 0;
    for (const q of realm.questions) {
      const f = felt[q.id];
      if (f) {
        total++;
        if (f === 'hard') hardCount++;
        else if (f === 'easy') easyCount++;
        else mediumCount++;
      }
    }
    // Struggle score: 0=comfortable, 1=struggling
    const struggleScore = total > 0 ? (hardCount * 1.0 + mediumCount * 0.4) / total : 0;
    insights[realm.id] = { hardCount, easyCount, mediumCount, total, struggleScore };
  }

  return insights;
}

/** Given insights, return realm ids sorted by struggle score descending */
export function getWeakRealms(insights: Record<string, RealmInsight>, threshold = 0.35): string[] {
  return Object.entries(insights)
    .filter(([, ins]) => ins.total >= 2 && ins.struggleScore >= threshold)
    .sort((a, b) => b[1].struggleScore - a[1].struggleScore)
    .map(([id]) => id);
}

/**
 * Adaptive daily quest selection.
 * Returns 3-5 question IDs:
 * - 3 from the active realm (normal)
 * - +1-2 bonus "focus" questions from the top struggling realm (if different from active)
 */
export function selectAdaptiveDailyQuests(
  activeRealm: string,
  completed: Record<string, { date: string; notes: string }>,
  insights: Record<string, RealmInsight>
): string[] {
  const completedIds = new Set(Object.keys(completed));

  // Primary: 3 questions from active realm
  const activeR = REALMS.find(r => r.id === activeRealm);
  const activePrimary = activeR
    ? activeR.questions.filter(q => !completedIds.has(q.id)).sort(() => 0.5 - Math.random()).slice(0, 3).map(q => q.id)
    : [];

  // Bonus: 1-2 from the top struggling realm (not the active one, min 35% struggle)
  const weakRealms = getWeakRealms(insights, 0.35).filter(id => id !== activeRealm);
  const bonusQuests: string[] = [];

  if (weakRealms.length > 0) {
    const focusRealm = REALMS.find(r => r.id === weakRealms[0]);
    if (focusRealm) {
      const focusAvail = focusRealm.questions.filter(q => !completedIds.has(q.id) && !activePrimary.includes(q.id));
      const focusPick = focusAvail.sort(() => 0.5 - Math.random()).slice(0, 2);
      bonusQuests.push(...focusPick.map(q => q.id));
    }
  }

  return [...activePrimary, ...bonusQuests];
}
