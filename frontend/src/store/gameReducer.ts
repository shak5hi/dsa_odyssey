import { GameState, Toast, ModalState, CodexModalState, AchievementPopup, FeedbackModalState, RealmInsight } from '../types/GameState';

export type Action =
  | { type: 'LOAD'; payload: Partial<GameState> }
  | { type: 'SET_NOTES'; payload: Record<string, string> }
  | { type: 'COMPLETE_QUEST'; qid: string; newXp: number; realmCompleted: string | null; newActiveRealm: string }
  | { type: 'UNCOMPLETE_QUEST'; qid: string; newXp: number }
  | { type: 'SAVE_NOTE'; qid: string; notes: string }
  | { type: 'ADD_TOAST'; toast: Toast }
  | { type: 'REMOVE_TOAST'; id: string }
  | { type: 'OPEN_MODAL'; qid: string }
  | { type: 'CLOSE_MODAL' }
  | { type: 'OPEN_CODEX_MODAL'; payload: CodexModalState }
  | { type: 'CLOSE_CODEX_MODAL' }
  | { type: 'OPEN_FEEDBACK_MODAL'; payload: FeedbackModalState }
  | { type: 'CLOSE_FEEDBACK_MODAL' }
  | { type: 'SAVE_FELT'; qid: string; felt: 'easy' | 'medium' | 'hard' }
  | { type: 'LOAD_INSIGHTS'; insights: Record<string, RealmInsight> }
  | { type: 'SHOW_CEREMONY'; realmId: string }
  | { type: 'CLOSE_CEREMONY' }
  | { type: 'SET_ACHIEVEMENT_POPUP'; payload: AchievementPopup | null }
  | { type: 'MARK_CEREMONY_SEEN'; realmId: string };

export const initialState: GameState = {
  xp: 0, streak: 0, bestStreak: 0, lastActivity: null,
  inventory: [], achievements: {}, ceremonySeen: {}, bonusDone: {},
  completed: {}, notes: {}, activeRealm: 'arrays',
  dailyQuests: [], astraMsg: '', loaded: false,
  toasts: [], modal: null, codexModal: null, feedbackModal: null,
  ceremonyRealm: null, achievementPopup: null,
  felt: {}, insights: {},
};

export function gameReducer(state: GameState, action: Action): GameState {
  switch (action.type) {
    case 'LOAD': return { ...state, ...action.payload, loaded: true };
    case 'SET_NOTES': return { ...state, notes: action.payload };
    case 'COMPLETE_QUEST': {
      const newCompleted = {
        ...state.completed,
        [action.qid]: { date: new Date().toISOString().slice(0, 10), notes: state.notes[action.qid] || '' }
      };
      return { ...state, completed: newCompleted, xp: action.newXp, activeRealm: action.newActiveRealm };
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
    case 'OPEN_FEEDBACK_MODAL': return { ...state, feedbackModal: action.payload };
    case 'CLOSE_FEEDBACK_MODAL': return { ...state, feedbackModal: null };
    case 'SAVE_FELT': return { ...state, felt: { ...state.felt, [action.qid]: action.felt } };
    case 'LOAD_INSIGHTS': return { ...state, insights: action.insights };
    case 'SHOW_CEREMONY': return { ...state, ceremonyRealm: action.realmId };
    case 'CLOSE_CEREMONY': return { ...state, ceremonyRealm: null };
    case 'SET_ACHIEVEMENT_POPUP': return { ...state, achievementPopup: action.payload };
    case 'MARK_CEREMONY_SEEN': return { ...state, ceremonySeen: { ...state.ceremonySeen, [action.realmId]: true } };
    default: return state;
  }
}
