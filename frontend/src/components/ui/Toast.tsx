'use client';
import { useGame } from '@/store/GameContext';

export function ToastContainer() {
  const { state } = useGame();
  const colorMap: Record<string, string> = { gold: 'var(--gold)', green: 'var(--green)', red: 'var(--ember)', muted: 'var(--text-faint)' };
  const emojiMap: Record<string, string> = { gold: '✨', green: '✅', red: '❌', muted: 'ℹ️' };

  return (
    <div className="toast-container">
      {state.toasts.map(t => (
        <div key={t.id} className="toast-item" style={{ borderLeft: `3px solid ${colorMap[t.type] || 'var(--violet)'}` }}>
          <span>{emojiMap[t.type] || '🔔'}</span>
          <span style={{ fontSize: 12 }}>{t.msg}</span>
        </div>
      ))}
    </div>
  );
}
