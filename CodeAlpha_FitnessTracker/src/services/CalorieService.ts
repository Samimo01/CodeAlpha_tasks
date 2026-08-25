// Estimates calories burned from duration, body weight, and activity intensity.
export function estimateCalories(durationSeconds: number, bodyWeightKg: number, met = 5): number {
    return Math.round(met * bodyWeightKg * (durationSeconds / 3600));
}
