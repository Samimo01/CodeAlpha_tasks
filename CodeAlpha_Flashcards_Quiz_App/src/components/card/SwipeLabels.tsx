import React from "react";
import { StyleSheet, Text } from "react-native";
import { colors } from "@/theme/colors";
import { typography } from "@/theme/typography";

interface Props {
  disabled: boolean;
}

export function SwipeLabels({ disabled }: Props) {
  return (
    <>
      <Text style={[styles.label, styles.left, disabled && styles.disabled]}>
        Incorrect
      </Text>
      <Text style={[styles.label, styles.right, disabled && styles.disabled]}>
        Correct
      </Text>
    </>
  );
}

const styles = StyleSheet.create({
  label: {
    fontFamily: typography.title,
    fontWeight: "700",
    fontSize: 10.5,
    letterSpacing: 1.4,
    textTransform: "uppercase",
    opacity: 0.55,
  },
  left: {
    color: colors.danger,
    transform: [{ rotate: "180deg" }],
  },
  right: {
    color: colors.success,
  },
  disabled: {
    opacity: 0.15,
  },
});
