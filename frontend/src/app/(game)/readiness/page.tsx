'use client';
import { useGame } from '@/lib/gameStore';
import { REALMS } from '@/lib/data';
import { useEffect, useRef } from 'react';

const TOPICS = [
  { icon: '📦', name: 'Arrays & Hashing', realms: ['arrays','hashing','prefix'] },
  { icon: '↔️', name: 'Two Pointers & Windows', realms: ['twoptr','sliding'] },
  { icon: '🔍', name: 'Binary Search', realms: ['bsearch'] },
  { icon: '🔗', name: 'Linked Lists & Stack', realms: ['linked','stack'] },
  { icon: '⚙️', name: 'Heaps & Backtracking', realms: ['heap','backtrack'] },
  { icon: '🌳', name: 'Trees & BST', realms: ['trees','bst'] },
  { icon: '🕸️', name: 'Graphs', realms: ['dfs','bfs','dsu'] },
  { icon: '⏳', name: 'Dynamic Programming', realms: ['dp1','dp2'] },
];

export default function ReadinessPage() {
  const { state } = useGame();
  const circleRef = useRef<SVGCircleElement>(null);

  let totalDone = 0, totalAll = 0;
  const topics = TOPICS.map(t => {
    let done = 0, all = 0;
    t.realms.forEach(rid => {
      const r = REALMS.find(x => x.id === rid);
      if (!r) return;
      done += r.questions.filter(q => state.completed[q.id]).length;
      all += r.questions.length;
    });
    totalDone += done; totalAll += all;
    const pct = all ? Math.round(done / all * 100) : 0;
    const color = pct >= 80 ? 'var(--green)' : pct >= 50 ? 'var(--gold)' : pct >= 20 ? 'var(--ember)' : 'var(--muted)';
    return { ...t, done, all, pct, color };
  });
  const overall = totalAll ? Math.round(totalDone / totalAll * 100) : 0;

  useEffect(() => {
    if (!circleRef.current) return;
    const circumference = 2 * Math.PI * 65;
    const offset = circumference * (1 - overall / 100);
    circleRef.current.style.strokeDashoffset = String(offset);
  }, [overall]);

  let msg = 'Keep going — every quest brings you closer to offer day.';
  if (overall >= 80) msg = '🎉 Outstanding! You are interview-ready.';
  else if (overall >= 60) msg = '💪 Strong progress! Focus on your weakest topics.';
  else if (overall >= 40) msg = '📈 Good momentum! Keep solving every day.';
  else if (overall >= 20) msg = '🌱 You have started your journey. Consistency wins.';

  return (
    <div className="page-view">
      <div className="view-header">
        <div className="view-eyebrow">Assessment</div>
        <div className="view-title">Placement <span>Readiness</span></div>
        <div className="view-subtitle">Your battle-readiness for technical interviews.</div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: 24, alignItems: 'start' }}>
        <div className="glass-card" style={{ textAlign: 'center' }}>
          <div className="readiness-score-circle">
            <svg className="readiness-circle-svg" viewBox="0 0 150 150" style={{ transform: 'rotate(-90deg)' }}>
              <circle cx="75" cy="75" r="65" fill="none" stroke="var(--surface)" strokeWidth="10" />
              <circle ref={circleRef} cx="75" cy="75" r="65" fill="none" stroke="url(#readGrad)" strokeWidth="10"
                strokeDasharray={String(2 * Math.PI * 65)} strokeDashoffset={String(2 * Math.PI * 65)}
                strokeLinecap="round" style={{ transition: 'stroke-dashoffset 1.5s cubic-bezier(.4,0,.2,1)' }} />
              <defs>
                <linearGradient id="readGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" style={{ stopColor: 'var(--ember)' }} />
                  <stop offset="50%" style={{ stopColor: 'var(--gold)' }} />
                  <stop offset="100%" style={{ stopColor: 'var(--green)' }} />
                </linearGradient>
              </defs>
            </svg>
            <div>
              <div className="readiness-score-num">{overall}%</div>
              <div className="readiness-score-pct">Overall Score</div>
            </div>
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-dim)', lineHeight: 1.6 }}>{msg}</div>
        </div>

        <div className="glass-card">
          <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 9, color: 'var(--text)', marginBottom: 20 }}>Topic Mastery</div>
          <div className="readiness-bars">
            {topics.map(t => (
              <div key={t.name} className="readiness-topic">
                <span className="readiness-topic-icon">{t.icon}</span>
                <div className="readiness-topic-info">
                  <div className="readiness-topic-name">
                    {t.name}
                    <span className="readiness-topic-pct">{t.pct}%</span>
                  </div>
                  <div className="prog-bar-bg" style={{ height: 7 }}>
                    <div className="prog-bar-fill" style={{ background: t.color, width: `${t.pct}%`, height: '100%' }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
