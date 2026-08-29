import { useCallback, useEffect, useState } from "react";
import type { WorkoutSession } from "@/types";
import { workoutRepository } from "../database/repositories/WorkoutRepository";

// Loads the workout session for a single ID and exposes refresh support.
export function useWorkoutSession(sessionId: number | null) {
    const [session, setSession] = useState<WorkoutSession | null>(null);
    const [loading, setLoading] = useState(Boolean(sessionId));

    const refresh = useCallback(async () => {
        if (sessionId === null || Number.isNaN(sessionId)) {
            setSession(null);
            setLoading(false);
            return;
        }

        setLoading(true);
        setSession(await workoutRepository.getSessionById(sessionId));
        setLoading(false);
    }, [sessionId]);

    useEffect(() => {
        void refresh();
    }, [refresh]);

    return { session, loading, refresh };
}
