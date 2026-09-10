'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import '@/app/globals.css';
import './login.css';
import { API_BASE_URL } from '@/config/api';

export default function LoginPage() {
  const [mode, setMode] = useState<'login' | 'register' | 'reset'>('login');
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

    let url = `${API_BASE_URL}/login`;
    if (mode === 'register') url = `${API_BASE_URL}/register`;
    else if (mode === 'reset') url = `${API_BASE_URL}/reset-password`;

    let bodyData: any = { username };
    if (mode === 'reset') bodyData.newPassword = password;
    else bodyData.password = password;

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyData),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || 'Authentication failed');
        setLoading(false);
        return;
      }

      if (mode === 'reset') {
        setError('');
        setMode('login');
        setPassword('');
        alert('Password reset successful! You can now login.');
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
              {mode === 'login' ? '⚔️ Enter the Kingdom' : mode === 'register' ? '📜 Create Account' : '🔑 Reset Password'}
            </div>
          </div>

          <div className="auth-tabs">
            <button
              className={`auth-tab ${mode === 'login' ? 'active' : ''}`}
              onClick={() => { setMode('login'); setError(''); }}
            >
              Login
            </button>
            <button
              className={`auth-tab ${mode === 'register' ? 'active' : ''}`}
              onClick={() => { setMode('register'); setError(''); }}
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
                <label className="auth-label">{mode === 'reset' ? 'New Password' : 'Password'}</label>
                <input
                  type="password"
                  className="auth-input"
                  placeholder={`Enter your ${mode === 'reset' ? 'new ' : ''}password`}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                />
              </div>

              <button type="submit" className="auth-btn" disabled={loading}>
                {loading ? <><span className="auth-spinner" />Loading...</> : mode === 'login' ? '⚔️ Login' : mode === 'register' ? '📜 Create Account' : '🔑 Reset Password'}
              </button>

              {mode === 'login' && (
                <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
                  <button type="button" onClick={() => { setMode('reset'); setError(''); }} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', textDecoration: 'underline', fontSize: '0.9rem', fontFamily: 'inherit' }}>
                    Forgot Password?
                  </button>
                </div>
              )}
              {mode === 'reset' && (
                <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
                  <button type="button" onClick={() => { setMode('login'); setError(''); }} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', textDecoration: 'underline', fontSize: '0.9rem', fontFamily: 'inherit' }}>
                    Back to Login
                  </button>
                </div>
              )}
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
