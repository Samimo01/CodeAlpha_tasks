import { getDatabase } from "../database";
import type { Equipment } from "@/types";

export class WorkoutExerciseRepository {

    // Persists the exercises attached to a workout session.
    async createForSession(sessionId: number, exercises: Array<{ name: string; equipment: Equipment }>): Promise<void> {
        const db = await getDatabase();
        for (let i = 0; i < exercises.length; i += 1)
            await db.runAsync("INSERT INTO session_exercises (session_id, exercise_name, equipment, position) VALUES (?, ?, ?, ?)", sessionId, exercises[i].name, exercises[i].equipment, i);
    }

    // Retrieves the exercises for a session in their original order.
    async getBySession(sessionId: number) {
        const db = await getDatabase();
        return db.getAllAsync("SELECT * FROM session_exercises WHERE session_id = ? ORDER BY position", sessionId);
    }
}

export const workoutExerciseRepository = new WorkoutExerciseRepository();