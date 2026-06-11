'use client';
import { useGame } from '@/lib/gameStore';
import { REALMS, getMasteryRank } from '@/lib/data';
import Link from 'next/link';
import { use } from 'react';

export default function RealmPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { state, completeQuest, dispatch } = useGame();
  const realm = REALMS.find(r => r.id === id);

  if (!realm) return (
    <div className="page-view">
      <div className="view-title">Realm not found</div>
      <Link href="/world"><button className="back-btn">← Back to World Map</button></Link>
    </div>
  );

  const done = realm.questions.filter(q => state.completed[q.id]).length;
  const total = realm.questions.length;
  const xpEarned = realm.questions.filter(q => state.completed[q.id]).reduce((a, q) => a + q.xp, 0);
  const xpTotal = realm.questions.reduce((a, q) => a + q.xp, 0);
  const pct = total ? Math.round(done / total * 100) : 0;
  const rank = getMasteryRank(pct);

  return (
    <div className="page-view">
      <Link href="/world"><button className="back-btn">← Back to World Map</button></Link>

      {/* Realm Header */}
      <div className="realm-detail-header">
        <span className="realm-detail-icon">{realm.icon}</span>
        <div className="realm-detail-info">
          <div className="realm-detail-name">{realm.name}</div>
          <div className="realm-detail-pattern">{realm.pattern} · {realm.lore}</div>
          <div className="realm-detail-stats">
            <div>
              <div className="realm-stat-val">{done}/{total}</div>
              <div className="realm-stat-label">Quests</div>
            </div>
            <div>
              <div className="realm-stat-val">{xpEarned}</div>
              <div className="realm-stat-label">XP Earned</div>
            </div>
            <div>
              <div className="realm-stat-val">{pct}%</div>
              <div className="realm-stat-label">Complete</div>
            </div>
          </div>
          <div className="prog-bar-bg" style={{ height: 7, marginTop: 12, width: 300, maxWidth: '100%' }}>
            <div className="prog-bar-fill" style={{ background: `linear-gradient(90deg,${realm.color},${realm.color}88)`, width: `${pct}%`, height: '100%' }} />
          </div>
          <div className={`mastery-rank-badge rank-${rank.cls}`} style={{ marginTop: 10 }}>{rank.icon} {rank.label}</div>
        </div>
      </div>

      {/* Quest List */}
      <div className="quest-list-table">
        {realm.questions.map((q, i) => {
          const isDone = !!state.completed[q.id];
          const hasNotes = !!state.notes[q.id];
          return (
            <div key={q.id} className={`quest-row${isDone ? ' quest-done' : ''}`}>
              <span className="quest-row-num">{String(i + 1).padStart(2, '0')}</span>
              <span className="quest-row-name">{q.name}</span>
              <div className="quest-row-meta">
                <span className={`diff-badge diff-${q.diff.toLowerCase()}`}>{q.diff}</span>
                <span className="xp-chip">+{q.xp}</span>
                <a href={q.url} target="_blank" rel="noreferrer" className="quest-lc-link btn-sm" onClick={e => e.stopPropagation()}>LC →</a>
                <button
                  className={`quest-notes-btn${hasNotes ? ' has-notes' : ''}`}
                  onClick={() => dispatch({ type: 'OPEN_MODAL', qid: q.id })}
                >📝</button>
                <button
                  className="quest-row-check"
                  onClick={() => completeQuest(q.id)}
                >
                  {isDone ? '✓' : ''}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
