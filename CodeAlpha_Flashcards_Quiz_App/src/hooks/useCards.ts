import { useCallback, useEffect, useRef, useState } from "react";
import { cardRepository } from "@/database/repositories/CardRepository";
import type { Card } from "@/types/Card";

export interface DeletedCard {
  card: Card;
  index: number;
}

export function useCards(collectionId: number) {
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleted, setDeleted] = useState<DeletedCard | null>(null);
  const deletedRef = useRef<DeletedCard | null>(null);

  const refresh = useCallback(async () => {
    const data = await cardRepository.getByCollection(collectionId);
    setCards(data);
    setLoading(false);
  }, [collectionId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const addCard = useCallback(
    async (question: string, answer: string) => {
      await cardRepository.create(collectionId, question, answer);
      await refresh();
    },
    [collectionId, refresh]
  );

  const updateCard = useCallback(
    async (id: number, question: string, answer: string) => {
      await cardRepository.update(id, question, answer);
      await refresh();
    },
    [refresh]
  );

  /**
   * Deletes a card. Returns false (and does not delete) if the card is the
   * last one of its collection. The repository enforces this as well.
   */
  const deleteCard = useCallback(
    async (id: number): Promise<boolean> => {
      const index = cards.findIndex((c) => c.id === id);
      const card = cards[index];
      if (!card) return false;

      // Check locally first (optimistic) - repository will enforce the real constraint
      if (cards.length <= 1) {
        return false;
      }

      // Set up undo state BEFORE any DB operation
      const entry = { card, index };
      deletedRef.current = entry;
      setDeleted(entry);

      // Optimistic local update
      setCards((prev) => prev.filter((c) => c.id !== id));

      try {
        // Now delete from database
        await cardRepository.delete(id);
        // Refresh to sync with DB (will also clear deleted if successful)
        await refresh();
        return true;
      } catch {
        // Rollback local state on DB error
        setCards((prev) => {
          const arr = [...prev];
          arr.splice(Math.min(index, arr.length), 0, card);
          return arr;
        });
        deletedRef.current = null;
        setDeleted(null);
        return false;
      }
    },
    [cards, refresh]
  );

const undoDelete = useCallback(async () => {
    const entry = deletedRef.current;
    if (!entry) return;
    deletedRef.current = null;
    setDeleted(null);
    // Re-insert at original position.
    await cardRepository.restoreAt(collectionId, entry.card, entry.index);
    await refresh();
  }, [collectionId, refresh]);

  const clearDeleted = useCallback(() => {
    deletedRef.current = null;
    setDeleted(null);
  }, []);

  return {
    cards,
    loading,
    deleted,
    refresh,
    addCard,
    updateCard,
    deleteCard,
    undoDelete,
    clearDeleted,
  };
}
