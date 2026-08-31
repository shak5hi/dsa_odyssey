import { authFetch } from './api/apiClient';
import { API_BASE_URL } from '@/config/api';

export const noteService = {
  async saveNote(qid: string, notes: string) {
    const res = await authFetch(`${API_BASE_URL}/notes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ qid, notes }),
    });
    return res.json();
  },

  async getCodexEntries() {
    const res = await authFetch(`${API_BASE_URL}/codex`);
    return res.json();
  },

  async saveCodexEntry(payload: Record<string, unknown>) {
    const res = await authFetch(`${API_BASE_URL}/codex`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return res.json();
  },

  async deleteCodexEntry(id: number) {
    const res = await authFetch(`${API_BASE_URL}/codex?id=${id}`, {
      method: 'DELETE',
    });
    return res.json();
  }
};
