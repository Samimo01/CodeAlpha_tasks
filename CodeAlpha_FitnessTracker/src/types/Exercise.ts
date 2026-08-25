export type MuscleGroup = "Chest" | "Back" | "Shoulders" | "Arms" | "Legs" | "Abs";
export type Equipment = "Barbell" | "Dumbbell" | "Cable" | "Machine" | "Bodyweight";

export interface Exercise {
    id: string;
    name: string;
    muscle: MuscleGroup;
    equipment: Equipment;
}
