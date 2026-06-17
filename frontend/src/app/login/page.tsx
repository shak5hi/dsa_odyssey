'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import '@/app/globals.css';

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // If already logged in, skip to kingdom
    const token = localStorage.getItem('auth_token');
    if (token) router.push('/kingdom');
    else setMounted(true);
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const url = isLogin ? 'http://localhost:5000/api/login' : 'http://localhost:5000/api/register';

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || 'Authentication failed');
        setLoading(false);
        return;
      }

      localStorage.setItem('auth_token', data.token);
      localStorage.setItem('username', data.user.username);
      router.push('/kingdom');
    } catch (err) {
      setError('Could not connect to the server. Is the backend running?');
      setLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&family=Inter:wght@400;500;600&display=swap');

        .auth-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #0a0a0f;
          position: relative;
          overflow: hidden;
          font-family: 'Inter', sans-serif;
        }

        .auth-bg-grid {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(255,176,0,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,176,0,0.04) 1px, transparent 1px);
          background-size: 60px 60px;
        }

        .auth-bg-glow {
          position: absolute;
          width: 600px;
          height: 600px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(255,140,0,0.08) 0%, transparent 70%);
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          pointer-events: none;
        }

        .auth-card {
          position: relative;
          z-index: 10;
          width: 100%;
          max-width: 420px;
          margin: 20px;
          background: rgba(16, 16, 26, 0.95);
          border: 1px solid rgba(255, 176, 0, 0.2);
          border-radius: 2px;
          box-shadow: 0 0 60px rgba(255,140,0,0.1), 0 0 0 1px rgba(255,176,0,0.05);
          overflow: hidden;
          animation: auth-enter 0.4s ease;
        }

        @keyframes auth-enter {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .auth-card-header {
          background: linear-gradient(135deg, rgba(255,140,0,0.12) 0%, rgba(255,60,0,0.06) 100%);
          border-bottom: 1px solid rgba(255,176,0,0.15);
          padding: 32px 36px 28px;
          text-align: center;
        }

        .auth-logo {
          font-family: 'Press Start 2P', monospace;
          font-size: 11px;
          color: #ffb000;
          letter-spacing: 2px;
          margin-bottom: 8px;
          text-shadow: 0 0 20px rgba(255,176,0,0.5);
        }

        .auth-logo span {
          display: block;
          font-size: 7px;
          color: rgba(255,176,0,0.5);
          margin-top: 4px;
          letter-spacing: 3px;
        }

        .auth-pixel-divider {
          width: 48px;
          height: 2px;
          background: linear-gradient(90deg, transparent, #ffb000, transparent);
          margin: 16px auto;
          opacity: 0.5;
        }

        .auth-title {
          font-family: 'Press Start 2P', monospace;
          font-size: 10px;
          color: #e0c060;
          letter-spacing: 1px;
        }

        .auth-tabs {
          display: flex;
          border-bottom: 1px solid rgba(255,176,0,0.1);
        }

        .auth-tab {
          flex: 1;
          padding: 14px;
          background: none;
          border: none;
          cursor: pointer;
          font-family: 'Inter', sans-serif;
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.5px;
          transition: all 0.2s;
          color: rgba(255,255,255,0.35);
          border-bottom: 2px solid transparent;
          margin-bottom: -1px;
        }

        .auth-tab.active {
          color: #ffb000;
          border-bottom-color: #ffb000;
          background: rgba(255,176,0,0.04);
        }

        .auth-tab:hover:not(.active) {
          color: rgba(255,255,255,0.6);
          background: rgba(255,255,255,0.02);
        }

        .auth-body {
          padding: 32px 36px 28px;
        }

        .auth-field {
          margin-bottom: 18px;
        }

        .auth-label {
          display: block;
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          color: rgba(255,255,255,0.4);
          margin-bottom: 8px;
        }

        .auth-input {
          width: 100%;
          padding: 12px 16px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 2px;
          color: #fff;
          font-family: 'Inter', sans-serif;
          font-size: 14px;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
          box-sizing: border-box;
        }

        .auth-input:focus {
          border-color: rgba(255,176,0,0.5);
          box-shadow: 0 0 0 3px rgba(255,176,0,0.08);
          background: rgba(255,176,0,0.03);
        }

        .auth-input::placeholder {
          color: rgba(255,255,255,0.2);
        }

        .auth-error {
          background: rgba(232,60,60,0.1);
          border: 1px solid rgba(232,60,60,0.25);
          border-radius: 2px;
          padding: 10px 14px;
          color: #ff6b6b;
          font-size: 12px;
          margin-bottom: 18px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .auth-btn {
          width: 100%;
          padding: 14px;
          background: linear-gradient(135deg, #e67e00, #c05500);
          border: none;
          border-radius: 2px;
          color: #fff;
          font-family: 'Press Start 2P', monospace;
          font-size: 9px;
          letter-spacing: 1px;
          cursor: pointer;
          transition: all 0.2s;
          position: relative;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(230,126,0,0.3);
        }

        .auth-btn:hover:not(:disabled) {
          background: linear-gradient(135deg, #ff8c00, #d06000);
          transform: translateY(-1px);
          box-shadow: 0 6px 24px rgba(230,126,0,0.4);
        }

        .auth-btn:active:not(:disabled) { transform: translateY(0); }
        .auth-btn:disabled { opacity: 0.5; cursor: not-allowed; }

        .auth-footer {
          padding: 16px 36px 24px;
          border-top: 1px solid rgba(255,255,255,0.05);
          text-align: center;
        }

        .auth-footer-link {
          color: rgba(255,255,255,0.35);
          text-decoration: none;
          font-size: 11px;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          transition: color 0.2s;
        }

        .auth-footer-link:hover { color: rgba(255,176,0,0.7); }

        .auth-spinner {
          display: inline-block;
          width: 12px;
          height: 12px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.6s linear infinite;
          vertical-align: middle;
          margin-right: 8px;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        .auth-pixel-stars {
          position: absolute;
          inset: 0;
          pointer-events: none;
          overflow: hidden;
        }
        .auth-star {
          position: absolute;
          width: 2px;
          height: 2px;
          background: rgba(255,176,0,0.4);
          animation: twinkle 3s infinite;
        }
        @keyframes twinkle {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 0.8; }
        }
      `}</style>

      <div className="auth-page">
        <div className="auth-bg-grid" />
        <div className="auth-bg-glow" />
        <div className="auth-pixel-stars">
          {[...Array(20)].map((_, i) => (
            <div key={i} className="auth-star" style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
              opacity: Math.random() * 0.5 + 0.1,
            }} />
          ))}
        </div>

        <div className="auth-card">
          <div className="auth-card-header">
            <div className="auth-logo">
              DSA ODYSSEY
              <span>KINGDOM OF ALGORITHMS</span>
            </div>
            <div className="auth-pixel-divider" />
            <div className="auth-title">
              {isLogin ? '⚔️ Enter the Kingdom' : '📜 Create Account'}
            </div>
          </div>

          <div className="auth-tabs">
            <button
              className={`auth-tab ${isLogin ? 'active' : ''}`}
              onClick={() => { setIsLogin(true); setError(''); }}
            >
              Login
            </button>
            <button
              className={`auth-tab ${!isLogin ? 'active' : ''}`}
              onClick={() => { setIsLogin(false); setError(''); }}
            >
              Register
            </button>
          </div>

          <div className="auth-body">
            {error && (
              <div className="auth-error">
                <span>⚠</span> {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="auth-field">
                <label className="auth-label">Username</label>
                <input
                  type="text"
                  className="auth-input"
                  placeholder="Enter your username"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  required
                  autoFocus
                  autoComplete="username"
                />
              </div>

              <div className="auth-field">
                <label className="auth-label">Password</label>
                <input
                  type="password"
                  className="auth-input"
                  placeholder="Enter your password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  autoComplete={isLogin ? 'current-password' : 'new-password'}
                />
              </div>

              <button type="submit" className="auth-btn" disabled={loading}>
                {loading ? <><span className="auth-spinner" />Loading...</> : isLogin ? '⚔️ Login' : '📜 Create Account'}
              </button>
            </form>
          </div>

          <div className="auth-footer">
            <Link href="/" className="auth-footer-link">
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
