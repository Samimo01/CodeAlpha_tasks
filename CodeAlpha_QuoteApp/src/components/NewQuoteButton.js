import React from "react";
import { View, StyleSheet, TouchableOpacity, Text, ActivityIndicator } from "react-native";
import { Feather } from "@expo/vector-icons";
import { colors, typography } from "@/theme";

/**
 * Button component to fetch and display a new quote.
 * Shows a loading indicator while fetching, and displays a refresh icon and text otherwise.
 * @param {Function} onPress - Callback function when the button is pressed
 * @param {boolean} loading - Whether a quote is currently being fetched
 * @param {boolean} disabled - Whether the button should be disabled
 */
export function NewQuoteButton({ onPress, loading, disabled }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      style={[styles.button, loading && styles.buttonLoading]}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color={colors.background} size="small" />
      ) : (
        <>
          <Feather name="refresh-cw" size={14} color={colors.background} />
          <Text style={[typography.buttonLabel, styles.buttonText]}>New Quote</Text>
        </>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: colors.ink,
    borderRadius: 999,
    paddingVertical: 14,
    paddingHorizontal: 24,
    minHeight: 48,
  },
  buttonLoading: {
    opacity: 0.7,
  },
  buttonText: {
    color: colors.background,
  },
});