import type { WorkoutSession } from "@/types";

// Returns the ISO year-week label for a calendar date.
export function getISOWeekLabel(date: Date): string {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const day = d.getUTCDay() || 7; d.setUTCDate(d.getUTCDate() + 4 - day);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));

    return `${d.getUTCFullYear()}-W${String(Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7)).padStart(2, "0")}`;
}

// Returns the seven dates in the week containing the reference date.
export function getCurrentWeekDays(reference = new Date()): Date[] {
    const d = new Date(reference);
    const day = d.getDay() || 7; d.setDate(d.getDate() - day + 1);

    return Array.from({ length: 7 }, (_, i) => {
        const x = new Date(d);
        x.setDate(d.getDate() + i);
        
        return x;
    });
}

// Groups workout sessions by their ISO week label.
export function groupSessionsByWeek(sessions: WorkoutSession[]): Record<string, WorkoutSession[]> {
    return sessions.reduce<Record<string, WorkoutSession[]>>((groups, session) => {
        const key = getISOWeekLabel(new Date(session.startedAt));
        (groups[key] ??= []).push(session);

        return groups;
    }, {});
}
