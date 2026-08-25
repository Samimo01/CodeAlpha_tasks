import { useRouter } from "expo-router";
import { ScrollView, StyleSheet, Text } from "react-native";
import { ScreenContainer } from "@/components/layout/ScreenContainer";
import { HistoryRow } from "@/components/history/HistoryRow";
import { useHistory } from "@/hooks/useHistory";
import { colors } from "@/theme/colors";
import { typography } from "@/theme/typography";

// Displays completed workout sessions in reverse chronological order.
export default function HistoryScreen() {
    const router = useRouter();
    const { sessions } = useHistory();

    return (
        <ScreenContainer>
            <ScrollView contentContainerStyle={styles.content}>
                <Text style={styles.title}>History</Text>
                {sessions.map(s => <HistoryRow key={s.id} session={s} onPress={() => router.push(`/history/${s.id}`)} />)}
            </ScrollView>
        </ScreenContainer>
    )
}

const styles = StyleSheet.create({
    content: {
        padding: 20
    },
    title: {
        ...typography.display,
        fontSize: 21,
        color: colors.text,
        marginBottom: 20
    }
});
