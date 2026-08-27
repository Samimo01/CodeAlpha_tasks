import { useLocalSearchParams, useRouter } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { ScreenContainer } from "@/components/layout/ScreenContainer";
import { ScreenHeader } from "@/components/layout/ScreenHeader";
import { EffortRing } from "@/components/workout/EffortRing";
import { Stepper } from "@/components/common/Stepper";
import { AppButton } from "@/components/common/AppButton";
import { useActiveWorkout } from "@/hooks/useActiveWorkout";
import { buildWorkout } from "@/services/WorkoutService";
import { useWorkoutTemplates } from "@/hooks/useWorkoutTemplates";
import catalog from "@/data/exercises.json";
import type { Exercise, WorkoutTemplate } from "@/types";
import { colors } from "@/theme/colors";
import { typography } from "@/theme/typography";

// Runs the active workout screen and lets the user edit, add, or remove sets.
export default function Active() {
    const { sessionId } = useLocalSearchParams<{ sessionId: string }>();
    const router = useRouter();
    const { templates } = useWorkoutTemplates();
    const t = templates.find(x => x.id === sessionId);

    return t ? <ActiveWorkout template={t} /> : null;
}

function ActiveWorkout({ template }: { template: WorkoutTemplate }) {
    const router = useRouter();
    const all = catalog as Exercise[];
    const workout = buildWorkout(template.name, template.exerciseIds.map(id => all.find(x => x.id === id)).filter((x): x is Exercise => Boolean(x)));
    const { activeWorkout, seconds, updateSet, addSet, removeSet, finishWorkout } = useActiveWorkout(workout);

    return (
        <ScreenContainer>
            <ScreenHeader title={activeWorkout.name} onBack={() => router.back()} />
            <View style={styles.ring}>
                <EffortRing seconds={seconds} />
            </View>
            <ScrollView contentContainerStyle={styles.content}>
                {activeWorkout.exercises.map((e, i) =>
                    <View style={styles.card} key={e.exerciseId}>
                        <Text style={styles.name}>{e.name}</Text>
                        {e.sets.map((s, j) =>
                            <View style={styles.set} key={j}>
                                <Text style={styles.index}>{j + 1}</Text>
                                <Stepper value={s.weight} formatted={`${s.weight} kg`} onDec={() => updateSet(i, j, "weight", -1)} onInc={() => updateSet(i, j, "weight", 1)} />
                                <Stepper value={s.reps} formatted={s.reps} onDec={() => updateSet(i, j, "reps", -1)} onInc={() => updateSet(i, j, "reps", 1)} />
                                <Pressable onPress={() => removeSet(i, j)}>
                                    <Text style={styles.remove}>×</Text>
                                </Pressable>
                            </View>
                        )}

                        <Text style={styles.add} onPress={() => addSet(i)}>＋ Add Set</Text>
                    </View>
                )}

                <AppButton onPress={async () => {
                    const result = await finishWorkout();
                    router.replace({
                        pathname: `/workout/summary/${result.id}`,
                        params: { newPrs: JSON.stringify(result.newPrs) }
                    });
                }}>Finish Workout</AppButton>
            </ScrollView>
        </ScreenContainer>
    )
}

const styles = StyleSheet.create({
    ring: {
        alignItems: "center",
        marginBottom: 12
    },
    content: {
        padding: 20
    },
    card: {
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 16,
        padding: 14,
        marginBottom: 12
    },
    name: {
        ...typography.display,
        fontWeight: "700",
        fontSize: 14,
        color: colors.text,
        marginBottom: 8
    },
    set: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: 6,
        borderTopWidth: 1,
        borderTopColor: colors.borderSoft
    },
    index: {
        ...typography.numeric,
        color: colors.textMuted,
    },
    remove: {
        ...typography.body,
        fontSize: 22,
        color: colors.textFaint
    },
    add: {
        ...typography.body,
        textAlign: "center",
        color: colors.accent,
        paddingTop: 8,
        fontWeight: "700"
    }
});
