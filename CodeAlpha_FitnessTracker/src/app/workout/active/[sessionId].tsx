import { useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { ScreenContainer } from "@/components/layout/ScreenContainer";
import { ScreenHeader } from "@/components/layout/ScreenHeader";
import { EffortRing } from "@/components/workout/EffortRing";
import { Stepper } from "@/components/common/Stepper";
import { AppButton } from "@/components/common/AppButton";
import { ConfirmModal } from "@/components/common/ConfirmModal";

import { useActiveWorkout } from "@/hooks/useActiveWorkout";
import { useConfirm } from "@/hooks/useConfirm";
import { buildWorkout } from "@/services/WorkoutService";
import { useWorkoutTemplates } from "@/hooks/useWorkoutTemplates";

import catalog from "@/data/exercises.json";

import type { ActiveWorkout, Exercise, WorkoutTemplate } from "@/types";

import { colors } from "@/theme/colors";
import { typography } from "@/theme/typography";

// Loads the selected workout template before rendering the active workout.
export default function Active() {
    const { sessionId } = useLocalSearchParams<{ sessionId: string }>();
    const { templates } = useWorkoutTemplates();

    const template = templates.find((item) => item.id === sessionId);

    if (!template) return null;

    return <ActiveWorkoutLoader template={template} />;
}

// Builds the workout asynchronously so previous session weights can be loaded.
function ActiveWorkoutLoader({ template }: { template: WorkoutTemplate }) {
    const all = catalog as Exercise[];

    const [workout, setWorkout] =
        useState<ActiveWorkout | null>(null);

    useEffect(() => {
        let cancelled = false;

        async function loadWorkout() {
            const exercises = template.exerciseIds
                .map((id) =>
                    all.find((exercise) => exercise.id === id)
                )
                .filter(
                    (exercise): exercise is Exercise =>
                        Boolean(exercise)
                );

            const builtWorkout = await buildWorkout(template.name, exercises);

            if (!cancelled) setWorkout(builtWorkout)
        }

        loadWorkout();

        return () => { cancelled = true; };
    }, [template]);

    if (!workout) return null;

    return <ActiveWorkout workout={workout} />;
}

function ActiveWorkout({ workout }: { workout: ActiveWorkout }) {
    const router = useRouter();
    const [saveError, setSaveError] = useState<string | null>(null);

    const {
        activeWorkout,
        seconds,
        updateSet,
        addSet,
        removeSet,
        finishWorkout
    } = useActiveWorkout(workout);

    const { confirm, modalProps } = useConfirm();
    const hasAnySets = activeWorkout.exercises.some((exercise) => exercise.sets.length > 0);

    function handleBack() {
        confirm({
            title: "Quit workout",
            message: "Your progress on this session hasn't been saved yet. Leaving now will discard it.",
            confirmLabel: "Quit",
            destructive: true,
            onConfirm: () => router.back()
        });
    }

    async function endWorkout() {
        setSaveError(null);

        try {
            const result = await finishWorkout();

            router.replace({
                pathname: `/workout/summary/${result.id}`,
                params: {
                    newPrs: JSON.stringify(
                        result.newPrs
                    )
                }
            });
        } catch (error) {
            const message = error instanceof Error
                ? error.message
                : "Add at least one set before finishing the workout.";

            setSaveError(message);
        }
    }

    return (
        <ScreenContainer>
            <ScreenHeader title={activeWorkout.name} onBack={handleBack} />

            <View style={styles.ring}>
                <EffortRing seconds={seconds} />
            </View>

            {/* Exercises List */}
            <ScrollView contentContainerStyle={styles.content}>
                {activeWorkout.exercises.map((exercise, exerciseIndex) => (
                    <View
                        style={styles.card}
                        key={exercise.exerciseId}
                    >
                        <Text style={styles.name}>
                            {exercise.name}
                        </Text>

                        {exercise.sets.map((set, setIndex) => (
                            <View
                                style={styles.set}
                                key={setIndex}
                            >
                                <Text style={styles.index}>
                                    {setIndex + 1}
                                </Text>

                                <Stepper
                                    value={set.weight}
                                    formatted={`${set.weight} kg`}
                                    onDec={() =>
                                        updateSet(
                                            exerciseIndex,
                                            setIndex,
                                            "weight",
                                            -1
                                        )
                                    }
                                    onInc={() =>
                                        updateSet(
                                            exerciseIndex,
                                            setIndex,
                                            "weight",
                                            1
                                        )
                                    }
                                />

                                <Stepper
                                    value={set.reps}
                                    formatted={set.reps}
                                    onDec={() =>
                                        updateSet(
                                            exerciseIndex,
                                            setIndex,
                                            "reps",
                                            -1
                                        )
                                    }
                                    onInc={() =>
                                        updateSet(
                                            exerciseIndex,
                                            setIndex,
                                            "reps",
                                            1
                                        )
                                    }
                                />

                                <Pressable
                                    onPress={() =>
                                        removeSet(
                                            exerciseIndex,
                                            setIndex
                                        )
                                    }
                                >
                                    <Text style={styles.remove}>
                                        ×
                                    </Text>
                                </Pressable>
                            </View>
                        ))}

                        <Text
                            style={styles.add}
                            onPress={() => addSet(exerciseIndex)}
                        >
                            ＋ Add Set
                        </Text>
                    </View>
                ))}

                {saveError ? (
                    <Text style={styles.errorText}>{saveError}</Text>
                ) : null}

                <AppButton
                    disabled={!hasAnySets}
                    onPress={endWorkout}
                >
                    Finish Workout
                </AppButton>
            </ScrollView>

            <ConfirmModal {...modalProps} />
        </ScreenContainer>
    );
}

const styles = StyleSheet.create({
    ring: {
        alignItems: "center",
        marginBottom: 12
    },

    content: {
        padding: 20
    },

    errorText: {
        color: colors.danger,
        fontSize: 12,
        fontWeight: "600",
        marginBottom: 12,
        textAlign: "center"
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
        color: colors.textMuted
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