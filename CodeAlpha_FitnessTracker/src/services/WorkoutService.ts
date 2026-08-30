import type { ActiveWorkout, Equipment, SetEntry, WorkoutSession, WorkoutTemplate } from "@/types";
import { workoutRepository } from "@/database/repositories/WorkoutRepository";

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
export function computeVolume(
    exercises: Array<{ equipment: Equipment; sets: SetEntry[] }>,
    bodyWeightKg: number
): number {
    return exercises.reduce(
        (total, exercise) =>
            total +
            exercise.sets.reduce(
                (sum, set) =>
                    sum +
                    (set.weight +
                        (exercise.equipment === "Bodyweight"
                            ? bodyWeightKg
                            : 0)) *
                    set.reps,
                0
            ),
        0
    );
}

// Creates an active workout using the previous session's weights when available.
// Falls back to DEFAULT_WEIGHT for the first session or missing previous sets.
export async function buildWorkout(
    name: string,
    exercises: Array<{
        id: string;
        name: string;
        equipment: Equipment;
    }>
): Promise<ActiveWorkout> {
    const previousSession: WorkoutSession | null =
        await workoutRepository.getLastSessionByName(name);

    return {
        name,
        exercises: exercises.map((exercise) => {
            const previousExercise = previousSession?.exercises.find(
                (previous) => previous.name === exercise.name
            );

            const previousSets = previousExercise?.sets ?? [];

            return {
                exerciseId: exercise.id,
                name: exercise.name,
                equipment: exercise.equipment,
                sets: [
                    {
                        weight:
                            previousSets[0]?.weight ??
                            DEFAULT_WEIGHT[exercise.equipment],
                        reps: 10
                    },
                    {
                        weight:
                            previousSets[1]?.weight ??
                            DEFAULT_WEIGHT[exercise.equipment],
                        reps: 8
                    }
                ]
            };
        })
    };
}

// Finds exercises whose best set exceeds the previously stored record.
export function detectPersonalRecords(
    exercises: Array<{ name: string; sets: SetEntry[] }>,
    currentBest: Record<string, number>
): Array<{ name: string; weight: number }> {
    const records: Array<{ name: string; weight: number }> = [];

    exercises.forEach((exercise) => {
        const max = Math.max(
            ...exercise.sets.map((set) => set.weight),
            0
        );

        if (
            max > 0 &&
            max > (currentBest[exercise.name] ?? 0)
        ) {
            records.push({
                name: exercise.name,
                weight: max
            });
        }
    });

    return records;
}