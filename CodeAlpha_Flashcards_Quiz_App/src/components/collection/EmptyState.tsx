import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { colors } from "@/theme/colors";
import { typography } from "@/theme/typography";

interface Props {
  title: string;
  subtitle?: string;
}

export function EmptyState({ title, subtitle }: Props) {
  return (
    <View style={styles.wrap}>
      <MaterialCommunityIcons name="cards-outline" size={28} color={colors.inkFaint} />
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingBottom: 60,
    textAlign: "center",
  },
  title: {
    fontFamily: typography.title,
    fontWeight: "600",
    fontSize: 14,
    color: colors.inkSoft,
    textAlign: "center",
  },
  subtitle: {
    fontFamily: typography.body,
    fontSize: 12,
    color: colors.inkFaint,
    textAlign: "center",
  },
});
