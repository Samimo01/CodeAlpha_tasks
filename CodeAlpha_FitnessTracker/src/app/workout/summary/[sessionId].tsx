import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Award, Check, Clock, Dumbbell, TrendingUp } from "lucide-react-native";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { ScreenContainer } from "@/components/layout/ScreenContainer";
import { StatCard } from "@/components/common/StatCard";
import { AppButton } from "@/components/common/AppButton";
import { workoutRepository } from "@/database/repositories/WorkoutRepository";
import { colors } from "@/theme/colors";
import { typography } from "@/theme/typography";

// Loads the finished session and summarizes its duration, volume, and calories.
export default function Summary() {
    const { sessionId, newPrs: newPrsParam } = useLocalSearchParams<{ sessionId: string; newPrs?: string }>();
    const router = useRouter();
    const [session, setSession] = useState<Awaited<ReturnType<typeof workoutRepository.getSessionById>>>(null);

    let newPrs: Array<{ name: string; weight: number }> = [];
    try {
        newPrs = newPrsParam ? JSON.parse(newPrsParam) as Array<{ name: string; weight: number }> : [];
    } catch {
        newPrs = [];
    }

    useEffect(() => {
        void workoutRepository.getSessionById(Number(sessionId)).then(setSession)
    }, [sessionId]);

    if (!session) return null;

    const volume = session.exercises.reduce(
        (total, exercise) => total + exercise.sets.reduce((setsTotal, set) => setsTotal + set.weight * set.reps, 0),
        0
    ) / 1000;
    const sets = session.exercises.reduce((total, exercise) => total + exercise.sets.length, 0);

    return (
        <ScreenContainer>
            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.successIcon}>
                    <Check size={28} color={colors.accent} strokeWidth={2.5} />
                </View>
                <Text style={styles.complete}>WORKOUT COMPLETE</Text>
                <Text style={styles.title}>{session.name}</Text>

                <View style={styles.stats}>
                    <StatCard caption="Duration" value={`${Math.round(session.durationSeconds / 60)} min`} icon={<Clock size={20} color={colors.textFaint} />} />
                    <StatCard caption="Volume" value={volume.toFixed(1)} unit="t" icon={<TrendingUp size={20} color={colors.textFaint} />} />
                    <StatCard caption="Exercises" value={session.exercises.length} icon={<Dumbbell size={20} color={colors.textFaint} />} />
                    <StatCard caption="Sets" value={sets} icon={<Check size={20} color={colors.textFaint} />} />
                </View>

                <View style={styles.records}>
                    <View style={styles.recordsHeader}>
                        <Award size={15} color={colors.textFaint} />
                        <Text style={styles.recordsTitle}>{newPrs.length} New Personal Record{newPrs.length === 1 ? "" : "s"}</Text>
                    </View>
                    
                    {newPrs.map((record) => (
                        <View style={styles.recordRow} key={record.name}>
                            <Text style={styles.recordName}>{record.name}</Text>
                            <Text style={styles.recordWeight}>{record.weight} kg</Text>
                        </View>
                    ))}
                </View>
                <Text style={styles.encouragement}>Great job!</Text>
                <AppButton onPress={() => router.replace("/")}>Done</AppButton>
            </ScrollView>
        </ScreenContainer>
    )
}

const styles = StyleSheet.create({
    content: {
        flexGrow: 1,
        padding: 24,
        paddingTop: 48,
        gap: 12
    },
    successIcon: {
        width: 64,
        height: 64,
        borderRadius: 20,
        backgroundColor: colors.accentSoft,
        borderWidth: 1,
        borderColor: colors.accentDim,
        alignItems: "center",
        justifyContent: "center",
        alignSelf: "center",
        marginBottom: 6
    },
    complete: {
        ...typography.label,
        color: colors.accent,
        textAlign: "center",
        marginBottom: -4
    },
    title: {
        ...typography.display,
        color: colors.text,
        fontSize: 24,
        textAlign: "center",
        marginBottom: 16,
        alignSelf: "center"
    },
    stats: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
        gap: 10,
        marginBottom: 2
    },
    records: {
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
        padding: 16,
        borderRadius: 16,
        marginTop: 2,
        marginBottom: 8
    },
    recordsHeader: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8
    },
    recordRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        borderTopWidth: 1,
        borderTopColor: colors.borderSoft,
        paddingTop: 10,
        marginTop: 10
    },
    recordName: {
        ...typography.body,
        color: colors.text,
        fontSize: 13,
        fontWeight: "600",
        flex: 1
    },
    recordWeight: {
        ...typography.numeric,
        color: colors.accentDark,
        fontSize: 13
    },
    recordsTitle: {
        ...typography.body,
        color: colors.textMuted,
        fontSize: 12.5,
        fontWeight: "700"
    },
    encouragement: {
        ...typography.display,
        color: colors.textMuted,
        fontSize: 13,
        textAlign: "center",
        marginBottom: 10
    }
});