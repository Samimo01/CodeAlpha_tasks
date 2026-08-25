import { StyleSheet, Text, View } from "react-native";
import { colors } from "@/theme/colors";
import { typography } from "@/theme/typography";

// Displays a consistent message when a screen has no content to show.
export function EmptyState({ children }: { children: string }) {
    return (
        <View style={styles.box}>
            <Text style={styles.text}>{children}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    box: {
        borderWidth: 1.5,
        borderStyle: "dashed",
        borderColor: colors.border,
        borderRadius: 14,
        padding: 22,
        alignItems: "center"
    },
    text: {
        ...typography.body,
        color: colors.textFaint,
        fontSize: 12.5
    }
});