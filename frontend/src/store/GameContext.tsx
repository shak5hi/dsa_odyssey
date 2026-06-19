'use client';
import { createContext, useContext, useReducer, useEffect, ReactNode, useCallback } from 'react';
import { GameState, Toast } from '../types/GameState';
import { gameReducer, initialState, Action } from './gameReducer';
import { REALMS, REALM_PROGRESSION } from '../constants/realms';
import { getActiveRealm } from '../utils/xpCalculator';
import { gameStateService } from '../services/gameStateService';
import { questService } from '../services/questService';
import { noteService } from '../services/noteService';

const GameCtx = createContext<{
  state: GameState;
  dispatch: React.Dispatch<Action>;
  completeQuest: (qid: string) => Promise<void>;
  uncompleteQuest: (qid: string) => Promise<void>;
  saveNote: (qid: string, notes: string) => Promise<void>;
  addToCodex: (qid: string, content: string) => Promise<void>;
  showToast: (msg: string, type?: Toast['type']) => void;
}>(null!);

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  const showToast = useCallback((msg: string, type: Toast['type'] = 'muted') => {
    const id = Math.random().toString(36).slice(2);
    dispatch({ type: 'ADD_TOAST', toast: { id, msg, type } });
    setTimeout(() => dispatch({ type: 'REMOVE_TOAST', id }), 3200);
  }, []);

  useEffect(() => {
    async function load() {
      try {
        const data = await gameStateService.getState();
        if (data.error) { console.error('State load error:', data.error); return; }

        const completed = data.completed || {};
        const activeRealm = getActiveRealm(completed) || data.dailyQuestRealm || 'arrays';
        
        const todayStr = new Date().toISOString().slice(0, 10);
        let dailyQuests: string[] = data.dailyQuests || [];

        if (data.dailyQuestDate !== todayStr || dailyQuests.length === 0) {
          const realm = REALMS.find(r => r.id === activeRealm) || REALMS[0];
          const completedIds = Object.keys(completed);
          const available = realm.questions.filter(q => !completedIds.includes(q.id));
          dailyQuests = available.sort(() => 0.5 - Math.random()).slice(0, 3).map(q => q.id);
          
          gameStateService.updateState({ dailyQuests, dailyQuestDate: todayStr, dailyQuestRealm: activeRealm }).catch(() => {});
        }

        dispatch({
          type: 'LOAD',
          payload: {
            xp: data.xp || 0,
            streak: data.streak || 0,
            bestStreak: data.bestStreak || 0,
            lastActivity: data.lastActivity || null,
            inventory: data.inventory || [],
            achievements: data.achievements || {},
            ceremonySeen: data.ceremonySeen || {},
            bonusDone: data.bonusDone || {},
            completed,
            notes: data.notes || {},
            activeRealm,
            dailyQuests,
          },
        });
      } catch (err) {
        console.error('Failed to load state', err);
      }
    }
    load();
  }, []);

  const completeQuest = useCallback(async (qid: string) => {
    if (state.completed[qid]) { await uncompleteQuest(qid); return; }

    let foundRealm = null;
    for (const r of REALMS) {
      const q = r.questions.find(x => x.id === qid);
      if (q) { foundRealm = { realm: r, q }; break; }
    }

    const data = await questService.completeQuest(qid);
    if (!data.success) { showToast('Error saving quest', 'red'); return; }

    const newXp = data.newXp;
    const xpGained = data.xpGained || (foundRealm?.q.xp ?? 10);

    let realmCompleted: string | null = null;
    let newActiveRealm = state.activeRealm;
    
    if (foundRealm) {
      const doneAfter = foundRealm.realm.questions.filter(
        q => state.completed[q.id] || q.id === qid
      ).length;
      if (doneAfter === foundRealm.realm.questions.length) {
        realmCompleted = foundRealm.realm.id;
        const idx = REALM_PROGRESSION.indexOf(foundRealm.realm.id);
        if (idx >= 0 && idx < REALM_PROGRESSION.length - 1) {
          newActiveRealm = REALM_PROGRESSION[idx + 1];
        }
      }
    }

    dispatch({ type: 'COMPLETE_QUEST', qid, newXp, realmCompleted, newActiveRealm });
    showToast(`⚔️ Quest Complete! +${xpGained} XP`, 'green');

    if (realmCompleted && !state.ceremonySeen[realmCompleted]) {
      dispatch({ type: 'MARK_CEREMONY_SEEN', realmId: realmCompleted });
      gameStateService.updateState({ ceremonySeen: { ...state.ceremonySeen, [realmCompleted]: true } }).catch(() => {});
      setTimeout(() => dispatch({ type: 'SHOW_CEREMONY', realmId: realmCompleted! }), 600);
    }

    if (foundRealm) {
      setTimeout(() => {
        dispatch({
          type: 'OPEN_CODEX_MODAL',
          payload: {
            qid,
            questName: foundRealm!.q.name,
            realmId: foundRealm!.realm.id,
            realmName: foundRealm!.realm.name,
            pattern: foundRealm!.realm.pattern,
            difficulty: foundRealm!.q.diff,
          },
        });
      }, 1200);
    }
  }, [state.completed, state.ceremonySeen, state.activeRealm, showToast]);

  async function uncompleteQuest(qid: string) {
    const data = await questService.uncompleteQuest(qid);
    if (!data.success) { showToast('Error', 'red'); return; }
    dispatch({ type: 'UNCOMPLETE_QUEST', qid, newXp: data.newXp });
    showToast('↩ Quest unmarked', 'muted');
  }

  const saveNote = useCallback(async (qid: string, notes: string) => {
    await noteService.saveNote(qid, notes);
    dispatch({ type: 'SAVE_NOTE', qid, notes });
    showToast('📝 Notes saved', 'gold');
  }, [showToast]);

  const addToCodex = useCallback(async (qid: string, content: string) => {
    let foundRealm = null;
    for (const realm of REALMS) {
      const q = realm.questions.find(x => x.id === qid);
      if (q) { foundRealm = { realm, q }; break; }
    }
    if (!foundRealm) return;
    
    await noteService.saveCodexEntry({
      qid,
      title: foundRealm.q.name,
      content,
      realmId: foundRealm.realm.id,
      realmName: foundRealm.realm.name,
      pattern: foundRealm.realm.pattern,
      difficulty: foundRealm.q.diff,
    });
    showToast('📓 Added to Codex!', 'gold');
  }, [showToast]);

  return (
    <GameCtx.Provider value={{ state, dispatch, completeQuest, uncompleteQuest, saveNote, addToCodex, showToast }}>
      {children}
    </GameCtx.Provider>
  );
}

export function useGame() { return useContext(GameCtx); }
