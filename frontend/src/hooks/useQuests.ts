import { useGame } from '../store/GameContext';
import { REALMS } from '../constants/realms';

export function useQuests() {
  const { state, completeQuest, uncompleteQuest } = useGame();

  const dailyQuests = state.dailyQuests
    .map(qid => {
      for (const realm of REALMS) {
        const q = realm.questions.find(x => x.id === qid);
        if (q) return { ...q, realmId: realm.id, realmName: realm.name, pattern: realm.pattern };
      }
      return null;
    })
    .filter(Boolean) as Array<{ id: string; name: string; diff: string; xp: number; url: string; realmId: string; realmName: string; pattern: string }>;

  const completedCount = Object.keys(state.completed).length;

  const isCompleted = (qid: string) => !!state.completed[qid];

  return {
    dailyQuests,
    completedCount,
    isCompleted,
    completeQuest,
    uncompleteQuest,
    completed: state.completed,
    activeRealm: state.activeRealm,
    bonusDone: state.bonusDone,
  };
}
