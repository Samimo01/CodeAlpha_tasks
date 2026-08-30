import { useLocalSearchParams, useRouter } from "expo-router";
import { Clock, TrendingUp } from "lucide-react-native";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { ScreenContainer } from "@/components/layout/ScreenContainer";
import { ScreenHeader } from "@/components/layout/ScreenHeader";
import { StatCard } from "@/components/common/StatCard";
import { SetRow } from "@/components/workout/SetRow";
import { useWorkoutSession } from "@/hooks/useWorkoutSession";
import { colors } from "@/theme/colors";
import { typography } from "@/theme/typography";
import type { WorkoutSession } from "@/types";

function formatDuration(seconds: number) {
    const minutes = Math.round(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return hours > 0 ? `${hours}h ${String(remainingMinutes).padStart(2, "0")}m` : `${minutes} min`;
}

function sessionVolume(session: WorkoutSession) {
    return session.exercises.reduce(
        (total, exercise) => total + exercise.sets.reduce((subtotal, set) => subtotal + set.weight * set.reps, 0),
        0
    ) / 1000;
}

// Loads and displays the exercises and sets for one completed session.
export default function Detail() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();
    const { session } = useWorkoutSession(id ? Number(id) : null);

    if (!session) return null;

    const volume = sessionVolume(session);

    return (
        <ScreenContainer>
            <ScreenHeader
                title={session.name}
                subtitle={new Date(session.startedAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                onBack={() => router.push(`/history`)}
            />

            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.stats}>
                    <StatCard caption="Duration" value={formatDuration(session.durationSeconds)} icon={<Clock size={20} color={colors.textFaint} />} />
                    <StatCard caption="Volume" value={volume.toFixed(1)} unit="t" icon={<TrendingUp size={20} color={colors.textFaint} />} />
                </View>

                <Text style={styles.sectionLabel}>Exercises</Text>
                {session.exercises.map(exercise =>
                    <View key={exercise.name} style={styles.exercise}>
                        <Text style={styles.exerciseName}>{exercise.name}</Text>
                        <View style={styles.sets}>
                            {exercise.sets.map((set, index) =>
                                <SetRow key={index} entry={set} />
                            )}
                        </View>
                    </View>)}
            </ScrollView>

        </ScreenContainer>
    )
}

const styles = StyleSheet.create({
    content: { padding: 20 },
    stats: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 20,
    },
    sectionLabel: {
        ...typography.label,
        color: colors.textMuted,
        marginBottom: 10,
    },
    exercise: {
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
        marginBottom: 12,
        padding: 12,
        borderRadius: 14,
    },
    exerciseName: {
        ...typography.body,
        fontSize: 13.5,
        fontWeight: "600",
        color: colors.text,
        marginBottom: 8,
    },
    sets: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 6,
    },
    setPill: {
        backgroundColor: colors.surfaceAlt,
        borderRadius: 8,
        paddingVertical: 4,
        paddingHorizontal: 9,
    },
    setText: {
        ...typography.body,
        fontSize: 11.5,
        color: colors.textMuted,
        fontVariant: ["tabular-nums"],
    }
});
