import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useState } from "react";
import type { WorkoutTemplate } from "@/types";
import { DEFAULT_TEMPLATES } from "@/services/WorkoutService";

async function loadTemplates(): Promise<WorkoutTemplate[]> {
    const stored = await AsyncStorage.getItem(process.env.EXPO_PUBLIC_STORAGE_KEY);
    if (!stored) return DEFAULT_TEMPLATES;

    try {
        return [...DEFAULT_TEMPLATES, ...JSON.parse(stored) as WorkoutTemplate[]];
    } catch {
        return DEFAULT_TEMPLATES;
    }
}

// Provides built-in and user-created workout templates.
export function useWorkoutTemplates() {
    const [templates, setTemplates] = useState<WorkoutTemplate[]>(DEFAULT_TEMPLATES);

    const refresh = useCallback(async () => {
        setTemplates(await loadTemplates());
    }, []);

    useEffect(() => {
        void refresh();
    }, [refresh]);

    async function addTemplate(template: WorkoutTemplate) {
        const userTemplates = templates.filter(({ id }) => !DEFAULT_TEMPLATES.some(defaultTemplate => defaultTemplate.id === id));
        const next = [...userTemplates, template];
        await AsyncStorage.setItem(process.env.EXPO_PUBLIC_STORAGE_KEY, JSON.stringify(next));
        setTemplates([...DEFAULT_TEMPLATES, ...next]);
    }

    return { templates, addTemplate, refresh };
}
