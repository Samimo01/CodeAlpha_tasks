import { Pressable, StyleSheet } from "react-native";
import type { ReactNode } from "react";
import { colors } from "@/theme/colors";

// Renders a compact icon-only button for secondary actions.
export function IconButton({ children, onPress }: { children: ReactNode; onPress?: () => void }) {
    return <Pressable onPress={onPress} style={styles.button}>{children}</Pressable>
}

const styles = StyleSheet.create({
    button: {
        width: 32,
        height: 32,
        borderRadius: 10,
        backgroundColor: colors.surfaceAlt,
        borderWidth: 1,
        borderColor: colors.border,
        alignItems: "center",
        justifyContent: "center"
    }
});