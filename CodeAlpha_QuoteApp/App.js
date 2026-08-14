import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Feather } from "@expo/vector-icons";
import { HomeScreen } from "@/screens/HomeScreen";
import { FavoritesScreen } from "@/screens/FavoritesScreen";
import { FavoritesProvider } from "@/context/FavoritesContext";
import { colors } from "@/theme";

const Tab = createBottomTabNavigator();

/**
 * Main app component with bottom tab navigation.
 * Provides access to Home and Favorites screens through a tab bar.
 * Wraps the app with FavoritesProvider to manage favorite quotes state globally.
 */
export default function App() {
  return (
    <FavoritesProvider>
      <NavigationContainer>
        {/* Bottom tab navigation with Home and Favorites screens */}
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarActiveTintColor: colors.accent,
            tabBarInactiveTintColor: colors.mutedLight,
            tabBarLabelStyle: {
              fontSize: 9,
              letterSpacing: 1,
              textTransform: "uppercase",
              fontFamily: "System",
              marginTop: 2,
            },
            tabBarStyle: {
              borderTopWidth: 1,
              borderTopColor: colors.border,
              backgroundColor: colors.background,
              paddingBottom: 20,
              paddingTop: 12,
            },
            tabBarIcon: ({ focused, color, size }) => {
              // Select icon based on the current route
              let iconName;
              if (route.name === "Home") {
                iconName = "home";
              } else if (route.name === "Favorites") {
                iconName = "bookmark";
              }
              return <Feather name={iconName} size={size} color={color} />;
            },
          })}
        >
          <Tab.Screen 
            name="Home" 
            component={HomeScreen} 
            options={{ headerShown: false }}
          />
          <Tab.Screen 
            name="Favorites" 
            component={FavoritesScreen} 
            options={{ headerShown: false }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </FavoritesProvider>
  );
}