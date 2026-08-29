import { Pressable, StyleSheet, Text, View } from "react-native";
import { Pencil, Trash2 } from "lucide-react-native";
import type { WorkoutTemplate } from "@/types";
import { colors } from "@/theme/colors";
import { typography } from "@/theme/typography";

// Summarizes a workout template and exposes its start, edit, and delete actions.
export function WorkoutCard({ workout, onPress, onEdit, onDelete }: {
    workout: WorkoutTemplate;
    onPress: () => void;
    onEdit?: () => void;
    onDelete?: () => void;
}) {
    return (
        <Pressable onPress={onPress} style={styles.card}>
            <View style={styles.header}>
                <Text style={styles.name}>{workout.name}</Text>
                <View style={styles.actions}>
                    {onEdit && (
                        <Pressable onPress={onEdit} style={styles.actionButton} hitSlop={8}>
                            <Pencil size={14} color={colors.textMuted} />
                        </Pressable>
                    )}
                    {onDelete && (
                        <Pressable onPress={onDelete} style={styles.actionButton} hitSlop={8}>
                            <Trash2 size={14} color={colors.danger} />
                        </Pressable>
                    )}
                </View>
            </View>
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
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between"
    },
    name: {
        ...typography.display,
        fontSize: 15.5,
        color: colors.text,
        flex: 1
    },
    actions: {
        flexDirection: "row",
        gap: 8
    },
    actionButton: {
        width: 26,
        height: 26,
        borderRadius: 8,
        backgroundColor: colors.surfaceAlt,
        borderWidth: 1,
        borderColor: colors.border,
        alignItems: "center",
        justifyContent: "center"
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