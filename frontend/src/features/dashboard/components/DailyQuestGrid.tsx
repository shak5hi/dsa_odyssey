import { useQuests } from '@/hooks/useQuests';

export function DailyQuestGrid() {
  const { dailyQuests, isCompleted, completeQuest } = useQuests();

  if (dailyQuests.length === 0) {
    return (
      <div className="glass-card" style={{ textAlign: 'center', padding: 40 }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>🎉</div>
        <div className="view-title">All daily quests complete!</div>
        <p style={{ color: 'var(--text-dim)', marginTop: 8 }}>Return tomorrow for new challenges, champion.</p>
      </div>
    );
  }

  return (
    <div className="quest-grid">
      {dailyQuests.map((q, i) => (
        <div key={q.id} className={`quest-card${isCompleted(q.id) ? ' completed' : ''}`} id={`qcard-${q.id}`}>
          <div className="quest-num">Quest {i + 1}</div>
          <div className="quest-info">
            <div className="quest-name">{q.name}</div>
            <div className="quest-meta">
              <span className={`diff-badge diff-${q.diff.toLowerCase()}`}>{q.diff}</span>
              <span className="xp-chip">+{q.xp} XP</span>
              <span className="quest-pattern">{q.pattern}</span>
            </div>
          </div>
          <div className="quest-actions">
            <a href={q.url} target="_blank" rel="noreferrer" className="quest-lc-link" onClick={e => e.stopPropagation()}>LC →</a>
            <button
              className="quest-check"
              onClick={e => { e.stopPropagation(); completeQuest(q.id); }}
            >
              {isCompleted(q.id) ? '✓' : ''}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
