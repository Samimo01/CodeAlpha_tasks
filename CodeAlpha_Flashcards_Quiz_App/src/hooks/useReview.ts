import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Card } from "@/types/Card";
import type { ReviewFace } from "@/types/ReviewCard";
import { shuffle } from "@/services/ReviewService";

export type AnswerValue = boolean;

export interface ReviewState {
  order: Card[];
  index: number;
  face: ReviewFace;
  results: Record<number, boolean>;
}

/**
 * Manages a review session for a given set of cards.
 * Cards are shuffled once at start. Navigation is free, and a card that has
 * already been answered cannot be re-answered.
 */
export function useReview(cards: Card[]) {
  const [order, setOrder] = useState<Card[]>(() => shuffle(cards));
  const [index, setIndex] = useState(0);
  const [face, setFace] = useState<ReviewFace>("question");
  const [results, setResults] = useState<Record<number, boolean>>({});
  const answeredCount = Object.keys(results).length;

  // Re-shuffle if the source cards set changes identity (new session).
  const cardsKey = useMemo(() => cards.map((c) => c.id).join(","), [cards]);
  const prevKey = useRef(cardsKey);
  useEffect(() => {
    if (prevKey.current !== cardsKey) {
      prevKey.current = cardsKey;
      setOrder(shuffle(cards));
      setIndex(0);
      setFace("question");
      setResults({});
    }
  }, [cardsKey, cards]);

  const current = order[index] ?? null;
  const total = order.length;
  const isAnswered = current ? Object.prototype.hasOwnProperty.call(results, current.id) : false;
  const currentResult = current ? results[current.id] : undefined;
  const isFinished = total > 0 && answeredCount === total;

  const flip = useCallback(() => {
    setFace((f) => (f === "question" ? "answer" : "question"));
  }, []);

  const goPrev = useCallback(() => {
    setIndex((i) => (i <= 0 ? i : i - 1));
    setFace("question");
  }, []);

  const goNext = useCallback(() => {
    setIndex((i) => (i >= order.length - 1 ? i : i + 1));
    setFace("question");
  }, [order.length]);

  const markAnswer = useCallback(
    (isCorrect: boolean) => {
      if (!current) return;
      const cardId = current.id;
      setResults((prev) => {
        if (Object.prototype.hasOwnProperty.call(prev, cardId)) return prev;
        return { ...prev, [cardId]: isCorrect };
      });
    },
    [current]
  );

  // goes to the next non-answered card
  useEffect(() => {
    if (!current) return;
    if (!Object.prototype.hasOwnProperty.call(results, current.id)) return;
    if (answeredCount >= total) return; // session terminée, on ne bouge plus

    const nextIndex = order.findIndex(
      (c) => !Object.prototype.hasOwnProperty.call(results, c.id)
    );
    if (nextIndex !== -1 && nextIndex !== index) {
      setIndex(nextIndex);
      setFace("question");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [results]);

  return {
    order, index, face, results, current, total,
    isAnswered, currentResult, answeredCount,
    isFinished, flip, goPrev, goNext, markAnswer,
  };
}