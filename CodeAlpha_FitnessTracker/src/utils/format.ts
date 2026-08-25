import type { Equipment } from "@/types";

// Formats a duration in minutes as hours and minutes.
export function fmtDuration(minutes: number): string {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;

    return h ? `${h}h ${String(m).padStart(2, "0")}m` : `${m} min`;
}

// Formats elapsed seconds as a zero-padded timer.
export function fmtTimer(seconds: number): string {
    return `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;
}

// Formats a weight value with the appropriate body-weight label.
export function fmtWeight(equipment: Equipment, weight: number): string {
    return equipment === "Bodyweight" && weight === 0 ? "BW" : `${weight} kg`;
}
