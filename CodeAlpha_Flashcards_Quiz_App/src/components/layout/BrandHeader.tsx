import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { colors } from "@/theme/colors";
import { typography } from "@/theme/typography";

export function BrandHeader() {
  return (
    <View style={styles.brand}>
      <View style={styles.mark}>
        <MaterialCommunityIcons name="cards-outline" size={16} color={colors.accentInk} />
      </View>
      <Text style={styles.name}>Recall</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  brand: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginVertical: 4,
  },
  mark: {
    width: 26,
    height: 26,
    borderRadius: 8,
    backgroundColor: colors.accent,
    alignItems: "center",
    justifyContent: "center",
  },
  name: {
    fontFamily: typography.display,
    fontWeight: "700",
    fontSize: 18,
    color: colors.ink,
    letterSpacing: -0.2,
  },
});
