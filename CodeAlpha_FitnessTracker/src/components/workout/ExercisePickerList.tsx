import { Pressable, StyleSheet, Text } from "react-native";
import type { Exercise } from "@/types";
import { colors } from "@/theme/colors";
import { typography } from "@/theme/typography";

// Renders an exercise option with its selection state and press action.
export function ExercisePickerList({ exercise, selected, onPress }: {
    exercise: Exercise;
    selected: boolean;
    onPress: () => void
}) {

    return (
        <Pressable onPress={onPress} style={[styles.row, selected && styles.selected]}>
            <Text style={styles.name}>{exercise.name}</Text>
            <Text style={styles.meta}>{exercise.muscle} · {exercise.equipment}</Text>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    row: {
        padding: 13,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: colors.border,
        backgroundColor: colors.surface,
        marginBottom: 8
    },
    selected: {
        backgroundColor: colors.accentSoft,
        borderColor: colors.accentDim
    },
    name: {
        ...typography.body,
        color: colors.text,
        fontWeight: "600"
    },
    meta: {
        ...typography.label,
        color: colors.textMuted,
        fontSize: 10,
        letterSpacing: 1.4,
        marginTop: 3
    }
});