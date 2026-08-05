import React from "react";
import { StyleSheet, TextInput, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { colors } from "@/theme/colors";
import { typography } from "@/theme/typography";

interface Props {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}

export function SearchBar({ value, onChangeText, placeholder = "Search collections" }: Props) {
  return (
    <View style={styles.wrap}>
      <MaterialCommunityIcons name="magnify" size={15} color={colors.inkFaint} />
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor={colors.inkFaint}
        value={value}
        onChangeText={onChangeText}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: colors.surfaceAlt,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 10,
    paddingHorizontal: 12,
    marginBottom: 14,
  },
  input: {
    flex: 1,
    paddingVertical: 9,
    color: colors.ink,
    fontFamily: typography.body,
    fontSize: 13.5,
  },
});
