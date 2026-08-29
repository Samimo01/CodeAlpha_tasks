import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { ScreenContainer } from "@/components/layout/ScreenContainer";
import { ScreenHeader } from "@/components/layout/ScreenHeader";
import { AppButton } from "@/components/common/AppButton";
import { Chip } from "@/components/common/Chip";
import { ExerciseRow } from "@/components/workout/ExerciseRow";
import catalog from "@/data/exercises.json";
import { colors } from "@/theme/colors";
import { typography } from "@/theme/typography";
import { useWorkoutTemplates } from "@/hooks/useWorkoutTemplates";

const exerciseCatalog = catalog as Array<{ id: string; name: string; muscle: string; equipment: string }>;
const muscleGroups = ["All", ...Array.from(new Set(exerciseCatalog.map(exercise => exercise.muscle)))];

// Builds a custom workout by collecting a name and selected exercises.
export default function Create() {
    const router = useRouter();
    const [name, setName] = useState("");
    const [ids, setIds] = useState<string[]>([]);
    const [selectedGroup, setSelectedGroup] = useState("All");
    const { addTemplate } = useWorkoutTemplates();

    const visibleExercises = useMemo(() => {
        if (selectedGroup === "All") return exerciseCatalog;
        return exerciseCatalog.filter(exercise => exercise.muscle === selectedGroup);
    }, [selectedGroup]);

    async function startWorkout() {
        const selected = exerciseCatalog.filter(e => ids.includes(e.id));
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

                {/* Workout Name Input */}
                <Text style={styles.label}>WORKOUT NAME</Text>
                <TextInput
                    value={name}
                    onChangeText={setName}
                    placeholder="e.g. Push Day"
                    placeholderTextColor={colors.textFaint}
                    style={styles.input}
                />

                {/* Chips Row */}
                <Text style={styles.label}>EXERCISES · {ids.length}</Text>
                <View style={styles.chipsRow}>
                    {muscleGroups.map(group => (
                        <Chip
                            key={group}
                            label={group}
                            active={selectedGroup === group}
                            onPress={() => setSelectedGroup(group)}
                        />
                    ))}
                </View>

                {/* Exercises List */}
                {visibleExercises.map(exercise => (
                    <Pressable
                        key={exercise.id}
                        onPress={() => setIds(current => current.includes(exercise.id)
                            ? current.filter(id => id !== exercise.id)
                            : [...current, exercise.id])}
                    >
                        <ExerciseRow name={exercise.name} muscle={exercise.muscle} selected={ids.includes(exercise.id)} />
                    </Pressable>
                ))}

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
    },
    chipsRow: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 8,
        marginBottom: 12
    }
});
