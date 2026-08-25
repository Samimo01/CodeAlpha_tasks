import { ChevronLeft } from "lucide-react-native";
import { StyleSheet, Text, View } from "react-native";
import { colors } from "@/theme/colors";
import { typography } from "@/theme/typography";
import { IconButton } from "../common/IconButton";

// Renders a reusable title area with optional subtitle and back navigation.
export function ScreenHeader({ title, subtitle, onBack }: { title: string; subtitle?: string; onBack?: () => void }) {
    return (
        <View style={styles.header}>
            <View style={styles.left}>
                {onBack && <IconButton onPress={onBack}>
                    <ChevronLeft size={16} color={colors.text} />
                </IconButton>}

                <View>
                    <Text style={styles.title}>{title}</Text>
                    {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    header: {
        paddingHorizontal: 20,
        paddingTop: 6,
        paddingBottom: 14
    },
    left: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12
    },
    title: {
        ...typography.display,
        fontSize: 18,
        color: colors.text
    },
    subtitle: {
        ...typography.label,
        color: colors.textMuted,
        marginTop: 2
    }
});
