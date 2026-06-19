'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useGame } from '@/store/GameContext';
import { getLevelInfo } from '@/utils/xpCalculator';
import { LEVELS } from '@/constants/tiers';
import { REALMS, REALM_PROGRESSION } from '@/constants/realms';

const NAV_ITEMS = [
  { path: '/kingdom', label: 'Kingdom', icon: '🏰', view: 'home' },
  { path: '/today', label: "Today's Quest", icon: '⚔️', view: 'today', badge: true },
  { path: '/world', label: 'World Map', icon: '🗺️', view: 'world' },
  { path: '/inventory', label: 'Inventory', icon: '🎒', view: 'inventory' },
  { path: '/achievements', label: 'Achievements', icon: '🏆', view: 'achievements' },
  { path: '/readiness', label: 'Readiness', icon: '📊', view: 'readiness' },
  { path: '/library', label: 'Library', icon: '📖', view: 'library' },
  { path: '/codex', label: 'Codex', icon: '📓', view: 'codex' },
  { path: '/relics', label: 'Relics', icon: '🪙', view: 'relics' },
  { path: '/forecast', label: 'Forecast', icon: '🎯', view: 'forecast' },
];

export function Sidebar() {
  const pathname = usePathname();
  const { state } = useGame();
  const [username, setUsername] = useState('Hero');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const u = localStorage.getItem('username');
      if (u) setUsername(u);
    }
  }, []);

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('username');
      window.location.href = '/login';
    }
  };

  const lvl = getLevelInfo(state.xp);
  const nextLvl = LEVELS.find(l => l.lvl === lvl.lvl + 1) || lvl;
  const progress = lvl.lvl === 8 ? 100 : Math.min(100, ((state.xp - lvl.xp) / (nextLvl.xp - lvl.xp)) * 100);

  const solved = Object.keys(state.completed).length;
  let byteStage = 'Egg', byteEmoji = '🥚', byteMsg = '"I believe in you!"';
  if (solved >= 50) { byteStage = 'Ancient Dragon'; byteEmoji = '🐉'; byteMsg = '"You have become legend!"'; }
  else if (solved >= 20) { byteStage = 'Young Dragon'; byteEmoji = '🐲'; byteMsg = '"We\'re unstoppable!"'; }
  else if (solved >= 5) { byteStage = 'Baby Dragon'; byteEmoji = '🐣'; byteMsg = '"I\'m growing with you!"'; }
  else if (solved >= 1) { byteStage = 'Hatching'; byteEmoji = '🐣'; byteMsg = '"Almost there..."'; }

  let campfire = '🕯️';
  if (state.streak >= 30) campfire = '🔥';
  else if (state.streak >= 7) campfire = '🪵';
  else if (state.streak >= 3) campfire = '🌟';

  // Daily badge count
  const activeRealm = state.activeRealm;
  const realm = REALMS.find(r => r.id === activeRealm);
  const dailyPending = state.dailyQuests.filter(qid => !state.completed[qid]).length;

  // Next unlock
  const activeIdx = REALM_PROGRESSION.indexOf(activeRealm);
  const nextRid = activeIdx < REALM_PROGRESSION.length - 1 ? REALM_PROGRESSION[activeIdx + 1] : null;
  const nextRealm = nextRid ? REALMS.find(r => r.id === nextRid) : null;
  const currentRealmDone = realm ? realm.questions.filter(q => state.completed[q.id]).length : 0;
  const currentRealmTotal = realm ? realm.questions.length : 0;
  const toUnlock = currentRealmTotal - currentRealmDone;

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="logo-pixel">
          DSA<br />ODYSSEY
          <span>Kingdom of Algorithms</span>
        </div>
      </div>

      {/* Character Card */}
      <div className="char-card">
        <div className="char-top">
          <div className="char-avatar">{lvl.avatar}</div>
          <div className="char-info">
            <div className="char-name">{username}</div>
            <div className="char-title">{lvl.title}</div>
            <div className="char-level">Level {lvl.lvl}</div>
          </div>
        </div>
        <div className="xp-bar-wrap">
          <div className="xp-labels">
            <span>{state.xp} XP</span>
            <span>{lvl.lvl === 8 ? 'MAX' : nextLvl.xp} XP</span>
          </div>
          <div className="xp-bar-bg">
            <div className="xp-bar-fill" style={{ width: `${progress}%` }} />
          </div>
        </div>
      </div>

      {/* Byte Dragon */}
      <div className="byte-section">
        <span className="byte-dragon">{byteEmoji}</span>
        <div className="byte-info">
          <div className="byte-name">Byte</div>
          <div className="byte-stage">{byteStage}</div>
          <div className="byte-msg">{byteMsg}</div>
        </div>
      </div>

      {/* Streak */}
      <div className="streak-section">
        <span className="campfire">{campfire}</span>
        <div className="streak-info">
          <div className="streak-num">{state.streak}</div>
          <div className="streak-label">Day Streak</div>
          <div className="streak-best">Best: {state.bestStreak}</div>
        </div>
      </div>

      {/* Next Unlock */}
      {nextRealm && toUnlock > 0 && (
        <div className="next-unlock-banner">
          <span style={{ fontSize: '20px', flexShrink: 0 }}>{nextRealm.icon}</span>
          <div>
            <div className="nub-label">Next Unlock</div>
            <div className="nub-name">{nextRealm.name}</div>
            <div className="nub-remaining">{toUnlock} quest{toUnlock !== 1 ? 's' : ''} to unlock</div>
          </div>
        </div>
      )}

      {/* Nav */}
      <nav className="sidebar-nav">
        {NAV_ITEMS.map(item => {
          const isActive = item.path === '/kingdom' ? pathname === '/kingdom' : pathname.startsWith(item.path);
          return (
            <Link key={item.path} href={item.path} style={{ textDecoration: 'none' }}>
              <div className={`nav-item${isActive ? ' active' : ''}`}>
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-label">{item.label}</span>
                {item.badge && dailyPending > 0 && (
                  <span className="nav-badge">{dailyPending}</span>
                )}
              </div>
            </Link>
          );
        })}
      </nav>

      <div className="sidebar-logout" style={{ padding: '15px', marginTop: 'auto' }}>
        <button 
          onClick={handleLogout} 
          style={{ width: '100%', background: 'none', border: '1px solid #444', color: '#888', padding: '10px', borderRadius: '4px', cursor: 'pointer', fontFamily: 'monospace', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
        >
          🚪 Logout
        </button>
      </div>
    </aside>
  );
}
