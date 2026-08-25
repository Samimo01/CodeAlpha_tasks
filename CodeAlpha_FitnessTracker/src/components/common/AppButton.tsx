import { Pressable, StyleSheet, Text } from "react-native";
import type { ReactNode } from "react";
import { colors } from "@/theme/colors";
import { typography } from "@/theme/typography";

// Renders the app's primary text button with a consistent disabled state.
export function AppButton({ children, onPress, disabled = false }: { children: ReactNode; onPress?: () => void; disabled?: boolean }) {
    return (
        <Pressable disabled={disabled} onPress={onPress} style={[styles.button, disabled && styles.disabled]}>
            <Text style={[styles.text, disabled && styles.textDisabled]}>{children}</Text>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    button: {
        backgroundColor: colors.accent,
        borderRadius: 16,
        paddingVertical: 16,
        alignItems: "center",
        justifyContent: "center"
    },
    disabled: {
        backgroundColor: colors.surfaceAlt,
    },
    text: {
        ...typography.body,
        color: colors.accentText,
        fontSize: 13.5,
        fontWeight: "700",
        letterSpacing: 1,
        textTransform: "uppercase"
    },
    textDisabled: {
        color: colors.textFaint
    }
});