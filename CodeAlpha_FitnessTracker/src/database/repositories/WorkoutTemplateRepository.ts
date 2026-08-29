import AsyncStorage from "@react-native-async-storage/async-storage";
import type { WorkoutTemplate } from "@/types";
import { DEFAULT_TEMPLATES } from "@/services/WorkoutService";
import catalog from "@/data/exercises.json";
import type { Exercise } from "@/types";

const STORAGE_KEY = process.env.EXPO_PUBLIC_STORAGE_KEY;

type TemplateEditableFields = Pick<WorkoutTemplate, "name" | "muscles" | "exerciseIds" | "avgDurationMinutes">;

interface TemplateOverrides {
    custom: WorkoutTemplate[];
    edited: Record<string, Partial<TemplateEditableFields>>;
    hiddenDefaultIds: string[];
}

const EMPTY_OVERRIDES: TemplateOverrides = { custom: [], edited: {}, hiddenDefaultIds: [] };

// Recomputes muscle groups and estimated duration from a new exercise selection.
function deriveMetadata(exerciseIds: string[]): Pick<TemplateEditableFields, "muscles" | "avgDurationMinutes"> {
    const all = catalog as Exercise[];
    const selected = all.filter((e) => exerciseIds.includes(e.id));

    return {
        muscles: [...new Set(selected.map((e) => e.muscle))].join(" · "),
        avgDurationMinutes: Math.max(10, exerciseIds.length * 10)
    };
}

export class WorkoutTemplateRepository {
    // Reads persisted overrides, transparently migrating the legacy flat-array format.
    private async readOverrides(): Promise<TemplateOverrides> {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (!stored) return EMPTY_OVERRIDES;

        try {
            const parsed = JSON.parse(stored);

            if (Array.isArray(parsed)) {
                const migrated: TemplateOverrides = { custom: parsed, edited: {}, hiddenDefaultIds: [] };
                await this.writeOverrides(migrated);
                return migrated;
            }

            return {
                custom: Array.isArray(parsed.custom) ? parsed.custom : [],
                edited: typeof parsed.edited === "object" && parsed.edited !== null ? parsed.edited : {},
                hiddenDefaultIds: Array.isArray(parsed.hiddenDefaultIds) ? parsed.hiddenDefaultIds : []
            };
        } catch {
            return EMPTY_OVERRIDES;
        }
    }

    private async writeOverrides(data: TemplateOverrides): Promise<void> {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }

    // Merges default templates (with edits/hidden state applied) and custom templates.
    async getAll(): Promise<WorkoutTemplate[]> {
        const { custom, edited, hiddenDefaultIds } = await this.readOverrides();

        const defaults = DEFAULT_TEMPLATES
            .filter((t) => !hiddenDefaultIds.includes(t.id))
            .map((t) => (edited[t.id] ? { ...t, ...edited[t.id] } : t));

        return [...defaults, ...custom];
    }

    async addCustom(template: WorkoutTemplate): Promise<void> {
        const data = await this.readOverrides();
        data.custom = [...data.custom.filter((t) => t.id !== template.id), template];
        await this.writeOverrides(data);
    }

    // Updates a template's editable fields, whether it's a default or a custom one.
    // If exerciseIds changes, muscles/avgDurationMinutes are auto-recomputed unless overridden explicitly.
    async update(id: string, changes: Partial<TemplateEditableFields>): Promise<void> {
        const data = await this.readOverrides();
        const isDefault = DEFAULT_TEMPLATES.some((t) => t.id === id);
        const derived = changes.exerciseIds ? deriveMetadata(changes.exerciseIds) : {};
        const finalChanges = { ...derived, ...changes };

        if (isDefault) {
            data.edited[id] = { ...data.edited[id], ...finalChanges };
        } else {
            data.custom = data.custom.map((t) => (t.id === id ? { ...t, ...finalChanges } : t));
        }

        await this.writeOverrides(data);
    }

    // Removes a template. Default templates are hidden rather than deleted from source code.
    async remove(id: string): Promise<void> {
        const data = await this.readOverrides();
        const isDefault = DEFAULT_TEMPLATES.some((t) => t.id === id);

        if (isDefault) {
            data.hiddenDefaultIds = [...new Set([...data.hiddenDefaultIds, id])];
        } else {
            data.custom = data.custom.filter((t) => t.id !== id);
        }

        await this.writeOverrides(data);
    }

    // Reverses a hidden default template back to visible, discarding any edits made to it.
    async restoreDefault(id: string): Promise<void> {
        const data = await this.readOverrides();
        data.hiddenDefaultIds = data.hiddenDefaultIds.filter((hiddenId) => hiddenId !== id);
        delete data.edited[id];
        await this.writeOverrides(data);
    }
}

export const workoutTemplateRepository = new WorkoutTemplateRepository();