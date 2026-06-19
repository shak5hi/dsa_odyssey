'use client';
import { useState } from 'react';
import { useUser } from '@/hooks/useUser';
import { useQuests } from '@/hooks/useQuests';
import { REALMS } from '@/constants/realms';
import { TrainingArcCard } from '@/features/dashboard/components/TrainingArcCard';
import { DailyQuestGrid } from '@/features/dashboard/components/DailyQuestGrid';
import { WeeklyGoals } from '@/features/dashboard/components/WeeklyGoals';
import { DeepFocusOverlay } from '@/features/dashboard/components/DeepFocusOverlay';

export default function TodayPage() {
  const { astraMsg } = useUser();
  const { dailyQuests, activeRealm, completed, bonusDone, completeQuest } = useQuests();
  const [focusOpen, setFocusOpen] = useState(false);
  const [focusIdx, setFocusIdx] = useState(0);

  const now = new Date();
  const dateStr = now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  // Bonus quest
  const realmObj = REALMS.find(r => r.id === activeRealm);
  const dailyIds = new Set(dailyQuests.map(q => q.id));
  const allDailyDone = dailyQuests.length > 0 && dailyQuests.every(q => completed[q.id]);
  const bonusQ = allDailyDone && realmObj
    ? realmObj.questions.find(q => !completed[q.id] && !dailyIds.has(q.id))
    : null;
  const today = now.toISOString().slice(0, 10);
  const isBonusDone = bonusDone?.[today];

  return (
    <div className="page-view">
      <div className="view-header">
        <div className="view-eyebrow">Daily Adventure</div>
        <div className="view-title">Current <span>Training Arc</span></div>
        <div className="view-subtitle">{dateStr}</div>
      </div>

      <TrainingArcCard />

      {/* Astra Banner */}
      <div className="astra-banner">
        <span className="astra-avatar">✨</span>
        <div>
          <div className="astra-name">Astra — Court Wizard</div>
          <div className="astra-text">{astraMsg || 'Your quest awaits, champion.'}</div>
        </div>
      </div>

      <DailyQuestGrid />
      <WeeklyGoals />

      {/* Deep Focus Button */}
      <div style={{ marginBottom: 20, display: 'flex', gap: 10, alignItems: 'center' }}>
        <button className="btn-primary" onClick={() => { setFocusIdx(0); setFocusOpen(true); }}>
          🧘 Enter Deep Focus
        </button>
        <span style={{ fontSize: 11, color: 'var(--text-faint)' }}>Distraction-free quest mode</span>
      </div>

      {/* Bonus Quest */}
      {bonusQ && (
        <div style={{ marginTop: 16 }}>
          <div className="section-title">✨ Bonus Quest</div>
          <div className={`bonus-quest-card${isBonusDone === bonusQ.id ? ' bonus-done' : ''}`} style={{ opacity: isBonusDone === bonusQ.id ? 0.5 : 1 }}>
            <div style={{ flex: 1 }}>
              <div className="bonus-quest-label">✨ Bonus Quest — One More</div>
              <div className="bonus-quest-name">{bonusQ.name}</div>
              <div className="bonus-quest-hint">{realmObj?.pattern} · {bonusQ.diff}</div>
            </div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexShrink: 0 }}>
              <a href={bonusQ.url} target="_blank" rel="noreferrer"
                style={{ fontSize: 11, color: 'var(--crystal)', padding: '6px 12px', border: '1px solid rgba(79,195,247,0.2)' }}>
                Open →
              </a>
              <button className="btn-gold btn-sm"
                onClick={() => completeQuest(bonusQ.id)}>
                {isBonusDone === bonusQ.id ? '✓ Done' : 'Mark Done'}
              </button>
            </div>
          </div>
        </div>
      )}

      <DeepFocusOverlay 
        isOpen={focusOpen} 
        onClose={() => setFocusOpen(false)} 
        focusIdx={focusIdx} 
        setFocusIdx={setFocusIdx} 
      />
    </div>
  );
}
