import { StyleSheet, Text, View } from "react-native";
import { colors } from "@/theme/colors";
import { typography } from "@/theme/typography";

// Displays an exercise name and its optional muscle-group label.
export function ExerciseRow({
    name,
    muscle,
    selected = false
}: {
    name: string;
    muscle?: string;
    selected?: boolean;
}) {
    return (
        <View style={[styles.row, selected && styles.rowSelected]}>
            <View style={styles.content}>
                <Text style={[styles.name, selected && styles.nameSelected]}>{name}</Text>
                {muscle && <Text style={styles.muscle}>{muscle}</Text>}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    row: {
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 14,
        padding: 13,
        marginBottom: 8,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between"
    },
    rowSelected: {
        backgroundColor: colors.accentSoft,
        borderColor: colors.accent
    },
    content: {
        flex: 1,
        marginRight: 12
    },
    name: {
        ...typography.body,
        fontSize: 13.5,
        fontWeight: "600",
        color: colors.text
    },
    nameSelected: {
        color: colors.accent
    },
    muscle: {
        ...typography.label,
        color: colors.textMuted,
        marginTop: 3
    }
});
