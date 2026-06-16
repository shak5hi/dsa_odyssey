'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import '@/app/globals.css';

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const url = isLogin ? 'http://localhost:5000/api/login' : 'http://localhost:5000/api/register';
    
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      
      if (!res.ok || !data.success) {
        setError(data.error || 'Authentication failed');
        return;
      }
      
      localStorage.setItem('auth_token', data.token);
      localStorage.setItem('username', data.user.username);
      router.push('/kingdom');
    } catch (err) {
      setError('Failed to connect to the server');
    }
  };

  return (
    <div className="landing-container">
      <div className="landing-bg"></div>
      <div className="landing-content" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        
        <div className="rpg-dialogue-box" style={{ maxWidth: '400px', width: '100%', marginTop: '10vh' }}>
          <h2 style={{ textAlign: 'center', color: '#ffb000', marginBottom: '20px', fontFamily: '"Press Start 2P", monospace', fontSize: '1.2rem' }}>
            {isLogin ? 'Enter the Kingdom' : 'Create an Account'}
          </h2>
          
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <input 
              type="text" 
              placeholder="Username" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              style={{
                padding: '10px',
                background: '#1a1a1a',
                border: '2px solid #555',
                color: '#fff',
                fontFamily: 'monospace',
                fontSize: '16px',
                outline: 'none'
              }}
            />
            <input 
              type="password" 
              placeholder="Password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                padding: '10px',
                background: '#1a1a1a',
                border: '2px solid #555',
                color: '#fff',
                fontFamily: 'monospace',
                fontSize: '16px',
                outline: 'none'
              }}
            />
            
            {error && <div style={{ color: '#ff4444', fontSize: '14px', textAlign: 'center' }}>{error}</div>}
            
            <button type="submit" className="btn-gold" style={{ marginTop: '10px' }}>
              {isLogin ? 'Login' : 'Register'}
            </button>
          </form>
          
          <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '14px', color: '#aaa' }}>
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <span 
              onClick={() => { setIsLogin(!isLogin); setError(''); }}
              style={{ color: '#ffb000', cursor: 'pointer', textDecoration: 'underline' }}
            >
              {isLogin ? 'Register Here' : 'Login Here'}
            </span>
          </div>

          <div style={{ textAlign: 'center', marginTop: '15px' }}>
             <Link href="/" style={{ color: '#888', textDecoration: 'none', fontSize: '12px' }}>
               ← Back to Home
             </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
