import { getDatabase } from "../database";
import type { PersonalRecord, WorkoutSession, Equipment, SetEntry } from "@/types";

export class WorkoutRepository {
  // Persists a complete workout session, including exercises and sets.
  async createSession(
    name: string,
    startedAt: string,
    durationSeconds: number,
    caloriesBurned: number,
    exercises: Array<{ name: string; equipment: Equipment; sets: SetEntry[] }>
  ): Promise<number> {

    const db = await getDatabase();
    let sessionId = 0;

    await db.withTransactionAsync(async () => {
      const sessionResult = await db.runAsync(`
      INSERT INTO workout_sessions (name, started_at, duration_seconds, calories_burned) 
      VALUES (?, ?, ?, ?)`,
        name, startedAt, durationSeconds, caloriesBurned
      );
      sessionId = sessionResult.lastInsertRowId;

      for (let i = 0; i < exercises.length; i += 1) {
        const ex = exercises[i];
        const exerciseResult = await db.runAsync(`
        INSERT INTO session_exercises (session_id, exercise_name, equipment, position) 
        VALUES (?, ?, ?, ?)`,
          sessionId, ex.name, ex.equipment, i
        );
        const sessionExerciseId = exerciseResult.lastInsertRowId;

        for (let j = 0; j < ex.sets.length; j += 1) {
          await db.runAsync(`
          INSERT INTO sets (session_exercise_id, weight, reps, set_order) 
          VALUES (?, ?, ?, ?)`,
            sessionExerciseId, ex.sets[j].weight, ex.sets[j].reps, j
          );
        }
      }
    });

    return sessionId;
  }

  // Retrieves every saved workout session with its nested exercise data.
  async getAllSessions(): Promise<WorkoutSession[]> {
    const db = await getDatabase();
    const rows = await db.getAllAsync<{
      id: number;
      name: string;
      started_at: string;
      duration_seconds: number;
      calories_burned: number
    }>("SELECT * FROM workout_sessions ORDER BY started_at DESC");

    return Promise.all(rows.map((r) => this.getSessionById(r.id).then((s) => s as WorkoutSession)));
  }

  // Retrieves one workout session by ID, or null when it does not exist.
  async getSessionById(id: number): Promise<WorkoutSession | null> {
    const db = await getDatabase();
    const row = await db.getFirstAsync<{
      id: number;
      name: string;
      started_at: string;
      duration_seconds: number;
      calories_burned: number
    }>("SELECT * FROM workout_sessions WHERE id = ?", id);

    if (!row) return null;
    const exercises = await db.getAllAsync<{
      id: number;
      exercise_name: string;
      equipment: Equipment
    }>("SELECT id, exercise_name, equipment FROM session_exercises WHERE session_id = ? ORDER BY position", id);

    return {
      id: row.id,
      name: row.name,
      startedAt: row.started_at,
      durationSeconds: row.duration_seconds,
      caloriesBurned: row.calories_burned,

      exercises: await Promise.all(exercises.map(async (e) =>
      ({
        name: e.exercise_name,
        equipment: e.equipment,
        sets: await db.getAllAsync<SetEntry>("SELECT weight, reps FROM sets WHERE session_exercise_id = ? ORDER BY set_order", e.id)
      })))
    };
  }

  // Retrieves the heaviest recorded set for each exercise.
  async getPersonalRecords(): Promise<PersonalRecord[]> {
    const db = await getDatabase();

    return db.getAllAsync<PersonalRecord>(
      `SELECT se.exercise_name AS exerciseName, MAX(s.weight) AS weight, MAX(ws.started_at) AS achievedAt 
      FROM sets s JOIN session_exercises se ON se.id = s.session_exercise_id JOIN workout_sessions ws ON ws.id = se.session_id 
      WHERE s.weight > 0 GROUP BY se.exercise_name ORDER BY se.exercise_name`
    );
  }

  // Deletes a saved workout session by ID.
  async deleteSession(id: number): Promise<void> {
    const db = await getDatabase();
    await db.runAsync("DELETE FROM workout_sessions WHERE id = ?", id);
  }
}

export const workoutRepository = new WorkoutRepository();
