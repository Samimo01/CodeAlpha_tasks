import type { Equipment } from "./Exercise";
import type { SetEntry } from "./SetEntry";

export interface WorkoutTemplate {
    id: string;
    name: string;
    muscles: string;
    exerciseIds: string[];
    avgDurationMinutes: number;
}

export interface ActiveWorkoutExercise {
    exerciseId: string;
    name: string;
    equipment: Equipment;
    sets: SetEntry[];
}

export interface ActiveWorkout {
    name: string;
    exercises: ActiveWorkoutExercise[];
}

export interface WorkoutSession {
    id: number;
    name: string;
    startedAt: string;
    durationSeconds: number;
    caloriesBurned: number;
    exercises: Array<{ name: string; equipment: Equipment; sets: SetEntry[] }>;
}
