'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import '@/app/globals.css';
import './login.css';

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
