'use client';
import { useState } from 'react';
import { useGame } from '@/lib/gameStore';
import { REALMS, LORE_DB } from '@/lib/data';

export default function LibraryPage() {
  const { state } = useGame();
  const [panelRealm, setPanelRealm] = useState<string | null>(null);

  const loreRealm = panelRealm ? REALMS.find(r => r.id === panelRealm) : null;
  const lore = panelRealm ? LORE_DB[panelRealm] : null;

  return (
    <div className="page-view">
      <div className="view-header">
        <div className="view-eyebrow">Ancient Knowledge</div>
        <div className="view-title">The Pattern <span>Library</span></div>
        <div className="view-subtitle">Deep lore on each algorithm pattern. Unlock by starting a realm.</div>
      </div>

      <div className="lore-grid">
        {Object.entries(LORE_DB).map(([rid, data]) => {
          const realm = REALMS.find(r => r.id === rid);
          if (!realm) return null;
          const started = realm.questions.some(q => state.completed[q.id]);
          return (
            <div key={rid} className={`lore-card${!started ? ' locked' : ''}`} onClick={() => started && setPanelRealm(rid)}>
              <div className="lore-card-top">
                <span className="lore-card-icon">{realm.icon}</span>
                <div>
                  <div className="lore-card-name">{realm.name}</div>
                  <div className="lore-card-pattern">{realm.pattern}</div>
                </div>
                {!started && <span style={{ marginLeft: 'auto', fontSize: 12, color: 'var(--text-faint)' }}>🔒 Start realm to unlock</span>}
              </div>
              {started && (
                <>
                  <p style={{ fontSize: 12, color: 'var(--text-dim)', lineHeight: 1.7, marginBottom: 10 }}>{data.story}</p>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    {data.signals.map((s, i) => (
                      <span key={i} style={{ fontSize: 9, padding: '2px 8px', background: 'rgba(79,195,247,0.06)', border: '1px solid rgba(79,195,247,0.15)', color: 'var(--crystal)', fontFamily: 'JetBrains Mono, monospace' }}>
                        {s}
                      </span>
                    ))}
                  </div>
                  <div style={{ marginTop: 10, fontSize: 11, color: 'var(--text-faint)' }}>Click to view full lore →</div>
                </>
              )}
            </div>
          );
        })}
      </div>

      {/* Lore Detail Panel */}
      <div className={`lore-detail-panel${panelRealm ? ' open' : ''}`}>
        <button className="lore-panel-close" onClick={() => setPanelRealm(null)}>✕</button>
        {loreRealm && lore && (
          <>
            <div style={{ marginBottom: 18 }}>
              <span style={{ fontSize: 40, display: 'block', marginBottom: 8 }}>{loreRealm.icon}</span>
              <div style={{ fontFamily: "'Cinzel', serif", fontSize: 18, fontWeight: 700, color: 'var(--text)', marginBottom: 4 }}>{loreRealm.name}</div>
              <div style={{ fontSize: 11, color: 'var(--text-faint)', fontFamily: 'JetBrains Mono, monospace' }}>{loreRealm.pattern}</div>
            </div>
            <div className="lore-section">
              <div className="lore-section-title">📜 Lore</div>
              <div className="lore-section-body">{lore.story}</div>
            </div>
            <div className="lore-section">
              <div className="lore-section-title">🚦 When to Use</div>
              <div className="lore-section-body">
                <ul>{lore.signals.map((s, i) => <li key={i}>{s}</li>)}</ul>
              </div>
            </div>
            <div className="lore-section">
              <div className="lore-section-title">⚠️ Common Mistakes</div>
              <div className="lore-section-body">
                <ul>{lore.mistakes.map((s, i) => <li key={i}>{s}</li>)}</ul>
              </div>
            </div>
            <div className="lore-section">
              <div className="lore-section-title">💡 Expert Hints</div>
              <div className="lore-section-body">
                <ul>{lore.hints.map((s, i) => <li key={i}>{s}</li>)}</ul>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
