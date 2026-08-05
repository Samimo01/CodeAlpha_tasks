import { useCallback, useEffect, useState } from "react";
import { collectionRepository } from "@/database/repositories/CollectionRepository";
import { cardRepository } from "@/database/repositories/CardRepository";
import type { CollectionWithCount, Card } from "@/types";

export function useCollections() {
  const [collections, setCollections] = useState<CollectionWithCount[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const data = await collectionRepository.getAll();
    setCollections(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const create = useCallback(
    async (
      name: string,
      cards: Array<{ question: string; answer: string }> = []
    ) => {
      const collection = await collectionRepository.create(name);
      for (const card of cards) {
        await cardRepository.create(collection.id, card.question, card.answer);
      }
      await refresh();
      return collection;
    },
    [refresh]
  );

  const update = useCallback(async (id: number, name: string) => {
    await collectionRepository.update(id, name);
    await refresh();
  }, [refresh]);

  const remove = useCallback(async (id: number) => {
    await collectionRepository.delete(id);
    await refresh();
  }, [refresh]);

  return { collections, loading, refresh, create, update, remove };
}
