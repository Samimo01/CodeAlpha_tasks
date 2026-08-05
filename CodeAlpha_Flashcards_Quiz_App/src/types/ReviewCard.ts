import type { Card } from "./Card";

export type ReviewFace = "question" | "answer";

export interface ReviewCard {
  card: Card;
}
