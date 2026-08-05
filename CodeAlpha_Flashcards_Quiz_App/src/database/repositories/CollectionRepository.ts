import type { SQLiteDatabase } from "expo-sqlite";
import { getDatabase } from "../database";
import type { Collection } from "@/types/Collection";
import type { CollectionWithCount } from "@/types/CollectionWithCount";

interface CollectionRow {
  id: number;
  name: string;
}

interface CollectionCountRow {
  id: number;
  name: string;
  cardCount: number;
}

export class CollectionRepository {
  private async db(): Promise<SQLiteDatabase> {
    return getDatabase();
  }

  /** Returns all collections with their associated card counts. */
  async getAll(): Promise<CollectionWithCount[]> {
    const db = await this.db();
    return db.getAllAsync<CollectionCountRow>(
      `SELECT c.id, c.name, COUNT(k.id) AS cardCount
       FROM collections c
       LEFT JOIN cards k ON k.collection_id = c.id
       GROUP BY c.id
       ORDER BY c.name COLLATE NOCASE ASC`
    );
  }

  async getById(id: number): Promise<Collection | null> {
    const db = await this.db();
    return db.getFirstAsync<CollectionRow>(
      "SELECT id, name FROM collections WHERE id = ?",
      id
    );
  }

  async create(name: string): Promise<Collection> {
    const db = await this.db();
    const result = await db.runAsync(
      "INSERT INTO collections (name) VALUES (?)",
      name.trim()
    );
    return { id: result.lastInsertRowId, name: name.trim() };
  }

  async update(id: number, name: string): Promise<Collection> {
    const db = await this.db();
    await db.runAsync(
      "UPDATE collections SET name = ? WHERE id = ?",
      name.trim(),
      id
    );
    return { id, name: name.trim() };
  }

  async delete(id: number): Promise<void> {
    const db = await this.db();
    await db.runAsync("DELETE FROM collections WHERE id = ?", id);
  }
}

export const collectionRepository = new CollectionRepository();
