import { REALMS, REALM_PROGRESSION } from '@/constants/realms';
import { getMasteryRank } from '@/utils/xpCalculator';
import { useQuests } from '@/hooks/useQuests';

export function TrainingArcCard() {
  const { activeRealm, completed } = useQuests();
  const realmObj = REALMS.find(r => r.id === activeRealm);

  if (!realmObj) return null;

  const arcDone = realmObj.questions.filter(q => completed[q.id]).length;
  const arcTotal = realmObj.questions.length;
  const arcPct = arcTotal ? Math.round((arcDone / arcTotal) * 100) : 0;
  const rank = getMasteryRank(arcPct);
  const activeIdx = REALM_PROGRESSION.indexOf(activeRealm);
  const nextRid = activeIdx < REALM_PROGRESSION.length - 1 ? REALM_PROGRESSION[activeIdx + 1] : null;
  const nextRealm = nextRid ? REALMS.find(r => r.id === nextRid) : null;

  return (
    <div className="training-arc-card">
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 20, flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: 200 }}>
          <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 7, color: 'var(--text-faint)', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 4 }}>Current Training Arc</div>
          <div style={{ fontFamily: "'Cinzel', serif", fontSize: 20, fontWeight: 700, color: 'var(--text)', marginBottom: 2 }}>{realmObj.name}</div>
          <div style={{ fontSize: 11, color: 'var(--gold)', marginBottom: 14, fontFamily: 'JetBrains Mono, monospace' }}>Pattern: {realmObj.pattern}</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12 }}>
            {[
              { label: 'Progress', val: `${arcDone} / ${arcTotal}`, color: 'var(--gold)' },
              { label: 'Remaining', val: `${arcTotal - arcDone} left`, color: 'var(--crystal)' },
            ].map(s => (
              <div key={s.label} style={{ background: 'var(--surface)', border: '2px solid var(--border)', padding: '10px 12px' }}>
                <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 7, color: 'var(--text-faint)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 2 }}>{s.label}</div>
                <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 14, color: s.color }}>{s.val}</div>
              </div>
            ))}
          </div>
          <div className="prog-bar-bg" style={{ height: 8, marginBottom: 10 }}>
            <div className="prog-bar-fill" style={{ background: 'linear-gradient(90deg,var(--violet),var(--crystal))', width: `${arcPct}%`, height: '100%' }} />
          </div>
          <div className={`mastery-rank-badge rank-${rank.cls}`}>{rank.icon} {rank.label}</div>
        </div>
        <div style={{ minWidth: 160, maxWidth: 200 }}>
          <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 7, color: 'var(--text-faint)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>Next Realm</div>
          {nextRealm ? (
            <>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', marginBottom: 4 }}>{nextRealm.icon} {nextRealm.name}</div>
              <div style={{ fontSize: 11, color: 'var(--text-faint)', lineHeight: 1.5 }}>
                {arcPct >= 100 ? '🔓 Unlocked! Head to World Map.' : `Complete ${arcTotal - arcDone} more quest${arcTotal - arcDone === 1 ? '' : 's'} to unlock`}
              </div>
              {arcPct >= 80 && arcPct < 100 && (
                <div style={{ marginTop: 10, padding: '8px 12px', background: 'rgba(74,222,128,0.06)', border: '1px solid rgba(74,222,128,0.2)', fontSize: 11, color: 'var(--green)' }}>
                  🔓 Almost there!
                </div>
              )}
            </>
          ) : (
            <div style={{ fontSize: 13, color: 'var(--gold)' }}>🏆 Final Realm</div>
          )}
        </div>
      </div>
    </div>
  );
}
