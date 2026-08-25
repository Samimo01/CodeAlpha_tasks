import { StyleSheet, Text, View } from "react-native";
import type { SetEntry } from "@/types";
import { colors } from "@/theme/colors";
import { typography } from "@/theme/typography";

// Displays the index, weight, and repetitions for one completed set.
export function SetRow({ entry }: { entry: SetEntry }) {
    return (
        <View style={styles.setPill}>
            <Text style={styles.setText}>
                {entry.weight > 0 ? `${entry.weight} x ${entry.reps}` : `BW x ${entry.reps}`}
            </Text>
        </View>
    )
}

const styles = StyleSheet.create({
    setPill: {
        backgroundColor: colors.surfaceAlt,
        borderRadius: 8,
        paddingVertical: 4,
        paddingHorizontal: 9,
    },
    setText: {
        ...typography.body,
        fontSize: 11.5,
        color: colors.textMuted,
        fontVariant: ["tabular-nums"],
    },
});
