import { useMemo, useState } from "react";
import catalog from "@/data/exercises.json";
import type { Exercise, MuscleGroup } from "@/types";

// Filters the exercise catalog by the selected muscle group and search text.
export function useExerciseCatalog() {
    const [query, setQuery] = useState("");
    const [muscle, setMuscle] = useState<MuscleGroup>("Chest");

    const exercises = useMemo(() => {
        const all = catalog as Exercise[];
        return query.trim() ? all.filter(e => e.name.toLowerCase().includes(query.toLowerCase())) : all.filter(e => e.muscle === muscle)
    }, [query, muscle]);

    return { exercises, query, setQuery, muscle, setMuscle };
}
