import { StyleSheet, Text, View } from "react-native";
import type { ReactNode } from "react";
import { colors } from "@/theme/colors";
import { typography } from "@/theme/typography";

// Displays one labeled workout statistic with an optional unit and icon.
export function StatCard({ caption, value, unit, icon,
}: {
    caption: string;
    value: string | number;
    unit?: string;
    icon?: ReactNode,
}) {
    return (
        <View style={styles.card}>
            <View style={styles.top}>
                <Text style={styles.label}>{caption}</Text>
                {icon}
            </View>

            <Text style={styles.value}>
                {value}{unit && <Text style={styles.unit}> {unit}</Text>}
            </Text>
        </View>
    )
}

const styles = StyleSheet.create({
    card: {
        minWidth: 0,
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 16,
        padding: 14,
        width: "48%",
    },
    top: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 10
    },
    label: {
        ...typography.label,
        color: colors.textMuted
    },
    value: {
        ...typography.numeric,
        fontSize: 20,
        color: colors.text
    },
    unit: {
        ...typography.body,
        fontSize: 12,
        color: colors.textMuted,
        fontWeight: "500"
    }
});