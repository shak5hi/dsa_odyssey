'use client';
import { createContext, useContext, useReducer, useEffect, ReactNode, useCallback } from 'react';
import { REALMS, LEVELS, ACHIEVEMENTS, getLevelInfo, getActiveRealm, REALM_PROGRESSION } from '@/lib/data';

export async function authFetch(url: string, options: RequestInit = {}) {
  const token = localStorage.getItem('auth_token');
  if (!token) {
    if (typeof window !== 'undefined') window.location.href = '/login';
    throw new Error('Not authenticated');
  }
  const headers = { ...options.headers, 'Authorization': `Bearer ${token}` };
  const res = await fetch(url, { ...options, headers });
  if (res.status === 401 || res.status === 403) {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('username');
      window.location.href = '/login';
    }
    throw new Error('Session expired');
  }
  return res;
}

export interface GameState {
  xp: number;
  streak: number;
  bestStreak: number;
  lastActivity: string | null;
  inventory: string[];
  achievements: Record<string, string>;
  ceremonySeen: Record<string, boolean>;
  bonusDone: Record<string, string>;
  completed: Record<string, { date: string; notes: string }>;
  notes: Record<string, string>;
  activeRealm: string;
  dailyQuests: string[];
  astraMsg: string;
  loaded: boolean;
  // UI state
  toasts: Toast[];
  modal: ModalState | null;
  codexModal: CodexModalState | null;
  ceremonyRealm: string | null;
  achievementPopup: AchievementPopup | null;
}

export interface Toast { id: string; msg: string; type: 'gold' | 'green' | 'red' | 'muted' }
export interface ModalState { qid: string }
export interface CodexModalState { qid: string; questName: string; realmId: string; realmName: string; pattern: string; difficulty: string }
export interface AchievementPopup { icon: string; name: string; desc: string }

type Action =
  | { type: 'LOAD'; payload: Partial<GameState> }
  | { type: 'SET_NOTES'; payload: Record<string, string> }
  | { type: 'COMPLETE_QUEST'; qid: string; xpGained: number; newXp: number; realmCompleted: string | null; activeRealm: string }
  | { type: 'UNCOMPLETE_QUEST'; qid: string; newXp: number }
  | { type: 'SAVE_NOTE'; qid: string; notes: string }
  | { type: 'ADD_TOAST'; toast: Toast }
  | { type: 'REMOVE_TOAST'; id: string }
  | { type: 'OPEN_MODAL'; qid: string }
  | { type: 'CLOSE_MODAL' }
  | { type: 'OPEN_CODEX_MODAL'; payload: CodexModalState }
  | { type: 'CLOSE_CODEX_MODAL' }
  | { type: 'SHOW_CEREMONY'; realmId: string }
  | { type: 'CLOSE_CEREMONY' }
  | { type: 'SET_ACHIEVEMENT_POPUP'; payload: AchievementPopup | null }
  | { type: 'MARK_CEREMONY_SEEN'; realmId: string }

function reducer(state: GameState, action: Action): GameState {
  switch (action.type) {
    case 'LOAD': return { ...state, ...action.payload, loaded: true };
    case 'SET_NOTES': return { ...state, notes: action.payload };
    case 'COMPLETE_QUEST': {
      const newCompleted = { ...state.completed, [action.qid]: { date: new Date().toISOString().slice(0, 10), notes: state.notes[action.qid] || '' } };
      return { ...state, completed: newCompleted, xp: action.newXp, activeRealm: action.activeRealm };
    }
    case 'UNCOMPLETE_QUEST': {
      const newCompleted = { ...state.completed };
      delete newCompleted[action.qid];
      return { ...state, completed: newCompleted, xp: action.newXp };
    }
    case 'SAVE_NOTE': return { ...state, notes: { ...state.notes, [action.qid]: action.notes } };
    case 'ADD_TOAST': return { ...state, toasts: [...state.toasts, action.toast] };
    case 'REMOVE_TOAST': return { ...state, toasts: state.toasts.filter(t => t.id !== action.id) };
    case 'OPEN_MODAL': return { ...state, modal: { qid: action.qid } };
    case 'CLOSE_MODAL': return { ...state, modal: null };
    case 'OPEN_CODEX_MODAL': return { ...state, codexModal: action.payload };
    case 'CLOSE_CODEX_MODAL': return { ...state, codexModal: null };
    case 'SHOW_CEREMONY': return { ...state, ceremonyRealm: action.realmId };
    case 'CLOSE_CEREMONY': return { ...state, ceremonyRealm: null };
    case 'SET_ACHIEVEMENT_POPUP': return { ...state, achievementPopup: action.payload };
    case 'MARK_CEREMONY_SEEN': return { ...state, ceremonySeen: { ...state.ceremonySeen, [action.realmId]: true } };
    default: return state;
  }
}

const initial: GameState = {
  xp: 0, streak: 0, bestStreak: 0, lastActivity: null,
  inventory: [], achievements: {}, ceremonySeen: {}, bonusDone: {},
  completed: {}, notes: {}, activeRealm: 'arrays',
  dailyQuests: [], astraMsg: '', loaded: false,
  toasts: [], modal: null, codexModal: null, ceremonyRealm: null, achievementPopup: null,
};

const GameCtx = createContext<{ state: GameState; dispatch: React.Dispatch<Action>; completeQuest: (qid: string) => Promise<void>; uncompleteQuest: (qid: string) => Promise<void>; saveNote: (qid: string, notes: string) => Promise<void>; addToCodex: (qid: string, content: string) => Promise<void>; showToast: (msg: string, type?: Toast['type']) => void }>(null!);

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initial);

  const showToast = useCallback((msg: string, type: Toast['type'] = 'muted') => {
    const id = Math.random().toString(36).slice(2);
    dispatch({ type: 'ADD_TOAST', toast: { id, msg, type } });
    setTimeout(() => dispatch({ type: 'REMOVE_TOAST', id }), 3200);
  }, []);

  // Load state on mount — server now returns camelCase fields directly
  useEffect(() => {
    async function load() {
      try {
        const res = await authFetch('http://localhost:5000/api/state');
        const data = await res.json();

        // data.completed = { qid: { date, notes } }
        // data.notes = { qid: notes }
        // data.dailyQuests = string[]
        // etc — all camelCase from server

        const completed: Record<string, { date: string; notes: string }> = data.completed || {};
        const completedQids = Object.keys(completed);

        // Figure out active realm based on progression
        const activeRealm = data.dailyQuestRealm || getActiveRealm(completedQids) || 'arrays';

        // Regenerate daily quests if the date changed
        const todayStr = new Date().toISOString().slice(0, 10);
        let dailyQuests: string[] = data.dailyQuests || [];

        if (data.dailyQuestDate !== todayStr || dailyQuests.length === 0) {
          const realm = REALMS.find(r => r.id === activeRealm) || REALMS[0];
          const available = realm.questions.filter(q => !completedQids.includes(q.id));
          dailyQuests = available.sort(() => 0.5 - Math.random()).slice(0, 3).map(q => q.id);

          // Save new daily quests to backend
          authFetch('http://localhost:5000/api/state', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              dailyQuests,
              dailyQuestDate: todayStr,
              dailyQuestRealm: activeRealm,
            }),
          });
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

    // Calculate XP from quest difficulty
    let xpGained = 10;
    let foundRealm: { realm: typeof REALMS[0]; q: typeof REALMS[0]['questions'][0] } | null = null;
    for (const r of REALMS) {
      const q = r.questions.find(x => x.id === qid);
      if (q) { foundRealm = { realm: r, q }; break; }
    }
    if (foundRealm) {
      if (foundRealm.q.diff === 'Medium') xpGained = 20;
      if (foundRealm.q.diff === 'Hard') xpGained = 30;
    }
    const newXp = (state.xp || 0) + xpGained;

    // Check if this quest completes the realm
    let realmCompleted: string | null = null;
    let newActiveRealm = state.activeRealm;
    if (foundRealm) {
      const doneAfter = foundRealm.realm.questions.filter(q => state.completed[q.id] || q.id === qid).length;
      if (doneAfter === foundRealm.realm.questions.length) {
        realmCompleted = foundRealm.realm.id;
        // Advance to next realm
        const idx = REALM_PROGRESSION.indexOf(foundRealm.realm.id);
        if (idx < REALM_PROGRESSION.length - 1) {
          newActiveRealm = REALM_PROGRESSION[idx + 1];
        }
      }
    }

    // Save to backend (quest completion + xp + realm)
    await authFetch('http://localhost:5000/api/complete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ qid, action: 'complete' }),
    });

    await authFetch('http://localhost:5000/api/state', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ xp: newXp }),
    });

    dispatch({ type: 'COMPLETE_QUEST', qid, xpGained, newXp, realmCompleted, activeRealm: newActiveRealm });
    showToast(`⚔️ Quest Complete! +${xpGained} XP`, 'green');

    // Realm ceremony
    if (realmCompleted && !state.ceremonySeen[realmCompleted]) {
      dispatch({ type: 'MARK_CEREMONY_SEEN', realmId: realmCompleted });
      await authFetch('http://localhost:5000/api/state', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ceremonySeen: { ...state.ceremonySeen, [realmCompleted]: true } }),
      });
      setTimeout(() => dispatch({ type: 'SHOW_CEREMONY', realmId: realmCompleted! }), 600);
    }

    // Open "Add to Codex" modal after a delay
    if (foundRealm) {
      setTimeout(() => {
        dispatch({ type: 'OPEN_CODEX_MODAL', payload: { qid, questName: foundRealm!.q.name, realmId: foundRealm!.realm.id, realmName: foundRealm!.realm.name, pattern: foundRealm!.realm.pattern, difficulty: foundRealm!.q.diff } });
      }, 1200);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.xp, state.completed, state.ceremonySeen, state.activeRealm, showToast]);

  async function uncompleteQuest(qid: string) {
    let xpLost = 10;
    for (const r of REALMS) {
      const q = r.questions.find(x => x.id === qid);
      if (q) {
        if (q.diff === 'Medium') xpLost = 20;
        if (q.diff === 'Hard') xpLost = 30;
        break;
      }
    }
    const newXp = Math.max(0, (state.xp || 0) - xpLost);

    await authFetch('http://localhost:5000/api/complete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ qid, action: 'uncomplete' }),
    });

    await authFetch('http://localhost:5000/api/state', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ xp: newXp }),
    });

    dispatch({ type: 'UNCOMPLETE_QUEST', qid, newXp });
    showToast('↩ Quest unmarked', 'muted');
  }

  const saveNote = useCallback(async (qid: string, notes: string) => {
    await authFetch('http://localhost:5000/api/notes', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ qid, notes }) });
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
    await authFetch('http://localhost:5000/api/codex', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ qid, title: foundRealm.q.name, content, realmId: foundRealm.realm.id, realmName: foundRealm.realm.name, pattern: foundRealm.realm.pattern, difficulty: foundRealm.q.diff }),
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
export { getLevelInfo, LEVELS };
