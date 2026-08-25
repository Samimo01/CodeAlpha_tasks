export const SCHEMA_VERSION = 1;
export const SCHEMA_SQL = `
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS workout_sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT, 
    name TEXT NOT NULL, started_at TEXT NOT NULL, 
    duration_seconds INTEGER NOT NULL, 
    calories_burned INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS session_exercises (
    id INTEGER PRIMARY KEY AUTOINCREMENT, 
    session_id INTEGER NOT NULL REFERENCES workout_sessions(id) ON DELETE CASCADE, 
    exercise_name TEXT NOT NULL, 
    equipment TEXT NOT NULL, 
    position INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS sets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_exercise_id INTEGER NOT NULL REFERENCES session_exercises(id) ON DELETE CASCADE,
    weight REAL NOT NULL, 
    reps INTEGER NOT NULL,
    set_order INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS body_weight_log (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    logged_at TEXT NOT NULL, 
    weight REAL NOT NULL
);
`;
