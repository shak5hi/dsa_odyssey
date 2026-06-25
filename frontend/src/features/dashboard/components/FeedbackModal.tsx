'use client';
import { useState } from 'react';
import { useGame } from '@/store/GameContext';

export function FeedbackModal() {
  const { state, dispatch, saveFelt } = useGame();
  const [saving, setSaving] = useState<string | null>(null);

  const modal = state.feedbackModal;
  if (!modal) return null;

  const close = () => dispatch({ type: 'CLOSE_FEEDBACK_MODAL' });

  const handle = async (felt: 'easy' | 'medium' | 'hard') => {
    setSaving(felt);
    await saveFelt(modal.qid, felt);
    setSaving(null);
  };

  const options: { felt: 'easy' | 'medium' | 'hard'; emoji: string; label: string; sub: string; color: string; glow: string }[] = [
    { felt: 'easy', emoji: '😊', label: 'Too Easy', sub: 'Got it right away', color: '#4ade80', glow: 'rgba(74,222,128,0.25)' },
    { felt: 'medium', emoji: '🤔', label: 'Just Right', sub: 'Struggled but got it', color: '#fbbf24', glow: 'rgba(251,191,36,0.25)' },
    { felt: 'hard', emoji: '😅', label: 'Too Hard', sub: 'Needed to look it up', color: '#f87171', glow: 'rgba(248,113,113,0.25)' },
  ];

  return (
    <div className="modal-overlay open" onClick={close} style={{ zIndex: 1100 }}>
      <div
        className="feedback-modal-box"
        onClick={e => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Rate your difficulty"
      >
        {/* Header */}
        <div className="fb-header">
          <div className="fb-eyebrow">Adaptive Engine</div>
          <div className="fb-title">How did that feel?</div>
          <div className="fb-quest-name">{modal.questName}</div>
          <div className="fb-realm">{modal.realmName}</div>
        </div>

        {/* Buttons */}
        <div className="fb-options">
          {options.map(opt => (
            <button
              key={opt.felt}
              className={`fb-btn${saving === opt.felt ? ' fb-btn-saving' : ''}`}
              style={{ '--fb-color': opt.color, '--fb-glow': opt.glow } as React.CSSProperties}
              onClick={() => handle(opt.felt)}
              disabled={!!saving}
              id={`fb-btn-${opt.felt}`}
            >
              <span className="fb-emoji">{opt.emoji}</span>
              <span className="fb-label">{opt.label}</span>
              <span className="fb-sub">{opt.sub}</span>
              {saving === opt.felt && <span className="fb-spinner">⟳</span>}
            </button>
          ))}
        </div>

        <div className="fb-footer">
          Your rating shapes your future practice — we'll drill what's hard.
        </div>
        <button className="fb-skip" onClick={close}>Skip for now</button>
      </div>
    </div>
  );
}
