import type * as SQLite from "expo-sqlite";
import { SCHEMA_SQL, SCHEMA_VERSION } from "./schema";

// Applies schema migrations required by the current database version.
export async function runMigrations(db: SQLite.SQLiteDatabase): Promise<void> {
    const row = await db.getFirstAsync<{ user_version: number }>("PRAGMA user_version");

    if ((row?.user_version ?? 0) < SCHEMA_VERSION) {
        db.execSync(SCHEMA_SQL);
        db.execSync(`PRAGMA user_version = ${SCHEMA_VERSION}`);
    }
}
