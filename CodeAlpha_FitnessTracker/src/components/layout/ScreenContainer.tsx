import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet } from "react-native";
import type { ReactNode } from "react";
import { colors } from "@/theme/colors";

// Applies the shared screen padding and background to page content.
export function ScreenContainer({ children }: { children: ReactNode }) {
    return <SafeAreaView style={styles.container}>{children}</SafeAreaView>
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background }
});
