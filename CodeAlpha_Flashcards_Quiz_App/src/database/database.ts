import * as SQLite from "expo-sqlite";
import { runMigrations } from "./migrations";

const DB_NAME = "recall.db";

let dbPromise: Promise<SQLite.SQLiteDatabase> | null = null;

/**
 * Opens (or returns an already-open) SQLite connection and ensures the
 * schema is migrated to the latest version.
 */
export function getDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (!dbPromise) {
    dbPromise = (async () => {
      const db = await SQLite.openDatabaseAsync(DB_NAME);
      await runMigrations(db);
      return db;
    })();
  }
  return dbPromise;
}
