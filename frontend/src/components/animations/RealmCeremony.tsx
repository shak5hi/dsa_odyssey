'use client';
import { useGame } from '@/store/GameContext';
import { REALMS } from '@/constants/realms';

export function RealmCeremony() {
  const { state, dispatch } = useGame();
  const rid = state.ceremonyRealm;
  const realm = rid ? REALMS.find(r => r.id === rid) : null;

  return (
    <div className={`realm-ceremony${rid ? ' show' : ''}`}>
      <div className="ceremony-inner">
        <span className="ceremony-realm-icon">{realm?.icon || '⚔️'}</span>
        <div className="ceremony-eyebrow">Realm Conquered</div>
        <div className="ceremony-title">{realm?.name} — Restored</div>
        <div className="ceremony-subtitle">
          You have mastered every secret of this realm. The ancient pattern is yours.
        </div>
        <div className="ceremony-stars">⭐ ⭐ ⭐</div>
        <div className="ceremony-artifact">
          <span className="ceremony-artifact-icon">{realm?.artifact.icon || '💠'}</span>
          <div>
            <div className="ceremony-artifact-name">{realm?.artifact.name || 'Artifact'}</div>
            <div className="ceremony-artifact-desc">{realm?.artifact.desc || ''} — Added to your inventory.</div>
          </div>
        </div>
        <button className="btn-gold" onClick={() => dispatch({ type: 'CLOSE_CEREMONY' })}>
          Continue the Journey →
        </button>
      </div>
    </div>
  );
}
