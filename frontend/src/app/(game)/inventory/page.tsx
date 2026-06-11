'use client';
import { useGame } from '@/lib/gameStore';
import { REALMS } from '@/lib/data';

export default function InventoryPage() {
  const { state } = useGame();
  return (
    <div className="page-view">
      <div className="view-header">
        <div className="view-eyebrow">Equipment</div>
        <div className="view-title">Your <span>Inventory</span></div>
        <div className="view-subtitle">Artifacts earned by mastering the ancient patterns.</div>
      </div>
      <div className="inventory-grid">
        {REALMS.map(r => {
          const owned = state.inventory.includes(r.id);
          return (
            <div key={r.id} className={`inv-slot${owned ? ' filled' : ' empty'}`}>
              <span className="inv-icon" style={{ filter: owned ? 'none' : 'grayscale(1)' }}>{r.artifact.icon}</span>
              <div className="inv-name">{owned ? r.artifact.name : '???'}</div>
              <div className="inv-desc">{owned ? r.artifact.desc : `Complete ${r.name} to unlock`}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
