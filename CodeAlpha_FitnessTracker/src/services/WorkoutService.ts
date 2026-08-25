import type { ActiveWorkout, Equipment, SetEntry, WorkoutTemplate } from "@/types";

export const DEFAULT_WEIGHT: Record<Equipment, number> = {
    Barbell: 40,
    Dumbbell: 12,
    Cable: 20,
    Machine: 35,
    Bodyweight: 0
};

export const DEFAULT_TEMPLATES: WorkoutTemplate[] = [
    { id: "w1", name: "Push Day", muscles: "Chest · Shoulders · Triceps", exerciseIds: ["ex1", "ex8", "ex13", "ex2", "ex9"], avgDurationMinutes: 58 },
    { id: "w2", name: "Pull Day", muscles: "Back · Biceps", exerciseIds: ["ex4", "ex5", "ex6", "ex11", "ex12"], avgDurationMinutes: 62 },
    { id: "w3", name: "Leg Day", muscles: "Quads · Hamstrings · Calves", exerciseIds: ["ex15", "ex16", "ex17", "ex18", "ex19"], avgDurationMinutes: 52 },
    { id: "w4", name: "Upper Body", muscles: "Chest · Back · Shoulders · Arms", exerciseIds: ["ex1", "ex5", "ex8", "ex11", "ex13"], avgDurationMinutes: 63 },
    { id: "w5", name: "Full Body", muscles: "Legs · Chest · Back · Core", exerciseIds: ["ex15", "ex1", "ex4", "ex20"], avgDurationMinutes: 42 },
];

// Computes total training volume, including body-weight resistance.
export function computeVolume(exercises: Array<{ equipment: Equipment; sets: SetEntry[] }>, bodyWeightKg: number): number {
    return exercises.reduce((total, exercise) => total + exercise.sets.reduce((sum, set) => sum + (set.weight + (exercise.equipment === "Bodyweight" ? bodyWeightKg : 0)) * set.reps, 0), 0);
}

// Creates an active workout with one default set for every exercise.
export function buildWorkout(name: string, exercises: Array<{ id: string; name: string; equipment: Equipment }>): ActiveWorkout {
    return {
        name, exercises: exercises.map((e) => ({
            exerciseId: e.id, name: e.name, equipment: e.equipment, sets: [
                { weight: DEFAULT_WEIGHT[e.equipment], reps: 10 },
                { weight: DEFAULT_WEIGHT[e.equipment], reps: 8 }
            ]
        }))
    };
}

// Finds exercises whose best set exceeds the previously stored record.
export function detectPersonalRecords(exercises: Array<{ name: string; sets: SetEntry[] }>, currentBest: Record<string, number>): Array<{ name: string; weight: number }> {
    const records: Array<{ name: string; weight: number }> = [];
    exercises.forEach((e) => {
        const max = Math.max(...e.sets.map((s) => s.weight), 0);
        if (max > 0 && max > (currentBest[e.name] ?? 0)) records.push({ name: e.name, weight: max });
    });

    return records;
}