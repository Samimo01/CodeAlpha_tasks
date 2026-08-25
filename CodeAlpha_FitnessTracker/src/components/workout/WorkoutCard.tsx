import { Pressable, StyleSheet, Text } from "react-native";
import type { WorkoutTemplate } from "@/types";
import { colors } from "@/theme/colors";
import { typography } from "@/theme/typography";

// Summarizes a workout template and exposes its start action.
export function WorkoutCard({ workout, onPress }: { workout: WorkoutTemplate; onPress: () => void }) {
    return (
        <Pressable onPress={onPress} style={styles.card}>
            <Text style={styles.name}>{workout.name}</Text>
            <Text style={styles.muscles}>{workout.muscles}</Text>
            <Text style={styles.meta}>{workout.exerciseIds.length} exercises   ~{workout.avgDurationMinutes} min</Text>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 18,
        padding: 16,
        marginBottom: 12
    },
    name: {
        ...typography.display,
        fontSize: 15.5,
        color: colors.text
    },
    muscles: {
        ...typography.body,
        fontSize: 12,
        color: colors.textMuted,
        marginTop: 6
    },
    meta: {
        ...typography.body,
        fontSize: 11,
        color: colors.textFaint,
        marginTop: 12
    }
});
