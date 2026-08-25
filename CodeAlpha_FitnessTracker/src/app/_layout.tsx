import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";

// Defines the root navigation stack and the global app screen options.
export default function Layout() {
    return (
        <SafeAreaProvider>
            <Stack screenOptions={{ headerShown: false }} />
        </SafeAreaProvider>
    )
}
