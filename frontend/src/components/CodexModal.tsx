'use client';
import { useState } from 'react';
import { useGame } from '@/lib/gameStore';

export function CodexModal() {
  const { state, dispatch, addToCodex } = useGame();
  const [text, setText] = useState('');

  const modal = state.codexModal;
  if (!modal) return null;

  const handleSave = async () => {
    if (text.trim()) {
      await addToCodex(modal.qid, text.trim());
    }
    dispatch({ type: 'CLOSE_CODEX_MODAL' });
    setText('');
  };

  const handleSkip = () => {
    dispatch({ type: 'CLOSE_CODEX_MODAL' });
    setText('');
  };

  return (
    <div className="modal-overlay open" onClick={e => { if (e.target === e.currentTarget) handleSkip(); }}>
      <div className="modal-box" style={{ border: '2px solid var(--gold-dim)', boxShadow: '0 0 40px var(--gold-glow), 6px 6px 0 rgba(0,0,0,0.5)' }}>
        <div style={{ textAlign: 'center', marginBottom: 18 }}>
          <span style={{ fontSize: 36, display: 'block', marginBottom: 6 }}>📓</span>
          <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 8, color: 'var(--gold-dim)', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 6 }}>
            Quest Complete!
          </div>
          <div className="modal-title" style={{ color: 'var(--gold)' }}>Add to Codex?</div>
          <div style={{ fontSize: 11, color: 'var(--text-dim)', marginTop: 4 }}>
            <span style={{ fontWeight: 600, color: 'var(--text)' }}>{modal.questName}</span>
            {' · '}<span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10 }}>{modal.pattern}</span>
          </div>
        </div>
        <textarea
          className="notes-textarea"
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder={`What did you learn from "${modal.questName}"?\n\nApproach, key insight, edge cases, pattern you noticed...`}
          rows={5}
          autoFocus
        />
        <div className="modal-actions" style={{ justifyContent: 'flex-end' }}>
          <button
            onClick={handleSkip}
            style={{ fontSize: 11, color: 'var(--text-faint)', padding: '8px 16px', border: '2px solid var(--border)', background: 'transparent', cursor: 'pointer', fontFamily: "'Press Start 2P', monospace" }}
          >
            Skip
          </button>
          <button className="btn-gold" onClick={handleSave}>
            📓 Add to Codex
          </button>
        </div>
      </div>
    </div>
  );
}
