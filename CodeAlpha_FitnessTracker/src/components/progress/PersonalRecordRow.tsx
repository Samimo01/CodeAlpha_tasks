import { Award } from "lucide-react-native";
import { StyleSheet, Text, View } from "react-native";
import type { PersonalRecord } from "@/types";
import { colors } from "@/theme/colors";
import { typography } from "@/theme/typography";

// Displays one personal record with the exercise name and achieved weight.
export function PersonalRecordRow({ record }: { record: PersonalRecord }) {
    return (
        <View style={styles.row}>
            <Award size={15} color={colors.accentDark} />
            <Text style={styles.name}>{record.exerciseName}</Text>
            <Text style={styles.weight}>{record.weight} kg</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    row: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 14,
        padding: 13,
        marginBottom: 8
    },
    name: {
        ...typography.body,
        flex: 1,
        color: colors.text,
        fontWeight: "600"
    },
    weight: {
        ...typography.numeric,
        color: colors.accentDark,
    }
});