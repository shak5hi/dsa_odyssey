import { authFetch } from './api/apiClient';
import { API_BASE_URL } from '@/config/api';

export const feedbackService = {
  async saveFelt(qid: string, felt: 'easy' | 'medium' | 'hard') {
    const res = await authFetch(`${API_BASE_URL}/feedback`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ qid, felt }),
    });
    return res.json();
  },

  async getInsights(): Promise<{ felt: Record<string, 'easy' | 'medium' | 'hard'> }> {
    const res = await authFetch(`${API_BASE_URL}/insights`);
    return res.json();
  },
};
