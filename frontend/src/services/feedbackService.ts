import { authFetch } from './api/apiClient';

export const feedbackService = {
  async saveFelt(qid: string, felt: 'easy' | 'medium' | 'hard') {
    const res = await authFetch('http://localhost:5000/api/feedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ qid, felt }),
    });
    return res.json();
  },

  async getInsights(): Promise<{ felt: Record<string, 'easy' | 'medium' | 'hard'> }> {
    const res = await authFetch('http://localhost:5000/api/insights');
    return res.json();
  },
};
