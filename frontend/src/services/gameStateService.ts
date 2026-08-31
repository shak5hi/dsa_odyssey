import { authFetch } from './api/apiClient';
import { API_BASE_URL } from '@/config/api';

export const gameStateService = {
  async getState() {
    const res = await authFetch(`${API_BASE_URL}/state`);
    return res.json();
  },

  async updateState(payload: Record<string, unknown>) {
    const res = await authFetch(`${API_BASE_URL}/state`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return res.json();
  }
};
