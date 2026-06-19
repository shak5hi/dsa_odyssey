import { authFetch } from './api/apiClient';

export const noteService = {
  async saveNote(qid: string, notes: string) {
    const res = await authFetch('http://localhost:5000/api/notes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ qid, notes }),
    });
    return res.json();
  },

  async getCodexEntries() {
    const res = await authFetch('http://localhost:5000/api/codex');
    return res.json();
  },

  async saveCodexEntry(payload: Record<string, unknown>) {
    const res = await authFetch('http://localhost:5000/api/codex', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return res.json();
  },

  async deleteCodexEntry(id: number) {
    const res = await authFetch(`http://localhost:5000/api/codex?id=${id}`, {
      method: 'DELETE',
    });
    return res.json();
  }
};
