import type { LucideIcon } from "lucide-react-native";
import { colors } from "@/theme/colors";

// Renders a tab icon using the active or inactive theme color.
export function TabBarIcon({ Icon, focused }: { Icon: LucideIcon; focused: boolean }) {
    return <Icon size={20} color={focused ? colors.accent : colors.textFaint} />
}
