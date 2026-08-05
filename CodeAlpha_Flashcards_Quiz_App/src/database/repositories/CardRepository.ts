import type { SQLiteDatabase } from "expo-sqlite";
import { getDatabase } from "../database";
import type { Card } from "@/types/Card";

interface CardRow {
  id: number;
  question: string;
  answer: string;
  collection_id: number;
}

export class CardRepository {
  private async db(): Promise<SQLiteDatabase> {
    return getDatabase();
  }

  async getByCollection(collectionId: number): Promise<Card[]> {
    const db = await this.db();
    return db.getAllAsync<CardRow>(
      "SELECT id, question, answer, collection_id FROM cards WHERE collection_id = ? ORDER BY id ASC",
      collectionId
    );
  }

  async countByCollection(collectionId: number): Promise<number> {
    const db = await this.db();
    const row = await db.getFirstAsync<{ n: number }>(
      "SELECT COUNT(*) AS n FROM cards WHERE collection_id = ?",
      collectionId
    );
    return row?.n ?? 0;
  }

  async create(
    collectionId: number,
    question: string,
    answer: string
  ): Promise<Card> {
    const db = await this.db();
    const result = await db.runAsync(
      "INSERT INTO cards (question, answer, collection_id) VALUES (?, ?, ?)",
      question.trim(),
      answer.trim(),
      collectionId
    );
    return {
      id: result.lastInsertRowId,
      question: question.trim(),
      answer: answer.trim(),
      collection_id: collectionId,
    };
  }

  async update(id: number, question: string, answer: string): Promise<Card> {
    const db = await this.db();
    await db.runAsync(
      "UPDATE cards SET question = ?, answer = ? WHERE id = ?",
      question.trim(),
      answer.trim(),
      id
    );
    return {
      id,
      question: question.trim(),
      answer: answer.trim(),
      collection_id: await this.getCollectionId(id),
    };
  }

  private async getCollectionId(cardId: number): Promise<number> {
    const db = await this.db();
    const row = await db.getFirstAsync<{ collection_id: number }>(
      "SELECT collection_id FROM cards WHERE id = ?",
      cardId
    );
    if (!row) throw new Error("Card not found");
    return row.collection_id;
  }

/**
   * Deletes a card. Throws if this is the last card of its collection,
   * because a collection must always contain at least one card.
   */
  async delete(id: number): Promise<void> {
    const db = await this.db();
    const collectionId = await this.getCollectionId(id);
    const count = await this.countByCollection(collectionId);
    if (count <= 1) {
      throw new Error(
        "A collection must always contain at least one flashcard."
      );
    }
    await db.runAsync("DELETE FROM cards WHERE id = ?", id);
  }

  /**
   * Restores a previously deleted card at its original position in the
   * collection. Re-inserts the card with its original id and rewrites the
   * ordering of the remaining cards so the restored card sits at `index`.
   */
  async restoreAt(
    collectionId: number,
    card: Card,
    index: number
  ): Promise<void> {
const db = await this.db();
    const snapshot = await this.getByCollection(collectionId);

    // Build the full list with the card restored at its original position.
    const withRestored = [...snapshot];
    withRestored.splice(Math.min(index, withRestored.length), 0, card);

    await db.withTransactionAsync(async () => {
      await db.runAsync(
        "DELETE FROM cards WHERE collection_id = ?",
        collectionId
      );
      for (const c of withRestored) {
        await db.runAsync(
          "INSERT INTO cards (id, question, answer, collection_id) VALUES (?, ?, ?, ?)",
          c.id,
          c.question,
          c.answer,
          collectionId
        );
      }
    });
  }
}

export const cardRepository = new CardRepository();
