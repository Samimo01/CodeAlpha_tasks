import * as SQLite from "expo-sqlite";
import { runMigrations } from "./migrations";

let dbPromise: Promise<SQLite.SQLiteDatabase> | null = null;

// Opens the SQLite database once and reuses the shared promise thereafter.
export function getDatabase(): Promise<SQLite.SQLiteDatabase> {
    if (!dbPromise) {
        dbPromise = (async () => {
            const db = await SQLite.openDatabaseAsync(process.env.EXPO_PUBLIC_DB_NAME);
            await runMigrations(db); return db;
        })();
    } return dbPromise;
}
