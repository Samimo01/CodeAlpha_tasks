import { Pressable, StyleSheet, Text, View } from "react-native";
import type { WorkoutSession } from "@/types";
import { colors } from "@/theme/colors";
import { typography } from "@/theme/typography";

// Renders one history entry with its session metadata and navigation action.
export function HistoryRow({ session, onPress }: {
    session: WorkoutSession; onPress: () => void
}) {
    return (
        <Pressable onPress={onPress} style={styles.row}>
            <View>
                <Text style={styles.date}>{new Date(session.startedAt).toLocaleDateString()}</Text>
                <Text style={styles.name}>{session.name}</Text>
            </View>
            <Text style={styles.duration}>{Math.round(session.durationSeconds / 60)} min</Text>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 16,
        padding: 14,
        marginBottom: 10
    },
    date: {
        ...typography.label,
        color: colors.textMuted
    },
    name: {
        ...typography.display,
        fontSize: 14.5,
        color: colors.text,
        marginTop: 4
    },
    duration: {
        ...typography.numeric,
        color: colors.text,
        fontSize: 12.5
    }
});
