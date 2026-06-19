import { useGame } from '../store/GameContext';

export function useCodex() {
  const { state, saveNote, addToCodex } = useGame();

  return {
    notes: state.notes,
    saveNote,
    addToCodex,
    codexModal: state.codexModal,
  };
}
