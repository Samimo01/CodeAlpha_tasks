import { useRouter } from "expo-router";
import { Plus } from "lucide-react-native";
import { useFocusEffect } from "expo-router";
import { useCallback } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { ScreenContainer } from "@/components/layout/ScreenContainer";
import { WorkoutCard } from "@/components/workout/WorkoutCard";
import { IconButton } from "@/components/common/IconButton";
import { useWorkoutTemplates } from "@/hooks/useWorkoutTemplates";
import { colors } from "@/theme/colors";
import { typography } from "@/theme/typography";

// Lists saved workout templates and provides entry points to start or create one.
export default function Workouts() {
    const router = useRouter();
    const { templates, refresh } = useWorkoutTemplates();

    useFocusEffect(useCallback(() => {
        void refresh();
    }, [refresh]));

    return (
        <ScreenContainer>
            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.header}>
                    <Text style={styles.title}>Workouts</Text>
                    <IconButton onPress={() => router.push("/workouts/create")}>
                        <Plus color={colors.accent} size={16} />
                    </IconButton>
                </View>

                {templates.map(t => <WorkoutCard key={t.id} workout={t} onPress={() => router.push(`/workout/preview/${t.id}`)} />)}

                <Text style={styles.footer} onPress={() => router.push("/workouts/create")}>＋  Create Workout</Text>
            </ScrollView>
        </ScreenContainer>
    )
}

const styles = StyleSheet.create({
    content: { padding: 20 },
    header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20 },
    title: { ...typography.display, fontSize: 21, color: colors.text },
    footer: { ...typography.body, borderWidth: 1, borderStyle: "dashed", borderColor: colors.border, borderRadius: 18, padding: 16, textAlign: "center", color: colors.textMuted, fontWeight: "700" }
});
