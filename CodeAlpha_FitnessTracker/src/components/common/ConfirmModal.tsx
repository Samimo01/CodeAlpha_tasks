import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { colors } from "@/theme/colors";
import { typography } from "@/theme/typography";

// Displays a themed confirmation dialog, replacing the native Alert for visual consistency.
export function ConfirmModal({
    visible,
    title,
    message,
    confirmLabel = "Confirm",
    cancelLabel = "Cancel",
    destructive = false,
    onConfirm,
    onCancel,
}: {
    visible: boolean;
    title: string;
    message: string;
    confirmLabel?: string;
    cancelLabel?: string;
    destructive?: boolean;
    onConfirm: () => void;
    onCancel: () => void;
}) {
    return (
        <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
            <Pressable style={styles.backdrop} onPress={onCancel}>
                {/* Stops the backdrop's onPress from closing the modal when tapping the card itself */}
                <Pressable style={styles.card} onPress={(e) => e.stopPropagation()}>
                    <Text style={styles.title}>{title}</Text>
                    <Text style={styles.message}>{message}</Text>

                    <View style={styles.actions}>
                        <Pressable style={styles.cancelButton} onPress={onCancel}>
                            <Text style={styles.cancelText}>{cancelLabel}</Text>
                        </Pressable>
                        <Pressable
                            style={[styles.confirmButton, destructive && styles.confirmButtonDestructive]}
                            onPress={onConfirm}
                        >
                            <Text style={[styles.confirmText, destructive && styles.confirmTextDestructive]}>
                                {confirmLabel}
                            </Text>
                        </Pressable>
                    </View>
                </Pressable>
            </Pressable>
        </Modal>
    )
}

const styles = StyleSheet.create({
    backdrop: {
        flex: 1,
        backgroundColor: "rgba(3,5,6,0.7)",
        alignItems: "center",
        justifyContent: "center",
        padding: 24
    },
    card: {
        width: "100%",
        maxWidth: 340,
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 20,
        padding: 22
    },
    title: {
        ...typography.display,
        fontSize: 16,
        color: colors.text,
        marginBottom: 8
    },
    message: {
        ...typography.body,
        fontSize: 13,
        color: colors.textMuted,
        lineHeight: 19,
        marginBottom: 22
    },
    actions: {
        flexDirection: "row",
        gap: 10
    },
    cancelButton: {
        flex: 1,
        backgroundColor: colors.surfaceAlt,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 14,
        paddingVertical: 13,
        alignItems: "center"
    },
    cancelText: {
        ...typography.body,
        fontSize: 12.5,
        fontWeight: "700",
        color: colors.textMuted,
        textTransform: "uppercase",
        letterSpacing: 0.5
    },
    confirmButton: {
        flex: 1,
        backgroundColor: colors.accent,
        borderRadius: 14,
        paddingVertical: 13,
        alignItems: "center"
    },
    confirmButtonDestructive: {
        backgroundColor: "rgba(232,97,90,0.14)",
        borderWidth: 1,
        borderColor: "rgba(232,97,90,0.35)"
    },
    confirmText: {
        ...typography.body,
        fontSize: 12.5,
        fontWeight: "700",
        color: colors.accentText,
        textTransform: "uppercase",
        letterSpacing: 0.5
    },
    confirmTextDestructive: {
        color: colors.danger
    }
});