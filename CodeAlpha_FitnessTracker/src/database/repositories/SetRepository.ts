import { getDatabase } from "../database";
import type { SetEntry } from "@/types";

export class SetRepository {
    // Persists all sets belonging to one session exercise in display order.
    async createSets(sessionExerciseId: number, sets: SetEntry[]): Promise<void> {
        const db = await getDatabase();
        for (let i = 0; i < sets.length; i += 1)
            await db.runAsync("INSERT INTO sets (session_exercise_id, weight, reps, set_order) VALUES (?, ?, ?, ?)", sessionExerciseId, sets[i].weight, sets[i].reps, i);
    }
    
    // Retrieves the recorded sets for one session exercise.
    async getBySessionExercise(id: number): Promise<SetEntry[]> {
        const db = await getDatabase();
        return db.getAllAsync<SetEntry>("SELECT weight, reps FROM sets WHERE session_exercise_id = ? ORDER BY set_order", id);
    }
}

export const setRepository = new SetRepository();
