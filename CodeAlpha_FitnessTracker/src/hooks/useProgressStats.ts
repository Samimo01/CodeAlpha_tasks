import { useCallback, useEffect, useState } from "react";
import { bodyWeightRepository } from "../database/repositories/BodyWeightRepository";
import { workoutRepository } from "../database/repositories/WorkoutRepository";
import { aggregateStats, weeklySeries } from "@/services/StatsService";

// Loads the aggregate metrics and trend data used by the progress screen,
// and exposes the actions needed to keep that data current.
export function useProgressStats() {
    const [state, setState] = useState({
        stats: { workouts: 0, volume: 0, timeMinutes: 0 },
        weekly: [] as Array<{ week: string; workouts: number; volume: number }>,
        weights: [] as Array<{ date: string; weight: number }>,
        prs: [] as Awaited<ReturnType<typeof workoutRepository.getPersonalRecords>>
    });

    const refresh = useCallback(async () => {
        const sessions = await workoutRepository.getAllSessions();
        const weight = await bodyWeightRepository.getLatest();

        setState({
            stats: aggregateStats(sessions, weight),
            weekly: weeklySeries(sessions, weight),
            weights: await bodyWeightRepository.getAll(),
            prs: await workoutRepository.getPersonalRecords()
        });
    }, []);

    useEffect(() => {
        void refresh();
    }, [refresh]);

    // Logs a new body-weight measurement and refreshes derived state.
    const logWeight = useCallback(async (weightKg: number) => {
        await bodyWeightRepository.logWeight(weightKg);
        await refresh();
    }, [refresh]);

    return { ...state, refresh, logWeight };
}