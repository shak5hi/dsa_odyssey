import { useState } from 'react';

export interface CodexEntry {
  id: number;
  qid: string;
  title: string;
  content: string;
  realm_id: string;
  realm_name: string;
  pattern: string;
  difficulty: string;
  created_at: string;
  updated_at: string;
}

interface CodexEntryCardProps {
  entry: CodexEntry;
  onEdit: (e: CodexEntry, newContent: string) => void;
  onDelete: (id: number) => void;
}

export function CodexEntryCard({ entry, onEdit, onDelete }: CodexEntryCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(entry.content);

  const handleSave = () => {
    onEdit(entry, editContent);
    setIsEditing(false);
  };

  return (
    <div className="codex-entry">
      <div className="codex-entry-header">
        <div>
          <div className="codex-entry-name">{entry.title}</div>
          <div className="codex-entry-realm">
            {entry.realm_name} · {entry.pattern} · <span className={`diff-badge diff-${entry.difficulty.toLowerCase()}`}>{entry.difficulty}</span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
          <button
            onClick={() => setIsEditing(true)}
            style={{ fontSize: 10, padding: '4px 10px', border: '1px solid var(--border)', background: 'transparent', color: 'var(--text-faint)', cursor: 'pointer' }}
          >
            ✏️ Edit
          </button>
          <button
            onClick={() => onDelete(entry.id)}
            style={{ fontSize: 10, padding: '4px 10px', border: '1px solid rgba(232,93,58,0.3)', background: 'transparent', color: 'var(--ember)', cursor: 'pointer' }}
          >
            🗑️ Del
          </button>
        </div>
      </div>

      {isEditing ? (
        <>
          <textarea
            className="notes-textarea"
            rows={5}
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            style={{ marginBottom: 8 }}
          />
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn-gold btn-sm" onClick={handleSave}>Save</button>
            <button
              onClick={() => { setIsEditing(false); setEditContent(entry.content); }}
              style={{ padding: '4px 12px', border: '1px solid var(--border)', background: 'transparent', color: 'var(--text-faint)', cursor: 'pointer', fontSize: 10 }}
            >
              Cancel
            </button>
          </div>
        </>
      ) : (
        <div className="codex-entry-body">
          {entry.content || <em style={{ color: 'var(--text-faint)' }}>No notes written yet.</em>}
        </div>
      )}
      <div className="codex-entry-date">Updated: {entry.updated_at?.slice(0, 10) || '—'}</div>
    </div>
  );
}
