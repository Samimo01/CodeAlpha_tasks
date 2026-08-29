import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { Plus } from "lucide-react-native";
import { colors } from "@/theme/colors";
import { typography } from "@/theme/typography";

// Lets the user log a body-weight entry through an inline, collapsible form.
// Without this, the Weight Progress chart has no way to ever receive data.
export function WeightLogRow({ onSubmit }: { onSubmit: (weightKg: number) => void }) {
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState("");

    function submit() {
        const parsed = Number(value.replace(",", "."));
        if (!Number.isFinite(parsed) || parsed <= 0) return;
        onSubmit(parsed);
        setValue("");
        setOpen(false);
    }

    if (!open) {
        return (
            <Pressable style={styles.trigger} onPress={() => setOpen(true)}>
                <Plus size={13} color={colors.accent} />
                <Text style={styles.triggerText}>Log body weight</Text>
            </Pressable>
        );
    }

    return (
        <View style={styles.row}>
            <TextInput
                value={value}
                onChangeText={setValue}
                placeholder="e.g. 74.5"
                placeholderTextColor={colors.textFaint}
                keyboardType="decimal-pad"
                autoFocus
                style={styles.input}
                onSubmitEditing={submit}
            />
            <Text style={styles.unit}>kg</Text>

            <Pressable style={styles.cancel} onPress={() => setOpen(false)}>
                <Text style={styles.cancelText}>Cancel</Text>
            </Pressable>
            <Pressable style={styles.confirm} onPress={submit}>
                <Text style={styles.confirmText}>Save</Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    trigger: { flexDirection: "row", alignItems: "center", gap: 6, alignSelf: "flex-start", marginBottom: 10 },
    triggerText: { ...typography.body, fontSize: 12, fontWeight: "700", color: colors.accent },
    row: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 10 },
    input: {
        ...typography.numeric,
        flex: 1,
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 10,
        paddingVertical: 8,
        paddingHorizontal: 12,
        fontSize: 13
    },
    unit: { ...typography.label, color: colors.textFaint },
    confirm: { backgroundColor: colors.accent, borderRadius: 10, paddingVertical: 8, paddingHorizontal: 14 },
    confirmText: { ...typography.body, fontSize: 12, fontWeight: "700", color: colors.accentText },
    cancel: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 10, paddingVertical: 8, paddingHorizontal: 14 },
    cancelText: { ...typography.body, fontSize: 12, fontWeight: "700", color: colors.textMuted }
});