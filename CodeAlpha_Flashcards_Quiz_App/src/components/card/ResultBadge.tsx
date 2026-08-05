import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { colors } from "@/theme/colors";
import { typography } from "@/theme/typography";

interface Props {
  correct: boolean;
}

export function ResultBadge({ correct }: Props) {
  return (
    <View style={[styles.badge, correct ? styles.correct : styles.wrong]}>
      <Text style={[styles.label, correct ? styles.correctLabel : styles.wrongLabel]}>
        {correct ? "Correct" : "Incorrect"}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    position: "absolute",
    top: 12,
    right: 12,
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  correct: {
    backgroundColor: colors.successSoft,
  },
  wrong: {
    backgroundColor: colors.dangerSoft,
  },
  label: {
    fontFamily: typography.title,
    fontWeight: "700",
    fontSize: 9.5,
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },
  correctLabel: {
    color: colors.success,
  },
  wrongLabel: {
    color: colors.danger,
  },
});
