import { Pressable, StyleSheet, Text } from "react-native";
import { colors } from "@/theme/colors";
import { typography } from "@/theme/typography";

// Renders a compact selectable label used for filters and categories.
export function Chip({ label, active, onPress }: { label: string; active?: boolean; onPress?: () => void }) {
    return (
        <Pressable onPress={onPress} style={[styles.chip, active && styles.active]}>
            <Text style={[styles.text, active && styles.activeText]}>{label}</Text>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    chip: {
        paddingVertical: 7,
        paddingHorizontal: 13,
        borderRadius: 999,
        borderWidth: 1,
        borderColor: colors.border
    },
    active: {
        backgroundColor: colors.accentSoft,
        borderColor: colors.accent
    },
    text: {
        ...typography.body,
        fontSize: 11,
        color: colors.textMuted
    },
    activeText: { color: colors.accent }
});
