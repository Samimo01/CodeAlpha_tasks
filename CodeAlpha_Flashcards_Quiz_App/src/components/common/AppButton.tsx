import React from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import { colors } from "@/theme/colors";
import { typography } from "@/theme/typography";

type Variant = "primary" | "outline" | "danger";

interface Props {
  label: string;
  onPress: () => void;
  variant?: Variant;
  disabled?: boolean;
  full?: boolean;
  style?: StyleProp<ViewStyle>;
}

export function AppButton({
  label,
  onPress,
  variant = "primary",
  disabled = false,
  full = false,
  style,
}: Props) {
  const bg =
    variant === "primary"
      ? colors.accent
      : variant === "danger"
      ? colors.danger
      : colors.surface;
  const fg =
    variant === "primary"
      ? colors.accentInk
      : variant === "danger"
      ? "#1B1220"
      : colors.ink;

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.btn,
        full && styles.full,
        { backgroundColor: bg },
        (pressed || disabled) && { opacity: disabled ? 0.4 : 0.92 },
        style,
      ]}
    >
      <Text style={[styles.label, { color: fg }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  full: {
    flex: 1,
  },
  label: {
    fontFamily: typography.title,
    fontWeight: "600",
    fontSize: 13.5,
  },
});
