import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { ScreenContainer } from "@/components/layout/ScreenContainer";
import { ScreenHeader } from "@/components/layout/ScreenHeader";
import { AppButton } from "@/components/common/AppButton";
import { Chip } from "@/components/common/Chip";
import { ExerciseRow } from "@/components/workout/ExerciseRow";
import { ConfirmModal } from "@/components/common/ConfirmModal";
import { useWorkoutTemplates } from "@/hooks/useWorkoutTemplates";
import { useConfirm } from "@/hooks/useConfirm";
import catalog from "@/data/exercises.json";
import { colors } from "@/theme/colors";
import { typography } from "@/theme/typography";

const exerciseCatalog = catalog as Array<{ id: string; name: string; muscle: string; equipment: string }>;
const muscleGroups = ["All", ...Array.from(new Set(exerciseCatalog.map(exercise => exercise.muscle)))];

// Edits an existing workout template's name and exercise selection.
export default function Edit() {
    const { templateId } = useLocalSearchParams<{ templateId: string }>();
    const router = useRouter();
    const { templates, updateTemplate, deleteTemplate } = useWorkoutTemplates();
    const template = templates.find(t => t.id === templateId);

    const [name, setName] = useState("");
    const [ids, setIds] = useState<string[]>([]);
    const [initialized, setInitialized] = useState(false);
    const [selectedGroup, setSelectedGroup] = useState("All");
    const { confirm, modalProps } = useConfirm();

    const visibleExercises = useMemo(() => {
        if (selectedGroup === "All") return exerciseCatalog;
        return exerciseCatalog.filter(exercise => exercise.muscle === selectedGroup);
    }, [selectedGroup]);

    // Seeds local form state once the template has loaded, without resetting on every list refresh.
    useEffect(() => {
        if (template && !initialized) {
            setName(template.name);
            setIds(template.exerciseIds);
            setInitialized(true);
        }
    }, [template, initialized]);

    if (!template) return null;

    async function save() {
        await updateTemplate(template!.id, { name: name.trim(), exerciseIds: ids });
        router.back();
    }

    function handleDelete() {
        confirm({
            title: "Delete workout",
            message: `Remove "${template!.name}"? This cannot be undone.`,
            confirmLabel: "Delete",
            destructive: true,
            onConfirm: async () => {
                await deleteTemplate(template!.id);
                router.back();
            }
        });
    }

    return (
        <ScreenContainer>
            <ScreenHeader title="Edit Workout" onBack={() => router.back()} />
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

                <AppButton disabled={!name.trim() || !ids.length} onPress={save}>Save Changes</AppButton>
                <Text style={styles.deleteLink} onPress={handleDelete}>Delete this workout</Text>
            </ScrollView>

            <ConfirmModal {...modalProps} />
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
    },
    deleteLink: {
        ...typography.body,
        textAlign: "center",
        color: colors.danger,
        fontWeight: "700",
        marginTop: 16,
        paddingVertical: 8
    }
});