'use client';
import { useState, useEffect } from 'react';
import { useGame } from '@/lib/gameStore';
import { REALMS } from '@/lib/data';

export function NotesModal() {
  const { state, dispatch, saveNote } = useGame();
  const [text, setText] = useState('');

  const qid = state.modal?.qid;
  useEffect(() => {
    if (qid) setText(state.notes[qid] || '');
  }, [qid, state.notes]);

  if (!qid) return null;

  let foundQ = null, foundRealm = null;
  for (const realm of REALMS) {
    const q = realm.questions.find(x => x.id === qid);
    if (q) { foundQ = q; foundRealm = realm; break; }
  }
  if (!foundQ) return null;

  const handleSave = async () => {
    await saveNote(qid, text);
    dispatch({ type: 'CLOSE_MODAL' });
  };

  return (
    <div className="modal-overlay open" onClick={e => { if (e.target === e.currentTarget) dispatch({ type: 'CLOSE_MODAL' }); }}>
      <div className="modal-box">
        <button className="modal-close" onClick={() => dispatch({ type: 'CLOSE_MODAL' })}>✕</button>
        <div className="modal-title">{foundQ.name}</div>
        <div className="modal-meta">
          <span className={`diff-badge diff-${foundQ.diff.toLowerCase()}`}>{foundQ.diff}</span>
          <span className="xp-chip">+{foundQ.xp} XP</span>
          <span style={{ fontSize: 10, color: 'var(--text-faint)', fontFamily: 'JetBrains Mono, monospace' }}>{foundRealm?.pattern}</span>
        </div>
        <p style={{ fontSize: 12, color: 'var(--text-dim)', marginBottom: 10 }}>
          Your personal notes — approach, edge cases, patterns noticed.
        </p>
        <textarea
          className="notes-textarea"
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Write your approach, key insights, or anything you want to remember..."
          rows={5}
        />
        <div className="modal-actions">
          <button className="btn-primary" onClick={handleSave}>💾 Save Notes</button>
          <a href={foundQ.url} target="_blank" rel="noreferrer"
            style={{ color: 'var(--crystal)', padding: '10px 14px', border: '1px solid rgba(79,195,247,0.2)', fontSize: 11 }}>
            Open on LeetCode →
          </a>
        </div>
      </div>
    </div>
  );
}
