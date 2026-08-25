import { Minus, Plus } from "lucide-react-native";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors } from "@/theme/colors";
import { typography } from "@/theme/typography";

// Provides increment and decrement controls for a bounded numeric value.
export function Stepper({ value, formatted, onDec, onInc, min = 0 }: {
    value: number; formatted: string | number;
    onDec: () => void;
    onInc: () => void; min?: number
}) {
    return (
        <View style={styles.row}>
            <Pressable disabled={value <= min} onPress={onDec} style={styles.control}>
                <Minus size={12} color={value <= min ? colors.textFaint : colors.text} />
            </Pressable>

            <Text style={styles.value}>{formatted}</Text>

            <Pressable onPress={onInc} style={styles.add}>
                <Plus size={12} color={colors.accent} />
            </Pressable>
        </View>
    )
}

const styles = StyleSheet.create({
    row: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8
    },
    control: {
        width: 26,
        height: 26,
        borderRadius: 8,
        backgroundColor: colors.surfaceAlt,
        borderWidth: 1,
        borderColor: colors.border,
        alignItems: "center",
        justifyContent: "center"
    },
    add: {
        width: 26,
        height: 26,
        borderRadius: 8,
        backgroundColor: colors.accentSoft,
        borderWidth: 1,
        borderColor: colors.accentDim,
        alignItems: "center",
        justifyContent: "center"
    },
    value: {
        ...typography.numeric,
        minWidth: 42,
        textAlign: "center",
        fontSize: 13,
        color: colors.text
    }
});