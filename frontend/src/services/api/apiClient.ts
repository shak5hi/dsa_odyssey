export async function authFetch(url: string, options: RequestInit = {}) {
  const token = localStorage.getItem('auth_token');
  if (!token) {
    if (typeof window !== 'undefined') window.location.href = '/login';
    throw new Error('Not authenticated');
  }
  const headers = { ...options.headers as Record<string, string>, 'Authorization': `Bearer ${token}` };
  const res = await fetch(url, { ...options, headers });
  
  if (res.status === 401 || res.status === 403) {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('username');
      window.location.href = '/login';
    }
    throw new Error('Session expired');
  }
  return res;
}
