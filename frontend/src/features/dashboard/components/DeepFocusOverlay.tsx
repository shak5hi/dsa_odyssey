import { useQuests } from '@/hooks/useQuests';
import { REALMS } from '@/constants/realms';

interface DeepFocusOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  focusIdx: number;
  setFocusIdx: (idx: number) => void;
}

export function DeepFocusOverlay({ isOpen, onClose, focusIdx, setFocusIdx }: DeepFocusOverlayProps) {
  const { dailyQuests, isCompleted, completeQuest, activeRealm } = useQuests();

  if (!isOpen) return null;

  const currentFocusQ = dailyQuests[focusIdx];
  const realmObj = REALMS.find(r => r.id === activeRealm);

  return (
    <div className="deep-focus-overlay open">
      <button className="focus-exit" onClick={onClose}>✕ Exit Focus</button>
      {currentFocusQ && (
        <>
          <div className="focus-realm-label">Realm</div>
          <div className="focus-realm-name">{realmObj?.name}</div>
          <div className="focus-q-num">Quest {focusIdx + 1} of {dailyQuests.length}</div>
          <div className="focus-q-name">{currentFocusQ.name}</div>
          <div className="focus-q-meta">
            <span className={`diff-badge diff-${currentFocusQ.diff.toLowerCase()}`}>{currentFocusQ.diff}</span>
            <span className="xp-chip">+{currentFocusQ.xp} XP</span>
          </div>
          <div className="focus-actions">
            <a href={currentFocusQ.url} target="_blank" rel="noreferrer" className="btn-primary" style={{ textDecoration: 'none' }}>
              Open on LeetCode →
            </a>
            <button
              className="btn-gold"
              disabled={isCompleted(currentFocusQ.id)}
              onClick={() => {
                completeQuest(currentFocusQ.id);
                const next = dailyQuests.findIndex((fq, i) => i > focusIdx && !isCompleted(fq.id));
                if (next !== -1) setTimeout(() => setFocusIdx(next), 600);
              }}
            >
              {isCompleted(currentFocusQ.id) ? '✓ Completed' : '✓ Mark Complete'}
            </button>
          </div>
          <div className="focus-nav">
            <button className="focus-nav-btn" onClick={() => setFocusIdx(Math.max(0, focusIdx - 1))}>← Prev</button>
            <button className="focus-nav-btn" onClick={() => setFocusIdx(Math.min(dailyQuests.length - 1, focusIdx + 1))}>Next →</button>
          </div>
        </>
      )}
      <div className="focus-progress">
        {dailyQuests.map((fq, i) => (
          <div key={fq.id} className={`focus-pip${isCompleted(fq.id) ? ' done' : i === focusIdx ? ' current' : ''}`} />
        ))}
      </div>
    </div>
  );
}
