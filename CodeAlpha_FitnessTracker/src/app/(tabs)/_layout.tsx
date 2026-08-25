import { Tabs } from "expo-router";
import { Home, Dumbbell, History, TrendingUp, LucideIcon } from "lucide-react-native";
import { colors } from "@/theme/colors";

// Configures the main tab navigation and its tab-specific icons.
export default function TabsLayout() {

    function TabBarIcon({ Icon, focused }: { Icon: LucideIcon; focused: boolean }) {
        return <Icon size={25} color={focused ? colors.accent : colors.textFaint} />
    }

    return (
        <Tabs screenOptions={{
            headerShown: false,
            tabBarStyle: { backgroundColor: colors.background, borderTopColor: colors.border, height: 78, paddingBottom: 20 },
            tabBarActiveTintColor: colors.accent,
            tabBarInactiveTintColor: colors.textFaint
        }}>
            <Tabs.Screen name="index" options={{
                title: "HOME",
                tabBarIcon: ({ focused }) => (<TabBarIcon Icon={Home} focused={focused} />)
            }} />

            <Tabs.Screen name="workouts/index" options={{
                title: "WORKOUTS",
                tabBarIcon: ({ focused }) => (<TabBarIcon Icon={Dumbbell} focused={focused} />)
            }} />

            <Tabs.Screen name="workouts/create" options={{ href: null }} />

            <Tabs.Screen name="history/index" options={{
                title: "HISTORY",
                tabBarIcon: ({ focused }) => (<TabBarIcon Icon={History} focused={focused} />)
            }} />

            <Tabs.Screen name="history/[id]" options={{ href: null }} />

            <Tabs.Screen name="progress/index" options={{
                title: "PROGRESS",
                tabBarIcon: ({ focused }) => (<TabBarIcon Icon={TrendingUp} focused={focused} />)

            }} />
        </Tabs>
    )
}
