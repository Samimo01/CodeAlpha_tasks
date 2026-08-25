import { useCallback, useEffect, useState } from "react";
import type { WorkoutSession } from "@/types";
import { workoutRepository } from "../database/repositories/WorkoutRepository";

// Loads saved workout history and exposes a refreshable loading state.
export function useHistory() {
    const [sessions, setSessions] = useState<WorkoutSession[]>([]);
    const [loading, setLoading] = useState(true);

    // Refreshes the session list from the local database.
    const refresh = useCallback(async () => {
        setLoading(true);
        setSessions(await workoutRepository.getAllSessions());
        setLoading(false)
    }, []);
    
    useEffect(() => {
        void refresh()
    }, [refresh]);

    return { sessions, loading, refresh };
}
