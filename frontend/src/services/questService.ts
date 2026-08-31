import { authFetch } from './api/apiClient';
import { API_BASE_URL } from '@/config/api';

export const questService = {
  async completeQuest(qid: string) {
    const res = await authFetch(`${API_BASE_URL}/complete`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ qid, action: 'complete' }),
    });
    return res.json();
  },

  async uncompleteQuest(qid: string) {
    const res = await authFetch(`${API_BASE_URL}/complete`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ qid, action: 'uncomplete' }),
    });
    return res.json();
  }
};
