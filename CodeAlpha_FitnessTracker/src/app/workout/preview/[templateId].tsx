import { useLocalSearchParams, useRouter } from "expo-router";
import { ScrollView, Text } from "react-native";
import { ScreenContainer } from "@/components/layout/ScreenContainer";
import { ScreenHeader } from "@/components/layout/ScreenHeader";
import { ExerciseRow } from "@/components/workout/ExerciseRow";
import { AppButton } from "@/components/common/AppButton";
import { useWorkoutTemplates } from "@/hooks/useWorkoutTemplates";
import catalog from "@/data/exercises.json";
import type { Exercise } from "@/types";

// Previews a workout template before the user starts the session.
export default function Preview() {
    const { templateId } = useLocalSearchParams<{ templateId: string }>();
    const router = useRouter();
    const { templates } = useWorkoutTemplates();
    const t = templates.find(x => x.id === templateId);

    if (!t) return null;

    const all = catalog as Exercise[];

    return (
        <ScreenContainer>
            <ScreenHeader title={t.name} subtitle={t.muscles} onBack={() => router.push(`/workouts`)} />
            <ScrollView contentContainerStyle={{ padding: 20 }}>
                {t.exerciseIds.map(id => {
                    const e = all.find(x => x.id === id);
                    return e ? <ExerciseRow key={id} name={e.name} muscle={`${e.muscle} · ${e.equipment}`} /> : null
                })}
                <AppButton onPress={() => router.push(`/workout/active/${t.id}`)}>Start Workout</AppButton>
            </ScrollView>
        </ScreenContainer>
    )
}
