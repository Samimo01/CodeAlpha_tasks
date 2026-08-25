import { StyleSheet, Text, View } from "react-native";
import { colors } from "@/theme/colors";
import { typography } from "@/theme/typography";

// Displays an exercise name and its optional muscle-group label.
export function ExerciseRow({ name, muscle }: { name: string; muscle?: string }) {
    return (
        <View style={styles.row}>
            <Text style={styles.name}>{name}</Text>
            {muscle && <Text style={styles.muscle}>{muscle}</Text>}
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
        marginBottom: 8
    },
    name: {
        ...typography.body,
        fontSize: 13.5,
        fontWeight: "600",
        color: colors.text
    },
    muscle: {
        ...typography.label,
        color: colors.textMuted,
        marginTop: 3
    }
});
