import type { SQLiteDatabase } from "expo-sqlite";
import { SCHEMA_SQL, SCHEMA_VERSION } from "./schema";

/**
 * Runs versioned migrations. The user_version pragma tracks the current
 * schema version. Each migration is applied in order and only once.
 */
export async function runMigrations(db: SQLiteDatabase): Promise<void> {
  const current = await getVersion(db);

  if (current < 1) {
    db.execSync(SCHEMA_SQL);
    db.execSync(`PRAGMA user_version = ${SCHEMA_VERSION}`);
  }
}

export async function getVersion(db: SQLiteDatabase): Promise<number> {
  const row = await db.getFirstAsync<{ user_version: number }>(
    "PRAGMA user_version"
  );
  return row?.user_version ?? 0;
}
