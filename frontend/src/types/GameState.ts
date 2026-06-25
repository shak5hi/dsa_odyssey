export interface Toast {
  id: string;
  msg: string;
  type: 'gold' | 'green' | 'red' | 'muted';
}

export interface ModalState {
  qid: string;
}

export interface CodexModalState {
  qid: string;
  questName: string;
  realmId: string;
  realmName: string;
  pattern: string;
  difficulty: string;
}

export interface FeedbackModalState {
  qid: string;
  questName: string;
  realmName: string;
}

export interface AchievementPopup {
  icon: string;
  name: string;
  desc: string;
}

/** Per-realm aggregated struggle data computed from felt ratings */
export interface RealmInsight {
  hardCount: number;
  easyCount: number;
  mediumCount: number;
  total: number;
  /** 0–1, higher = struggling more */
  struggleScore: number;
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
  toasts: Toast[];
  modal: ModalState | null;
  codexModal: CodexModalState | null;
  feedbackModal: FeedbackModalState | null;
  ceremonyRealm: string | null;
  achievementPopup: AchievementPopup | null;
  /** Per-question felt rating: 'easy' | 'medium' | 'hard' */
  felt: Record<string, 'easy' | 'medium' | 'hard'>;
  /** Per-realm aggregated insight data */
  insights: Record<string, RealmInsight>;
}
