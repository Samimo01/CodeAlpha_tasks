import { ScrollView, StyleSheet, Text, View } from "react-native";
import { ScreenContainer } from "@/components/layout/ScreenContainer";
import { StatCard } from "@/components/common/StatCard";
import { EmptyState } from "@/components/common/EmptyState";
import { WeeklyActivityChart } from "@/components/progress/WeeklyActivityChart";
import { VolumeChart } from "@/components/progress/VolumeChart";
import { WeightChart } from "@/components/progress/WeightChart";
import { WeightLogRow } from "@/components/progress/WeightLogRow";
import { PersonalRecordRow } from "@/components/progress/PersonalRecordRow";
import { useProgressStats } from "@/hooks/useProgressStats";
import { colors } from "@/theme/colors";
import { typography } from "@/theme/typography";
import { fmtDuration } from "@/utils/format";
import { Dumbbell, Clock, TrendingUp, Award } from "lucide-react-native";

// Presents workout volume, activity, body weight, and personal-record trends.
export default function Progress() {
    const { stats, weekly, weights, prs, logWeight } = useProgressStats();
    const hasSessions = weekly.length > 0;
    const hasWeightTrend = weights.length >= 2;

    return (
        <ScreenContainer>
            <ScrollView contentContainerStyle={styles.content}>
                <Text style={styles.title}>Progress</Text>
                <View style={styles.grid}>
                    <StatCard caption="Total Workouts" value={stats.workouts} icon={<Dumbbell color={colors.textMuted} size={20} />} />
                    <StatCard caption="Total Volume" value={stats.volume.toFixed(1)} unit="t" icon={<TrendingUp color={colors.textMuted} size={20} />} />
                    <StatCard caption="Workout Time" value={fmtDuration(stats.timeMinutes)} icon={<Clock color={colors.textMuted} size={20} />} />
                    <StatCard caption="Records" value={prs.length} icon={<Award color={colors.textMuted} size={20} />} />
                </View>

                <Text style={styles.label}>WEEKLY ACTIVITY</Text>
                <View style={styles.chart}>
                    {hasSessions
                        ? <WeeklyActivityChart data={weekly.map(x => ({ value: x.workouts, label: x.week.slice(-3) }))} />
                        : <EmptyState>Complete a workout to see your weekly activity.</EmptyState>}
                </View>

                <Text style={styles.label}>VOLUME PROGRESS</Text>
                <View style={styles.chart}>
                    {hasSessions
                        ? <VolumeChart data={weekly.map(x => ({ value: x.volume, label: x.week.slice(-3) }))} />
                        : <EmptyState>Complete a workout to see your volume trend.</EmptyState>}
                </View>

                <Text style={styles.label}>WEIGHT PROGRESS</Text>
                <WeightLogRow onSubmit={(w) => void logWeight(w)} />
                <View style={styles.chart}>
                    {hasWeightTrend
                        ? <WeightChart data={weights.map(x => ({
                            value: x.weight,
                            label: new Date(x.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })
                        }))} />
                        : <EmptyState>Log at least two weigh-ins to see your trend.</EmptyState>}
                </View>

                <Text style={styles.label}>PERSONAL RECORDS</Text>
                {prs.length > 0
                    ? prs.map(p => <PersonalRecordRow key={p.exerciseName} record={p} />)
                    : <EmptyState>Finish a workout to set your first personal record.</EmptyState>}

            </ScrollView>
        </ScreenContainer>
    )
}

const styles = StyleSheet.create({
    content: { padding: 20 },
    title: { ...typography.display, fontSize: 21, color: colors.text, marginBottom: 20 },
    grid: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 20 },
    label: { ...typography.label, color: colors.textMuted, marginVertical: 10 },
    chart: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 16, padding: 8, marginBottom: 12 }
});