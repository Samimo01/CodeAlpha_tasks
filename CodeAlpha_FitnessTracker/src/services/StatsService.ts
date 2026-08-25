import type { WorkoutSession } from "@/types";
import { groupSessionsByWeek } from "@/utils/date";
import { computeVolume } from "./WorkoutService";

// Calculates total lifted volume for one workout session.
export function sessionVolume(session: WorkoutSession, bodyWeightKg = 75): number {
    return computeVolume(session.exercises, bodyWeightKg) / 1000;
}

// Aggregates workout count, total volume, and total training time.
export function aggregateStats(sessions: WorkoutSession[], bodyWeightKg = 75) {
    return {
        workouts: sessions.length,
        volume: sessions.reduce((sum, s) => sum + sessionVolume(s, bodyWeightKg), 0),
        timeMinutes: Math.round(sessions.reduce((sum, s) => sum + s.durationSeconds, 0) / 60)
    }
}

// Groups sessions into sorted weekly volume and activity points.
export function weeklySeries(sessions: WorkoutSession[], bodyWeightKg = 75) {
    return Object.entries(groupSessionsByWeek(sessions)).sort(([a], [b]) => a.localeCompare(b)).map(([week, items]) =>
        ({ week, workouts: items.length, volume: +items.reduce((sum, s) => sum + sessionVolume(s, bodyWeightKg), 0).toFixed(1) })
    );
}
