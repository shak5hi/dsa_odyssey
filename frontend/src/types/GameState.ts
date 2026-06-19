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

export interface AchievementPopup {
  icon: string;
  name: string;
  desc: string;
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
  ceremonyRealm: string | null;
  achievementPopup: AchievementPopup | null;
}
