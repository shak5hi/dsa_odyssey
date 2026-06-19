import { authFetch } from './api/apiClient';

export const questService = {
  async completeQuest(qid: string) {
    const res = await authFetch('http://localhost:5000/api/complete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ qid, action: 'complete' }),
    });
    return res.json();
  },

  async uncompleteQuest(qid: string) {
    const res = await authFetch('http://localhost:5000/api/complete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ qid, action: 'uncomplete' }),
    });
    return res.json();
  }
};
