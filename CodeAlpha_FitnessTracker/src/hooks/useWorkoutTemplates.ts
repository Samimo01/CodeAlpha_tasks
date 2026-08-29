import { useCallback, useEffect, useState } from "react";
import type { WorkoutTemplate } from "@/types";
import { workoutTemplateRepository } from "@/database/repositories/WorkoutTemplateRepository";

type TemplateEditableFields = Pick<WorkoutTemplate, "name" | "muscles" | "exerciseIds" | "avgDurationMinutes">;

// Provides built-in and user-created workout templates, with edit/delete support.
export function useWorkoutTemplates() {
    const [templates, setTemplates] = useState<WorkoutTemplate[]>([]);
    const [loading, setLoading] = useState(true);

    const refresh = useCallback(async () => {
        setLoading(true);
        setTemplates(await workoutTemplateRepository.getAll());
        setLoading(false);
    }, []);

    useEffect(() => {
        void refresh();
    }, [refresh]);

    async function addTemplate(template: WorkoutTemplate) {
        await workoutTemplateRepository.addCustom(template);
        await refresh();
    }

    async function updateTemplate(id: string, changes: Partial<TemplateEditableFields>) {
        await workoutTemplateRepository.update(id, changes);
        await refresh();
    }

    async function deleteTemplate(id: string) {
        await workoutTemplateRepository.remove(id);
        await refresh();
    }

    async function restoreDefaultTemplate(id: string) {
        await workoutTemplateRepository.restoreDefault(id);
        await refresh();
    }

    return { templates, loading, addTemplate, updateTemplate, deleteTemplate, restoreDefaultTemplate, refresh };
}