import { useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, TextInput } from "react-native";
import { ScreenContainer } from "@/components/layout/ScreenContainer";
import { ScreenHeader } from "@/components/layout/ScreenHeader";
import { AppButton } from "@/components/common/AppButton";
import { ExerciseRow } from "@/components/workout/ExerciseRow";
import catalog from "@/data/exercises.json";
import { colors } from "@/theme/colors";
import { typography } from "@/theme/typography";
import { useWorkoutTemplates } from "@/hooks/useWorkoutTemplates";

// Builds a custom workout by collecting a name and selected exercises.
export default function Create() {
    const router = useRouter();
    const [name, setName] = useState("");
    const [ids, setIds] = useState<string[]>([]);
    const { addTemplate } = useWorkoutTemplates();

    async function startWorkout() {
        const selected = (catalog as Array<{ id: string; muscle: string }>).filter(e => ids.includes(e.id));
        const template = {
            id: `custom-${Date.now()}`,
            name: name.trim(),
            muscles: [...new Set(selected.map(e => e.muscle))].join(" · "),
            exerciseIds: ids,
            avgDurationMinutes: Math.max(10, ids.length * 10)
        };

        await addTemplate(template);
        router.push(`/workout/active/${template.id}`);
    }

    return (
        <ScreenContainer>
            <ScreenHeader title="Create Workout" onBack={() => router.back()} />
            <ScrollView contentContainerStyle={styles.content}>
                <Text style={styles.label}>WORKOUT NAME</Text>
                <TextInput value={name} onChangeText={setName} placeholder="e.g. Push Day" placeholderTextColor={colors.textFaint} style={styles.input} />
                <Text style={styles.label}>EXERCISES · {ids.length}</Text>

                {(catalog as Array<{ id: string; name: string; muscle: string }>).map(e => <Pressable key={e.id} onPress={() => setIds(x => x.includes(e.id) ? x.filter(id => id !== e.id) : [...x, e.id])}>
                    <ExerciseRow name={`${ids.includes(e.id) ? "✓ " : ""}${e.name}`} muscle={e.muscle} /></Pressable>
                )}

                <AppButton disabled={!name.trim() || !ids.length} onPress={startWorkout}>Start Workout</AppButton>
            </ScrollView>
        </ScreenContainer>
    )
}

const styles = StyleSheet.create({
    content: { padding: 20 },
    label: {
        ...typography.label,
        color: colors.textMuted,
        marginBottom: 8,
        marginTop: 10
    },
    input: {
        ...typography.body,
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 12,
        color: colors.text,
        padding: 13,
        marginBottom: 12
    }
});
