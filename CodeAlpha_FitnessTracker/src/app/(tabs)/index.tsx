import { useRouter } from "expo-router";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { Dumbbell, Clock, TrendingUp, Flame } from "lucide-react-native";
import { ScreenContainer } from "@/components/layout/ScreenContainer";
import { StatCard } from "@/components/common/StatCard";
import { AppButton } from "@/components/common/AppButton";
import { colors } from "@/theme/colors";
import { typography } from "@/theme/typography";
import { useHistory } from "@/hooks/useHistory";
import { sessionVolume } from "@/services/StatsService";
import { fmtDuration } from "@/utils/format";

export default function Home() {
    const router = useRouter();
    const { sessions } = useHistory();
    const today = sessions.filter(s => new Date(s.startedAt).toDateString() === new Date().toDateString());
    const todayVolume = today.reduce((sum, s) => sum + sessionVolume(s), 0);
    const latest = sessions[0];

    // Home Page
    return (
        <ScreenContainer>
            <ScrollView contentContainerStyle={styles.content}>
                <Text style={styles.label}>{new Date().toDateString().toUpperCase()}</Text>

                {/* TODO: add the user's name after the welcome message */}
                <Text style={styles.greeting}>Good {new Date().getHours() < 12 ? "morning" : new Date().getHours() < 18 ? "afternoon" : "evening"}, Champion</Text>

                <Text style={styles.label}>TODAY'S ACTIVITY</Text>
                <View style={styles.grid}>
                    <StatCard caption="Workouts" value={today.length} icon={<Dumbbell color={colors.textMuted} size={20} />} />
                    <StatCard caption="Duration" value={fmtDuration(Math.round(today.reduce((a, s) => a + s.durationSeconds, 0) / 60))} icon={<Clock color={colors.textMuted} size={20} />} />
                    <StatCard caption="Calories" value={today.reduce((a, s) => a + s.caloriesBurned, 0)} unit="kcal" icon={<Flame color={colors.textMuted} size={20} />} />
                    <StatCard caption="Volume" value={todayVolume.toFixed(1)} unit="t" icon={<TrendingUp color={colors.textMuted} size={20} />} />
                </View>

                <Text style={styles.label}>LATEST SESSION</Text>
                {latest ?
                    <View style={styles.card}>
                        <Text style={styles.title}>{latest.name}</Text>
                        <Text style={styles.muted}>{latest.exercises.length} exercises · {Math.round(latest.durationSeconds / 60)} min</Text>
                    </View> :
                    <Text style={styles.muted}>No workouts logged yet.</Text>
                }

                <AppButton onPress={() => router.push("/workouts")}>Start Workout</AppButton>
            </ScrollView>
        </ScreenContainer>
    )
}

const styles = StyleSheet.create({
    content: {
        padding: 20,
        gap: 12
    },
    label: {
        ...typography.label,
        color: colors.textMuted,
        marginTop: 10
    },
    greeting: {
        ...typography.display,
        fontSize: 21,
        color: colors.text,
        marginBottom: 12
    },
    grid: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
        rowGap: 8,
    },
    card: {
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 18,
        padding: 16,
        marginBottom: 14
    },
    title: {
        ...typography.display,
        fontSize: 20,
        color: colors.text
    },
    muted: {
        ...typography.body,
        fontSize: 12,
        color: colors.textMuted
    }
});