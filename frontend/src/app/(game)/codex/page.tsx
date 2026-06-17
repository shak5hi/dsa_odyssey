'use client';
import { useState, useEffect } from 'react';
import { useGame, authFetch } from '@/lib/gameStore';

interface CodexEntry { id: number; qid: string; title: string; content: string; realm_id: string; realm_name: string; pattern: string; difficulty: string; created_at: string; updated_at: string; }

export default function CodexPage() {
  const { showToast } = useGame();
  const [entries, setEntries] = useState<CodexEntry[]>([]);
  const [filter, setFilter] = useState('all');
  const [showNew, setShowNew] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [editId, setEditId] = useState<number | null>(null);
  const [editContent, setEditContent] = useState('');

  const load = async () => {
    const res = await authFetch('http://localhost:5000/api/codex');
    const { entries } = await res.json();
    setEntries(entries || []);
  };

  useEffect(() => { load(); }, []);

  const patterns = Array.from(new Set(entries.map(e => e.pattern)));
  const filtered = filter === 'all' ? entries : entries.filter(e => e.pattern === filter);

  const handleDelete = async (id: number) => {
    await authFetch('http://localhost:5000/api/codex', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
    showToast('Entry deleted', 'muted');
    load();
  };

  const handleCreate = async () => {
    if (!newTitle.trim()) return;
    await authFetch('http://localhost:5000/api/codex', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ qid: `manual-${Date.now()}`, title: newTitle, content: newContent, realmId: 'manual', realmName: 'Custom', pattern: 'Custom Note', difficulty: 'N/A' }) });
    showToast('📓 Entry created!', 'gold');
    setShowNew(false); setNewTitle(''); setNewContent('');
    load();
  };

  const handleEdit = async (e: CodexEntry) => {
    await authFetch('http://localhost:5000/api/codex', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ qid: e.qid, title: e.title, content: editContent, realmId: e.realm_id, realmName: e.realm_name, pattern: e.pattern, difficulty: e.difficulty }) });
    showToast('📓 Entry updated!', 'gold');
    setEditId(null); load();
  };

  return (
    <div className="page-view">
      <div className="view-header">
        <div className="view-eyebrow">Knowledge Tome</div>
        <div className="view-title">The <span>Codex</span></div>
        <div className="view-subtitle">Your personal notes on each quest. Written by you, for you.</div>
      </div>

      <div className="codex-new-btn-wrap" style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
        <button className="btn-gold" onClick={() => setShowNew(!showNew)}>
          {showNew ? '✕ Cancel' : '📓 New Entry'}
        </button>
        <span style={{ fontSize: 11, color: 'var(--text-faint)' }}>{entries.length} entries in your Codex</span>
      </div>

      {showNew && (
        <div className="glass-card" style={{ marginBottom: 20, border: '2px solid var(--gold-dim)' }}>
          <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 9, color: 'var(--gold)', marginBottom: 12 }}>New Codex Entry</div>
          <input
            type="text" placeholder="Entry title / Quest name..."
            value={newTitle} onChange={e => setNewTitle(e.target.value)}
            style={{ width: '100%', background: 'var(--deep)', border: '2px solid var(--border)', color: 'var(--text)', padding: '10px 12px', fontSize: 13, outline: 'none', marginBottom: 10, fontFamily: 'Inter, sans-serif' }}
          />
          <textarea
            className="notes-textarea" rows={6}
            placeholder="Write your notes, approach, key insights, patterns noticed..."
            value={newContent} onChange={e => setNewContent(e.target.value)}
          />
          <div style={{ display: 'flex', gap: 10, marginTop: 12 }}>
            <button className="btn-gold" onClick={handleCreate}>💾 Save Entry</button>
          </div>
        </div>
      )}

      <div className="codex-filters">
        <button className={`codex-filter${filter === 'all' ? ' active' : ''}`} onClick={() => setFilter('all')}>All ({entries.length})</button>
        {patterns.map(p => (
          <button key={p} className={`codex-filter${filter === p ? ' active' : ''}`} onClick={() => setFilter(p)}>
            {p} ({entries.filter(e => e.pattern === p).length})
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="glass-card" style={{ textAlign: 'center', padding: 48 }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>📓</div>
          <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 10, color: 'var(--text-dim)' }}>Codex Empty</div>
          <p style={{ color: 'var(--text-faint)', marginTop: 10, fontSize: 13 }}>
            Complete quests and click &quot;Add to Codex&quot; to build your personal knowledge base.
          </p>
        </div>
      ) : filtered.map(e => (
        <div key={e.id} className="codex-entry">
          <div className="codex-entry-header">
            <div>
              <div className="codex-entry-name">{e.title}</div>
              <div className="codex-entry-realm">{e.realm_name} · {e.pattern} · <span className={`diff-badge diff-${e.difficulty.toLowerCase()}`}>{e.difficulty}</span></div>
            </div>
            <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
              <button
                onClick={() => { setEditId(e.id); setEditContent(e.content); }}
                style={{ fontSize: 10, padding: '4px 10px', border: '1px solid var(--border)', background: 'transparent', color: 'var(--text-faint)', cursor: 'pointer' }}>
                ✏️ Edit
              </button>
              <button
                onClick={() => handleDelete(e.id)}
                style={{ fontSize: 10, padding: '4px 10px', border: '1px solid rgba(232,93,58,0.3)', background: 'transparent', color: 'var(--ember)', cursor: 'pointer' }}>
                🗑️ Del
              </button>
            </div>
          </div>
          {editId === e.id ? (
            <>
              <textarea className="notes-textarea" rows={5} value={editContent} onChange={ev => setEditContent(ev.target.value)} style={{ marginBottom: 8 }} />
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="btn-gold btn-sm" onClick={() => handleEdit(e)}>Save</button>
                <button onClick={() => setEditId(null)} style={{ padding: '4px 12px', border: '1px solid var(--border)', background: 'transparent', color: 'var(--text-faint)', cursor: 'pointer', fontSize: 10 }}>Cancel</button>
              </div>
            </>
          ) : (
            <div className="codex-entry-body">{e.content || <em style={{ color: 'var(--text-faint)' }}>No notes written yet.</em>}</div>
          )}
          <div className="codex-entry-date">Updated: {e.updated_at?.slice(0, 10) || '—'}</div>
        </div>
      ))}
    </div>
  );
}
