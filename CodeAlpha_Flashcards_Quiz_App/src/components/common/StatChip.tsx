import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { colors } from "@/theme/colors";
import { typography } from "@/theme/typography";

interface Props {
  label: string;
  tone?: "default" | "accent";
}

export function StatChip({ label, tone = "default" }: Props) {
  return (
    <View style={[styles.chip, tone === "accent" && styles.accent]}>
      <Text style={[styles.label, tone === "accent" && styles.accentLabel]}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    backgroundColor: colors.surfaceAlt,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  accent: {
    backgroundColor: colors.surfaceAlt,
  },
  label: {
    fontFamily: typography.title,
    fontWeight: "600",
    fontSize: 13,
    color: colors.inkSoft,
  },
  accentLabel: {
    color: colors.accent,
  },
});
