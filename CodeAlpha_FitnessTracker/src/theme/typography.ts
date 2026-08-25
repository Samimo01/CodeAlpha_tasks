import { StyleSheet } from "react-native";
import { colors } from "./colors";

export const typography = StyleSheet.create({
  display: {
    fontFamily: "Helvetica Neue",
    fontWeight: "700",
    color: colors.text
  },

  body: {
    fontFamily: "Segoe UI",
    color: colors.text
  },

  label: {
    fontFamily: "Segoe UI",
    fontSize: 10,
    letterSpacing: 1.4,
    color: colors.textMuted,
    textTransform: "uppercase"
  },

  numeric: {
    fontFamily: "Helvetica Neue",
    fontWeight: "700",
    color: colors.text,
    fontVariant: ["tabular-nums"]
  },
});
