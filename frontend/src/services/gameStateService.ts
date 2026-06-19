import { authFetch } from './api/apiClient';

export const gameStateService = {
  async getState() {
    const res = await authFetch('http://localhost:5000/api/state');
    return res.json();
  },

  async updateState(payload: Record<string, unknown>) {
    const res = await authFetch('http://localhost:5000/api/state', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return res.json();
  }
};
